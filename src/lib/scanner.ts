import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { type Lang } from '@/i18n/strings';
import { type IdentifyRequest, normalizeResult, type ScanResult } from '@/lib/scan-prompt';

// SKANER – część aplikacji: teksty, przygotowanie zdjęć i wywołanie serwera.
// Samo zapytanie do Claude API robi serwer (src/app/api/identify+api.ts), który trzyma klucz API.
// Prompt, narzędzie i typy wyników są w src/lib/scan-prompt.ts (wspólne z serwerem).
export { findSpecies, MAX_PHOTOS, type ScanResult } from '@/lib/scan-prompt';

export type ScanPhoto = { uri: string; base64: string; mime: string; fromAlbum?: boolean };

// Claude i tak zmniejsza zdjęcia do ~1568 px na dłuższym boku – większe tylko wydłużają wysyłanie.
const MAX_EDGE = 1568;

/** Zmniejsza zdjęcie do MAX_EDGE i zwraca JPEG w base64 (zwykle 0,2–0,4 MB zamiast kilku MB). */
export async function preparePhoto(uri: string, fromAlbum = false): Promise<ScanPhoto> {
  const original = await ImageManipulator.manipulate(uri).renderAsync();
  const { width, height } = original;
  const scale = MAX_EDGE / Math.max(width, height);
  const ref = scale < 1
    ? await ImageManipulator.manipulate(original)
      .resize(width >= height ? { width: MAX_EDGE, height: null } : { width: null, height: MAX_EDGE })
      .renderAsync()
    : original;
  const out = await ref.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true });
  return { uri, base64: out.base64 ?? '', mime: 'image/jpeg', fromAlbum };
}

export class ScanError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

export async function identify(photos: ScanPhoto[], lang: Lang): Promise<ScanResult> {
  const body: IdentifyRequest = { lang, photos: photos.map((p) => ({ base64: p.base64, mime: p.mime })) };
  let res: Response;
  try {
    res = await fetch('/api/identify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  } catch (e: any) {
    throw new ScanError('network', e?.message ?? String(e));
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ScanError(json?.error?.code ?? 'http', json?.error?.message ?? `HTTP ${res.status}`);
  return normalizeResult(json);
}

export const SCAN_TXT = {
  pl: {
    open: 'SKANUJ', title: 'Skaner', camera: 'Aparat', gallery: 'Galeria', analyze: 'ANALIZUJ', again: 'NOWY SKAN', close: 'ZAMKNIJ', back: 'WRÓĆ',
    hint: 'Do 3 zdjęć: kapelusz z góry, spód (blaszki / rurki / kolce) i cały trzon razem z podstawą wykopaną z ziemi. Im więcej cech widać, tym trafniejszy wynik.',
    analyzing: 'Porównuję z atlasem…',
    warn: 'To tylko szacunek AI na podstawie zdjęć. Procenty to ocena modelu, nie pewność. Nigdy nie jedz grzyba na podstawie skanu – pokaż go grzyboznawcy (sanepid).',
    deadly: 'Wśród możliwych gatunków jest grzyb ŚMIERTELNIE TRUJĄCY. Nie zbieraj go razem z innymi i myj ręce po dotknięciu.',
    matches: 'Najbardziej prawdopodobne', unknown: 'Inny gatunek / nie wiadomo', outside: 'Możliwy gatunek spoza atlasu',
    lookalikes: 'Groźne sobowtóry – jak odróżnić', photos: 'Co widać na zdjęciach', steps: 'Jak się upewnić',
    notMushroom: 'Na zdjęciu nie widać grzyba. Spróbuj z bliska, w dobrym świetle.',
    noKey: 'Brak klucza API. Utwórz klucz w Claude Console (platform.claude.com), wpisz go do pliku .env jako ANTHROPIC_API_KEY=… (na serwerze) i uruchom ponownie: npx expo start -c',
    noPermission: 'Brak dostępu do aparatu lub zdjęć. Włącz go w ustawieniach telefonu.',
    error: 'Nie udało się przeanalizować zdjęcia', tooBig: 'Zdjęcie jest za duże. Zrób je jeszcze raz albo wybierz mniejsze.',
    offline: 'Brak połączenia z serwerem skanera. Sprawdź internet i spróbuj ponownie.', busy: 'Zbyt wiele skanów naraz – spróbuj za chwilę.',
  },
  en: {
    open: 'SCAN', title: 'Scanner', camera: 'Camera', gallery: 'Gallery', analyze: 'ANALYSE', again: 'NEW SCAN', close: 'CLOSE', back: 'BACK',
    hint: 'Up to 3 photos: cap from above, underside (gills / pores / spines) and the whole stem including the base dug out of the soil. The more features visible, the better the result.',
    analyzing: 'Comparing with the atlas…',
    warn: 'This is only an AI estimate from photos. Percentages are the model’s judgement, not certainty. Never eat a mushroom based on a scan – show it to a mushroom expert.',
    deadly: 'One of the possible species is DEADLY POISONOUS. Keep it apart from other mushrooms and wash your hands after touching it.',
    matches: 'Most likely', unknown: 'Other species / unknown', outside: 'Possible species outside the atlas',
    lookalikes: 'Dangerous lookalikes – how to tell', photos: 'What the photos show', steps: 'How to make sure',
    notMushroom: 'No mushroom visible in the photo. Try closer, in good light.',
    noKey: 'No API key. Create one in the Claude Console (platform.claude.com), put it in .env as ANTHROPIC_API_KEY=… (server side) and restart with: npx expo start -c',
    noPermission: 'No access to the camera or photos. Enable it in your phone settings.',
    error: 'Could not analyse the photo', tooBig: 'The photo is too large. Take it again or choose a smaller one.',
    offline: 'Cannot reach the scanner server. Check your connection and try again.', busy: 'Too many scans at once – try again in a moment.',
  },
};

