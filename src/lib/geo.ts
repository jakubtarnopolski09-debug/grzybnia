import { type Lang } from '@/i18n/strings';

// Proste obliczenia na współrzędnych: odległość, kierunek, formatowanie.

export type LatLng = { lat: number; lng: number };

const R = 6_371_000; // promień Ziemi w metrach
const rad = (d: number) => (d * Math.PI) / 180;

/** Odległość w metrach (wzór haversine). */
export function distance(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Azymut z a do b w stopniach (0 = północ, 90 = wschód). */
export function bearing(a: LatLng, b: LatLng): number {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Długość trasy (suma odcinków) w metrach. */
export function pathLength(points: LatLng[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i++) sum += distance(points[i - 1], points[i]);
  return sum;
}

const DIRS = {
  pl: ['na północ', 'na północny wschód', 'na wschód', 'na południowy wschód', 'na południe', 'na południowy zachód', 'na zachód', 'na północny zachód'],
  en: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'],
};
/** Kierunek słownie, np. „na północny zachód”. */
export const directionName = (deg: number, lang: Lang) => DIRS[lang][Math.round(deg / 45) % 8];

/** 850 m, 1,2 km, 12 km */
export function formatDistance(m: number, lang: Lang): string {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  const km = m / 1000;
  const s = km < 10 ? km.toFixed(1) : String(Math.round(km));
  return `${lang === 'pl' ? s.replace('.', ',') : s} km`;
}

/** 1 h 05 min, 12 min */
export function formatDuration(ms: number): string {
  const min = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(min / 60);
  return h ? `${h} h ${String(min % 60).padStart(2, '0')} min` : `${min} min`;
}
