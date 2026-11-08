import Anthropic from '@anthropic-ai/sdk';
import {
  type IdentifyRequest, languageNote, MAX_PHOTOS, normalizeResult, REPORT_TOOL, type ScanResult, SUPPORTED, SYSTEM_PROMPT,
} from '@/lib/scan-prompt';

// POST /api/identify – rozpoznanie grzyba ze zdjęć przez Claude API.
// Działa na serwerze (w trakcie pracy: serwer `npx expo start`, po publikacji: EAS Hosting), więc klucz
// ANTHROPIC_API_KEY nigdy nie trafia do aplikacji na telefonie. Klucz wpisz do pliku .env (bez EXPO_PUBLIC_!).

const MODEL = 'claude-sonnet-5-5'; // dokładniej, ale drożej: 'claude-opus-5-5'
const MAX_BASE64 = 6_000_000; // ~4,5 MB na zdjęcie; aplikacja i tak zmniejsza je do ~0,3 MB

let client: Anthropic | null = null;

const fail = (status: number, code: string, message: string) => Response.json({ error: { code, message } }, { status });

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return fail(500, 'no_key', 'ANTHROPIC_API_KEY is not set on the server');

  let body: IdentifyRequest;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'bad_request', 'Invalid JSON');
  }
  const lang = body?.lang === 'en' ? 'en' : 'pl';
  const photos = Array.isArray(body?.photos) ? body.photos : [];
  if (!photos.length || photos.length > MAX_PHOTOS) return fail(400, 'bad_request', `Send 1-${MAX_PHOTOS} photos`);
  for (const p of photos) {
    if (typeof p?.base64 !== 'string' || !SUPPORTED.includes(p.mime)) return fail(400, 'bad_request', 'Unsupported photo');
    if (p.base64.length > MAX_BASE64) return fail(413, 'too_big', 'Photo too large');
  }

  client ??= new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      // gdy filtr bezpieczeństwa odrzuci zapytanie, API samo ponawia je na modelu zapasowym
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: languageNote(lang) },
      ],
      tools: [REPORT_TOOL],
      tool_choice: { type: 'auto' },
      messages: [{
        role: 'user',
        content: [
          ...photos.map((p) => ({
            type: 'image' as const,
            source: { type: 'base64' as const, media_type: p.mime as 'image/jpeg', data: p.base64 },
          })),
          { type: 'text' as const, text: lang === 'pl' ? 'Jaki to grzyb?' : 'Which mushroom is this?' },
        ],
      }],
    });

    if (response.stop_reason === 'refusal') return fail(422, 'refusal', 'The model declined to analyse these photos');

    let raw: any = null;
    for (const block of response.content) {
      if (block.type === 'tool_use' && block.name === REPORT_TOOL.name) { raw = block.input; break; }
    }
    if (!raw) {
      // zapas: gdyby model odpowiedział tekstem z JSON-em zamiast narzędziem
      const text = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
      const found = text.match(/\{[\s\S]*\}/);
      if (found) { try { raw = JSON.parse(found[0]); } catch {} }
    }
    if (!raw) return fail(502, 'no_result', 'No result');
    const result: ScanResult = normalizeResult(raw);
    return Response.json(result);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return fail(429, 'rate_limit', 'Too many requests – try again in a moment');
    if (error instanceof Anthropic.AuthenticationError) return fail(500, 'no_key', 'Invalid ANTHROPIC_API_KEY');
    if (error instanceof Anthropic.BadRequestError) return fail(400, 'bad_request', error.message);
    if (error instanceof Anthropic.APIError) return fail(502, 'api_error', `Claude API ${error.status}: ${error.message}`);
    return fail(502, 'network', String((error as Error)?.message ?? error));
  }
}
