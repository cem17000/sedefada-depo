import { useState, useEffect } from 'react';
import { Wind, Gauge, Waves, CloudRain, RefreshCw } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';
import type { Translations } from '../lib/i18n';

interface DayForecast {
  date: string;
  dateLabel: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
  pressureMean: number;
  precipitationSum: number;
  waveHeightMax: number | null;
}

const WMO_CODES: Record<number, { icon: string; labelKey: keyof Translations }> = {
  0:  { icon: '☀️',  labelKey: 'weatherNone' },
  1:  { icon: '🌤️', labelKey: 'weatherNone' },
  2:  { icon: '⛅',  labelKey: 'weatherNone' },
  3:  { icon: '☁️',  labelKey: 'weatherNone' },
  45: { icon: '🌫️', labelKey: 'weatherNone' },
  48: { icon: '🌫️', labelKey: 'weatherNone' },
  51: { icon: '🌦️', labelKey: 'weatherLight' },
  53: { icon: '🌦️', labelKey: 'weatherMedium' },
  55: { icon: '🌧️', labelKey: 'weatherHeavy' },
  61: { icon: '🌧️', labelKey: 'weatherLight' },
  63: { icon: '🌧️', labelKey: 'weatherMedium' },
  65: { icon: '🌧️', labelKey: 'weatherHeavy' },
  71: { icon: '🌨️', labelKey: 'weatherLight' },
  73: { icon: '❄️',  labelKey: 'weatherMedium' },
  75: { icon: '❄️',  labelKey: 'weatherHeavy' },
  80: { icon: '🌦️', labelKey: 'weatherLight' },
  81: { icon: '⛈️',  labelKey: 'weatherMedium' },
  82: { icon: '⛈️',  labelKey: 'weatherHeavy' },
  95: { icon: '⛈️',  labelKey: 'windStorm' },
  96: { icon: '⛈️',  labelKey: 'windStorm' },
  99: { icon: '⛈️',  labelKey: 'windStorm' },
};

// Static Turkish labels for WMO codes (display only)
const WMO_TR: Record<number, string> = {
  0: 'Açık', 1: 'Çoğunlukla Açık', 2: 'Parçalı Bulutlu', 3: 'Kapalı',
  45: 'Sisli', 48: 'Dondurucu Sis', 51: 'Hafif Çisenti', 53: 'Orta Çisenti',
  55: 'Yoğun Çisenti', 61: 'Hafif Yağmur', 63: 'Orta Yağmur', 65: 'Yoğun Yağmur',
  71: 'Hafif Kar', 73: 'Orta Kar', 75: 'Yoğun Kar', 80: 'Hafif Sağanak',
  81: 'Orta Sağanak', 82: 'Şiddetli Sağanak', 95: 'Fırtınalı',
  96: 'Dolu ile Fırtına', 99: 'Şiddetli Dolu Fırtınası',
};
const WMO_EN: Record<number, string> = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Freezing Fog', 51: 'Light Drizzle', 53: 'Drizzle',
  55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 80: 'Light Showers',
  81: 'Showers', 82: 'Heavy Showers', 95: 'Thunderstorm',
  96: 'Hail Storm', 99: 'Severe Hail Storm',
};
const WMO_DE: Record<number, string> = {
  0: 'Klar', 1: 'Überwiegend klar', 2: 'Teilweise bewölkt', 3: 'Bedeckt',
  45: 'Neblig', 48: 'Gefrierender Nebel', 51: 'Leichter Nieselregen', 53: 'Nieselregen',
  55: 'Starker Nieselregen', 61: 'Leichter Regen', 63: 'Regen', 65: 'Starker Regen',
  71: 'Leichter Schnee', 73: 'Schnee', 75: 'Starker Schnee', 80: 'Leichte Schauer',
  81: 'Schauer', 82: 'Starke Schauer', 95: 'Gewitter', 96: 'Hagelsturm', 99: 'Schwerer Hagelsturm',
};
const WMO_ES: Record<number, string> = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla helada', 51: 'Llovizna ligera', 53: 'Llovizna',
  55: 'Llovizna intensa', 61: 'Lluvia ligera', 63: 'Lluvia', 65: 'Lluvia intensa',
  71: 'Nieve ligera', 73: 'Nieve', 75: 'Nevada intensa', 80: 'Chubascos ligeros',
  81: 'Chubascos', 82: 'Chubascos intensos', 95: 'Tormenta', 96: 'Granizo', 99: 'Granizo severo',
};
const WMO_FR: Record<number, string> = {
  0: 'Ensoleillé', 1: 'Surtout ensoleillé', 2: 'Partiellement nuageux', 3: 'Couvert',
  45: 'Brumeux', 48: 'Brouillard givrant', 51: 'Bruine légère', 53: 'Bruine',
  55: 'Bruine forte', 61: 'Pluie légère', 63: 'Pluie', 65: 'Forte pluie',
  71: 'Neige légère', 73: 'Neige', 75: 'Forte neige', 80: 'Averses légères',
  81: 'Averses', 82: 'Fortes averses', 95: 'Orage', 96: 'Grêle', 99: 'Grêle sévère',
};
const WMO_AR: Record<number, string> = {
  0: 'صافٍ', 1: 'صافٍ في معظمه', 2: 'غائم جزئياً', 3: 'غائم',
  45: 'ضبابي', 48: 'ضباب متجمد', 51: 'رذاذ خفيف', 53: 'رذاذ',
  55: 'رذاذ كثيف', 61: 'مطر خفيف', 63: 'ممطر', 65: 'أمطار غزيرة',
  71: 'ثلج خفيف', 73: 'ثلج', 75: 'ثلج كثيف', 80: 'زخات خفيفة',
  81: 'زخات', 82: 'زخات قوية', 95: 'عاصفة رعدية', 96: 'برد', 99: 'عاصفة برد شديدة',
};

const WMO_BY_LANG: Record<string, Record<number, string>> = {
  tr: WMO_TR, en: WMO_EN, de: WMO_DE, es: WMO_ES, fr: WMO_FR, ar: WMO_AR,
};

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function getWindArrow(deg: number): string {
  const arrows = ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘'];
  return arrows[Math.round(deg / 45) % 8];
}

function getWindLabel(speed: number, t: Translations): string {
  if (speed < 1) return t.windCalm;
  if (speed < 6) return t.windLightBreeze;
  if (speed < 12) return t.windLight;
  if (speed < 20) return t.windModerate;
  if (speed < 29) return t.windFresh;
  if (speed < 39) return t.windStrong;
  if (speed < 50) return t.windVeryStrong;
  return t.windStorm;
}

function getWaveLabel(height: number, t: Translations): string {
  if (height < 0.1) return t.waveCalm;
  if (height < 0.2) return t.waveVeryLight;
  if (height < 0.5) return t.waveLight;
  if (height < 1.0) return t.waveModerate;
  if (height < 1.5) return t.waveRough;
  if (height < 2.5) return t.waveVeryRough;
  return t.waveStorm;
}

function maxPerDay(times: string[], values: (number | null)[]): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  times.forEach((time, i) => {
    const day = time.split('T')[0];
    const val = values[i];
    if (val === null || val === undefined) return;
    if (result[day] === undefined || result[day] === null || val > result[day]!) {
      result[day] = val;
    }
  });
  return result;
}

export function WeatherWidget() {
  const { t, lang } = useLanguage();
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.getTime() === today.getTime()) return t.weatherToday;
    if (date.getTime() === tomorrow.getTime()) return t.weatherTomorrow;
    return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
      weekday: 'long', day: 'numeric', month: 'short',
    });
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const weatherUrl =
        'https://api.open-meteo.com/v1/forecast?latitude=40.874&longitude=29.074' +
        '&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,surface_pressure_mean,precipitation_sum' +
        '&timezone=Europe%2FIstanbul&forecast_days=5';

      const marineUrl =
        'https://marine-api.open-meteo.com/v1/marine?latitude=40.874&longitude=29.074' +
        '&hourly=wave_height&timezone=Europe%2FIstanbul&forecast_days=5';

      const [weatherRes, marineRes] = await Promise.all([fetch(weatherUrl), fetch(marineUrl)]);
      if (!weatherRes.ok) throw new Error('Weather API error');
      const weatherJson = await weatherRes.json();
      const d = weatherJson.daily;

      let waveByDay: Record<string, number | null> = {};
      if (marineRes.ok) {
        const marineJson = await marineRes.json();
        if (marineJson.hourly?.time && marineJson.hourly?.wave_height) {
          waveByDay = maxPerDay(marineJson.hourly.time, marineJson.hourly.wave_height);
        }
      }

      const days: DayForecast[] = d.time.map((dateStr: string, i: number) => ({
        date: dateStr,
        dateLabel: formatDateLabel(dateStr),
        weatherCode: d.weathercode[i],
        tempMax: Math.round(d.temperature_2m_max[i]),
        tempMin: Math.round(d.temperature_2m_min[i]),
        windSpeedMax: Math.round(d.windspeed_10m_max[i]),
        windGustsMax: Math.round(d.windgusts_10m_max[i]),
        windDirectionDominant: Math.round(d.winddirection_10m_dominant[i]),
        pressureMean: Math.round(d.surface_pressure_mean[i]),
        precipitationSum: Math.round((d.precipitation_sum[i] ?? 0) * 10) / 10,
        waveHeightMax: waveByDay[dateStr] !== undefined ? waveByDay[dateStr] : null,
      }));

      setForecasts(days);
      setLastUpdated(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4 border-b border-sedef-border pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sedef-accent text-base">🌊</span>
          <h3 className="text-sm font-semibold">{t.weatherTitle}</h3>
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="text-sedef-secondary hover:text-sedef-accent transition-colors disabled:opacity-40"
          title={t.weatherRefresh}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <p className="text-xs text-sedef-secondary mb-3 leading-relaxed">
        {t.weatherSubtitle}
      </p>

      {loading && !forecasts.length && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-28 bg-sedef-border/10 rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-xs text-sedef-secondary text-center py-4 bg-sedef-border/10 rounded-lg">
          {t.weatherError}
        </div>
      )}

      {!loading && !error && forecasts.length > 0 && (
        <div className="space-y-3">
          {forecasts.slice(0, 3).map((day, idx) => {
            const wmoEntry = WMO_CODES[day.weatherCode] ?? { icon: '❓' };
            const wmoLabels = WMO_BY_LANG[lang] ?? WMO_EN;
            const weatherLabel = wmoLabels[day.weatherCode] ?? '—';
            const windDir = getWindDirection(day.windDirectionDominant);
            const windArrow = getWindArrow(day.windDirectionDominant);
            const windLabel = getWindLabel(day.windSpeedMax, t);
            const waveVal = day.waveHeightMax;
            const waveLabel = waveVal !== null ? getWaveLabel(waveVal, t) : null;

            return (
              <div
                key={day.date}
                className={`rounded-lg p-3 border transition-all duration-300 ${
                  idx === 0
                    ? 'border-sedef-accent/30 bg-sedef-accent/5'
                    : 'border-sedef-border bg-sedef-bg/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${idx === 0 ? 'text-sedef-accent' : 'text-sedef-secondary'}`}>
                      {day.dateLabel}
                    </span>
                    <p className="text-[11px] text-sedef-secondary">
                      {new Date(day.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-2xl">{wmoEntry.icon}</span>
                    <div>
                      <p className="text-base font-bold text-sedef-primary leading-none">
                        {day.tempMax}° <span className="text-sedef-secondary font-normal text-xs">/ {day.tempMin}°</span>
                      </p>
                      <p className="text-[10px] text-sedef-secondary">{weatherLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-start gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sedef-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-sedef-secondary uppercase tracking-wide">{t.weatherWind}</p>
                      <p className="text-xs font-semibold text-sedef-primary">{windArrow} {windDir}</p>
                      <p className="text-[10px] text-sedef-primary">{day.windSpeedMax} km/h</p>
                      <p className="text-[10px] text-sedef-secondary">{windLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-sedef-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-sedef-secondary uppercase tracking-wide">{t.weatherPressure}</p>
                      <p className="text-xs font-semibold text-sedef-primary">{day.pressureMean} hPa</p>
                      <p className="text-[10px] text-sedef-secondary">
                        {day.pressureMean >= 1013 ? t.weatherHigh : day.pressureMean >= 1000 ? t.weatherNormal : t.weatherLow}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sedef-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-sedef-secondary uppercase tracking-wide">{t.weatherRain}</p>
                      <p className="text-xs font-semibold text-sedef-primary">{day.precipitationSum} mm</p>
                      <p className="text-[10px] text-sedef-secondary">
                        {day.precipitationSum === 0 ? t.weatherNone : day.precipitationSum < 2 ? t.weatherLight : day.precipitationSum < 10 ? t.weatherMedium : t.weatherHeavy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-sedef-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-sedef-secondary uppercase tracking-wide">{t.weatherWave}</p>
                      {waveVal !== null ? (
                        <>
                          <p className="text-xs font-semibold text-sedef-primary">{waveVal.toFixed(1)} m</p>
                          <p className="text-[10px] text-sedef-secondary">{waveLabel}</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-sedef-secondary">—</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5 Günlük Rüzgar Tahmini Tablosu */}
      {!loading && !error && forecasts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-sedef-border">
          <h4 className="text-xs font-semibold text-sedef-accent uppercase tracking-wide mb-3 flex items-center gap-2">
            <Wind className="w-3.5 h-3.5" />
            5 Günlük Rüzgar Tahmini
          </h4>
          <div className="grid grid-cols-5 gap-1 text-[10px]">
            {/* Header */}
            <div className="text-sedef-secondary font-semibold text-center pb-1 border-b border-sedef-border">Gün</div>
            <div className="text-sedef-secondary font-semibold text-center pb-1 border-b border-sedef-border">Yön</div>
            <div className="text-sedef-secondary font-semibold text-center pb-1 border-b border-sedef-border">Hız</div>
            <div className="text-sedef-secondary font-semibold text-center pb-1 border-b border-sedef-border">Esinti</div>
            <div className="text-sedef-secondary font-semibold text-center pb-1 border-b border-sedef-border">Durum</div>
            
            {/* Data rows */}
            {forecasts.map((day, idx) => {
              const windDir = getWindDirection(day.windDirectionDominant);
              const windArrow = getWindArrow(day.windDirectionDominant);
              const windLabel = getWindLabel(day.windSpeedMax, t);
              return (
                <div key={day.date} className="contents">
                  <div className={`text-center py-2 ${idx === 0 ? 'font-semibold text-sedef-accent' : 'text-sedef-primary'}`}>
                    <div>{day.dateLabel}</div>
                    <div className="text-sedef-secondary font-normal text-[9px]">
                      {new Date(day.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="text-center py-2 text-sedef-primary">
                    <span className="text-sm">{windArrow}</span> {windDir}
                  </div>
                  <div className="text-center py-2">
                    <span className="font-bold text-sedef-primary">{day.windSpeedMax}</span>
                    <span className="text-sedef-secondary ml-0.5">km/h</span>
                  </div>
                  <div className="text-center py-2">
                    <span className="text-sedef-secondary">{day.windGustsMax}</span>
                    <span className="text-sedef-secondary ml-0.5">km/h</span>
                  </div>
                  <div className="text-center py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                      windLabel === t.windStorm || windLabel === t.windVeryStrong
                        ? 'bg-red-500/20 text-red-400'
                        : windLabel === t.windStrong || windLabel === t.windFresh
                        ? 'bg-orange-500/20 text-orange-400'
                        : windLabel === t.windModerate
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {windLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] text-sedef-secondary/60 mt-2 text-center">
            Veri kaynağı: Open-Meteo (Sedef Adası: 40.874°N, 29.074°E)
          </p>
        </div>
      )}

      {lastUpdated && (
        <p className="text-[10px] text-sedef-secondary/60 mt-3 text-right">
          {t.weatherLastUpdated}: {lastUpdated.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}
