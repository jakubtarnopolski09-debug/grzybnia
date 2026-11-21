# Grzybnia – atlas grzybiarza

Mobilna aplikacja w **React Native + Expo** dla grzybiarzy. Łączy cztery rzeczy, których zwykle szuka się w kilku
aplikacjach: **atlas 300 gatunków** z alertami o grzybach trujących, **skaner AI** rozpoznający grzyba ze zdjęć,
**mapę lasu** z własnymi miejscówkami i nawigacją powrotną oraz **album zbiorów** ze zdjęciami i lokalizacją.
Wszystko działa po polsku i angielsku, w trybie jasnym i ciemnym, a dane użytkownika zostają w telefonie (offline).

| | |
|---|---|
| **Platforma, na którą głównie przygotowano aplikację** | **Android** |
| **Testowana na fizycznym urządzeniu** | **Tak** – telefon z Androidem, przez Expo Go |
| Expo SDK / React Native | 58 / 0.88 (Expo Router, React Compiler, TypeScript) |

## Zrzuty ekranu

| Atlas | Karta gatunku | Skaner | Mapa | Album |
|---|---|---|---|---|
| ![Atlas](docs/screenshots/atlas.png) | ![Karta gatunku](docs/screenshots/gatunek.png) | ![Skaner](docs/screenshots/skaner.png) | ![Mapa](docs/screenshots/mapa.png) | ![Album](docs/screenshots/album.png) |

## Funkcje

### 🍄 Atlas – 300 gatunków
- Podział na **jadalne, warunkowo jadalne, niejadalne, trujące i śmiertelnie trujące** – kolorowe oznaczenia i filtry.
- Wyszukiwanie po nazwie polskiej, angielskiej i łacińskiej, także **bez polskich znaków** („zolciak” → „Żółciak”).
- Sekcja **„Teraz w lesie”** – gatunki, które owocnikują w bieżącym miesiącu (sezon wyliczany z opisu gatunku).
- Karta gatunku: zdjęcie (Wikipedia / iNaturalist), opis wyglądu i siedliska, **pasek sezonowości** (12 miesięcy),
  przepisy z tym grzybem i **profil toksyczności** – *jak i dlaczego szkodzi* (amanityny, orellanina, muskaryna,
  rabdomioliza po gąsce zielonce, zatrucia żołądkowe…), z objawami i czasem ich wystąpienia.
- Atlas zawiera celowo wiele **groźnych sobowtórów** (sromotnik, muchomor jadowity, strzępiaki, hełmówka, dzwonkówka
  trująca, lisówka – „fałszywa kurka”), żeby uczyć odróżniania.

### 📷 Skaner AI (Claude)
- Do 3 zdjęć (kapelusz, spód, trzon z podstawą) z aparatu, galerii lub albumu.
- Wynik: **najbardziej prawdopodobne gatunki z atlasu z procentami**, cechy widoczne na zdjęciach, **groźne sobowtóry
  i jak je odróżnić** oraz kroki, jak się upewnić (wysyp zarodników, przekrój miąższu, pochwa u nasady…).
- **Alert o gatunku śmiertelnie trującym**, jeśli taki jest wśród kandydatów lub sobowtórów.
- Bezpieczeństwo: klucz API **nie jest w aplikacji** – zapytanie idzie przez trasę serwerową Expo Router
  ([src/app/api/identify+api.ts](src/app/api/identify+api.ts)); zdjęcia są zmniejszane na telefonie do 1568 px,
  a stała część promptu (lista atlasu) jest cache’owana po stronie API.

### 🗺️ Mapa grzybiarza
- Mapa OpenStreetMap i **mapa terenowa** (OpenTopoMap), tryb nocny.
- **91 kompleksów leśnych** we wszystkich 16 województwach z opisem, typowymi grzybami i porą zbioru;
  filtr **„W sezonie”** pokazuje lasy, w których teraz trwa sezon.
- **Własne miejscówki**: przytrzymaj palec na mapie (albo „zapisz, gdzie jestem”), dodaj nazwę i notatkę,
  potem nawiguj do niej.
- **Tryb wycieczki**: zapamiętuje punkt startu, rysuje ślad GPS, liczy przebyty dystans i czas,
  a **strzałka z kompasu wskazuje drogę powrotną** do startu (np. do samochodu).
- Warstwa **okresowych zakazów wstępu do lasu** (Bank Danych o Lasach, Lasy Państwowe).
- **Znaleziska z iNaturalist** w okolicy (z filtrem „tylko ten miesiąc”) i moje zdjęcia z albumu w miejscach zrobienia.

### 🧺 Album zbiorów
- Zdjęcia z aparatu lub galerii zapisywane w pamięci aplikacji, z **datą i lokalizacją GPS**.
- Notatka, przypisanie gatunku z atlasu, pokazanie miejsca na mapie, wysłanie do skanera, udostępnianie.

### 🍳 Przepisy
21 przepisów (zupa grzybowa, kurki w śmietanie, uszka, risotto, opieńki marynowane, poradnik suszenia…),
każdy powiązany z gatunkami z atlasu i ze wskazówkami bezpieczeństwa.

### 📴 Offline
W lesie zasięg bywa słaby, więc:
- cały atlas, przepisy i lista lasów są wbudowane w aplikację,
- album, notatki, miejscówki, trwająca wycieczka i ustawienia są zapisywane lokalnie (`expo-file-system`),
- adresy zdjęć gatunków są zapamiętywane na 30 dni, a same obrazki trzyma cache dysku `expo-image` –
  raz obejrzany gatunek pokazuje zdjęcie bez internetu.

## Uruchomienie

Wymagania: Node.js 20+, emulator Androida (Android Studio) lub telefon z aplikacją **Expo Go** (SDK 58).

```bash
npm install
npx expo start
```

W terminalu Expo naciśnij **`a`**, żeby otworzyć aplikację na emulatorze Androida, albo zeskanuj kod QR w Expo Go.

### Skaner AI – działa bez konfiguracji
Serwer skanera (trasa [src/app/api/identify+api.ts](src/app/api/identify+api.ts)) jest wdrożony na **EAS Hosting**
pod adresem `https://grzybnia.expo.app/api/identify`, a klucz Claude API jest zapisany tam jako zmienna środowiskowa.
Aplikacja domyślnie wysyła zdjęcia właśnie tam, więc **skaner działa od razu po `npx expo start`** – nie trzeba
żadnego klucza ani pliku `.env`. Klucza nie ma ani w repozytorium, ani w aplikacji.
Serwer ma limit zapytań na adres IP (20 na 10 minut).

Na emulatorze najprościej przetestować skaner, wybierając zdjęcie grzyba z galerii.

Własny serwer lokalny z własnym kluczem (opcjonalnie) – plik `.env` (wzór: [.env.example](.env.example)):

```
ANTHROPIC_API_KEY=sk-ant-...
EXPO_PUBLIC_SCANNER_URL=/api/identify
```

Wdrożenie serwera: `npx expo export --platform web`, potem `eas deploy --prod --environment production`
(klucz ustawiony przez `eas env:set --name ANTHROPIC_API_KEY --environment production --visibility sensitive`).

### Sprawdzanie kodu
```bash
npx tsc --noEmit   # typy
npx expo lint      # ESLint (z regułami React Compiler)
```

## Struktura projektu

```
src/
  app/                 trasy Expo Router
    index.tsx          główny ekran: stan aplikacji, zakładki, arkusze
    api/identify+api.ts  serwer skanera (Claude API, klucz po stronie serwera)
  data/                baza: mushrooms.ts (300 gatunków, opisy, profile toksyczności, sezony),
                       recipes.ts, forests.ts
  lib/                 logika bez UI: storage (zapis), photos (zdjęcia + cache), scanner + scan-prompt,
                       map (HTML mapy Leaflet), geo (odległość, azymut), spots (miejscówki, wycieczka)
  screens/             ekrany: atlas, karta gatunku, mapa, skaner, przepisy, album, arkusze lasów
  components/          wspólne elementy UI (przyciski z animacją, zdjęcie gatunku, pasek zakładek)
  styles/, constants/palette.ts, i18n/   style, kolory jasne/ciemne, teksty PL/EN
```

## Decyzje techniczne
- **Mapa: Leaflet w `react-native-webview` zamiast `react-native-maps`** – działa w Expo Go bez klucza Google Maps,
  daje mapę terenową (OpenTopoMap) i warstwę WMS z zakazami wstępu do lasu z BDL.
- **Lokalizacja i kompas: `expo-location`**, zdjęcia: `expo-image-picker`, `expo-image` (cache), `expo-image-manipulator`.
- **Animacje**: wejścia elementów, ugięcie przycisków, przesuwane podświetlenie zakładek, animowany nagłówek atlasu
  i przejścia arkuszy (React Native Animated z natywnym sterownikiem).
- **React Compiler** włączony – kod przechodzi lint bez naruszeń reguł hooków, więc kompilator optymalizuje wszystkie komponenty.
- Zakładki montowane leniwie (mapa z WebView dopiero po pierwszym otwarciu), listy na `FlatList`,
  posortowany indeks wyszukiwania liczony raz.

## Źródła danych
Opisy gatunków – opracowanie własne. Zdjęcia: Wikipedia / Wikimedia Commons, iNaturalist.
Mapy: © OpenStreetMap, OpenTopoMap. Zakazy wstępu: Bank Danych o Lasach (Lasy Państwowe). Rozpoznawanie: Claude API (Anthropic).

> Aplikacja ma charakter edukacyjny. Nigdy nie jedz grzyba wyłącznie na jej podstawie – pokaż go grzyboznawcy (sanepid).
