'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Algorithm } from '@/types';
import { Play, RotateCcw } from 'lucide-react';
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
  const [isRunning, setIsRunning] = useState(false);
  const [variables, setVariables] = useState<Record<string, any>>({});

  const runCode = async () => {
    setIsRunning(true);

    try {
      const input = [64, 34, 25, 12, 22, 11, 90];
      const result = await executeJavaScriptCode(code, input);
      
      if (result.success) {
        // Değişkenleri güncelle (şimdilik örnek)
        setVariables({
          input: input,
          result: 'Hesaplanıyor...',
          i: '-',
          j: '-',
          temp: '-'
        });
      }
    } catch (error) {
      console.error('Kod çalıştırma hatası:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultJavaScriptCode[algorithm.id] || defaultJavaScriptCode['default']);
    setVariables({});
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">JavaScript Editörü</h3>
          <p className="text-sm text-gray-400">Kodu yazın ve çalıştırın</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Çalışıyor...' : 'Çalıştır'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sol: Kod Editörü - DAHA UZUN */}
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="600px"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
            }}
          />
        </div>

        {/* Sağ: İkiye Bölünmüş Panel */}
        <div className="flex flex-col gap-4">
          {/* Üst Yarı: Değişkenler */}
          <div className="border rounded-lg p-4 bg-gray-800 flex-1">
            <h4 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Değişkenler
            </h4>
            <div className="space-y-2 font-mono text-sm">
              {Object.keys(variables).length > 0 ? (
                Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-gray-900 p-2 rounded">
                    <span className="text-blue-400">{key}</span>
                    <span className="text-green-400">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Kodu çalıştırdıktan sonra değişkenler burada görünecek
                </p>
              )}
            </div>
          </div>

          {/* Alt Yarı: Görsel Elemanlar (Placeholder) */}
          <div className="border rounded-lg p-4 bg-gray-800 flex-1">
            <h4 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Görselleştirme
            </h4>
            <div className="h-full flex items-center justify-center bg-gray-900 rounded min-h-[150px]">
              <p className="text-gray-500 text-center">
                Görsel elemanlar buraya eklenecek<br/>
                <span className="text-xs">(Çubuk grafik, animasyon, vb.)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}