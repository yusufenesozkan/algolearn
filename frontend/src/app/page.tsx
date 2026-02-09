'use client';

import Link from 'next/link';
import { algorithms } from '@/data/algorithms';
import { Play, BookOpen, BarChart3 } from 'lucide-react';

const categoryColors: Record<string, string> = {
  sorting: 'bg-blue-100 text-blue-800',
  searching: 'bg-green-100 text-green-800',
  graph: 'bg-purple-100 text-purple-800',
  tree: 'bg-orange-100 text-orange-800',
  'dynamic-programming': 'bg-red-100 text-red-800',
};

const categoryNames: Record<string, string> = {
  sorting: 'Sıralama',
  searching: 'Arama',
  graph: 'Graf',
  tree: 'Ağaç',
  'dynamic-programming': 'Dinamik Programlama',
};

const difficultyColors: Record<string, string> = {
  beginner: 'text-green-600',
  intermediate: 'text-yellow-600',
  advanced: 'text-red-600',
};

const difficultyNames: Record<string, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">AlgoLearn</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Algoritma ve veri yapılarını görselleştirerek öğren! 
            Akış diyagramları ve kaba kod ile adım adım keşfet.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="#algorithms"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Başla
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold">{algorithms.length}+</h3>
            <p className="text-gray-600">Algoritma</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Play className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold">Görsel</h3>
            <p className="text-gray-600">Adım Adım Anlatım</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-bold">İnteraktif</h3>
            <p className="text-gray-600">Akış Diyagramları</p>
          </div>
        </div>
      </div>

      {/* Algorithm List */}
      <div id="algorithms" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Algoritmalar</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algorithm) => (
            <Link
              key={algorithm.id}
              href={`/algorithms/${algorithm.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 block"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    categoryColors[algorithm.category]
                  }`}
                >
                  {categoryNames[algorithm.category]}
                </span>
                <span className={`text-sm font-medium ${difficultyColors[algorithm.difficulty]}`}>
                  {difficultyNames[algorithm.difficulty]}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{algorithm.name}</h3>
              <p className="text-gray-600 mb-4">{algorithm.description}</p>
              
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Zaman: {algorithm.complexity.time}</span>
                <span>Mekan: {algorithm.complexity.space}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
