
// Teksty interfejsu (PL/EN)

export type Lang = 'pl' | 'en';

// polska odmiana: 1 gatunek, 2 gatunki, 5 gatunków
export const plural = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;

export const L = {
  pl: {
    brand: 'Grzybnia',
    tabs: { atlas: 'Atlas', map: 'Mapa', game: 'Gra', scan: 'Skaner', recipes: 'Przepisy', album: 'Zdjęcia' },
    months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
    monthLetters: ['S', 'L', 'M', 'K', 'M', 'C', 'L', 'S', 'W', 'P', 'L', 'G'],
    label: { e: 'Jadalny', c: 'Warunkowo', i: 'Niejadalny', t: 'Trujący', d: 'Śmiertelny' },
    desc: {
      e: 'Jadalny. Zbieraj tylko okazy, które rozpoznajesz na pewno.',
      c: 'Jadalny dopiero po właściwej obróbce (np. długie gotowanie). Surowy lub źle przygotowany szkodzi.',
      i: 'Niejadalny: twardy, gorzki albo bez wartości kulinarnej.',
      t: 'Trujący. Wywołuje zatrucie pokarmowe lub inne objawy.',
      d: 'ŚMIERTELNIE TRUJĄCY. Nie jedz i nie wkładaj do jednego koszyka z jadalnymi.',
    },
    kicker: 'Teraz w lesie',
    heroStats: (n: number, e: number, d: number) => `${n} ${plural(n, 'gatunek', 'gatunki', 'gatunków')} w sezonie · ${e} jadalnych · ${d} trujących`,
    inSeason: 'W sezonie',
    search: 'Szukaj gatunku…', all: 'Wszystkie',
    count: (n: number) => `${n} ${plural(n, 'gatunek', 'gatunki', 'gatunków')}`,
    noResults: 'Nic nie znaleziono',
    season: 'Sezon', look: 'Wygląd i siedlisko', recipesWith: 'Przepisy z tym grzybem', more: 'Więcej o gatunku',
    wiki: 'Wikipedia', commons: 'Zdjęcia – Wikimedia Commons', inat: 'Obserwacje – iNaturalist', noPhoto: 'Brak zdjęcia',
    warn: 'Aplikacja jest tylko informacyjna. Nigdy nie jedz grzyba wyłącznie na jej podstawie – zapytaj grzyboznawcę (sanepid).',
    recipesTitle: 'Przepisy', recipesSub: 'Kuchnia z grzybów z atlasu',
    min: (n: number) => `${n} min`, serves: (n: number) => `${n} ${plural(n, 'porcja', 'porcje', 'porcji')}`,
    mushrooms: 'Grzyby', ingredients: 'Składniki', steps: 'Przygotowanie', tip: 'Wskazówka',
    cookSafety: 'Gotuj tylko grzyby, których jesteś pewien, i zawsze obrabiaj je termicznie.',
    albumTitle: 'Moje zdjęcia', albumSub: (n: number) => n ? `${n} ${plural(n, 'zdjęcie', 'zdjęcia', 'zdjęć')} z grzybobrań` : 'Twoje znaleziska z lasu',
    camera: 'Aparat', gallery: 'Galeria',
    albumEmpty: 'Nie masz jeszcze zdjęć. Zrób zdjęcie na grzybobraniu – zostanie zapisane tutaj, możesz je opisać, przypisać do gatunku i wysłać do skanera.',
    note: 'Notatka: miejsce, pogoda, co zauważyłeś…', assign: 'Przypisz gatunek', change: 'Zmień', unassigned: 'Bez gatunku',
    scanIt: 'Skanuj', share: 'Udostępnij', del: 'Usuń',
    delQ: 'Usunąć to zdjęcie?', delMsg: 'Zdjęcie zniknie z albumu w aplikacji.', cancel: 'Anuluj',
    noPermission: 'Brak dostępu do aparatu lub zdjęć. Włącz go w ustawieniach telefonu.',
    scanSub: 'Rozpoznaj grzyba ze zdjęcia', fromAlbum: 'Album', saveToAlbum: 'Zapisz zdjęcia w albumie', saved: 'Zapisano w albumie',
    emptyAlbumPick: 'Album jest pusty.',
  },
  en: {
    brand: 'Mycelium',
    tabs: { atlas: 'Atlas', map: 'Map', game: 'Game', scan: 'Scanner', recipes: 'Recipes', album: 'Photos' },
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthLetters: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    label: { e: 'Edible', c: 'Conditional', i: 'Inedible', t: 'Poisonous', d: 'Deadly' },
    desc: {
      e: 'Edible. Only pick specimens you identify with certainty.',
      c: 'Edible only after proper preparation (e.g. long cooking). Harmful raw or badly prepared.',
      i: 'Inedible: tough, bitter or of no culinary value.',
      t: 'Poisonous. Causes food poisoning or other symptoms.',
      d: 'DEADLY. Do not eat, and never mix into a basket with edible species.',
    },
    kicker: 'In the forest now',
    heroStats: (n: number, e: number, d: number) => `${n} species in season · ${e} edible · ${d} poisonous`,
    inSeason: 'In season',
    search: 'Search species…', all: 'All',
    count: (n: number) => `${n} species`,
    noResults: 'Nothing found',
    season: 'Season', look: 'Appearance and habitat', recipesWith: 'Recipes with this mushroom', more: 'More about this species',
    wiki: 'Wikipedia', commons: 'Photos – Wikimedia Commons', inat: 'Observations – iNaturalist', noPhoto: 'No photo',
    warn: 'This app is informational only. Never eat a mushroom based on an app alone – ask a certified mycologist.',
    recipesTitle: 'Recipes', recipesSub: 'Cooking with mushrooms from the atlas',
    min: (n: number) => `${n} min`, serves: (n: number) => `${n} servings`,
    mushrooms: 'Mushrooms', ingredients: 'Ingredients', steps: 'Method', tip: 'Tip',
    cookSafety: 'Only cook mushrooms you are certain of, and always cook them thoroughly.',
    albumTitle: 'My photos', albumSub: (n: number) => n ? `${n} photo${n === 1 ? '' : 's'} from your forays` : 'Your finds from the forest',
    camera: 'Camera', gallery: 'Gallery',
    albumEmpty: 'No photos yet. Take a photo on your next foray – it will be saved here, and you can add notes, link a species and send it to the scanner.',
    note: 'Note: place, weather, what you noticed…', assign: 'Link a species', change: 'Change', unassigned: 'No species',
    scanIt: 'Scan', share: 'Share', del: 'Delete',
    delQ: 'Delete this photo?', delMsg: 'The photo will be removed from the in-app album.', cancel: 'Cancel',
    noPermission: 'No access to the camera or photos. Enable it in your phone settings.',
    scanSub: 'Identify a mushroom from a photo', fromAlbum: 'Album', saveToAlbum: 'Save photos to album', saved: 'Saved to album',
    emptyAlbumPick: 'The album is empty.',
  },
};
export type Strings = typeof L.pl;
