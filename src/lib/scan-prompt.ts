import { MUSHROOMS } from '@/data/mushrooms';
import { type Lang } from '@/i18n/strings';

// Część skanera wspólna dla aplikacji i serwera (src/app/api/identify+api.ts):
// prompt, opis narzędzia i porządkowanie odpowiedzi. Bez modułów natywnych, żeby dało się jej użyć na serwerze.

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
/** To, co aplikacja wysyła do serwera. */
export type IdentifyRequest = { lang: Lang; photos: { base64: string; mime: string }[] };

export const MAX_PHOTOS = 3;
export const SUPPORTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const BY_LATIN = new Map(MUSHROOMS.map((m) => [m.latin.toLowerCase(), m]));
export const findSpecies = (latin: string) => BY_LATIN.get(latin.trim().toLowerCase());

export const REPORT_TOOL = {
  name: 'report_identification',
  description: 'Report the identification of the mushroom in the photos against the atlas.',
  input_schema: {
    type: 'object' as const,
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

// Stała część promptu (zasady + cały atlas) jest identyczna przy każdym skanie, więc serwer
// trzyma ją w cache API (prompt caching) – kolejne skany są tańsze i szybsze.
// Język odpowiedzi idzie osobnym, krótkim blokiem na końcu, żeby nie psuć cache.
const ATLAS = MUSHROOMS.map((m) => `${m.latin} (${m.pl}; ${m.en})`).join('\n');
export const SYSTEM_PROMPT = `You are a careful mycology assistant inside a Polish mushroom field-guide app. The user photographs a mushroom; you compare it with the atlas below and call the report_identification tool.

Rules:
- Always answer by calling the report_identification tool exactly once. Do not answer with plain text.
- Pick candidates ONLY from the atlas list and copy the Latin name exactly. If it looks like a species outside the atlas, say so in outside_atlas.
- Be honest and conservative with confidence. A photo rarely proves a species. Lower the confidence when key features are not visible (underside, cut flesh and its colour change, ring, base of the stem / volva, smell, spore print, substrate). Confidences sum to at most 100; the rest means "other / unknown".
- Always list dangerous lookalikes, especially deadly ones (Amanita phalloides, A. virosa, Galerina marginata, Cortinarius orellanus/rubellus, Lepiota, Gyromitra) whenever they are plausible.
- verification_steps: concrete checks with the physical specimen, e.g. dig out the whole base and look for a sac-like volva, check gill/spore colour, take a spore print on white and black paper, cut the flesh and watch for colour change for a few minutes, smell, note the substrate and nearby trees. Never suggest tasting. The last step is always to show the mushroom to a certified mushroom expert (in Poland: sanepid) before eating.
- Never state or imply that a mushroom is safe to eat.

Atlas:
${ATLAS}`;
export const languageNote = (lang: Lang) => `Write all text fields in ${lang === 'pl' ? 'Polish' : 'English'}.`;

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
