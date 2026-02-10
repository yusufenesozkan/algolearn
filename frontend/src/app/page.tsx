'use client';

import { useState } from 'react';
import Link from 'next/link';
import { algorithms } from '@/data/algorithms';
import { ChevronDown, ChevronRight, BookOpen, Layers, Network, Play } from 'lucide-react';

const categoryConfig: Record<string, { name: string; icon: any; color: string; bgColor: string; borderColor: string }> = {
  sorting: {
    name: 'Sıralama Algoritmaları',
    icon: Layers,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20 hover:bg-blue-900/30',
    borderColor: 'border-blue-800',
  },
  graph: {
    name: 'Graph Algoritmaları',
    icon: Network,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20 hover:bg-purple-900/30',
    borderColor: 'border-purple-800',
  },
  clustering: {
    name: 'Kümeleme Algoritmaları',
    icon: BookOpen,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/20 hover:bg-orange-900/30',
    borderColor: 'border-orange-800',
  },
};

export default function Home() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('sorting');

  const getAlgorithmsByCategory = (category: string) => {
    return algorithms.filter((alg) => alg.category === category);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section with Description */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-gray-100 py-16 border-b border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">AlgoLearn</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto text-gray-300">
            Algoritmaları görselleştirerek öğrenmenin en kolay yolu!
          </p>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto border border-gray-600">
            <p className="text-lg leading-relaxed text-gray-300">
              AlgoLearn, algoritma ve veri yapılarını adım adım, görsel olarak ve interaktif şekilde öğrenmenizi sağlar. 
              Akış diyagramları oluşturun, kaba kod yazın ve algoritmaların çalışmasını gerçek zamanlı izleyin. 
              Sıralama, graph ve kümeleme algoritmalarını keşfedin!
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Categories */}
      <div id="algorithms" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const categoryAlgorithms = getAlgorithmsByCategory(key);
            const isExpanded = expandedCategory === key;

            return (
              <div key={key} className="flex flex-col">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(key)}
                  className={`${config.bgColor} rounded-lg p-6 transition-all duration-200 border-2 ${
                    isExpanded ? `${config.borderColor} shadow-lg shadow-black/50` : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gray-800 shadow-sm border border-gray-700`}>
                        <Icon className={`w-8 h-8 ${config.color}`} />
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${config.color}`}>{config.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {categoryAlgorithms.length} algoritma
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-6 h-6 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Algorithm List (Expanded) */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {categoryAlgorithms.length > 0 ? (
                      categoryAlgorithms.map((algorithm) => (
                        <Link
                          key={algorithm.id}
                          href={`/algorithms/${algorithm.id}`}
                          className="block bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition border border-gray-700 hover:border-gray-500"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-200 mb-2">
                                {algorithm.name}
                              </h4>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {algorithm.description}
                              </p>
                            </div>
                            <div className="ml-3">
                              <Play className="w-5 h-5 text-gray-500" />
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500 border border-gray-700">
                        <p>Bu kategoride henüz algoritma yok.</p>
                        <p className="text-sm mt-1">Çok yakında eklenecek!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
