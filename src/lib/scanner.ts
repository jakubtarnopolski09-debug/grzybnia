import * as ImagePicker from 'expo-image-picker';
import { MUSHROOMS } from '@/data/mushrooms';
import { type Lang } from '@/i18n/strings';

// SKANER (rozpoznawanie ze zdjęcia przez Claude API)

// Klucz API: utwórz w https://platform.claude.com (Console) i wpisz do pliku .env w głównym folderze projektu:
//   EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
// UWAGA: klucz zapisany w aplikacji da się z niej wyciągnąć. Do testów na własnym telefonie jest OK,
// ale przed publikacją w sklepie przenieś zapytanie do własnego serwera (proxy) i trzymaj klucz tam.
export const API_KEY: string = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
export const MODEL = 'claude-sonnet-5-5'; // dokładniej, ale drożej: 'claude-opus-5-5'
export const MAX_PHOTOS = 3;

export type ScanPhoto = { uri: string; base64: string; mime: string; fromAlbum?: boolean };
export type Candidate = { latin: string; confidence: number; key_features: string };
export type Lookalike = { latin: string; how_to_tell: string };
export type ScanResult = {
  is_mushroom: boolean;
  photo_feedback: string;
  candidates: Candidate[];
  outside_atlas?: string;
  dangerous_lookalikes: Lookalike[];
  verification_steps: string[];
};

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
    noKey: 'Brak klucza API. Utwórz klucz w Claude Console (platform.claude.com), wpisz go do pliku .env jako EXPO_PUBLIC_ANTHROPIC_API_KEY=… i uruchom ponownie: npx expo start -c',
    noPermission: 'Brak dostępu do aparatu lub zdjęć. Włącz go w ustawieniach telefonu.',
    error: 'Nie udało się przeanalizować zdjęcia', tooBig: 'Zdjęcie jest za duże. Zrób je jeszcze raz albo wybierz mniejsze.',
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
    noKey: 'No API key. Create one in the Claude Console (platform.claude.com), put it in .env as EXPO_PUBLIC_ANTHROPIC_API_KEY=… and restart with: npx expo start -c',
    noPermission: 'No access to the camera or photos. Enable it in your phone settings.',
    error: 'Could not analyse the photo', tooBig: 'The photo is too large. Take it again or choose a smaller one.',
  },
};

export const BY_LATIN = new Map(MUSHROOMS.map((m) => [m.latin.toLowerCase(), m]));
export const findSpecies = (latin: string) => BY_LATIN.get(latin.trim().toLowerCase());

export const REPORT_TOOL = {
  name: 'report_identification',
  description: 'Report the identification of the mushroom in the photos against the atlas.',
  input_schema: {
    type: 'object',
    properties: {
      is_mushroom: { type: 'boolean', description: 'Whether the photos show a mushroom / fungus at all.' },
      photo_feedback: { type: 'string', description: 'Which identifying features are visible and which are missing; which extra photo to take.' },
      candidates: {
        type: 'array', maxItems: 5,
        description: 'Best matches from the atlas, most likely first. Confidences are integers 0-100 and must sum to at most 100.',
        items: {
          type: 'object',
          properties: {
            latin: { type: 'string', description: 'Latin name copied exactly from the atlas list.' },
            confidence: { type: 'integer', minimum: 0, maximum: 100 },
            key_features: { type: 'string', description: 'Visible features that support or argue against this species.' },
          },
          required: ['latin', 'confidence', 'key_features'],
        },
      },
      outside_atlas: { type: 'string', description: 'If the mushroom may be a species not in the atlas, name it (Latin + common name). Otherwise empty string.' },
      dangerous_lookalikes: {
        type: 'array', maxItems: 4,
        description: 'Poisonous or deadly atlas species that could be confused with the candidates.',
        items: {
          type: 'object',
          properties: {
            latin: { type: 'string', description: 'Latin name copied exactly from the atlas list.' },
            how_to_tell: { type: 'string' },
          },
          required: ['latin', 'how_to_tell'],
        },
      },
      verification_steps: {
        type: 'array', maxItems: 7, items: { type: 'string' },
        description: 'Concrete, safe checks the user can do with the physical mushroom to confirm or rule out the candidates.',
      },
    },
    required: ['is_mushroom', 'photo_feedback', 'candidates', 'outside_atlas', 'dangerous_lookalikes', 'verification_steps'],
  },
};

export function systemPrompt(lang: Lang) {
  const atlas = MUSHROOMS.map((m) => `${m.latin} (${m.pl}; ${m.en})`).join('\n');
  return `You are a careful mycology assistant inside a Polish mushroom field-guide app. The user photographs a mushroom; you compare it with the atlas below and call the report_identification tool.

Rules:
- Always answer by calling the report_identification tool exactly once. Do not answer with plain text.
- Pick candidates ONLY from the atlas list and copy the Latin name exactly. If it looks like a species outside the atlas, say so in outside_atlas.
- Be honest and conservative with confidence. A photo rarely proves a species. Lower the confidence when key features are not visible (underside, cut flesh and its colour change, ring, base of the stem / volva, smell, spore print, substrate). Confidences sum to at most 100; the rest means "other / unknown".
- Always list dangerous lookalikes, especially deadly ones (Amanita phalloides, A. virosa, Galerina marginata, Cortinarius orellanus/rubellus, Lepiota, Gyromitra) whenever they are plausible.
- verification_steps: concrete checks with the physical specimen, e.g. dig out the whole base and look for a sac-like volva, check gill/spore colour, take a spore print on white and black paper, cut the flesh and watch for colour change for a few minutes, smell, note the substrate and nearby trees. Never suggest tasting. The last step is always to show the mushroom to a certified mushroom expert (in Poland: sanepid) before eating.
- Never state or imply that a mushroom is safe to eat.
- Write all text fields in ${lang === 'pl' ? 'Polish' : 'English'}.

Atlas:
${atlas}`;
}

export async function identify(photos: ScanPhoto[], lang: Lang): Promise<ScanResult> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt(lang),
      tools: [REPORT_TOOL],
      tool_choice: { type: 'auto' },
      messages: [{
        role: 'user',
        content: [
          ...photos.map((p) => ({ type: 'image', source: { type: 'base64', media_type: p.mime, data: p.base64 } })),
          { type: 'text', text: lang === 'pl' ? 'Jaki to grzyb?' : 'Which mushroom is this?' },
        ],
      }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
  const blocks: any[] = json.content ?? [];
  const tool = blocks.find((b) => b.type === 'tool_use');
  let r: ScanResult | null = tool ? (tool.input as ScanResult) : null;
  if (!r) {
    // zapas: gdyby model odpowiedział tekstem z JSON-em zamiast narzędziem
    const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('');
    const found = text.match(/\{[\s\S]*\}/);
    if (found) { try { r = JSON.parse(found[0]); } catch {} }
  }
  if (!r) throw new Error('No result');
  return normalizeResult(r);
}

// Model czasem zwraca listy jako tekst (np. "[...]") albo liczby jako napisy – sprowadzamy wszystko do właściwych typów
export const asText = (v: any): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
export function asArray(v: any): any[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return v.split(/\n+/).map((x) => x.replace(/^\s*(\d+[.)]|[-•])\s*/, '').trim()).filter(Boolean);
  }
  return [];
}
export function normalizeResult(raw: any): ScanResult {
  const candidates = asArray(raw.candidates)
    .filter((c) => c && typeof c.latin === 'string' && findSpecies(c.latin))
    .map((c) => ({ latin: c.latin, confidence: Math.max(0, Math.min(100, Math.round(Number(c.confidence) || 0))), key_features: asText(c.key_features) }))
    .sort((a, b) => b.confidence - a.confidence);
  return {
    is_mushroom: raw.is_mushroom !== false && raw.is_mushroom !== 'false',
    photo_feedback: asText(raw.photo_feedback),
    outside_atlas: asText(raw.outside_atlas),
    candidates,
    dangerous_lookalikes: asArray(raw.dangerous_lookalikes)
      .filter((l) => l && typeof l.latin === 'string' && findSpecies(l.latin))
      .map((l) => ({ latin: l.latin, how_to_tell: asText(l.how_to_tell) })),
    verification_steps: asArray(raw.verification_steps).map(asText).filter(Boolean),
  };
}

export const SUPPORTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const toPhoto = (a: ImagePicker.ImagePickerAsset): ScanPhoto | null =>
  a.base64 ? { uri: a.uri, base64: a.base64, mime: a.mimeType && SUPPORTED.includes(a.mimeType) ? a.mimeType : 'image/jpeg' } : null;
