import { useState, useEffect, useRef } from 'react';
import NewsCard from './NewsCard';

const SOURCES = [
  { id: 'kompas', label: 'Kompas' },
  { id: 'cnn', label: 'CNN' },
];

// Kategori CNN diambil dari path URL bila API tidak mengirim category
function categoryFromLink(link = '') {
  const seg = link.split('/')[3];
  return seg && !/^\d/.test(seg) ? seg.replace(/-/g, ' ') : '';
}

// TAHAP 3: Normalisasi — samakan skema CNN dengan Kompas
function normalize(source, items) {
  return items.map((d) => ({
    ...d,
    image: d.image || d.image_thumbnail || d.image_full || '',
    date: d.date || (d.time ? d.time.replace('T', ' ').slice(0, 16) : ''),
    category:
      source === 'cnn'
        ? ['CNN', d.category || categoryFromLink(d.link)].filter(Boolean).join(' • ')
        : d.category || '',
  }));
}

function NewsFeed() {
  // TAHAP 1: state sumber berita
  const [source, setSource] = useState('kompas');

  // Tiga pilar state
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Abaikan respons lama bila user cepat berpindah sumber
  const requestId = useRef(0);

  // TAHAP 2: URL dinamis dari state source
  const fetchNews = async () => {
    const myId = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const url = 'https://api.siputzx.my.id/api/berita/' + source;
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP Error: ' + res.status);
      const json = await res.json();
      if (myId !== requestId.current) return;
      setNews(normalize(source, json.data || []));
    } catch (err) {
      if (myId !== requestId.current) return;
      setNews([]);
      setError(err.message || 'Gagal mengambil berita terkini.');
    } finally {
      if (myId === requestId.current) setIsLoading(false);
    }
  };

  // TAHAP 4: jalankan saat mounting DAN setiap [source] berubah
  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const sourceLabel = SOURCES.find((s) => s.id === source).label;

  return (
    <div className="news-container">
      <div className="news-toolbar">
        <div>
          <div className="news-title-row">
            <h2>Berita Terkini {sourceLabel}</h2>
            <div className="source-switch">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  className={'source-btn ' + s.id + (source === s.id ? ' active' : '')}
                  onClick={() => setSource(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <p>
            Menampilkan {news.length} artikel{' '}
            {source === 'cnn' ? 'hasil normalisasi API' : 'dari API Siputzx'}
          </p>
        </div>

        <button className="btn-refresh" onClick={fetchNews} disabled={isLoading}>
          {isLoading ? '⏳ Memuat...' : '🔄 Segarkan Berita'}
        </button>
      </div>

      {isLoading && (
        <div className="spinner-box">
          <div className="css-spinner"></div>
          <p>Mengunduh berita {sourceLabel} terbaru...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="error-banner">
          <h5>Terjadi Kesalahan Jaringan</h5>
          <p>{error}</p>
          <button onClick={fetchNews}>Coba Lagi</button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="news-grid">
          {news.map((item, i) => (
            <NewsCard key={item.link || i} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsFeed;