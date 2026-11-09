import { createContext, useContext } from 'react';
import { type Mushroom } from '@/data/mushrooms';
import { type Theme } from '@/constants/palette';
import { type Lang, type Strings } from '@/i18n/strings';
import { type AlbumItem } from '@/lib/storage';
import { type Recipe } from '@/data/recipes';
import { type Forest } from '@/data/forests';
import { type Styles } from '@/styles/make-styles';

// Wspólny stan aplikacji

export type Tab = 'atlas' | 'map' | 'game' | 'scan' | 'recipes' | 'album';
export type Sheet = { kind: 'species'; m: Mushroom } | { kind: 'recipe'; r: Recipe } | { kind: 'photo'; id: string } | { kind: 'forest'; f: Forest } | { kind: 'forests' };
export type App = {
  c: Theme; s: Styles; lang: Lang; t: Strings;
  photoOf: (latin: string) => string | null | undefined;
  open: (sheet: Sheet) => void; back: () => void;
  album: AlbumItem[];
  addToAlbum: (uris: string[], latin?: string, withLocation?: boolean) => void;
  showOnMap: (lat: number, lng: number, zoom?: number) => void;
  updateAlbum: (id: string, patch: Partial<AlbumItem>) => void;
  removeFromAlbum: (id: string) => void;
  sendToScanner: (item: AlbumItem) => void;
  scanSeed: { item: AlbumItem; n: number } | null;
};
export const AppCtx = createContext<App | null>(null);
export const useApp = () => useContext(AppCtx)!;
