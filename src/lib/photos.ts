
// Zdjęcia: Wikipedia (EN, potem PL), a gdy obrazek się nie wczyta – iNaturalist

// Serwer obrazków Wikimedia często odrzuca aplikacje (HTTP 403), dlatego po kilku takich błędach
// aplikacja przestaje próbować Wikipedii i od razu bierze zdjęcia z iNaturalist.
export type Photos = Record<string, string | null>;
export const USER_AGENT = 'GrzybyAtlas/1.0 (React Native mushroom field guide)';
export const HEADERS = { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT };
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const wikiImages = { errors: 0 }; // licznik błędów obrazków Wikimedia (wspólny dla całej aplikacji)
export const WIKI_ERROR_LIMIT = 3;

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

export async function loadAllPhotos(latins: string[], onUpdate: (p: Photos) => void) {
  let found: Photos = await wikiThumbs('en.wikipedia.org', latins);
  onUpdate(found);
  const missing = latins.filter((l) => !found[l]);
  if (missing.length) {
    found = { ...found, ...(await wikiThumbs('pl.wikipedia.org', missing)) };
    onUpdate(found);
  }
}

// iNaturalist: zdjęcie domyślne gatunku. Zapytania idą po kolei co 0,7 s (limit API),
// tylko dla grzybów widocznych na ekranie, a wynik jest zapamiętywany.
export const inatCache = new Map<string, Promise<string | null>>();
export let inatQueue: Promise<unknown> = Promise.resolve();

export function inatPhoto(latin: string): Promise<string | null> {
  const cached = inatCache.get(latin);
  if (cached) return cached;
  const job = inatQueue.then(async () => {
    try {
      const res = await fetch(`https://api.inaturalist.org/v1/taxa?rank=species&per_page=1&q=${encodeURIComponent(latin)}`, { headers: HEADERS });
      if (!res.ok) { console.log(`[zdjęcia] iNaturalist: HTTP ${res.status}`); return null; }
      const json = await res.json();
      const taxon = json.results?.[0];
      if (!taxon || taxon.name?.toLowerCase() !== latin.toLowerCase()) return null;
      return (taxon.default_photo?.medium_url as string | undefined) ?? null;
    } catch (e: any) {
      console.log(`[zdjęcia] iNaturalist: ${e?.message ?? e}`);
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
