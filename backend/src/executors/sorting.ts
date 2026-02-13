export interface AlgorithmStep {
  step: number;
  description: string;
  data: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
}

export class SortingExecutor {
  private steps: AlgorithmStep[] = [];
  private stepCount = 0;

  execute(algorithmType: string, input: number[]): AlgorithmStep[] {
    this.steps = [];
    this.stepCount = 0;

    const data = [...input]; // Copy array

    switch (algorithmType) {
      case 'bubble-sort':
        this.bubbleSort(data);
        break;
      case 'selection-sort':
        this.selectionSort(data);
        break;
      case 'insertion-sort':
        this.insertionSort(data);
        break;
      case 'quick-sort':
        this.quickSort(data, 0, data.length - 1);
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithmType}`);
    }

    // Add final sorted state
    this.addStep(data, 'Sıralama tamamlandı!', [], [], []);

    return this.steps;
  }

  private addStep(
    data: number[],
    description: string,
    comparing: number[] = [],
    swapping: number[] = [],
    sorted: number[] = [],
    pivot?: number
  ): void {
    this.steps.push({
      step: this.stepCount++,
      description,
      data: [...data],
      comparing: comparing.length > 0 ? comparing : undefined,
      swapping: swapping.length > 0 ? swapping : undefined,
      sorted: sorted.length > 0 ? sorted : undefined,
      pivot
    });
  }

  private bubbleSort(arr: number[]): void {
    const n = arr.length;

    this.addStep(arr, 'Bubble Sort başlıyor...');

    for (let i = 0; i < n - 1; i++) {
      this.addStep(arr, `Dış döngü: i = ${i}`);

      for (let j = 0; j < n - i - 1; j++) {
        this.addStep(arr, `Karşılaştırma: arr[${j}] vs arr[${j + 1}]`, [j, j + 1]);

        if (arr[j] > arr[j + 1]) {
          this.addStep(arr, `Yer değiştirme: ${arr[j]} ↔ ${arr[j + 1]}`, [j, j + 1], [j, j + 1]);
          
          // Swap
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          this.addStep(arr, `Yer değiştirme tamamlandı`, [], [j, j + 1]);
        }
      }

      // Mark last i elements as sorted
      const sortedIndices = [];
      for (let k = n - i - 1; k < n; k++) {
        sortedIndices.push(k);
      }
      this.addStep(arr, `${i + 1}. eleman yerinde`, [], [], sortedIndices);
    }
  }

  private selectionSort(arr: number[]): void {
    const n = arr.length;

    this.addStep(arr, 'Selection Sort başlıyor...');

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      this.addStep(arr, `Minimum bulma: başlangıç = ${i}`);

      for (let j = i + 1; j < n; j++) {
        this.addStep(arr, `Karşılaştırma: arr[${minIdx}] vs arr[${j}]`, [minIdx, j]);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          this.addStep(arr, `Yeni minimum bulundu: indeks ${minIdx}`);
        }
      }

      if (minIdx !== i) {
        this.addStep(arr, `Yer değiştirme: ${arr[i]} ↔ ${arr[minIdx]}`, [i, minIdx], [i, minIdx]);
        
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;

        this.addStep(arr, `Yer değiştirme tamamlandı`, [], [i, minIdx]);
      }

      const sortedIndices = [];
      for (let k = 0; k <= i; k++) {
        sortedIndices.push(k);
      }
      this.addStep(arr, `${i + 1}. eleman yerinde`, [], [], sortedIndices);
    }
  }

  private insertionSort(arr: number[]): void {
    const n = arr.length;

    this.addStep(arr, 'Insertion Sort başlıyor...');

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      this.addStep(arr, `Anahtar eleman: ${key} (indeks ${i})`, [i]);

      while (j >= 0 && arr[j] > key) {
        this.addStep(arr, `Kaydırma: arr[${j}] → arr[${j + 1}]`, [j, j + 1], [j, j + 1]);
        
        arr[j + 1] = arr[j];
        j--;

        this.addStep(arr, `Kaydırma tamamlandı`, [], [j + 1, j + 2]);
      }

      arr[j + 1] = key;
      this.addStep(arr, `${key} yerine yerleştirildi`, [j + 1]);
    }
  }

  private quickSort(arr: number[], low: number, high: number): void {
    if (low < high) {
      const pi = this.partition(arr, low, high);
      this.quickSort(arr, low, pi - 1);
      this.quickSort(arr, pi + 1, high);
    }
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    this.addStep(arr, `Pivot seçildi: ${pivot}`, [], [], [], high);

    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.addStep(arr, `Karşılaştırma: arr[${j}] vs pivot ${pivot}`, [j, high]);

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          this.addStep(arr, `Yer değiştirme`, [i, j], [i, j]);
          
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          this.addStep(arr, `Yer değiştirme tamamlandı`, [], [i, j]);
        }
      }
    }

    this.addStep(arr, `Pivot yerine yerleştiriliyor`, [i + 1, high], [i + 1, high]);
    
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    this.addStep(arr, `Pivot yerine yerleştirildi`, [], [i + 1]);

    return i + 1;
  }
}