import { Router } from 'express';
import { SortingExecutor } from '../executors/sorting';

const router = Router();

// POST /api/algorithms/sorting/:type
router.post('/sorting/:type', (req, res) => {
  try {
    const { type } = req.params;
    const { input } = req.body;

    const executor = new SortingExecutor();
    const steps = executor.execute(type, input);

    res.json({
      success: true,
      algorithm: type,
      input,
      steps,
      totalSteps: steps.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/algorithms/sorting
router.get('/sorting', (req, res) => {
  res.json({
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort', complexity: 'O(n²)' },
      { id: 'quick-sort', name: 'Quick Sort', complexity: 'O(n log n)' },
      { id: 'merge-sort', name: 'Merge Sort', complexity: 'O(n log n)' },
      { id: 'selection-sort', name: 'Selection Sort', complexity: 'O(n²)' },
      { id: 'insertion-sort', name: 'Insertion Sort', complexity: 'O(n²)' }
    ]
  });
});

export { router as algorithmRoutes };