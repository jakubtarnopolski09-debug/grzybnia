import { Directory, File, Paths } from 'expo-file-system';
import { type ThemeMode } from '@/constants/palette';
import { type Lang } from '@/i18n/strings';

// Zapis w telefonie: album zdjęć i ustawienia (expo-file-system)

export type AlbumItem = { id: string; name: string; date: string; note: string; latin?: string; lat?: number; lng?: number };
export type Settings = { lang: Lang; theme: ThemeMode };

// folder albumu sprawdzamy na dysku tylko raz – albumUri() jest wołane przy każdej miniaturze
let albumDirCache: Directory | null = null;
export function albumDir() {
  if (albumDirCache) return albumDirCache;
  const dir = new Directory(Paths.document, 'album');
  if (!dir.exists) dir.create();
  albumDirCache = dir;
  return dir;
}
const uriByName = new Map<string, string>();
export const albumUri = (item: AlbumItem) => {
  let uri = uriByName.get(item.name);
  if (!uri) { uri = new File(albumDir(), item.name).uri; uriByName.set(item.name, uri); }
  return uri;
};
export const albumIndexFile = () => new File(Paths.document, 'album.json');
export const settingsFile = () => new File(Paths.document, 'settings.json');

export function readJson<T>(file: File, fallback: T): T {
  try {
    return file.exists ? (JSON.parse(file.textSync()) as T) : fallback;
  } catch (e) {
    console.log('[zapis] odczyt', e);
    return fallback;
  }
}
export function writeJson(file: File, value: unknown) {
  try {
    if (!file.exists) file.create();
    file.write(JSON.stringify(value));
  } catch (e) {
    console.log('[zapis] zapis', e);
  }
}
export function copyIntoAlbum(sourceUri: string): AlbumItem {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const ext = (sourceUri.split('?')[0].split('.').pop() ?? '').toLowerCase();
  const name = `${id}.${['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'}`;
  new File(sourceUri).copy(new File(albumDir(), name));
  return { id, name, date: new Date().toISOString(), note: '' };
}
export const mimeOf = (uri: string) => {
  const u = uri.toLowerCase();
  return u.endsWith('.png') ? 'image/png' : u.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
};
