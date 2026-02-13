'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Algorithm } from '@/types';
import { Play, RotateCcw, Terminal, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { executeJavaScriptCode } from '@/services/api';

interface CodeEditorProps {
  algorithm: Algorithm;
}

// JavaScript kod örnekleri
const defaultJavaScriptCode: Record<string, string> = {
  'bubble-sort': `// Bubble Sort - JavaScript
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

  'quick-sort': `// Quick Sort - JavaScript
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

  'selection-sort': `// Selection Sort - JavaScript
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

  'insertion-sort': `// Insertion Sort - JavaScript
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

  'binary-search': `// Binary Search - JavaScript
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

const target = input[Math.floor(input.length / 2)];
const result = binarySearch(input, target);
console.log(\`Hedef: \${target}, Bulundu: \${result}\`);`,

  'default': `// JavaScript kodunuzu buraya yazın
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

export default function CodeEditor({ algorithm }: CodeEditorProps) {
  const [code, setCode] = useState(
    defaultJavaScriptCode[algorithm.id] || defaultJavaScriptCode['default']
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Kod çalıştırılıyor...\n');

    try {
      const input = [64, 34, 25, 12, 22, 11, 90];
      const result = await executeJavaScriptCode(code, input);
      
      if (result.success) {
        setOutput(result.output || 'Kod çalıştırıldı (çıktı yok)');
        // Örnek adım sayısı
        setTotalSteps(15);
        setCurrentStep(1);
        // Değişkenleri güncelle
        setVariables({
          input: input,
          result: 'Hesaplanıyor...',
          i: 0,
          j: 1,
          temp: '-'
        });
      } else {
        setOutput(`HATA: ${result.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      setOutput(`HATA: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultJavaScriptCode[algorithm.id] || defaultJavaScriptCode['default']);
    setOutput('');
    setVariables({});
    setCurrentStep(0);
    setTotalSteps(0);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Burada önceki adımın verilerini yükle
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Burada sonraki adımın verilerini yükle
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3">
      {/* Üst Kısım: Başlık ve Kontroller */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">JavaScript Editörü</h3>
          <p className="text-sm text-gray-400">Kodu yazın ve adım adım çalıştırın</p>
        </div>
        
        {/* Adım Kontrol Butonları */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevStep}
            disabled={currentStep <= 1}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Önceki
          </button>
          
          <div className="px-4 py-2 bg-gray-800 rounded border border-gray-700 min-w-[120px] text-center">
            <span className="text-lg font-bold text-white">{currentStep}</span>
            <span className="text-gray-500"> / {totalSteps || '-'}</span>
          </div>
          
          <button
            onClick={handleNextStep}
            disabled={currentStep >= totalSteps || totalSteps === 0}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Sıfırla ve Çalıştır */}
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 font-semibold"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Çalışıyor...' : 'Başlat'}
          </button>
        </div>
      </div>

      {/* Ana İçerik - Çok Daha Uzun */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Sol: Kod Editörü */}
        <div className="border-2 border-gray-700 rounded-lg overflow-hidden h-full">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Sağ: İkiye Bölünmüş Panel */}
        <div className="flex flex-col gap-4 h-full">
          {/* Üst Yarı: Değişkenler */}
          <div className="border-2 border-gray-700 rounded-lg p-5 bg-gray-800 flex-1 overflow-auto">
            <h4 className="text-gray-200 font-bold mb-4 flex items-center gap-2 text-lg">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Değişkenler
            </h4>
            <div className="space-y-3 font-mono text-base">
              {Object.keys(variables).length > 0 ? (
                Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <span className="text-blue-400 font-bold">{key}</span>
                    <span className="text-green-400">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-12 text-lg">
                  Kodu çalıştırdıktan sonra değişkenler burada görünecek
                </p>
              )}
            </div>
          </div>

          {/* Alt Yarı: Görsel Elemanlar */}
          <div className="border-2 border-gray-700 rounded-lg p-5 bg-gray-800 flex-1 overflow-auto">
            <h4 className="text-gray-200 font-bold mb-4 flex items-center gap-2 text-lg">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              Görselleştirme
            </h4>
            <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg min-h-[250px] border border-gray-700">
              <p className="text-gray-500 text-center text-lg">
                Görsel elemanlar buraya eklenecek<br/>
                <span className="text-base">(Çubuk grafik, animasyon, vb.)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alt: Konsol Çıktısı - Daha Geniş */}
      <div className="border-2 border-gray-700 rounded-lg p-5 bg-gray-900 text-white font-mono text-base h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-gray-300 flex items-center gap-2 text-lg font-bold">
            <Terminal className="w-5 h-5" />
            Konsol Çıktısı
          </h4>
          {currentStep > 0 && (
            <span className="text-sm text-gray-500">
              Adım {currentStep} / {totalSteps}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-auto bg-black p-4 rounded-lg border border-gray-800">
          {output ? (
            <pre className="whitespace-pre-wrap text-base leading-relaxed">{output}</pre>
          ) : (
            <p className="text-gray-500 text-lg">Kodu çalıştırmak için "Başlat" butonuna tıklayın...</p>
          )}
        </div>
      </div>
    </div>
  );
}