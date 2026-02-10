# AlgoLearn

İnteraktif algoritma ve veri yapıları öğrenme platformu. Görselleştirme, akış diyagramları ve kaba kod ile algoritmaları adım adım öğrenin!

## Özellikler

- **Algoritma Kütüphanesi**: Sıralama, arama, graf ve ağaç algoritmaları
- **Video Anlatımlar**: Her algoritma için kısa tanıtım videoları
- **Akış Diyagramı Editörü**: Sürükle-bırak ile kendi akış diyagramlarınızı oluşturun
- **Kaba Kod Editörü**: Pseudocode yazın ve çalıştırın
- **Görselleştirici**: Algoritmaları gerçek zamanlı görselleştirin
- **Adım Adım Anlatım**: Her adımı detaylı olarak öğrenin

## Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Görselleştirme**: React Flow, Framer Motion, Monaco Editor
- **İkonlar**: Lucide React

## Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/yusufenesozkan/algolearn.git
cd algolearn/frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Mevcut Algoritmalar

### Sıralama
- Bubble Sort
- Quick Sort

### Arama
- Binary Search

### Graf
- Depth First Search (DFS)
- Breadth First Search (BFS)

## Proje Yapısı

```
frontend/
├── src/
│   ├── app/                    # Next.js sayfaları
│   │   ├── algorithms/[id]/    # Algoritma detay sayfası
│   │   └── page.tsx            # Ana sayfa
│   ├── components/
│   │   ├── FlowEditor/         # Akış diyagramı editörü
│   │   ├── CodeEditor/         # Kaba kod editörü
│   │   └── Visualizer/         # Algoritma görselleştirici
│   ├── data/
│   │   └── algorithms.ts       # Algoritma verileri
│   └── types/
│       └── index.ts            # TypeScript tipleri
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Yol Haritası

- [ ] Daha fazla algoritma ekle
- [ ] Kullanıcı kayıt/giriş sistemi
- [ ] İlerleme takibi
- [ ] Quiz ve testler
- [ ] Kod çalıştırma sandbox
- [ ] Çoklu dil desteği

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**AlgoLearn** - Algoritmaları öğrenmenin en kolay yolu! 🚀
