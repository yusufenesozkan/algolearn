'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Algorithm } from '@/types';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Lock, 
  AlertCircle,
  SkipBack,
  SkipForward,
  Variable,
  Code2
} from 'lucide-react';
import { executeJavaScriptCodeStepByStep, StepData } from '@/services/api';

interface CodeEditorProps {
  algorithm: Algorithm;
}

// Input satırı formatı kontrolü (const, let veya var)
const INPUT_PATTERN = /^(?:const|let|var)\s+input\s*=\s*\[.*\];?$/;

// JavaScript kod örnekleri - input satırı ile birlikte
const defaultJavaScriptCode: Record<string, string> = {
  'bubble-sort': `const input = [64, 34, 25, 12, 22, 11, 90];

// Bubble Sort - JavaScript
function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    console.log(\`Dış döngü: i = \${i}\`);
    
    for (let j = 0; j < n - i - 1; j++) {
      console.log(\`Karşılaştırma: arr[\${j}]=\${arr[j]} vs arr[\${j+1}]=\${arr[j+1]}\`);
      
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        console.log(\`Yer değiştirildi: [\${arr.join(', ')}]\`);
      }
    }
    console.log(\`\${i + 1}. tur tamamlandı\`);
  }
  
  return arr;
}

const result = bubbleSort(input);
console.log("Sonuç:", result);`,

  'quick-sort': `const input = [64, 34, 25, 12, 22, 11, 90];

// Quick Sort - JavaScript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

const result = quickSort(input);
console.log("Sonuç:", result);`,

  'selection-sort': `const input = [64, 34, 25, 12, 22, 11, 90];

// Selection Sort - JavaScript
function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  
  return arr;
}

const result = selectionSort(input);
console.log("Sonuç:", result);`,

  'insertion-sort': `const input = [64, 34, 25, 12, 22, 11, 90];

// Insertion Sort - JavaScript
function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}

const result = insertionSort(input);
console.log("Sonuç:", result);`,

  'binary-search': `const input = [11, 12, 22, 25, 34, 64, 90];

// Binary Search - JavaScript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

const target = 25;
const result = binarySearch(input, target);
console.log(\`Hedef: \${target}, Bulundu: \${result}\`);`,

  'default': `const input = [64, 34, 25, 12, 22, 11, 90];

// JavaScript kodunuzu buraya yazın
function myAlgorithm(arr) {
  console.log("Girdi:", arr);
  
  // Algoritmanızı buraya yazın
  for (let i = 0; i < arr.length; i++) {
    console.log(\`Eleman \${i}: \${arr[i]}\`);
  }
  
  return arr;
}

const result = myAlgorithm(input);
console.log("Sonuç:", result);`,
};

// Çubuk grafik görselleştirme bileşeni
function ArrayVisualizer({ data, comparing = [], swapping = [] }: { 
  data: number[]; 
  comparing?: number[]; 
  swapping?: number[];
}) {
  const maxVal = Math.max(...data, 1);
  
  return (
    <div className="w-full h-full flex items-end justify-center gap-1 px-4 py-4">
      {data.map((value, index) => {
        const height = (value / maxVal) * 100;
        const isComparing = comparing.includes(index);
        const isSwapping = swapping.includes(index);
        
        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
            style={{ width: `${100 / data.length}%`, maxWidth: '80px' }}
          >
            <span className={`text-xs font-bold ${
              isSwapping ? 'text-red-400' : isComparing ? 'text-yellow-400' : 'text-gray-300'
            }`}>
              {value}
            </span>
            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${
                isSwapping 
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110' 
                  : isComparing 
                    ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' 
                    : 'bg-gradient-to-t from-blue-600 to-blue-400'
              }`}
              style={{ height: `${Math.max(height * 0.8, 20)}%`, minHeight: '30px' }}
            />
            <span className="text-[10px] text-gray-500">[{index}]</span>
          </div>
        );
      })}
    </div>
  );
}

export default function CodeEditor({ algorithm }: CodeEditorProps) {
  const [code, setCode] = useState(
    defaultJavaScriptCode[algorithm.id] || defaultJavaScriptCode['default']
  );
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [output, setOutput] = useState('');
  const [steps, setSteps] = useState<StepData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionCompleted, setExecutionCompleted] = useState(false);
  
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  // Editörde çalışan satırı vurgula
  const highlightCurrentLine = useCallback((lineNumber: number) => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const monaco = (window as any).monaco;
    
    if (!monaco) return;
    
    // Önceki vurgulamaları kaldır
    if (decorationsRef.current.length > 0) {
      editor.deltaDecorations(decorationsRef.current, []);
    }
    
    // Yeni vurgulama ekle
    if (lineNumber > 0) {
      const newDecorations = editor.deltaDecorations([], [
        {
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className: 'current-line-highlight',
            linesDecorationsClassName: 'current-line-margin'
          }
        }
      ]);
      decorationsRef.current = newDecorations;
      editor.revealLineInCenter(lineNumber);
    }
  }, []);

  // Adım değiştiğinde görselleştirmeyi ve editörü güncelle
  useEffect(() => {
    if (steps.length > 0 && currentStep > 0 && currentStep <= steps.length) {
      const step = steps[currentStep - 1];
      highlightCurrentLine(step.line);
    }
  }, [currentStep, steps, highlightCurrentLine]);

  // Kodu çalıştır ve adımları kaydet
  const runCode = async () => {
    setError(null);
    setIsRunning(true);
    setOutput('Kod analiz ediliyor ve adım adım çalıştırılıyor...\n');

    try {
      const lines = code.split('\n');
      const firstLine = lines[0].trim();
      
      if (!INPUT_PATTERN.test(firstLine)) {
        setIsRunning(false);
        setOutput('');
        setError('HATA: İlk satır "const input = [...];" formatında olmalıdır!');
        return;
      }

      const result = await executeJavaScriptCodeStepByStep(code);
      
      if (result.success) {
        setSteps(result.steps);
        setTotalSteps(result.steps.length);
        setCurrentStep(0);
        setOutput(result.output);
        setExecutionCompleted(true);
        setIsReadOnly(true);
      } else {
        setOutput(`HATA: ${result.error || 'Bilinmeyen hata'}`);
        setExecutionCompleted(false);
      }
    } catch (error) {
      setOutput(`HATA: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      setExecutionCompleted(false);
    } finally {
      setIsRunning(false);
    }
  };

  // Kodu sıfırla
  const resetCode = () => {
    setCode(defaultJavaScriptCode[algorithm.id] || defaultJavaScriptCode['default']);
    setOutput('');
    setSteps([]);
    setCurrentStep(0);
    setTotalSteps(0);
    setIsReadOnly(false);
    setError(null);
    setExecutionCompleted(false);
    
    if (editorRef.current && decorationsRef.current.length > 0) {
      editorRef.current.deltaDecorations(decorationsRef.current, []);
      decorationsRef.current = [];
    }
  };

  // Navigation
  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleStart = () => {
    if (totalSteps > 0) setCurrentStep(1);
  };

  const handleEnd = () => {
    if (totalSteps > 0) setCurrentStep(totalSteps);
  };

  const currentStepData = currentStep > 0 && currentStep <= steps.length ? steps[currentStep - 1] : null;

  return (
    <div className="flex flex-col gap-6 h-full min-h-[900px]">
      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-900/50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-200 font-semibold">{error}</p>
            <p className="text-red-400 text-sm mt-1">İlk satır: const input = [64, 34, 25, 12, 22, 11, 90];</p>
          </div>
        </div>
      )}

      {/* ÜST KISIM: Görselleştirme - Geniş ve belirgin */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="bg-gray-800/80 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Array Görselleştirme</h3>
          </div>
          {currentStepData && (
            <div className="flex gap-3">
              {currentStepData.comparing.length > 0 && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
                  Karşılaştırma: {currentStepData.comparing.join(', ')}
                </span>
              )}
              {currentStepData.swapping.length > 0 && (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full border border-red-500/30">
                  Değişim: {currentStepData.swapping.join(', ')}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="h-[300px] bg-gray-900/50">
          {currentStepData ? (
            <ArrayVisualizer 
              data={currentStepData.input} 
              comparing={currentStepData.comparing}
              swapping={currentStepData.swapping}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center text-lg">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                Kodu çalıştırarak görselleştirmeyi başlat
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ORTA KISIM: Kontroller ve Bilgi */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleStart}
            disabled={!executionCompleted || currentStep === 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-30"
            title="Başa git"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePrevStep}
            disabled={!executionCompleted || currentStep <= 1}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-30 rounded-lg transition font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Önceki
          </button>
          
          <div className="px-6 py-2 bg-gray-900 rounded-lg border border-gray-600 min-w-[120px] text-center">
            <span className="text-2xl font-bold text-white">{currentStep}</span>
            <span className="text-gray-500 text-lg"> / {totalSteps || '-'}</span>
          </div>
          
          <button
            onClick={handleNextStep}
            disabled={!executionCompleted || currentStep >= totalSteps}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-30 rounded-lg transition font-medium"
          >
            Sonraki
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleEnd}
            disabled={!executionCompleted || currentStep === totalSteps}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-30"
            title="Sona git"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {currentStepData && (
            <div className="px-4 py-2 bg-blue-900/30 rounded-lg border border-blue-700/50">
              <span className="text-blue-300 text-sm">
                <span className="font-semibold">Satır {currentStepData.line}:</span> {currentStepData.description}
              </span>
            </div>
          )}
          
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition border border-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>
          
          <button
            onClick={runCode}
            disabled={isRunning || isReadOnly}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition font-semibold shadow-lg shadow-green-900/30"
          >
            <Play className="w-5 h-5" />
            {isRunning ? 'Çalışıyor...' : 'Başlat'}
          </button>
        </div>
      </div>

      {/* ALT KISIM: Kod Editörü ve Değişkenler - Yan yana */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Sol: Kod Editörü - 2/3 genişlik */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
          <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 rounded">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-gray-300 font-medium">main.js</span>
              {isReadOnly && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                  Kilitli
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => !isReadOnly && setCode(value || '')}
              theme="vs-dark"
              onMount={(editor) => { editorRef.current = editor; }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: true,
                readOnly: isReadOnly,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        {/* Sağ: Değişkenler ve Konsol - 1/3 genişlik */}
        <div className="flex flex-col gap-4">
          {/* Değişkenler */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden flex-1">
            <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700 flex items-center gap-2">
              <div className="p-1.5 bg-green-500/20 rounded">
                <Variable className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-gray-200 font-semibold">Değişkenler</h4>
            </div>
            <div className="p-4 overflow-auto max-h-[300px]">
              {currentStepData && Object.keys(currentStepData.variables).length > 0 ? (
                <div className="flex flex-col gap-2">
                  {Object.entries(currentStepData.variables)
                    .filter(([key]) => 
                      !key.startsWith('_') && 
                      !['window', 'self', 'global', 'this', 'arguments', 'console', 'test'].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 px-3 py-2 bg-gray-900/80 rounded-lg border border-gray-700">
                        <span className="text-blue-400 font-mono font-bold min-w-[60px]">{key}</span>
                        <span className="text-gray-600">=</span>
                        <span className="text-green-400 font-mono text-sm truncate">
                          {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {executionCompleted 
                    ? 'Bu adımda değişken yok' 
                    : 'Değişkenler burada görünecek'}
                </p>
              )}
            </div>
          </div>

          {/* Konsol */}
          <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden flex-1">
            <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-gray-400" />
              <h4 className="text-gray-300 font-semibold">Konsol</h4>
            </div>
            <div className="p-4 overflow-auto max-h-[200px]">
              {output ? (
                <pre className="whitespace-pre-wrap text-sm text-green-400 font-mono leading-relaxed">{output}</pre>
              ) : (
                <p className="text-gray-600 text-sm">Kodu çalıştırmak için &quot;Başlat&quot; butonuna tıklayın...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Stilleri */}
      <style jsx global>{`
        .current-line-highlight {
          background-color: rgba(59, 130, 246, 0.25) !important;
          border-left: 4px solid #3b82f6 !important;
        }
        .current-line-margin {
          background-color: #3b82f6;
          width: 4px;
        }
      `}</style>
    </div>
  );
}
