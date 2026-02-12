export interface AlgorithmStep {
  step: number;
  description: string;
  data: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
}

export interface SortingResult {
  success: boolean;
  algorithm: string;
  input: number[];
  steps: AlgorithmStep[];
  totalSteps: number;
  error?: string;
}

export const executeSortingAlgorithm = async (
  algorithmType: string,
  input: number[]
): Promise<SortingResult> => {
  try {
    // Use relative URL for Vercel (same domain)
    const response = await fetch(`/api/algorithms/sorting/${algorithmType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      algorithm: algorithmType,
      input,
      steps: [],
      totalSteps: 0,
      error: error instanceof Error ? error.message : 'Failed to execute algorithm',
    };
  }
};

export const getSortingAlgorithms = async () => {
  try {
    // Use relative URL for Vercel (same domain)
    const response = await fetch(`/api/algorithms/sorting/bubble-sort`);
    const data = await response.json();
    return data.algorithms || [];
  } catch (error) {
    console.error('Failed to fetch algorithms:', error);
    return [];
  }
};