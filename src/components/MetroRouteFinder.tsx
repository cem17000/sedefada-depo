import { useState, useRef, useEffect } from 'react';
import { MapPin, X, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';

interface Edge { to: string; min: number; line: string; }
type Graph = Record<string, Edge[]>;

function addEdge(g: Graph, a: string, b: string, min: number, line: string) {
  if (!g[a]) g[a] = [];
  if (!g[b]) g[b] = [];
  g[a].push({ to: b, min, line });
  g[b].push({ to: a, min, line });
}

function seq(arr: string[], min: number, line: string, g: Graph) {
  for (let i = 0; i < arr.length - 1; i++) addEdge(g, arr[i], arr[i+1], min, line);
}

function buildGraph(): Graph {
  const g: Graph = {};

  seq(['Yenikapı (M2)','Aksaray','Emniyet-Fatih','Topkapı-Ulubatlı','Bayrampaşa-Maltepe',
       'Sağmalcılar','Kocatepe','Otogar','Terazidere','Davutpaşa-YTÜ','Merter',
       'Zeytinburnu','Bakırköy-İncirli','Bahçelievler','Ataköy-Şirinevler',
       'Bağcılar-Meydan','Kirazlı','Atatürk Havalimanı'], 2, 'M1A', g);

  seq(['Kirazlı','Bağcılar','Güneştepe','Bahariye-MASKO','İkitelli Sanayi',
       'Turgut Özal','Ziya Gökalp Mahallesi','Atatürk Mahallesi','Olimpiyat'], 2, 'M1B', g);

  seq(['Yenikapı (M2)','Vezneciler','Haliç','Şişhane','Taksim','Osmanbey',
       'Şişli-Mecidiyeköy','Gayrettepe','Levent','4. Levent',
       'Sanayi Mahallesi','Seyrantepe','İTÜ-Ayazağa','Hacıosman'], 2, 'M2', g);

  seq(['Kadıköy','Ayrılık Çeşmesi (M4)','Acıbadem','Ünalan','Göztepe (M4)','Yenisahra',
       'Kozyatağı (M4)','Bostancı','Küçükyalı','Maltepe','Huzurevi','Gülsuyu','Esenkent',
       'Hastane-Adliye','Soğanlık','Kartal (M4)','Yakacık','Pendik (M4)','Tavşantepe',
       'Fevzi Çakmak','Yayalar-Şeyhli','Kurtköy','Sabiha Gökçen Havalimanı'], 2, 'M4', g);

  seq(['Üsküdar (M5)','Fıstıkağacı','Bağlarbaşı','Altunizade','Kısıklı','Bulgurlu',
       'Ümraniye','Çarşı','Yamanevler','Çakmak','Ihlamurkuyu','Altınşehir',
       'İmam Hatip Lisesi','Dudullu (M5)','Necip Fazıl','Çekmeköy','Meclis',
       'Sarıgazi','Sancaktepe Şehir Hastanesi','Sancaktepe',
       'Samandıra Merkez','Veysel Karani-Hasanpaşa','Sultanbeyli'], 2, 'M5', g);

  seq(['Levent (M6)','Nispetiye','Etiler','Boğaziçi Üniversitesi'], 2, 'M6', g);

  seq(['Kabataş (M7)','Beşiktaş','Yıldız','Fulya','Mecidiyeköy (M7)','Çağlayan',
       'Kağıthane (M7)','Nurtepe','Alibeyköy','Çırçır','Veysel Karani-Akşemsettin',
       'Yeşilpınar','Kâzım Karabekir (M7)','Yenimahalle','Karadeniz Mahallesi',
       'Giyimkent-Tekstilkent','Oruç Reis','Mahmutbey'], 2, 'M7', g);

  seq(['Bostancı (M8)','Emin Ali Paşa','Ayşekadın','Kozyatağı (M8)',
       'Küçükbakkalköy','İçerenköy','Kayışdağı','Mevlana (M8)','İMES',
       'MODOKO-KEYAP','Dudullu (M8)','Huzur','Parseller'], 2, 'M8', g);

  seq(['Ataköy','Yenibosna','Çobançeşme','29 Ekim Cumhuriyet','Doğu Sanayi',
       'Mimar Sinan','15 Temmuz Halkalı Caddesi','Atatürk Mahallesi (M9)',
       'MASKO (M9)','İkitelli Sanayi (M9)','Ziya Gökalp (M9)','Olimpiyat (M9)'], 2, 'M9', g);

  // M11: Gayrettepe–İstanbul Havalimanı ~38 dk (7 durak), toplam hat ~70 dk
  // Durak araları uzun tünel/viyadük geçişleri nedeniyle 4-6 dk arası değişiyor;
  // ortalama 5 dk kullanıyoruz (resmi süre: Gayrettepe–HAV = ~38 dk / 7 durak ≈ 5.4 dk)
  seq(['Gayrettepe (M11)','Kağıthane (M11)','Hasdal','Kemerburgaz','Göktürk','İhsaniye',
       'Terminal 2','İstanbul Havalimanı','Kargo Terminali','Taşoluk',
       'Arnavutköy Hastane','İbn Haldun Üniversitesi','Kayaşehir Merkez',
       'Olimpiyatköy','Halkalı Stadı','Halkalı (M11)'], 5, 'M11', g);

  // Marmaray — tam istasyon sırası, gerçek durak araları
  // Halkalı tarafı (batı): duraklar ~3 dk arayla
  seq(['Halkalı','Mustafa Kemal','Yakuplu','Bahçeşehir 1. Kısım','Bahçeşehir 2. Kısım',
       'Ispartakule','Yarımburgaz','Küçükçekmece','Florya','Florya Akvaryum',
       'Yeşilyurt','Ataköy (Marmaray)','Bakırköy (Marmaray)','Yenimahalle (Marmaray)',
       'Zeytinburnu (Marmaray)','Kazlıçeşme','Yenikapı'], 3, 'Marmaray', g);
  // Tüp geçit + Anadolu yakası: duraklar ~4-5 dk arayla
  seq(['Yenikapı','Sirkeci','Üsküdar','Ayrılık Çeşmesi','Haydarpaşa',
       'Söğütlüçeşme','Göztepe (Marmaray)','Erenköy','Suadiye','Bostancı (Marmaray)',
       'Küçükyalı (Marmaray)','Maltepe (Marmaray)','Cevizli','Kartal',
       'Yakacık (Marmaray)','Pendik','Kaynarca','Tersane','Güzelyalı',
       'Osmangazi','Gebze'], 3, 'Marmaray', g);
  addEdge(g, 'Taksim',           'Kabataş',           4, 'F1-Füniküler');
  addEdge(g, 'Kadıköy',          'Üsküdar',           8, 'Vapur');

  // Aktarmalar (5 dk bekleme)
  const t = (a: string, b: string) => addEdge(g, a, b, 10, 'Aktarma');
  t('Şişli-Mecidiyeköy', 'Mecidiyeköy (M7)');  // M2 ↔ M7
  t('Levent', 'Levent (M6)');                   // M2 ↔ M6
  t('Kozyatağı (M4)', 'Kozyatağı (M8)');        // M4 ↔ M8
  t('Küçükbakkalköy', 'Kozyatağı (M8)');        // M4 ↔ M8 (Küçükbakkalköy tarafı)
  t('Ayrılık Çeşmesi', 'Ayrılık Çeşmesi (M4)');// Marmaray ↔ M4
  t('Ayrılık Çeşmesi (M4)', 'Kadıköy');         // M4 ↔ Kadıköy
  t('Dudullu (M5)', 'Dudullu (M8)');             // M5 ↔ M8
  t('Üsküdar', 'Üsküdar (M5)');                 // Marmaray ↔ M5
  t('Kabataş', 'Kabataş (M7)');                 // F1 ↔ M7
  t('Bostancı', 'Bostancı (M8)');               // M4 ↔ M8
  t('Pendik', 'Pendik (M4)');                   // Marmaray ↔ M4
  t('Yenikapı (M2)', 'Yenikapı');               // M1A/M2 ↔ Marmaray
  t('Gayrettepe', 'Gayrettepe (M11)');          // M2 ↔ M11
  t('Halkalı (M11)', 'Halkalı');                // M11 ↔ Marmaray
  t('Kartal (M4)', 'Kartal');                   // M4 ↔ Marmaray

  return g;
}

const GRAPH = buildGraph();
const ALL_STATIONS = [...new Set(Object.keys(GRAPH))].sort();

// Normalize edilmiş arama indeksi — modül yüklenirken bir kez hesapla
const STATION_INDEX: Array<{ original: string; normalized: string }> = ALL_STATIONS.map(s => ({
  original: s,
  normalized: s.toLocaleLowerCase('tr-TR'),
}));

// ── Dijkstra ──────────────────────────────────────────────────────────────────
function dijkstra(start: string, end: string) {
  const dist: Record<string, number> = {};
  const prev: Record<string, { from: string; line: string }> = {};
  const visited = new Set<string>();
  const queue: Array<{ node: string; cost: number }> = [];

  for (const n of Object.keys(GRAPH)) dist[n] = Infinity;
  dist[start] = 0;
  queue.push({ node: start, cost: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { node, cost } = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);
    if (node === end) break;
    for (const edge of (GRAPH[node] ?? [])) {
      const nc = cost + edge.min;
      if (nc < dist[edge.to]) {
        dist[edge.to] = nc;
        prev[edge.to] = { from: node, line: edge.line };
        queue.push({ node: edge.to, cost: nc });
      }
    }
  }

  if (dist[end] === Infinity) return null;

  const path: string[] = [];
  const lines: string[] = [];
  let cur = end;
  while (cur !== start) {
    path.unshift(cur);
    const p = prev[cur];
    lines.unshift(p.line);
    cur = p.from;
  }
  path.unshift(start);
  return { cost: dist[end], path, lines };
}

// ── Arama ─────────────────────────────────────────────────────────────────────
// toLocaleLowerCase('tr-TR') kullanımı: İ→i, I→ı doğru çevirir
function normalizeQ(q: string): string {
  return q.toLocaleLowerCase('tr-TR');
}
function searchStations(q: string): string[] {
  if (q.length < 1) return [];
  const nq = normalizeQ(q);
  return STATION_INDEX
    .filter(({ normalized }) => normalized.includes(nq))
    .map(({ original }) => original)
    .slice(0, 8);
}

// ── Hat renkleri ──────────────────────────────────────────────────────────────
const LINE_COLOR: Record<string, string> = {
  M1A:'bg-orange-500', M1B:'bg-orange-400', M2:'bg-red-500',
  M4:'bg-yellow-500',  M5:'bg-teal-500',    M6:'bg-pink-400',
  M7:'bg-blue-400',    M8:'bg-indigo-400',  M9:'bg-cyan-500',
  M11:'bg-violet-600', Marmaray:'bg-blue-700',
  Aktarma:'bg-gray-400', 'F1-Füniküler':'bg-emerald-400', Vapur:'bg-sky-500',
};
const lineColor = (l: string) => LINE_COLOR[l] ?? 'bg-sedef-accent';

// ── Güzergahı segmentlere ayır ────────────────────────────────────────────────
// lines[i]: path[i] → path[i+1] kenarının hat adı
// Aktarma kenarları segment sınırı; hasTransferBefore = öncesinde gerçek aktarma kenarı geçildi
function segmentRoute(path: string[], lines: string[]) {
  if (!path.length) return [] as Array<{ line: string; stations: string[]; hasTransferBefore: boolean }>;
  const segs: Array<{ line: string; stations: string[]; hasTransferBefore: boolean }> = [];

  let curLine = lines[0];
  let curStations = [path[0], path[1]];
  let pendingTransfer = false;
  let i = 1;

  while (i < lines.length) {
    const line = lines[i];

    if (line === 'Aktarma') {
      // Mevcut segmenti kapat
      segs.push({ line: curLine, stations: curStations, hasTransferBefore: pendingTransfer });
      pendingTransfer = true;
      // Aktarma kenarı: path[i] → path[i+1] arası yürüme/bekleme
      // Yeni segment path[i+1]'den başlar, bir sonraki gerçek hat kenarı i+1'de
      i++; // aktarma kenarını geç, i artık aktarma varışı
      curLine = lines[i] ?? curLine; // i'deki kenar yeni segmentin hattı
      curStations = [path[i], path[i + 1]]; // yeni segmentin ilk iki istasyonu
      i++; // bu gerçek kenarı da tükettik
    } else if (line === curLine) {
      curStations.push(path[i + 1]);
      i++;
    } else {
      // Hat değişimi, Aktarma kenarı yok (örn. Gayrettepe M2→M11)
      segs.push({ line: curLine, stations: curStations, hasTransferBefore: pendingTransfer });
      pendingTransfer = false;
      curLine = line;
      curStations = [path[i], path[i + 1]];
      i++;
    }
  }
  segs.push({ line: curLine, stations: curStations, hasTransferBefore: pendingTransfer });
  return segs;
}

// ── Bileşen ───────────────────────────────────────────────────────────────────
export function MetroRouteFinder() {
  const { t } = useLanguage();
  const [query, setQuery]             = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [result, setResult]           = useState<ReturnType<typeof dijkstra> | 'notfound' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setSuggestions([]);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleInput = (v: string) => {
    setQuery(v); setResult(null);
    setSuggestions(v.length >= 1 ? searchStations(v) : []);
  };
  const handleSelect = (station: string) => {
    setQuery(station); setSuggestions([]);
    setResult(dijkstra(station, 'Kartal') ?? 'notfound');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Tam eşleşmeyi dene, yoksa ilk öneriyi al
      const nq = normalizeQ(query);
      const exact = ALL_STATIONS.find(s => normalizeQ(s) === nq);
      const target = exact ?? suggestions[0];
      if (target) handleSelect(target);
    }
  };
  const handleClear = () => {
    setQuery(''); setResult(null); setSuggestions([]);
    inputRef.current?.focus();
  };

  const segments    = result && result !== 'notfound' ? segmentRoute(result.path, result.lines) : [];
  const uniqueLines = result && result !== 'notfound'
    ? [...new Set(result.lines.filter(l => l !== 'Aktarma'))] : [];

  return (
    <div className="rounded-xl border border-sedef-border bg-sedef-card-bg/60 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-sedef-border">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sedef-accent/15 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-sedef-accent" />
        </span>
        <div>
          <p className="text-sm font-semibold text-sedef-primary leading-tight">{t.metroTitle}</p>
          <p className="text-[11px] text-sedef-secondary">{t.metroSubtitle}</p>
        </div>
      </div>

      <div ref={wrapRef} className="relative px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-sedef-border bg-sedef-bg/50 px-3 py-2 focus-within:border-sedef-accent/60 transition-colors">
          <Search className="w-3.5 h-3.5 text-sedef-secondary flex-shrink-0" />
          <input ref={inputRef} type="text" value={query}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.metroPlaceholder}
            className="flex-1 bg-transparent text-sm text-sedef-primary placeholder:text-sedef-secondary/60 outline-none min-w-0" />
          {query && (
            <button onClick={handleClear} className="flex-shrink-0 text-sedef-secondary hover:text-sedef-primary">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <div className="absolute left-4 right-4 top-full mt-1 z-20 rounded-xl border border-sedef-border bg-sedef-card-bg shadow-2xl overflow-hidden">
            {suggestions.map(s => (
              <button key={s} onMouseDown={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-sedef-primary hover:bg-sedef-accent/10 transition-colors flex items-center gap-2">
                <MapPin className="w-3 h-3 text-sedef-secondary flex-shrink-0" />{s}
              </button>
            ))}
          </div>
        )}
      </div>

      {result === 'notfound' && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-[12px] text-red-400">
            {t.metroNotFound}
          </div>
        </div>
      )}

      {result && result !== 'notfound' && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              {uniqueLines.map(l => (
                <span key={l} className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${lineColor(l)}`}>{l}</span>
              ))}
            </div>
            <span className="text-sm font-bold text-sedef-accent">~{result.cost} dk</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {segments.map((seg, si) => (
              <div key={si}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${lineColor(seg.line)}`}>{seg.line}</span>
                  <span className="text-[10px] text-sedef-secondary">{seg.stations.length - 1} {t.metroStops}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-sedef-primary ml-1 flex-wrap">
                  <span className="font-semibold">{seg.stations[0]}</span>
                  <ArrowRight className="w-3 h-3 text-sedef-secondary flex-shrink-0" />
                  <span className="font-semibold">{seg.stations[seg.stations.length - 1]}</span>
                </div>
                {si < segments.length - 1 && segments[si + 1].hasTransferBefore && (
                  <p className="text-[10px] text-amber-500 mt-1 ml-1">{t.metroTransfer}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-sedef-accent/10 border border-sedef-accent/30 px-3 py-2">
            <span className="text-sm">🚉</span>
            <span className="text-[12px] font-semibold text-sedef-primary">
              {t.metroEstimated} <span className="text-sedef-accent">~{result.cost} {t.metroMinutes}</span>
            </span>
          </div>
          <p className="text-[10px] text-sedef-secondary/50 text-right">{t.metroFootnote}</p>
        </div>
      )}
    </div>
  );
}
