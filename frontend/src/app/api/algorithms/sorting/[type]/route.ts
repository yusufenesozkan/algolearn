import { NextRequest, NextResponse } from 'next/server';
import { SortingExecutor } from '@/lib/executors/sorting';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const body = await request.json();
    const { input } = body;

    if (!Array.isArray(input)) {
      return NextResponse.json(
        { success: false, error: 'Input must be an array' },
        { status: 400 }
      );
    }

    const executor = new SortingExecutor();
    const steps = executor.execute(type, input);

    return NextResponse.json({
      success: true,
      algorithm: type,
      input,
      steps,
      totalSteps: steps.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort', complexity: 'O(n²)' },
      { id: 'quick-sort', name: 'Quick Sort', complexity: 'O(n log n)' },
      { id: 'merge-sort', name: 'Merge Sort', complexity: 'O(n log n)' },
      { id: 'selection-sort', name: 'Selection Sort', complexity: 'O(n²)' },
      { id: 'insertion-sort', name: 'Insertion Sort', complexity: 'O(n²)' }
    ]
  });
}