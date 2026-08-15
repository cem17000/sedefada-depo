import { useState, useEffect } from 'react';
import content from '../data/content.json';
import { BookOpen, Film, Snowflake, Home, Anchor, HelpCircle, Ship, Phone, Globe, Heart, Video, Landmark, Gem, Leaf } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { useLanguage } from '../lib/useLanguage';
import type { Translations } from '../lib/i18n';

export interface NavItem {
  id: string;
  type: 'blog' | 'post';
  displayName: string;
  icon: React.ReactNode;
  blogSlug: string;
  postId?: string;
  excludeIds?: string[];
  childPosts?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'fa-solid fa-landmark': <Landmark className="w-4 h-4" />,
  'fa-solid fa-gem': <Gem className="w-4 h-4" />,
  'fa-solid fa-heart': <Heart className="w-4 h-4" />,
  'fa-solid fa-leaf': <Leaf className="w-4 h-4" />,
  'fa-solid fa-video': <Video className="w-4 h-4" />,
  'fa-solid fa-snowflake': <Snowflake className="w-4 h-4" />,
  'fa-solid fa-ship': <Ship className="w-4 h-4" />,
  'fa-solid fa-globe': <Globe className="w-4 h-4" />,
  'fa-solid fa-umbrella-beach': <HelpCircle className="w-4 h-4" />,
  'fa-solid fa-book-open-reader': <BookOpen className="w-4 h-4" />,
  'fa-solid fa-film': <Film className="w-4 h-4" />,
  'fa-solid fa-house-chimney': <Home className="w-4 h-4" />,
  'fa-solid fa-anchor': <Anchor className="w-4 h-4" />,
  'fa-solid fa-phone': <Phone className="w-4 h-4" />,
};

interface NavConfigSource {
  id: string;
  type: 'blog' | 'post';
  displayNameTr?: string;
  icon: string;
  blogSlug: string;
  postId?: string;
  excludeIds?: string[];
}

interface NavigationProps {
  onNavigate: (item: NavItem) => void;
  activeItem: NavItem | null;
  renderMobileContent: () => React.ReactNode;
}

const NAV_CONFIG = (content.navItems as NavConfigSource[])
  .map((item) => ({
    ...item,
    icon: iconMap[item.icon] ?? <HelpCircle className="w-4 h-4" />,
  })) as Array<NavConfigSource & { icon: React.ReactNode }>;

const NAV_DISPLAY_NAME: Record<string, keyof Translations> = {
  sedefada_tarihi: 'navHakkinda',
  anilar: 'navYerlesim',
  ekoloji: 'navEkoloji',
  videolar: 'navFilmler',
  kis_baskadir: 'navKis',
  ulasim_tarife: 'navUlasim',
  web: 'navWeb',
  iletisim_bilgileri: 'navIletisim',
};

type ConfigItemType = typeof NAV_CONFIG[number];

export function Navigation({ onNavigate, activeItem, renderMobileContent }: NavigationProps) {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>('sedefada_tarihi');

  useEffect(() => {
    handleItemClick(NAV_CONFIG[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // activeItem prop değiştiğinde activeId'yi senkronize et (mobil uyumluluk için)
  useEffect(() => {
    if (activeItem && activeItem.id) {
      setActiveId(activeItem.id);
    }
  }, [activeItem]);

  const getDisplayName = (config: ConfigItemType): string => {
    const key = NAV_DISPLAY_NAME[config.id];
    if (key) return t[key] as string;
    return config.displayNameTr ?? config.id;
  };

  const getPostCount = (config: ConfigItemType): number => {
    if (config.type === 'blog') {
      return content.posts.filter((post) => post.blogSlug === config.blogSlug && !config.excludeIds?.includes(post.id)).length;
    }
    return 1;
  };

  const handleItemClick = (config: ConfigItemType) => {
    if (activeId === config.id) {
      setActiveId('');
      onNavigate({} as NavItem);
      return;
    }

    setActiveId(config.id);

    const navItem: NavItem = {
      id: config.id,
      type: config.type,
      displayName: getDisplayName(config),
      icon: config.icon,
      blogSlug: config.blogSlug,
      postId: config.type === 'post' ? config.postId : undefined,
      excludeIds: config.excludeIds,
      childPosts: getPostCount(config),
    };

    onNavigate(navItem);
  };

  return (
    <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-sedef-secondary mb-3 pl-2">
          {t.navCategories}
        </p>
        <nav className="flex flex-col gap-2">
          {NAV_CONFIG.map((config) => {
            const isActive = activeId === config.id;

            return (
              <div key={config.id} className="flex flex-col w-full">
                <button
                  onClick={() => handleItemClick(config)}
                  className={`nav-item w-full ${isActive ? 'active border-sedef-accent bg-sedef-card-bg shadow-lg translate-x-1' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-sedef-accent' : 'text-sedef-secondary'}>
                      {config.icon}
                    </span>
                    <span className="text-sm font-medium text-sedef-primary">{getDisplayName(config)}</span>
                  </div>
                  {/* Sayı sayaçlarının basıldığı yuvarlak badge alanı burası da dahil olmak üzere tamamen temizlendi */}
                </button>

                {isActive && activeItem && activeItem.id === config.id && (
                  <div className="mt-2 mb-4 p-4 bg-sedef-card-bg/40 border border-sedef-border rounded-xl md:hidden w-full overflow-hidden">
                    {renderMobileContent()}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <WeatherWidget />
      <DistanceCalculator />
      <MoonCycleWidget />
    </aside>
  );
}

function DistanceCalculator() {
  const { t } = useLanguage();
  const [distance, setDistance] = useState(6.0);
  const speed = 18;

  const kmDistance = (distance * 1.852).toFixed(1);
  const timeMinutes = Math.round((distance / speed) * 60);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `~${minutes} ${t.distMin}`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `~${hrs} ${t.distHour} ${mins} ${t.distMin}` : `~${hrs} ${t.distHour}`;
  };

  const piers = [
    { value: 1.2, label: 'Büyükada' },
    { value: 3.5, label: 'Kartal' },
    { value: 3.0, label: 'Heybeliada' },
    { value: 5.0, label: 'Burgazada' },
    { value: 6.0, label: 'Kınalıada' },
    { value: 6.0, label: 'Bostancı' },
    { value: 11.0, label: 'Kadıköy' },
    { value: 13.0, label: 'Kabataş' },
  ];

  const selectedPierLabel = piers.find((p) => p.value === distance)?.label ?? '';

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4 border-b border-sedef-border pb-3">
        <Anchor className="w-4 h-4 text-sedef-accent" />
        <h3 className="text-sm font-semibold">{t.distTitle}</h3>
      </div>

      <p className="text-xs text-sedef-secondary mb-3 leading-relaxed">
        {t.distSubtitle}
      </p>

      <select
        value={distance}
        onChange={(e) => setDistance(parseFloat(e.target.value))}
        className="w-full bg-sedef-bg/30 border border-sedef-border rounded-lg px-4 py-2.5 text-sm text-sedef-primary mb-2 cursor-pointer focus:border-sedef-accent focus:outline-none transition-colors"
      >
        {piers.map((p, i) => (
          <option key={i} value={p.value}>{p.label} (~{p.value} NM)</option>
        ))}
      </select>

      <div className="mt-3 bg-sedef-accent/5 border border-sedef-accent/20 rounded-lg p-4">
        <p className="text-[10px] font-semibold text-sedef-accent uppercase tracking-wide mb-1">
          {t.distResult}
        </p>
        <p className="text-base font-bold text-sedef-primary mb-1">
          {distance.toFixed(1)} NM / {kmDistance} km
        </p>
        <p className="text-xs text-sedef-secondary leading-relaxed">
          <strong className="text-sedef-primary">{selectedPierLabel}</strong> — {t.distWith} <strong className="text-sedef-primary">{t.distFastBoat}</strong>:<br />
          {t.distEstimated}: <strong className="text-sedef-primary">{formatTime(timeMinutes)}</strong>
        </p>
      </div>
    </div>
  );
}

function getMoonPhase(date: Date): { phase: number; age: number } {
  const SYNODIC = 29.53059;
  const REF_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();
  const elapsed = (date.getTime() - REF_NEW_MOON) / (1000 * 60 * 60 * 24);
  const age = ((elapsed % SYNODIC) + SYNODIC) % SYNODIC;
  const phase = age / SYNODIC;
  return { phase, age };
}

function MoonSvg({ phase }: { phase: number }) {
  const size = 64;
  const r = 28;
  const cx = size / 2;
  const cy = size / 2;
  const illumination = 0.5 - 0.5 * Math.cos(2 * Math.PI * phase);
  const isWaxing = phase < 0.5;
  const k = Math.abs(2 * illumination - 1);
  const rx2 = r * k;

  if (illumination < 0.03) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#1a1a2e" stroke="#4a5568" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={r * 0.15} fill="#4a5568" opacity="0.4" />
      </svg>
    );
  }
  if (illumination > 0.97) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#f6e7b0" />
        <circle cx={cx} cy={cy} r={r * 0.35} fill="#f0d060" opacity="0.25" />
        <circle cx={cx} cy={cy} r={r * 0.6} fill="#f0d060" opacity="0.1" />
      </svg>
    );
  }

  const sweep = isWaxing ? 1 : 0;
  const innerSweep = isWaxing ? 0 : 1;
  const dPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} A ${rx2} ${r} 0 0 ${innerSweep} ${cx} ${cy - r} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#1a1a2e" stroke="#4a5568" strokeWidth="1" />
      <path d={dPath} fill="#f6e7b0" />
    </svg>
  );
}

interface MoonPhaseInfo {
  name: string;
  emoji: string;
  description: string;
  doList: string[];
  dontList: string[];
}

function getMoonPhaseInfo(_phase: number, age: number, t: Translations): MoonPhaseInfo {
  if (age < 1.85) return { name: t.moonNewMoon, emoji: '🌑', description: t.moonNewMoonDesc, doList: [...t.moonNewDo], dontList: [...t.moonNewDont] };
  if (age < 7.38) return { name: t.moonWaxingCrescent, emoji: '🌒', description: t.moonWaxingCrescentDesc, doList: [...t.moonWaxCrDo], dontList: [...t.moonWaxCrDont] };
  if (age < 9.22) return { name: t.moonFirstQuarter, emoji: '🌓', description: t.moonFirstQuarterDesc, doList: [...t.moonFQDo], dontList: [...t.moonFQDont] };
  if (age < 14.77) return { name: t.moonWaxingGibbous, emoji: '🌔', description: t.moonWaxingGibbousDesc, doList: [...t.moonWaxGibDo], dontList: [...t.moonWaxGibDont] };
  if (age < 16.61) return { name: t.moonFullMoon, emoji: '🌕', description: t.moonFullMoonDesc, doList: [...t.moonFullDo], dontList: [...t.moonFullDont] };
  if (age < 22.15) return { name: t.moonWaningGibbous, emoji: '🌖', description: t.moonWaningGibbousDesc, doList: [...t.moonWanGibDo], dontList: [...t.moonWanGibDont] };
  if (age < 24.0) return { name: t.moonLastQuarter, emoji: '🌗', description: t.moonLastQuarterDesc, doList: [...t.moonLQDo], dontList: [...t.moonLQDont] };
  return { name: t.moonWaningCrescent, emoji: '🌘', description: t.moonWaningCrescentDesc, doList: [...t.moonWanCrDo], dontList: [...t.moonWanCrDont] };
}

function MoonCycleWidget() {
  const { t } = useLanguage();
  const now = new Date();
  const { phase, age } = getMoonPhase(now);
  const info = getMoonPhaseInfo(phase, age, t);
  const daysToFull = phase < 0.5 ? Math.round((0.5 - phase) * 29.53) : Math.round((1.5 - phase) * 29.53);
  const daysToNew = phase < 1 ? Math.round((1 - phase) * 29.53) : 0;
  const illuminationPct = Math.round((0.5 - 0.5 * Math.cos(2 * Math.PI * phase)) * 100);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4 border-b border-sedef-border pb-3">
        <span className="text-sedef-accent text-base">🌙</span>
        <h3 className="text-sm font-semibold">{t.moonTitle}</h3>
      </div>

      <div className="flex items-center gap-4 mb-4 bg-sedef-bg/20 border border-sedef-border rounded-lg p-3">
        <div className="flex-shrink-0">
          <MoonSvg phase={phase} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg">{info.emoji}</span>
            <p className="text-sm font-bold text-sedef-primary">{info.name}</p>
          </div>
          <p className="text-[11px] text-sedef-secondary leading-relaxed mb-2">{info.description}</p>
          <div className="flex gap-3 text-[10px] text-sedef-secondary">
            <span>{t.moonAge}: <strong className="text-sedef-primary">{age.toFixed(1)} {t.moonDays}</strong></span>
            <span>{t.moonIllumination}: <strong className="text-sedef-primary">%{illuminationPct}</strong></span>
          </div>
          <div className="flex gap-3 text-[10px] text-sedef-secondary mt-0.5">
            {phase < 0.5
              ? <span>{t.moonToFull}: <strong className="text-sedef-primary">{t.moonApprox}{daysToFull} {t.moonDays}</strong></span>
              : <span>{t.moonToNew}: <strong className="text-sedef-primary">{t.moonApprox}{daysToNew} {t.moonDays}</strong></span>
            }
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
          <span>✓</span> {t.moonCanDo}
        </p>
        <div className="space-y-1">
          {info.doList.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-sedef-secondary leading-snug">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-sedef-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-500 mb-1.5 flex items-center gap-1">
          <span>✕</span> {t.moonAvoid}
        </p>
        <div className="space-y-1">
          {info.dontList.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-sedef-secondary leading-snug">
              <span className="text-rose-400 mt-0.5 flex-shrink-0">●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-sedef-secondary/50 mt-3 text-right">
        {t.moonBiodynamic}
      </p>
    </div>
  );
}