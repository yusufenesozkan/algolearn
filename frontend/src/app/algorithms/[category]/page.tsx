'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { algorithms } from '@/data/algorithms';
import { ArrowLeft, Play, Layers, Network, BookOpen } from 'lucide-react';

const categoryConfig: Record<string, { name: string; icon: any; color: string; bgColor: string; borderColor: string; description: string }> = {
  sorting: {
    name: 'Sıralama Algoritmaları',
    icon: Layers,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-800',
    description: 'Verileri belirli bir düzende sıralamak için kullanılan algoritmalar',
  },
  graph: {
    name: 'Graph Algoritmaları',
    icon: Network,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-800',
    description: 'Graph veri yapıları üzerinde çalışan arama ve traversal algoritmaları',
  },
  clustering: {
    name: 'Kümeleme Algoritmaları',
    icon: BookOpen,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/20',
    borderColor: 'border-orange-800',
    description: 'Veri noktalarını gruplara ayıran kümeleme algoritmaları',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const config = categoryConfig[category];
  
  const categoryAlgorithms = algorithms.filter((alg) => alg.category === category);
  
  if (!config) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Kategori Bulunamadı</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </Link>
          
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-xl bg-gray-800 shadow-lg border ${config.borderColor}`}>
              <Icon className={`w-12 h-12 ${config.color}`} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${config.color} mb-2`}>{config.name}</h1>
              <p className="text-gray-400 text-lg">{config.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm List */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Mevcut Algoritmalar ({categoryAlgorithms.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryAlgorithms.length > 0 ? (
            categoryAlgorithms.map((algorithm) => (
              <Link
                key={algorithm.id}
                href={`/algorithms/${category}/${algorithm.id}`}
                className="block bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700 hover:border-gray-500 hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-200 group-hover:text-white transition">
                    {algorithm.name}
                  </h3>
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Play className={`w-5 h-5 ${config.color}`} />
                  </div>
                </div>
                <p className="text-gray-400 line-clamp-3">
                  {algorithm.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
              <Icon className={`w-16 h-16 mx-auto mb-4 opacity-50 ${config.color}`} />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Henüz Algoritma Yok
              </h3>
              <p className="text-gray-500">
                Bu kategoride algoritmalar çok yakında eklenecek!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
