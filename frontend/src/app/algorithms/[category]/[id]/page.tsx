'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAlgorithmById } from '@/data/algorithms';
import { ArrowLeft, Play, Code, GitBranch } from 'lucide-react';
import { useState } from 'react';
import FlowEditor from '@/components/FlowEditor/FlowEditor';
import CodeEditor from '@/components/CodeEditor/CodeEditor';

type Tab = 'info' | 'flow' | 'code';

export default function AlgorithmPage() {
  const params = useParams();
  const algorithm = getAlgorithmById(params.id as string);
  const category = params.category as string;
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
            href={`/algorithms/${category}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">{algorithm.name}</h1>
            <p className="text-gray-400">{algorithm.description}</p>
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
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 rounded-2xl shadow-xl p-6 border border-gray-700 min-h-[800px]">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                <div className="text-center text-gray-400">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Video Tanıtım (Yakında)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && <FlowEditor algorithm={algorithm} />}
          {activeTab === 'code' && <CodeEditor algorithm={algorithm} />}
        </div>
      </div>
    </div>
  );
}
