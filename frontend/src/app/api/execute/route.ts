import { NextRequest, NextResponse } from 'next/server';
import { VM } from 'vm2';

export interface ExecutionStep {
  line: number;
  description: string;
  variables: Record<string, any>;
  output?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  steps: ExecutionStep[];
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { code, input } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Kod gerekli' },
        { status: 400 }
      );
    }

    const steps: ExecutionStep[] = [];
    let output = '';
    let lineNumber = 0;

    // Güvenli sandbox ortamı oluştur
    const vm = new VM({
      timeout: 5000, // 5 saniye timeout
      sandbox: {
        input: input || [],
        console: {
          log: (...args: any[]) => {
            output += args.map(arg => String(arg)).join(' ') + '\n';
          }
        },
        // Adım takibi için yardımcı fonksiyon
        _trackStep: (desc: string, vars: Record<string, any>) => {
          steps.push({
            line: lineNumber,
            description: desc,
            variables: { ...vars }
          });
        }
      }
    });

    // Kodu satır satır çalıştır ve adımları kaydet
    const lines = code.split('\n');
    const instrumentedCode = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Boş satırları ve yorumları atla
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        return line;
      }
      
      // Return, fonksiyon tanımları ve if/else gibi kontrol yapılarını özel işle
      if (trimmedLine.startsWith('function') || 
          trimmedLine.startsWith('const') || 
          trimmedLine.startsWith('let') || 
          trimmedLine.startsWith('var')) {
        return line;
      }
      
      // Her satırın sonunda değişkenleri kaydet
      return `
        ${line}
        try {
          _trackStep("Satır ${index + 1}: ${trimmedLine.replace(/"/g, "'")}", {
            input: typeof input !== 'undefined' ? input : undefined,
            i: typeof i !== 'undefined' ? i : undefined,
            j: typeof j !== 'undefined' ? j : undefined,
            temp: typeof temp !== 'undefined' ? temp : undefined,
            n: typeof n !== 'undefined' ? n : undefined,
            arr: typeof arr !== 'undefined' ? arr : undefined
          });
        } catch(e) {}
      `;
    }).join('\n');

    // Kodu çalıştır
    try {
      vm.run(instrumentedCode);
    } catch (execError) {
      return NextResponse.json({
        success: false,
        output,
        steps,
        error: `Çalışma hatası: ${execError instanceof Error ? execError.message : String(execError)}`,
        executionTime: Date.now() - startTime
      });
    }

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      output: output || 'Kod çalıştırıldı (çıktı yok)',
      steps,
      executionTime
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      output: '',
      steps: [],
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      executionTime: Date.now() - startTime
    }, { status: 500 });
  }
}