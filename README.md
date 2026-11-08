# Grzybnia

Atlas grzybów (Expo SDK 58 + Expo Router): atlas gatunków z sezonami, mapa lasów i zakazów wstępu,
skaner AI (Claude), przepisy i album zdjęć z grzybobrań.

## Uruchomienie

```bash
npm install
npx expo start
```

## Klucz API do skanera

Skaner wysyła zdjęcia do **własnego serwera aplikacji** – trasy [`src/app/api/identify+api.ts`](src/app/api/identify+api.ts) –
a dopiero serwer wywołuje Claude API. Dzięki temu klucz nie trafia do aplikacji na telefonie.

1. Utwórz klucz w Claude Console (https://platform.claude.com).
2. Wpisz go do pliku `.env` w głównym folderze (plik jest w `.gitignore`):

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   **Bez** przedrostka `EXPO_PUBLIC_` – zmienne z tym przedrostkiem są wbudowywane w aplikację i każdy mógłby je odczytać.

W trakcie pracy (`npx expo start`, Expo Go) trasę obsługuje serwer deweloperski – nic więcej nie trzeba.

### Publikacja (wersja ze sklepu)

Gotowa aplikacja potrzebuje serwera dostępnego w internecie:

1. Wdróż serwer na EAS Hosting:

   ```bash
   npx expo export --platform web
   npx eas-cli@latest deploy
   ```

2. Ustaw `ANTHROPIC_API_KEY` jako zmienną środowiskową tego wdrożenia (zmienne EAS – szczegóły w dokumentacji
   EAS Hosting; plik `.env` nie jest wysyłany).
3. W `app.json` dodaj adres serwera do wtyczki `expo-router`, żeby aplikacja wiedziała, dokąd wysyłać zapytania:

   ```json
   ["expo-router", { "origin": "https://<twoj-projekt>.expo.app" }]
   ```

Endpoint jest publiczny – przed szerszą publikacją warto dodać limit zapytań, żeby nikt nie zużywał klucza.

## Struktura

| Folder | Zawartość |
|---|---|
| `src/app/` | trasy Expo Router: `index.tsx` (główny ekran), `api/identify+api.ts` (serwer skanera) |
| `src/data/` | baza: `mushrooms.ts` (gatunki, opisy, sezony), `recipes.ts`, `forests.ts` |
| `src/lib/` | logika: `storage.ts` (album, ustawienia), `photos.ts` (zdjęcia + cache), `scanner.ts` i `scan-prompt.ts` (skaner), `map.ts` |
| `src/screens/` | ekrany i arkusze |
| `src/components/` | wspólne elementy UI |
| `src/styles/`, `src/constants/palette.ts`, `src/i18n/` | style, kolory, teksty PL/EN |

## Wydajność – co warto wiedzieć

- Adresy zdjęć gatunków są zapisywane w pamięci telefonu (`photos.json`, `inat.json` w cache) i odświeżane co 30 dni;
  po dodaniu nowych gatunków aplikacja dociąga tylko brakujące. Same obrazki trzyma w cache dysku `expo-image`.
- Zakładki (zwłaszcza mapa z WebView) powstają dopiero przy pierwszym otwarciu.
- Skaner zmniejsza zdjęcia do 1568 px przed wysłaniem; stała część promptu (atlas) jest w cache API (prompt caching).
- Projekt używa React Compiler – kod musi przechodzić `npx expo lint` bez błędów `react-hooks/*`,
  inaczej kompilator pomija dany komponent. Animowane wartości twórz przez `useState(() => new Animated.Value(0))[0]`,
  nie `useRef(...).current`.

## Polecenia

```bash
npx expo lint        # lint
npx tsc --noEmit     # typecheck
npx expo-doctor      # diagnostyka zależności
```
