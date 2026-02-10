'use client';

import { useState, useEffect } from 'react';
import { Algorithm } from '@/types';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualizerProps {
  algorithm: Algorithm;
}

// Sample data for visualization
const generateRandomArray = (size: number = 10) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 10);
};

export default function Visualizer({ algorithm }: VisualizerProps) {
  const [data, setData] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  useEffect(() => {
    reset();
  }, [algorithm]);

  const reset = () => {
    setData(generateRandomArray());
    setCurrentStep(0);
    setIsPlaying(false);
    setComparing([]);
    setSwapping([]);
  };

  const nextStep = () => {
    if (currentStep < algorithm.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      // Simulate comparison/swapping for demo
      const indices = [Math.floor(Math.random() * data.length), Math.floor(Math.random() * data.length)];
      setComparing(indices);
      setTimeout(() => setComparing([]), 500);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStep < algorithm.steps.length - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const getBarColor = (index: number) => {
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (swapping.includes(index)) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Algoritma Görselleştirici</h3>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === algorithm.steps.length - 1}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-gray-100 rounded-lg p-8 h-[300px] flex items-end justify-center gap-2">
        <AnimatePresence>
          {data.map((value, index) => (
            <motion.div
              key={index}
              layout
              initial={{ height: 0 }}
              animate={{ height: `${value * 2}px` }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-8 rounded-t transition-colors duration-300 ${getBarColor(index)}`}
            >
              <span className="text-white text-xs font-bold flex justify-center pt-1">
                {value}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Step Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-4 mb-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Adım {currentStep + 1} / {algorithm.steps.length}
          </span>
          <h4 className="font-semibold">{algorithm.steps[currentStep]?.description}</h4>
        </div>
        <code className="block bg-gray-800 text-white p-3 rounded text-sm font-mono mb-2">
          {algorithm.steps[currentStep]?.pseudoCode}
        </code>
        <p className="text-gray-600 text-sm">
          {algorithm.steps[currentStep]?.explanation}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / algorithm.steps.length) * 100}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span>Karşılaştırma</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span>Değiştirme</span>
        </div>
      </div>
    </div>
  );
}
