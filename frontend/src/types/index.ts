export interface Algorithm {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'tree' | 'dynamic-programming' | 'clustering';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  complexity: {
    time: string;
    space: string;
  };
  steps: AlgorithmStep[];
}

export interface AlgorithmStep {
  id: number;
  description: string;
  pseudoCode: string;
  explanation: string;
}

export interface FlowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
