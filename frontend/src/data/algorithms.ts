import { Algorithm } from '@/types';

export const algorithms: Algorithm[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Komşu elemanları karşılaştırarak sıralama yapan basit bir algoritma',
    difficulty: 'beginner',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
    steps: [
      {
        id: 1,
        description: 'Dizinin başından başla',
        pseudoCode: 'for i from 0 to n-1',
        explanation: 'Dizinin her elemanı için işlem yapacağız',
      },
      {
        id: 2,
        description: 'Komşu elemanları karşılaştır',
        pseudoCode: 'if arr[j] > arr[j+1] then',
        explanation: 'Yan yana olan iki elemanı karşılaştırıyoruz',
      },
      {
        id: 3,
        description: 'Yer değiştirme',
        pseudoCode: 'swap(arr[j], arr[j+1])',
        explanation: 'Büyük olan eleman sağa, küçük olan sola geçer',
      },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    description: 'Sıralı dizide hedef değeri O(log n) karmaşıklığında bulan arama algoritması',
    difficulty: 'beginner',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)',
    },
    steps: [
      {
        id: 1,
        description: 'Orta elemanı bul',
        pseudoCode: 'mid = (left + right) / 2',
        explanation: 'Dizinin orta noktasını hesaplıyoruz',
      },
      {
        id: 2,
        description: 'Karşılaştır',
        pseudoCode: 'if target == arr[mid] then return mid',
        explanation: 'Hedef değer orta elemana eşit mi kontrol et',
      },
      {
        id: 3,
        description: 'Aralığı daralt',
        pseudoCode: 'if target < arr[mid] then right = mid - 1',
        explanation: 'Hedef küçükse sol tarafa, büyükse sağ tarafa bak',
      },
    ],
  },
  {
    id: 'dfs',
    name: 'Depth First Search (DFS)',
    category: 'graph',
    description: 'Grafta derinlik öncelikli arama yapan algoritma',
    difficulty: 'intermediate',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    steps: [
      {
        id: 1,
        description: 'Başlangıç düğümünü ziyaret et',
        pseudoCode: 'visited[start] = true',
        explanation: 'Başlangıç düğümünü işaretle',
      },
      {
        id: 2,
        description: 'Komşuları keşfet',
        pseudoCode: 'for each neighbor of current node',
        explanation: 'Mevcut düğümün tüm komşularına bak',
      },
      {
        id: 3,
        description: 'Ziyaret edilmemişse git',
        pseudoCode: 'if not visited[neighbor] then DFS(neighbor)',
        explanation: 'Ziyaret edilmemiş komşuya rekürsif olarak git',
      },
    ],
  },
  {
    id: 'bfs',
    name: 'Breadth First Search (BFS)',
    category: 'graph',
    description: 'Grafta genişlik öncelikli arama yapan algoritma',
    difficulty: 'intermediate',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    steps: [
      {
        id: 1,
        description: 'Kuyruğa ekle',
        pseudoCode: 'queue.enqueue(start)',
        explanation: 'Başlangıç düğümünü kuyruğa ekle',
      },
      {
        id: 2,
        description: 'Kuyruktan çıkar',
        pseudoCode: 'node = queue.dequeue()',
        explanation: 'Kuyruğun başından eleman al',
      },
      {
        id: 3,
        description: 'Komşuları kuyruğa ekle',
        pseudoCode: 'for each unvisited neighbor: queue.enqueue(neighbor)',
        explanation: 'Ziyaret edilmemiş komşuları kuyruğa ekle',
      },
    ],
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'Böl ve yönet stratejisi ile çalışan hızlı sıralama algoritması',
    difficulty: 'intermediate',
    complexity: {
      time: 'O(n log n) - O(n²)',
      space: 'O(log n)',
    },
    steps: [
      {
        id: 1,
        description: 'Pivot seç',
        pseudoCode: 'pivot = arr[high]',
        explanation: 'Pivot olarak son elemanı seç',
      },
      {
        id: 2,
        description: 'Bölme işlemi',
        pseudoCode: 'i = low - 1',
        explanation: 'Pivotdan küçük elemanların indeksi',
      },
      {
        id: 3,
        description: 'Yerleştir',
        pseudoCode: 'if arr[j] <= pivot then i++ and swap',
        explanation: 'Pivotdan küçük elemanları sola taşı',
      },
    ],
  },
  {
    id: 'k-means',
    name: 'K-Means',
    category: 'clustering',
    description: 'Veri noktalarını K adet kümeye ayıran popüler kümeleme algoritması',
    difficulty: 'intermediate',
    complexity: {
      time: 'O(n * K * I * d)',
      space: 'O(n + K)',
    },
    steps: [
      {
        id: 1,
        description: 'Merkez noktaları başlat',
        pseudoCode: 'centroids = random K points from data',
        explanation: 'K adet rastgele merkez noktası seç',
      },
      {
        id: 2,
        description: 'Noktaları atama',
        pseudoCode: 'for each point: assign to nearest centroid',
        explanation: 'Her veri noktasını en yakın merkeze ata',
      },
      {
        id: 3,
        description: 'Merkezleri güncelle',
        pseudoCode: 'centroids = mean of assigned points',
        explanation: 'Her kümenin merkezini küme üyelerinin ortalaması olarak güncelle',
      },
    ],
  },
  {
    id: 'hierarchical-clustering',
    name: 'Hierarchical Clustering',
    category: 'clustering',
    description: 'Verileri ağaç yapısında hiyerarşik olarak kümeleyen algoritma',
    difficulty: 'advanced',
    complexity: {
      time: 'O(n³)',
      space: 'O(n²)',
    },
    steps: [
      {
        id: 1,
        description: 'Başlangıç kümeleme',
        pseudoCode: 'each point = one cluster',
        explanation: 'Her veri noktası tek başına bir küme',
      },
      {
        id: 2,
        description: 'En yakın kümeleri bul',
        pseudoCode: 'find two closest clusters',
        explanation: 'Birbirine en yakın iki kümeyi bul',
      },
      {
        id: 3,
        description: 'Birleştir',
        pseudoCode: 'merge two closest clusters',
        explanation: 'En yakın iki kümeyi birleştir',
      },
    ],
  },
];

export const getAlgorithmById = (id: string) => {
  return algorithms.find((alg) => alg.id === id);
};

export const getAlgorithmsByCategory = (category: string) => {
  return algorithms.filter((alg) => alg.category === category);
};
