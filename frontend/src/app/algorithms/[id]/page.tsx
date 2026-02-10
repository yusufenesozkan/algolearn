'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAlgorithmById } from '@/data/algorithms';
import { ArrowLeft, Play, Code, GitBranch } from 'lucide-react';
import { useState } from 'react';
import FlowEditor from '@/components/FlowEditor/FlowEditor';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import Visualizer from '@/components/Visualizer/Visualizer';

type Tab = 'info' | 'flow' | 'code' | 'visualize';

export default function AlgorithmPage() {
  const params = useParams();
  const algorithm = getAlgorithmById(params.id as string);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  if (!algorithm) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Algoritma Bulunamadı</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">{algorithm.name}</h1>
              <p className="text-gray-400">{algorithm.description}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-800">
                <span className="text-gray-400">Zaman:</span>
                <span className="ml-2 font-mono font-bold text-blue-400">{algorithm.complexity.time}</span>
              </div>
              <div className="bg-green-900/30 px-4 py-2 rounded-lg border border-green-800">
                <span className="text-gray-400">Mekan:</span>
                <span className="ml-2 font-mono font-bold text-green-400">{algorithm.complexity.space}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <Play className="w-4 h-4" />
            Tanıtım
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'flow'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Akış Diyagramı
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Kaba Kod
          </button>
          <button
            onClick={() => setActiveTab('visualize')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'visualize'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <Play className="w-4 h-4" />
            Görselleştir
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                <div className="text-center text-gray-400">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Video Tanıtım (Yakında)</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">Algoritma Adımları</h3>
                <div className="space-y-4">
                  {algorithm.steps.map((step) => (
                    <div
                      key={step.id}
                      className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-700/50 rounded-r-lg"
                    >
                      <h4 className="font-semibold mb-1 text-gray-200">
                        {step.id}. {step.description}
                      </h4>
                      <code className="block bg-gray-900 p-2 rounded text-sm font-mono mb-2 text-green-400 border border-gray-700">
                        {step.pseudoCode}
                      </code>
                      <p className="text-gray-400 text-sm">{step.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && <FlowEditor algorithm={algorithm} />}
          {activeTab === 'code' && <CodeEditor algorithm={algorithm} />}
          {activeTab === 'visualize' && <Visualizer algorithm={algorithm} />}
        </div>
      </div>
    </div>
  );
}
