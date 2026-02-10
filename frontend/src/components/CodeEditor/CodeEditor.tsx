'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Algorithm } from '@/types';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  algorithm: Algorithm;
}

const defaultPseudoCode: Record<string, string> = {
  'bubble-sort': `fonksiyon bubbleSort(dizi):
    n = dizi.uzunluk
    
    için i = 0'dan n-1'e kadar:
        için j = 0'dan n-i-1'e kadar:
            eğer dizi[j] > dizi[j+1] ise:
                // Yer değiştir
                geçici = dizi[j]
                dizi[j] = dizi[j+1]
                dizi[j+1] = geçici
    
    dizi'yi döndür`,
  
  'binary-search': `fonksiyon binarySearch(dizi, hedef):
    sol = 0
    sağ = dizi.uzunluk - 1
    
    iken sol <= sağ:
        orta = (sol + sağ) / 2
        
        eğer dizi[orta] == hedef:
            orta'yı döndür
        
        eğer dizi[orta] < hedef:
            sol = orta + 1
        değilse:
            sağ = orta - 1
    
    -1 döndür // Bulunamadı`,
  
  'default': `// Algoritmanızı buraya yazın
// Pseudocode formatında

fonksiyon algoritma(girdi):
    // İşlemler
    sonuç = girdi
    
    sonuç'u döndür`,
};

export default function CodeEditor({ algorithm }: CodeEditorProps) {
  const [code, setCode] = useState(
    defaultPseudoCode[algorithm.id] || defaultPseudoCode['default']
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('Kod çalıştırılıyor...\n\n');
    
    // Simulate execution with explanation
    setTimeout(() => {
      setOutput((prev) => 
        prev + `✓ Algoritma başarıyla çalıştırıldı!\n\n` +
        `Açıklama:\n` +
        `Bu ${algorithm.name} algoritmasıdır.\n\n` +
        `Adımlar:\n` +
        algorithm.steps.map(s => `${s.id}. ${s.description}`).join('\n')
      );
      setIsRunning(false);
    }, 1500);
  };

  const resetCode = () => {
    setCode(defaultPseudoCode[algorithm.id] || defaultPseudoCode['default']);
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Kaba Kod Editörü</h3>
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
            defaultLanguage="plaintext"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
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
          <h4 className="text-gray-400 mb-2">Çıktı:</h4>
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
          <li>Türkçe pseudocode kullanabilirsiniz</li>
          <li>Algoritmanın mantığını adım adım yazın</li>
          <li>Değişken isimleri anlamlı olsun</li>
          <li>Yorum satırları ekleyerek açıklama yapabilirsiniz</li>
        </ul>
      </div>
    </div>
  );
}
