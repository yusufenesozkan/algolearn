import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - js-interpreter doesn't have TypeScript types
const JSInterpreter = require('js-interpreter');

export interface StepData {
  stepNumber: number;
  line: number;
  description: string;
  variables: Record<string, any>;
  input: number[];
  comparing: number[];
  swapping: number[];
}

export interface StepExecutionResult {
  success: boolean;
  steps: StepData[];
  totalSteps: number;
  output: string;
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Kod gerekli' },
        { status: 400 }
      );
    }

    // Input'u çıkar (const, let veya var destekler)
    const lines = code.split('\n');
    const firstLine = lines[0].trim();
    const inputMatch = firstLine.match(/(?:const|let|var)\s+input\s*=\s*(\[.*?\]);?$/);
    
    if (!inputMatch) {
      return NextResponse.json(
        { success: false, error: 'İlk satır "const input = [...];" formatında olmalıdır' },
        { status: 400 }
      );
    }

    let inputData: number[] = [];
    try {
      inputData = JSON.parse(inputMatch[1]);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Input değerleri geçersiz' },
        { status: 400 }
      );
    }
    
    // Kodu ES5'e çevir (const/let -> var, template literals -> string concatenation)
    let es5Code = code
      .replace(/\bconst\b/g, 'var')
      .replace(/\blet\b/g, 'var')
      .replace(/`([^`]+)`/g, function(match, content) {
        // Template literal'ları string concatenation'a çevir
        return '"' + content.replace(/\$\{(\w+)\}/g, '" + $1 + "') + '"';
      });

    const steps: StepData[] = [];
    let output = '';
    let stepNumber = 0;

    // Interpreter oluştur
    const initFunc = (interpreter: any, globalObject: any) => {
      // Input değişkenini ekle
      interpreter.setProperty(globalObject, 'input', interpreter.nativeToPseudo(inputData.slice()));
      
      // Console.log override
      const consoleObj = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
      interpreter.setProperty(globalObject, 'console', consoleObj);
      
      const logFn = interpreter.createNativeFunction((...args: any[]) => {
        const message = args.map((arg: any) => {
          const value = interpreter.pseudoToNative(arg);
          return typeof value === 'object' ? JSON.stringify(value) : String(value);
        }).join(' ');
        output += message + '\n';
      });
      interpreter.setProperty(consoleObj, 'log', logFn);
    };

    const interpreter = new JSInterpreter(es5Code, initFunc);

    // Satır satır çalıştır - her satır değişiminde kaydet (döngü iterasyonları dahil)
    let currentLine = 1;
    let lastSavedLine = 0;
    let loopIterationCount = 0;
    
    // Son durumu tutan değişkenler
    let lastVariables: Record<string, any> = {};
    let lastInput: number[] = [...inputData];
    
    while (interpreter.step()) {
      // stateStack üzerinden mevcut satırı al
      const stateStack = interpreter.stateStack || interpreter.state_stack || [];
      const currentState = stateStack[stateStack.length - 1];
      const newLine = currentState?.node?.loc?.start?.line || currentLine;
      
      // Mevcut scope'daki değişkenleri topla (her adımda güncelle)
      try {
        const visitedScopes = new Set();
        const variables: Record<string, any> = {};
        let currentInputArr: number[] = [];
        
        for (let i = stateStack.length - 1; i >= 0; i--) {
          const state = stateStack[i];
          if (!state || !state.scope) continue;
          
          let currentScope: any = state.scope;
          while (currentScope && !visitedScopes.has(currentScope)) {
            visitedScopes.add(currentScope);
            
            if (currentScope.object && currentScope.object.properties) {
              const props = currentScope.object.properties;
              
              for (const key in props) {
                if (key !== 'console' && !key.startsWith('_') && !(key in variables)) {
                  try {
                    const propValue = props[key];
                    let nativeValue: any;
                    
                    if (propValue === undefined || propValue === null) {
                      nativeValue = propValue;
                    } else if (typeof propValue === 'object' && propValue.class) {
                      try {
                        nativeValue = interpreter.pseudoToNative(propValue);
                      } catch (e) {
                        nativeValue = `[${propValue.class}]`;
                      }
                    } else {
                      nativeValue = propValue;
                    }
                    
                    if (key !== 'window' && key !== 'self' && key !== 'global') {
                      variables[key] = nativeValue;
                      
                      if (key === 'input' && Array.isArray(nativeValue)) {
                        currentInputArr = nativeValue;
                      }
                    }
                  } catch (e) {
                    variables[key] = '[Error]';
                  }
                }
              }
            }
            
            currentScope = currentScope.parentScope;
          }
        }
        
        lastVariables = variables;
        if (currentInputArr.length > 0) {
          lastInput = currentInputArr;
        }
      } catch (e) {
        // Scope okunamazsa devam et
      }
      
      // Satır değiştiyse kaydet
      if (newLine !== currentLine) {
        // Aynı satıra geri dönüş (döngü) kontrolü
        const isLoopBack = newLine < currentLine || (steps.length > 0 && steps.some(s => s.line === newLine));
        
        if (isLoopBack) {
          loopIterationCount++;
        }
        
        // Önceki satırı kaydet
        if (lastSavedLine !== currentLine) {
          let comparing: number[] = [];
          let swapping: number[] = [];
          
          if (steps.length > 0) {
            const prevStepInput = steps[steps.length - 1].input;
            const changedIndices: number[] = [];
            
            for (let i = 0; i < Math.max(lastInput.length, prevStepInput.length); i++) {
              if (lastInput[i] !== prevStepInput[i]) {
                changedIndices.push(i);
              }
            }
            
            if (changedIndices.length === 2) {
              swapping = changedIndices;
            } else if (changedIndices.length > 0) {
              comparing = changedIndices;
            }
          }
          
          stepNumber++;
          steps.push({
            stepNumber,
            line: currentLine,
            description: getDescriptionForLine(code, currentLine, lastVariables),
            variables: { ...lastVariables },
            input: [...lastInput],
            comparing,
            swapping
          });
          lastSavedLine = currentLine;
        }
        
        currentLine = newLine;
      }
    }
    
    // Son satırı da kaydet
    if (lastSavedLine !== currentLine) {
      let comparing: number[] = [];
      let swapping: number[] = [];
      
      if (steps.length > 0) {
        const prevStepInput = steps[steps.length - 1].input;
        const changedIndices: number[] = [];
        
        for (let i = 0; i < Math.max(lastInput.length, prevStepInput.length); i++) {
          if (lastInput[i] !== prevStepInput[i]) {
            changedIndices.push(i);
          }
        }
        
        if (changedIndices.length === 2) {
          swapping = changedIndices;
        } else if (changedIndices.length > 0) {
          comparing = changedIndices;
        }
      }
      
      stepNumber++;
      steps.push({
        stepNumber,
        line: currentLine,
        description: getDescriptionForLine(code, currentLine, lastVariables),
        variables: { ...lastVariables },
        input: [...lastInput],
        comparing,
        swapping
      });
    }

    const executionTime = Date.now() - startTime;

    // Circular reference'ları temizle
    const cleanSteps = steps.map(step => ({
      ...step,
      variables: JSON.parse(JSON.stringify(step.variables, (key, value) => {
        // Circular reference ve fonksiyonları temizle
        if (typeof value === 'function') return '[Function]';
        if (value && typeof value === 'object') {
          // window, self gibi global objeleri temizle
          if (['window', 'self', 'global', 'document', 'location'].includes(key)) {
            return '[Global]';
          }
        }
        return value;
      }))
    }));

    return NextResponse.json({
      success: true,
      steps: cleanSteps,
      totalSteps: cleanSteps.length,
      output: output || 'Kod çalıştırıldı (çıktı yok)',
      executionTime
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      steps: [],
      totalSteps: 0,
      output: '',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      executionTime: Date.now() - startTime
    }, { status: 500 });
  }
}

// Satır için açıklama oluştur
function getDescriptionForLine(code: string, line: number, variables: Record<string, any>): string {
  const lines = code.split('\n');
  if (line < 1 || line > lines.length) return 'İşlem';
  
  const currentLine = lines[line - 1].trim();
  
  if (currentLine.includes('for') || currentLine.includes('while')) {
    return 'Döngü başlangıcı';
  }
  if (currentLine.includes('if')) {
    return 'Koşul kontrolü';
  }
  if (currentLine.includes('function')) {
    return 'Fonksiyon tanımı';
  }
  if (currentLine.includes('return')) {
    return 'Değer döndürme';
  }
  if (currentLine.includes('console.log')) {
    const match = currentLine.match(/console\.log\(['"](.+?)['"]/);
    return match ? `Log: ${match[1]}` : 'Konsola yazdırma';
  }
  if (currentLine.includes('swap') || (currentLine.includes('=') && currentLine.includes('['))) {
    if (variables['i'] !== undefined && variables['j'] !== undefined) {
      return `Karşılaştırma: i=${variables['i']}, j=${variables['j']}`;
    }
    return 'Değişken atama';
  }
  if (currentLine.includes('const') || currentLine.includes('let') || currentLine.includes('var')) {
    return 'Değişken tanımlama';
  }
  
  return 'İşlem';
}
