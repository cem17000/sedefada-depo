import { useState, useRef, useEffect } from 'react';
import { Train, X } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';
import type { Translations } from '../lib/i18n';

// ── Marmaray: Kartal kalkış dakikaları (gece yarısından itibaren) ─────────────
// Kartal, Ataköy–Pendik bandında → 8 dk sıklık (TCDD Taşımacılık resmi tarife)
// İşletme: 05:00 – 01:00
function buildMarmarayTimetable(): number[] {
  const m: number[] = [];
  for (let t = 300; t <= 360; t += 15) m.push(t); // 05:00–06:00 → 15 dk
  for (let t = 368; t <= 1410; t += 8)  m.push(t); // 06:00–23:30 → 8 dk
  for (let t = 1425; t <= 1500; t += 15) m.push(t); // 23:30–01:00 → 15 dk
  return m;
}

// ── M4 Metro: Kartal ↔ Sabiha Gökçen kalkış dakikaları ──────────────────────
// Kadıköy – Sabiha Gökçen Havalimanı hattı (Metro İstanbul / Wikipedia)
// Pik saatler (07:00–09:30, 16:30–19:30) → 5 dk
// Diğer saatler → 10 dk  |  İşletme: 06:00 – 00:00
function buildM4Timetable(): number[] {
  const m: number[] = [];
  const peakRanges = [[420, 570], [990, 1170]]; // 07:00–09:30 ve 16:30–19:30
  const isPeak = (t: number) => peakRanges.some(([s, e]) => t >= s && t <= e);
  let t = 360; // 06:00
  while (t <= 1440) { // 00:00 (gece yarısı)
    m.push(t);
    t += isPeak(t) ? 5 : 10;
  }
  return m;
}

const MARMARAY_TT = buildMarmarayTimetable();
const M4_TT       = buildM4Timetable();

function pad(n: number): string { return n.toString().padStart(2, '0'); }
function toHHMM(t: number): string {
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`;
}

interface Departure { dep: string; arr: string; minsLeft: number; }

function getNext(now: Date, timetable: number[], travelMin: number, count: number): Departure[] {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const results: Departure[] = [];
  for (const t of timetable) {
    if (results.length >= count) break;
    if (t >= nowMin) results.push({ dep: toHHMM(t), arr: toHHMM(t + travelMin), minsLeft: t - nowMin });
  }
  for (const t of timetable) {
    if (results.length >= count) break;
    results.push({ dep: toHHMM(t), arr: toHHMM(t + travelMin), minsLeft: t + 1440 - nowMin });
  }
  return results;
}

function minsLabel(m: number, t: Translations): string {
  if (m === 0) return t.marmarayNow;
  if (m < 60)  return `${m} ${t.marmarayMin}`;
  return `${Math.floor(m / 60)}${t.marmarayHour} ${m % 60}${t.marmarayMin}`;
}

// ── Ortak panel bileşeni ──────────────────────────────────────────────────────
interface PanelProps {
  titleKey: keyof Translations;
  subtitleKey: keyof Translations;
  depLabelKey: keyof Translations;
  arrLabelKey: keyof Translations;
  timetable: number[];
  travelMin: number;
  noteKey?: keyof Translations;
  t: Translations;
}

function DeparturePanel({ titleKey, subtitleKey, depLabelKey, arrLabelKey, timetable, travelMin, noteKey, t }: PanelProps) {
  const [rows, setRows] = useState<Departure[] | null>(null);
  const [checkedAt, setCheckedAt] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Dışarı tıklandığında kapat
  useEffect(() => {
    if (!rows) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setRows(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [rows]);

  const handleClick = () => {
    const now = new Date();
    setRows(getNext(now, timetable, travelMin, 3));
    setCheckedAt(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  return (
    <div ref={ref} className="rounded-xl border border-sedef-border bg-sedef-card-bg/60 overflow-hidden">
      <button
        onClick={handleClick}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-sedef-accent/10 transition-colors duration-200 group"
      >
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sedef-accent/15 flex items-center justify-center group-hover:bg-sedef-accent/25 transition-colors">
          <Train className="w-4 h-4 text-sedef-accent" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sedef-primary leading-tight">{t[titleKey]}</span>
          <span className="text-[11px] text-sedef-secondary">{t[subtitleKey]}</span>
        </div>
        <span className="ml-auto text-sedef-accent text-xs font-medium">{rows ? '↻' : '→'}</span>
      </button>

      {rows && (
        <div className="border-t border-sedef-border px-4 py-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="grid grid-cols-3 gap-1 text-[10px] text-sedef-secondary font-semibold uppercase tracking-wider flex-1">
              <span>{t.marmarayOrder}</span>
              <span>{t[depLabelKey]}</span>
              <span>{t[arrLabelKey]}</span>
            </div>
            <button
              onClick={() => setRows(null)}
              className="ml-2 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-sedef-secondary hover:text-sedef-primary hover:bg-sedef-border/40 transition-colors"
              aria-label={t.marmarayClose}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 gap-1 items-center rounded-lg px-2 py-2 text-sm ${i === 0 ? 'bg-sedef-accent/10 border border-sedef-accent/30' : 'bg-sedef-bg/30'}`}>
                <div className="flex flex-col">
                  <span className={`font-bold text-xs ${i === 0 ? 'text-sedef-accent' : 'text-sedef-secondary'}`}>{i === 0 ? '▶' : `${i + 1}.`}</span>
                  <span className="text-[10px] text-sedef-secondary">{minsLabel(row.minsLeft, t)}</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold ${i === 0 ? 'text-sedef-primary' : 'text-sedef-primary/80'}`}>{row.dep}</span>
                  <span className="text-[10px] text-sedef-secondary">{t.marmarayDeparture}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sedef-primary/70">{row.arr}</span>
                  <span className="text-[10px] text-sedef-secondary">~{travelMin} {t.marmarayMin}</span>
                </div>
              </div>
            ))}
          </div>
          {noteKey && (
            <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
              <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">ℹ</span>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-snug">{t[noteKey]}</p>
            </div>
          )}
          <p className="text-[10px] text-sedef-secondary/50 mt-2.5 text-right">{checkedAt} {t.marmarayFooter}</p>
        </div>
      )}
    </div>
  );
}

// ── Dışa aktarılan widget ─────────────────────────────────────────────────────
export function MarmarayWidget() {
  const { t } = useLanguage();

  return (
    <div className="my-4 flex flex-col gap-3">
      <DeparturePanel
        titleKey="marmarayToYenikapi"
        subtitleKey="marmarayStation"
        depLabelKey="marmarayDepLabel"
        arrLabelKey="marmarayArrYenikapi"
        timetable={MARMARAY_TT}
        travelMin={40}
        t={t}
      />
      <DeparturePanel
        titleKey="marmarayToGebze"
        subtitleKey="marmarayStation"
        depLabelKey="marmarayDepLabel"
        arrLabelKey="marmarayArrGebze"
        timetable={MARMARAY_TT}
        travelMin={13}
        t={t}
      />
      <DeparturePanel
        titleKey="metroM4ToSGH"
        subtitleKey="marmarayStation"
        depLabelKey="marmarayDepLabel"
        arrLabelKey="marmarayArrSGH"
        timetable={M4_TT}
        travelMin={21}
        noteKey="marmarayNoteM4ToSGH"
        t={t}
      />
      <DeparturePanel
        titleKey="metroM4FromSGH"
        subtitleKey="marmaraySGHStation"
        depLabelKey="marmarayDepSGH"
        arrLabelKey="marmarayArrKartal"
        timetable={M4_TT}
        travelMin={21}
        noteKey="marmarayNoteM4FromSGH"
        t={t}
      />
    </div>
  );
}
