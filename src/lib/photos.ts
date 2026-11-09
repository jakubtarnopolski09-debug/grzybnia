import { File, Paths } from 'expo-file-system';
import { readJson, writeJson } from '@/lib/storage';

// Zdjęcia: Wikipedia (EN, potem PL), a gdy obrazek się nie wczyta – iNaturalist.
// Adresy zdjęć zapisujemy w pamięci telefonu (photos.json), więc kolejne uruchomienia
// nie odpytują Wikipedii – lista jest od razu. Odświeżamy ją co PHOTOS_TTL_DAYS dni.
// Same obrazki trzyma w cache dysku expo-image.

// Serwer obrazków Wikimedia często odrzuca aplikacje (HTTP 403), dlatego po kilku takich błędach
// aplikacja przestaje próbować Wikipedii i od razu bierze zdjęcia z iNaturalist.
export type Photos = Record<string, string | null>;
export const USER_AGENT = 'GrzybyAtlas/1.0 (React Native mushroom field guide)';
export const HEADERS = { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT };
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const wikiImages = { errors: 0 }; // licznik błędów obrazków Wikimedia (wspólny dla całej aplikacji)
export const WIKI_ERROR_LIMIT = 3;

const PHOTOS_TTL_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;
type PhotoCache = { savedAt: number; latins: number; photos: Photos };
const photoCacheFile = () => new File(Paths.cache, 'photos.json');
const inatCacheFile = () => new File(Paths.cache, 'inat.json');

export async function wikiThumbs(host: string, titles: string[]): Promise<Photos> {
  const out: Photos = {};
  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    const url = `https://${host}/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&pilimit=50&titles=${encodeURIComponent(chunk.join('|'))}`;
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) { console.log(`[zdjęcia] ${host}: HTTP ${res.status}`); continue; }
      const json = await res.json();
      const back: Record<string, string> = {};
      for (const n of json.query?.normalized ?? []) back[n.to] = back[n.from] ?? n.from;
      for (const r of json.query?.redirects ?? []) back[r.to] = back[r.from] ?? r.from;
      for (const p of Object.values<any>(json.query?.pages ?? {})) {
        const original = back[p.title] ?? p.title;
        if (p.thumbnail?.source) out[original] = p.thumbnail.source;
      }
    } catch (e: any) {
      console.log(`[zdjęcia] ${host}: ${e?.message ?? e}`);
    }
  }
  return out;
}

/** Zapisane adresy zdjęć (jeśli są) – do natychmiastowego wyświetlenia przy starcie. */
export function cachedPhotos(): { photos: Photos; fresh: boolean } {
  const cache = readJson<PhotoCache | null>(photoCacheFile(), null);
  if (!cache?.photos) return { photos: {}, fresh: false };
  return { photos: cache.photos, fresh: Date.now() - cache.savedAt < PHOTOS_TTL_DAYS * DAY };
}

export async function loadAllPhotos(latins: string[], onUpdate: (p: Photos) => void) {
  const { photos, fresh } = cachedPhotos();
  // baza się rozrosła (nowe gatunki) – dociągamy tylko brakujące, reszta zostaje z pamięci
  const known = new Set(Object.keys(photos));
  const todo = fresh ? latins.filter((l) => !known.has(l)) : latins;
  if (!todo.length) return;

  let found: Photos = await wikiThumbs('en.wikipedia.org', todo);
  if (fresh) found = { ...photos, ...found };
  onUpdate(found);
  const missing = todo.filter((l) => !found[l]);
  if (missing.length) {
    found = { ...found, ...(await wikiThumbs('pl.wikipedia.org', missing)) };
  }
  // gatunki bez zdjęcia też zapisujemy (null), żeby nie pytać o nie przy każdym starcie
  for (const l of todo) if (!(l in found)) found[l] = null;
  onUpdate(found);
  // nie zapisuj wyniku, gdy sieć w ogóle nie odpowiedziała – spróbujemy przy następnym starcie
  if (Object.values(found).some(Boolean)) writeJson(photoCacheFile(), { savedAt: Date.now(), latins: latins.length, photos: found } satisfies PhotoCache);
}

// iNaturalist: zdjęcie domyślne gatunku. Zapytania idą po kolei co 0,7 s (limit API),
// tylko dla grzybów widocznych na ekranie, a wynik jest zapamiętywany – także na dysku.
// wczytywane przy pierwszym użyciu, nie przy imporcie modułu (import nie może dotykać dysku)
let inatSaved: Record<string, string | null> | null = null;
const inatCache = new Map<string, Promise<string | null>>();
const ensureInatLoaded = () => {
  if (inatSaved) return inatSaved;
  inatSaved = readJson<Record<string, string | null>>(inatCacheFile(), {});
  for (const [k, v] of Object.entries(inatSaved)) inatCache.set(k, Promise.resolve(v));
  return inatSaved;
};
let inatQueue: Promise<unknown> = Promise.resolve();
let inatSaveTimer: ReturnType<typeof setTimeout> | null = null;
const saveInatSoon = () => {
  if (inatSaveTimer) return;
  inatSaveTimer = setTimeout(() => { inatSaveTimer = null; writeJson(inatCacheFile(), ensureInatLoaded()); }, 2000);
};

export function inatPhoto(latin: string): Promise<string | null> {
  const saved = ensureInatLoaded();
  const cached = inatCache.get(latin);
  if (cached) return cached;
  const job = inatQueue.then(async () => {
    try {
      const res = await fetch(`https://api.inaturalist.org/v1/taxa?rank=species&per_page=1&q=${encodeURIComponent(latin)}`, { headers: HEADERS });
      if (!res.ok) { console.log(`[zdjęcia] iNaturalist: HTTP ${res.status}`); inatCache.delete(latin); return null; }
      const json = await res.json();
      const taxon = json.results?.[0];
      const url = taxon && taxon.name?.toLowerCase() === latin.toLowerCase() ? ((taxon.default_photo?.medium_url as string | undefined) ?? null) : null;
      saved[latin] = url;
      saveInatSoon();
      return url;
    } catch (e: any) {
      console.log(`[zdjęcia] iNaturalist: ${e?.message ?? e}`);
      inatCache.delete(latin); // błąd sieci – spróbuj ponownie później
      return null;
    } finally {
      await sleep(700);
    }
  });
  inatQueue = job;
  inatCache.set(latin, job);
  return job;
}

// większa wersja tego samego zdjęcia do widoku szczegółów
export const bigger = (url: string) =>
  url.includes('wikimedia.org') ? url.replace(/\/\d+px-/, '/960px-') : url.replace('/medium.', '/large.');
