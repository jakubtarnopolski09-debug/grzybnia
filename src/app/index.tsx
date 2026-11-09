import { File } from 'expo-file-system';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Animated, Easing, Modal, StatusBar, useColorScheme, View } from 'react-native';
import { MUSHROOMS } from '@/data/mushrooms';
import { DARK, LIGHT } from '@/constants/palette';
import { L } from '@/i18n/strings';
import { albumDir, albumIndexFile, type AlbumItem, copyIntoAlbum, readJson, type Settings, settingsFile, writeJson } from '@/lib/storage';
import { type App, AppCtx, type Sheet, type Tab } from '@/context/app-context';
import { cachedPhotos, loadAllPhotos, type Photos } from '@/lib/photos';
import { TabBar, TABS, TopBar } from '@/components/common';
import { AtlasScreen } from '@/screens/atlas';
import { RecipesScreen } from '@/screens/recipes';
import { AlbumScreen } from '@/screens/album';
import { MapScreen } from '@/screens/map';
import { ScannerScreen } from '@/screens/scanner';
import { sheetKey, SheetView } from '@/screens/sheet-view';
import { STYLES_DARK, STYLES_LIGHT } from '@/styles/make-styles';

// Grzybnia – atlas grzybów, mapa, skaner, przepisy i album zdjęć.
// Główny komponent: stan aplikacji, zakładki i arkusze. Reszta kodu:
//   src/data/      – baza: gatunki, przepisy, lasy
//   src/lib/       – logika: zapis, zdjęcia, skaner (Claude API), mapa
//   src/screens/   – ekrany i arkusze
//   src/components – wspólne elementy UI
//   src/styles, src/constants/palette.ts, src/i18n – wygląd i teksty

export default function GrzybniaApp() {
  const system = useColorScheme();
  const [settings, setSettings] = useState<Settings>(() => ({ lang: 'pl', theme: 'system', ...readJson<Partial<Settings>>(settingsFile(), {}) }));
  const saveSettings = (patch: Partial<Settings>) =>
    setSettings((cur) => { const next = { ...cur, ...patch }; writeJson(settingsFile(), next); return next; });
  const dark = settings.theme === 'system' ? system === 'dark' : settings.theme === 'dark';
  const c = dark ? DARK : LIGHT;
  const s = dark ? STYLES_DARK : STYLES_LIGHT;
  const lang = settings.lang;

  // zdjęcia gatunków
  // zapisane adresy pokazujemy od razu, a sieć odpytujemy tylko o nowe gatunki lub po 30 dniach
  const [initialPhotos] = useState(cachedPhotos);
  const [photos, setPhotos] = useState<Photos>(initialPhotos.photos);
  const [photosDone, setPhotosDone] = useState(initialPhotos.fresh);
  useEffect(() => {
    let alive = true;
    loadAllPhotos(MUSHROOMS.map((m) => m.latin), (p) => alive && setPhotos(p))
      .finally(() => alive && setPhotosDone(true));
    return () => { alive = false; };
  }, []);
  const photoOf = (latin: string) => photos[latin] ?? (photosDone ? null : undefined);

  // album
  const [album, setAlbum] = useState<AlbumItem[]>(() => readJson<AlbumItem[]>(albumIndexFile(), []));
  const commitAlbum = (fn: (cur: AlbumItem[]) => AlbumItem[]) =>
    setAlbum((cur) => { const next = fn(cur); writeJson(albumIndexFile(), next); return next; });
  const addToAlbum = (uris: string[], latin?: string, withLocation?: boolean) => {
    const items: AlbumItem[] = [];
    for (const uri of uris) {
      try {
        const it = copyIntoAlbum(uri);
        items.push(latin ? { ...it, latin } : it);
      } catch (e) {
        console.log('[album] kopiowanie', e);
      }
    }
    if (!items.length) return;
    commitAlbum((cur) => [...items, ...cur]);
    if (withLocation) {
      // zapisz, gdzie zrobiono zdjęcie – potem widać je na mapie jako „Moje”
      (async () => {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (!perm.granted) return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
          .catch(() => Location.getLastKnownPositionAsync());
        if (!pos) return;
        const ids = items.map((i) => i.id);
        commitAlbum((cur) => cur.map((a) => (ids.includes(a.id) ? { ...a, lat: pos.coords.latitude, lng: pos.coords.longitude } : a)));
      })().catch((e) => console.log('[album] lokalizacja', e));
    }
  };
  const updateAlbum = (id: string, patch: Partial<AlbumItem>) => commitAlbum((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const removeFromAlbum = (id: string) => {
    const it = album.find((a) => a.id === id);
    if (it) { try { new File(albumDir(), it.name).delete(); } catch (e) { console.log('[album] usuwanie', e); } }
    commitAlbum((cur) => cur.filter((a) => a.id !== id));
  };

  // nawigacja
  const [tab, setTab] = useState<Tab>('atlas');
  // zakładka (zwłaszcza mapa z WebView) powstaje dopiero przy pierwszym otwarciu, potem zostaje w pamięci
  const [visited, setVisited] = useState<ReadonlySet<Tab>>(() => new Set<Tab>(['atlas']));
  const fade = useState(() => new Animated.Value(1))[0];
  const switchTab = (k: Tab) => {
    if (k === tab) return;
    setTab(k);
    setVisited((cur) => (cur.has(k) ? cur : new Set(cur).add(k)));
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };
  const [stack, setStack] = useState<Sheet[]>([]);
  const open = (sheet: Sheet) => setStack((cur) => [...cur, sheet]);
  const back = () => setStack((cur) => cur.slice(0, -1));
  const [scanSeed, setScanSeed] = useState<{ item: AlbumItem; n: number } | null>(null);
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom: number; n: number } | null>(null);
  const showOnMap = (lat: number, lng: number, zoom = 12) => {
    setMapFocus({ lat, lng, zoom, n: Date.now() });
    setStack([]);
    switchTab('map');
  };
  const sendToScanner = (item: AlbumItem) => {
    setScanSeed({ item, n: Date.now() });
    setStack([]);
    switchTab('scan');
  };

  const ctx: App = {
    c, s, lang, t: L[lang], photoOf, open, back,
    album, addToAlbum, updateAlbum, removeFromAlbum, sendToScanner, scanSeed, showOnMap,
  };
  const header = <TopBar setLang={(l) => saveSettings({ lang: l })} toggleTheme={() => saveSettings({ theme: dark ? 'light' : 'dark' })} />;
  const top = stack[stack.length - 1];

  return (
    <AppCtx.Provider value={ctx}>
      <View style={s.root}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        {TABS.filter((k) => visited.has(k)).map((k) => (
          <Animated.View
            key={k}
            style={[s.flex, { display: tab === k ? 'flex' : 'none' }, tab === k && {
              opacity: fade,
              transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            }]}
          >
            {k === 'atlas' && <AtlasScreen header={header} />}
            {k === 'map' && <MapScreen active={tab === 'map'} focus={mapFocus} />}
            {k === 'scan' && <ScannerScreen header={header} />}
            {k === 'recipes' && <RecipesScreen header={header} />}
            {k === 'album' && <AlbumScreen header={header} />}
          </Animated.View>
        ))}
        <TabBar tab={tab} setTab={switchTab} />

        <Modal visible={stack.length > 0} animationType="slide" onRequestClose={back} statusBarTranslucent>
          {top && <SheetView key={`${stack.length}-${sheetKey(top)}`} sheet={top} />}
        </Modal>
      </View>
    </AppCtx.Provider>
  );
}
