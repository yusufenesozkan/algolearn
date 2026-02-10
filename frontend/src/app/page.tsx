'use client';

import Link from 'next/link';
import { algorithms } from '@/data/algorithms';
import { Layers, Network, BookOpen, ArrowRight } from 'lucide-react';

const categoryConfig: Record<string, { name: string; icon: any; color: string; bgColor: string; borderColor: string; description: string }> = {
  sorting: {
    name: 'Sıralama Algoritmaları',
    icon: Layers,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20 hover:bg-blue-900/30',
    borderColor: 'border-blue-800',
    description: 'Verileri düzenlemek için kullanılan algoritmalar',
  },
  graph: {
    name: 'Graph Algoritmaları',
    icon: Network,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20 hover:bg-purple-900/30',
    borderColor: 'border-purple-800',
    description: 'Graph yapıları üzerinde çalışan algoritmalar',
  },
  clustering: {
    name: 'Kümeleme Algoritmaları',
    icon: BookOpen,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/20 hover:bg-orange-900/30',
    borderColor: 'border-orange-800',
    description: 'Verileri gruplara ayıran algoritmalar',
  },
};

export default function Home() {
  const getAlgorithmsByCategory = (category: string) => {
    return algorithms.filter((alg) => alg.category === category);
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
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Algoritma Kategorileri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const categoryAlgorithms = getAlgorithmsByCategory(key);

            return (
              <Link
                key={key}
                href={`/algorithms/${key}`}
                className={`${config.bgColor} rounded-xl p-6 transition-all duration-200 border-2 ${config.borderColor} shadow-lg hover:shadow-xl hover:scale-[1.02] group block`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-800 shadow-sm border border-gray-700`}>
                    <Icon className={`w-10 h-10 ${config.color}`} />
                  </div>
                  <ArrowRight className={`w-6 h-6 ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                </div>
                
                <h3 className={`font-bold text-xl ${config.color} mb-2`}>
                  {config.name}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {config.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <span className="text-sm text-gray-500">
                    {categoryAlgorithms.length} algoritma
                  </span>
                  <span className={`text-sm font-semibold ${config.color} group-hover:underline`}>
                    Keşfet →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
