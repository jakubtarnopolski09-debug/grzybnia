import { File, Paths } from 'expo-file-system';
import { useSyncExternalStore } from 'react';
import { byKey, RARITY } from '@/game/data';
import {
  type Basket, cp, evolveCost, hash, type Inst, maxUpgradeLevel, SPAWN_MINUTES, type Spawn, type ThrowQ, seedsForCatch,
  STOP_COOLDOWN, stopLoot, trainerLevel, upgradeCost, XP,
} from '@/game/logic';
import { readJson, writeJson } from '@/lib/storage';

// Stan gry zapisywany w telefonie (game.json) + prosty magazyn z subskrypcją dla Reacta.

export type GameState = {
  v: 1;
  xp: number;
  b1: number; b2: number; b3: number;
  seeds: number;
  spores: Record<string, number>; // zarodniki rodzin
  box: Inst[];
  dex: Record<string, 1 | 2>; // 1 = widziany, 2 = złapany
  done: Record<string, 1>; // spawny już złapane lub uciekłe
  stops: Record<string, number>; // ostatnie przeszukanie paśnika
  gBeaten: Record<string, number>; // pokonane obozy Zespołu G (godzina)
  gWins: number;
  nextUid: number;
};
export const BOX_LIMIT = 300;

const START: GameState = { v: 1, xp: 0, b1: 20, b2: 3, b3: 0, seeds: 300, spores: {}, box: [], dex: {}, done: {}, stops: {}, gBeaten: {}, gWins: 0, nextUid: 1 };
const file = () => new File(Paths.document, 'game.json');

let state: GameState | null = null;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function get(): GameState {
  if (!state) {
    let saved: Partial<GameState> = {};
    try { saved = readJson<Partial<GameState>>(file(), {}); } catch (e) { console.log('[gra] odczyt', e); } // np. web bez systemu plików
    state = { ...START, ...saved };
  }
  return state;
}
function set(next: GameState) {
  state = next;
  listeners.forEach((l) => l());
  if (!saveTimer) saveTimer = setTimeout(() => { saveTimer = null; try { writeJson(file(), state); } catch (e) { console.log('[gra] zapis', e); } }, 600);
}
export function useGame(): GameState {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, get, get);
}
export const gameState = get;

// ---------- akcje ----------
export const level = (g: GameState) => trainerLevel(g.xp);
export const top3Cp = (g: GameState) => {
  const list = g.box.map((m) => cp(m.key, m.lvl, m.iv)).sort((a, b) => b - a).slice(0, 3);
  return list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0;
};

export function markSeen(key: string) {
  const g = get();
  if (g.dex[key]) return;
  set({ ...g, dex: { ...g.dex, [key]: 1 } });
}

/** Zużywa koszyk; false, gdy go brak. */
export function spendBasket(b: Basket): boolean {
  const g = get();
  if (g[b] <= 0) return false;
  set({ ...g, [b]: g[b] - 1 });
  return true;
}

export type CatchReward = { xp: number; seeds: number; spores: number; isNew: boolean; inst: Inst };
export function catchSuccess(sp: Pick<Spawn, 'id' | 'key' | 'lvl' | 'iv'>, q: ThrowQ): CatchReward {
  const g = get();
  const s = byKey(sp.key);
  const isNew = g.dex[sp.key] !== 2;
  const xp = XP.catch + (isNew ? XP.newSpecies : 0) + (q === 'nice' ? XP.nice : q === 'great' ? XP.great : q === 'perfect' ? XP.perfect : 0);
  const seeds = seedsForCatch(s.rarity);
  const spores = RARITY[s.rarity].spores;
  const inst: Inst = { uid: g.nextUid, key: sp.key, lvl: sp.lvl, iv: sp.iv, at: Date.now() };
  set({
    ...g,
    xp: g.xp + xp, seeds: g.seeds + seeds,
    spores: { ...g.spores, [s.fam]: (g.spores[s.fam] ?? 0) + spores },
    box: [inst, ...g.box].slice(0, BOX_LIMIT),
    dex: { ...g.dex, [sp.key]: 2 },
    done: pruneDone({ ...g.done, [sp.id]: 1 }),
    nextUid: g.nextUid + 1,
  });
  return { xp, seeds, spores, isNew, inst };
}
export function markGone(id: string) {
  const g = get();
  set({ ...g, done: pruneDone({ ...g.done, [id]: 1 }) });
}
// zostawiamy tylko wpisy z bieżącego i poprzedniego okna czasu
function pruneDone(done: Record<string, 1>): Record<string, 1> {
  const bucket = Math.floor(Date.now() / (SPAWN_MINUTES * 60_000));
  const out: Record<string, 1> = {};
  for (const id of Object.keys(done)) {
    const b = Number(id.split(':')[2]);
    if (!Number.isFinite(b) || b >= bucket - 1) out[id] = 1;
  }
  return out;
}

export function stopReady(g: GameState, id: string, now = Date.now()) {
  return now - (g.stops[id] ?? 0) >= STOP_COOLDOWN;
}
export function searchStop(id: string) {
  const g = get();
  const now = Date.now();
  if (!stopReady(g, id, now)) return null;
  const loot = stopLoot(hash(id + ':' + Math.floor(now / 60_000)));
  set({ ...g, b1: g.b1 + loot.b1, b2: g.b2 + loot.b2, b3: g.b3 + loot.b3, seeds: g.seeds + loot.seeds, xp: g.xp + XP.stop, stops: { ...g.stops, [id]: now } });
  return loot;
}

export function upgrade(uid: number): 'ok' | 'max' | 'seeds' | 'spores' {
  const g = get();
  const m = g.box.find((x) => x.uid === uid);
  if (!m) return 'max';
  if (m.lvl >= maxUpgradeLevel(level(g))) return 'max';
  const cost = upgradeCost(m.lvl);
  const fam = byKey(m.key).fam;
  if (g.seeds < cost.seeds) return 'seeds';
  if ((g.spores[fam] ?? 0) < cost.spores) return 'spores';
  set({
    ...g, seeds: g.seeds - cost.seeds, spores: { ...g.spores, [fam]: g.spores[fam] - cost.spores },
    box: g.box.map((x) => (x.uid === uid ? { ...x, lvl: x.lvl + 1 } : x)),
  });
  return 'ok';
}

export function evolve(uid: number): string | null {
  const g = get();
  const m = g.box.find((x) => x.uid === uid);
  if (!m) return null;
  const s = byKey(m.key);
  if (!s.evo || (g.spores[s.fam] ?? 0) < evolveCost(s)) return null;
  const isNew = g.dex[s.evo] !== 2;
  set({
    ...g, xp: g.xp + XP.evolve + (isNew ? XP.newSpecies : 0),
    spores: { ...g.spores, [s.fam]: g.spores[s.fam] - evolveCost(s) },
    box: g.box.map((x) => (x.uid === uid ? { ...x, key: s.evo! } : x)),
    dex: { ...g.dex, [s.evo]: 2 },
  });
  return s.evo;
}

export function transfer(uid: number) {
  const g = get();
  const m = g.box.find((x) => x.uid === uid);
  if (!m) return;
  const fam = byKey(m.key).fam;
  set({ ...g, box: g.box.filter((x) => x.uid !== uid), spores: { ...g.spores, [fam]: (g.spores[fam] ?? 0) + 1 } });
}
export function toggleFav(uid: number) {
  const g = get();
  set({ ...g, box: g.box.map((x) => (x.uid === uid ? { ...x, fav: !x.fav } : x)) });
}

export function battleWon(stopId: string, reward: { seeds: number; b1: number; b2: number; b3: number; xp: number }) {
  const g = get();
  set({
    ...g, seeds: g.seeds + reward.seeds, b1: g.b1 + reward.b1, b2: g.b2 + reward.b2, b3: g.b3 + reward.b3, xp: g.xp + reward.xp,
    gWins: g.gWins + 1, gBeaten: { ...g.gBeaten, [stopId]: Math.floor(Date.now() / 3_600_000) },
  });
}
export const campBeaten = (g: GameState, stopId: string) => g.gBeaten[stopId] === Math.floor(Date.now() / 3_600_000);
