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
// input dizisini sıralar

function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    console.log(\`Dış döngü: i = \${i}\`);
    
    for (let j = 0; j < n - i - 1; j++) {
      console.log(\`Karşılaştırma: arr[\${j}]=\${arr[j]} vs arr[\${j+1}]=\${arr[j+1]}\`);
      
      if (arr[j] > arr[j + 1]) {
        // Yer değiştir
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        console.log(\`Yer değiştirme yapıldı: [\${arr.join(', ')}]\`);
      }
    }
    
    console.log(\`\${i + 1}. tur tamamlandı: [\${arr.join(', ')}]\`);
  }
  
  return arr;
}

// Sıralamayı başlat
const result = bubbleSort(input);
console.log("\\n✓ Sıralama tamamlandı!");
console.log("Sonuç:", result);`,

  'quick-sort': `// Quick Sort - JavaScript
// input dizisini sıralar

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
  console.log(\`Pivot seçildi: \${pivot} (indeks \${high})\`);
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    console.log(\`Karşılaştırma: arr[\${j}]=\${arr[j]} vs pivot \${pivot}\`);
    
    if (arr[j] < pivot) {
      i++;
      if (i !== j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        console.log(\`Yer değiştirme: [\${arr.join(', ')}]\`);
      }
    }
  }
  
  const temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  console.log(\`Pivot yerleştirildi: [\${arr.join(', ')}]\`);
  
  return i + 1;
}

// Sıralamayı başlat
const result = quickSort(input);
console.log("\\n✓ Sıralama tamamlandı!");
console.log("Sonuç:", result);`,

  'selection-sort': `// Selection Sort - JavaScript
// input dizisini sıralar

function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    console.log(\`Minimum aranıyor, başlangıç: \${arr[i]} (indeks \${i})\`);
    
    for (let j = i + 1; j < n; j++) {
      console.log(\`Karşılaştırma: min=\${arr[minIdx]} vs arr[\${j}]=\${arr[j]}\`);
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        console.log(\`Yeni minimum bulundu: \${arr[minIdx]} (indeks \${minIdx})\`);
      }
    }
    
    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      console.log(\`Yer değiştirme yapıldı: [\${arr.join(', ')}]\`);
    }
    
    console.log(\`\${i + 1}. eleman yerinde: [\${arr.join(', ')}]\`);
  }
  
  return arr;
}

// Sıralamayı başlat
const result = selectionSort(input);
console.log("\\n✓ Sıralama tamamlandı!");
console.log("Sonuç:", result);`,

  'insertion-sort': `// Insertion Sort - JavaScript
// input dizisini sıralar

function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    console.log(\`Anahtar eleman: \${key} (indeks \${i})\`);
    
    while (j >= 0 && arr[j] > key) {
      console.log(\`Kaydırma: \${arr[j]} → indeks \${j + 1}\`);
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
    console.log(\`\${key} yerine yerleştirildi: [\${arr.join(', ')}]\`);
  }
  
  return arr;
}

// Sıralamayı başlat
const result = insertionSort(input);
console.log("\\n✓ Sıralama tamamlandı!");
console.log("Sonuç:", result);`,

  'binary-search': `// Binary Search - JavaScript
// Sıralı input dizisinde hedefi arar

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let steps = 0;
  
  console.log(\`Aranıyor: \${target}\`);
  console.log(\`Dizi: [\${arr.join(', ')}]\\n\`);
  
  while (left <= right) {
    steps++;
    const mid = Math.floor((left + right) / 2);
    console.log(\`Adım \${steps}: left=\${left}, right=\${right}, mid=\${mid}, arr[mid]=\${arr[mid]}\`);
    
    if (arr[mid] === target) {
      console.log(\`\\n✓ Bulundu! Hedef \${target}, indeks \${mid}\`);
      console.log(\`Toplam \${steps} adımda bulundu.\`);
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
      console.log(\`Hedef sağ tarafta, left = \${left}\`);
    } else {
      right = mid - 1;
      console.log(\`Hedef sol tarafta, right = \${right}\`);
    }
  }
  
  console.log(\`\\n✗ Bulunamadı! Hedef \${target} dizide yok.\`);
  return -1;
}

// Aramayı başlat
const target = input[input.length - 1]; // Son elemanı ara
const result = binarySearch(input, target);`,

  'default': `// JavaScript kodunuzu buraya yazın
// input değişkeni otomatik olarak tanımlıdır

function myAlgorithm(arr) {
  console.log("Girdi:", arr);
  
  // Algoritmanızı buraya yazın
  for (let i = 0; i < arr.length; i++) {
    console.log(\`İşleniyor: \${arr[i]}\`);
  }
  
  return arr;
}

const result = myAlgorithm(input);
console.log("\\nSonuç:", result);`,
};

export default function CodeEditor({ algorithm }: CodeEditorProps) {
  const [code, setCode] = useState(
    defaultJavaScriptCode[algorithm.id] || defaultJavaScriptCode['default']
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Kod çalıştırılıyor...\n');
    setExecutionTime(0);

    try {
      // Örnek input
      const input = [64, 34, 25, 12, 22, 11, 90];
      
      const result = await executeJavaScriptCode(code, input);
      
      setExecutionTime(result.executionTime);
      
      if (result.success) {
        setOutput(result.output || 'Kod çalıştırıldı (çıktı yok)');
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
    setExecutionTime(0);
  };

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="400px"
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

        <div className="border rounded-lg p-4 bg-gray-900 text-white font-mono text-sm overflow-auto h-[400px]">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-gray-400">Çıktı:</h4>
            {executionTime > 0 && (
              <span className="text-xs text-gray-500">
                {executionTime}ms
              </span>
            )}
          </div>
          {output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-gray-500">Kodu çalıştırmak için "Çalıştır" butonuna tıklayın...</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">İpuçları:</h4>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>JavaScript kodu yazabilirsiniz</li>
          <li><code>input</code> değişkeni otomatik olarak tanımlıdır (örnek dizi)</li>
          <li><code>console.log()</code> ile çıktı alabilirsiniz</li>
          <li>Kodunuzu fonksiyon içinde yazmanız önerilir</li>
          <li>Sonsuz döngülerden kaçının (5 saniye timeout)</li>
        </ul>
      </div>
    </div>
  );
}