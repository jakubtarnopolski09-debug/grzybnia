import { File, Paths } from 'expo-file-system';
import { type LatLng } from '@/lib/geo';
import { readJson, writeJson } from '@/lib/storage';

// Własne miejscówki (pinezki dodane długim przytrzymaniem mapy) i zapis wycieczki (ślad GPS + punkt startu).
// Wszystko zostaje tylko w telefonie.

export type Spot = { id: string; name: string; note: string; lat: number; lng: number; date: string };
export type Trip = { start: LatLng; startedAt: number; track: LatLng[] };

const spotsFile = () => new File(Paths.document, 'spots.json');
const tripFile = () => new File(Paths.document, 'trip.json');

export const loadSpots = () => readJson<Spot[]>(spotsFile(), []);
export const saveSpots = (spots: Spot[]) => writeJson(spotsFile(), spots);

export const loadTrip = () => readJson<Trip | null>(tripFile(), null);
export const saveTrip = (trip: Trip | null) => {
  if (trip) { writeJson(tripFile(), trip); return; }
  try { const f = tripFile(); if (f.exists) f.delete(); } catch (e) { console.log('[wycieczka] usuwanie', e); }
};

export const newSpotId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
