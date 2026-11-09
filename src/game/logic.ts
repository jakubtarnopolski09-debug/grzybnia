import {
  byKey, CHARGED_COST, CHARGED_POWER, effectiveness, FAST_ENERGY, FAST_POWER, type GameShroom, RARITY, type Rarity, SHROOMS,
} from '@/game/data';

// Logika gry bez UI: losowanie (powtarzalne), spawny wokół GPS, CP, łapanie, ulepszanie, ewolucje, poziom, walki.

// ---------- losowanie powtarzalne (to samo miejsce + ten sam czas = te same grzyby) ----------
export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, list: T[], weight: (x: T) => number): T => {
  const total = list.reduce((s, x) => s + weight(x), 0);
  let v = r() * total;
  for (const x of list) { v -= weight(x); if (v <= 0) return x; }
  return list[list.length - 1];
};

// ---------- grzyby gracza ----------
export type IV = { a: number; d: number; h: number };
export type Inst = { uid: number; key: string; lvl: number; iv: IV; at: number; fav?: boolean };

export const MAX_LEVEL = 40;
export const cpm = (lvl: number) => 0.094 + (Math.min(MAX_LEVEL, Math.max(1, lvl)) - 1) * 0.0208;
export function stats(key: string, lvl: number, iv: IV) {
  const s = byKey(key);
  const m = cpm(lvl);
  return { a: (s.base.a + iv.a) * m, d: (s.base.d + iv.d) * m, h: (s.base.h + iv.h) * m };
}
export function cp(key: string, lvl: number, iv: IV): number {
  const { a, d, h } = stats(key, lvl, iv);
  return Math.max(10, Math.floor((a * Math.sqrt(d) * Math.sqrt(h)) / 10));
}
// zdrowie w walce prawie nie rośnie z poziomem – o sile decyduje stosunek ataku do obrony, a walka zostaje krótka
export const maxHp = (key: string, lvl: number, iv: IV) => Math.floor(30 + (byKey(key).base.h + iv.h) * 0.22 + lvl * 0.5);
export const ivPercent = (iv: IV) => Math.round(((iv.a + iv.d + iv.h) / 45) * 100);

// ---------- poziom gracza ----------
export const MAX_TRAINER = 30;
export const xpForLevel = (n: number) => 250 * (n - 1) * n; // łączne XP potrzebne do poziomu n
export function trainerLevel(xp: number) {
  let n = 1;
  while (n < MAX_TRAINER && xp >= xpForLevel(n + 1)) n++;
  return n;
}
export const XP = { catch: 100, newSpecies: 400, nice: 10, great: 30, perfect: 60, stop: 50, evolve: 500, gWin: 300, gLeader: 800 };

// ---------- przedmioty ----------
export type Basket = 'b1' | 'b2' | 'b3';
export const BASKETS: Record<Basket, { pl: string; en: string; mult: number; color: string; rim: string }> = {
  b1: { pl: 'Koszyk', en: 'Basket', mult: 1, color: '#B07A43', rim: '#8A5A2E' },
  b2: { pl: 'Koszyk wiklinowy', en: 'Wicker basket', mult: 1.5, color: '#C9A15A', rim: '#7A5A2A' },
  b3: { pl: 'Złoty koszyk', en: 'Golden basket', mult: 2.5, color: '#F2C230', rim: '#B8860B' },
};

// ---------- spawny wokół gracza ----------
export const CELL_M = 70; // rozmiar komórki siatki w metrach
export const SPAWN_MINUTES = 15; // co tyle minut w komórce pojawiają się nowe grzyby
export const CATCH_RADIUS = 60; // m – z jakiej odległości można łapać
export const STOP_RADIUS = 60; // m – z jakiej odległości można przeszukać paśnik
export const RADAR_RADIUS = 180; // m – co pokazuje radar
export const STOP_COOLDOWN = 5 * 60_000;

export type Spawn = { id: string; key: string; lat: number; lng: number; lvl: number; iv: IV; until: number };
export type Stop = { id: string; lat: number; lng: number; team: null | 'grunt' | 'leader' };

const cellOf = (lat: number, lng: number) => {
  const dLat = CELL_M / 111_320;
  const dLng = CELL_M / (111_320 * Math.cos((lat * Math.PI) / 180));
  return { i: Math.floor(lat / dLat), j: Math.floor(lng / dLng), dLat, dLng };
};

const wildPool = SHROOMS;
/** Grzyby w komórkach wokół gracza – deterministycznie z (komórka, okno czasu). */
export function spawnsAround(lat: number, lng: number, now: number, trainerLvl: number, inSeason: (latin: string) => boolean): Spawn[] {
  const { i, j, dLat, dLng } = cellOf(lat, lng);
  const bucket = Math.floor(now / (SPAWN_MINUTES * 60_000));
  const until = (bucket + 1) * SPAWN_MINUTES * 60_000;
  const maxLvl = Math.min(30, trainerLvl + 3);
  const out: Spawn[] = [];
  for (let di = -3; di <= 3; di++) {
    for (let dj = -3; dj <= 3; dj++) {
      const ci = i + di;
      const cj = j + dj;
      const r = rng(hash(`s:${ci}:${cj}:${bucket}`));
      const roll = r();
      const n = roll < 0.22 ? 0 : roll < 0.62 ? 1 : roll < 0.9 ? 2 : 3;
      for (let k = 0; k < n; k++) {
        const s = pick(r, wildPool, (x) => RARITY[x.rarity].weight * (x.stage > 1 ? 0.12 : 1) * (inSeason(x.latin) ? 1.8 : 1));
        out.push({
          id: `${ci}:${cj}:${bucket}:${k}`, key: s.key,
          lat: (ci + r()) * dLat, lng: (cj + r()) * dLng,
          lvl: 1 + Math.floor(r() * maxLvl),
          iv: { a: Math.floor(r() * 16), d: Math.floor(r() * 16), h: Math.floor(r() * 16) },
          until,
        });
      }
    }
  }
  return out;
}

/** Paśniki (punkty z koszykami) – stałe miejsca; część co godzinę zajmuje Zespół G. */
export function stopsAround(lat: number, lng: number, now: number): Stop[] {
  const { i, j, dLat, dLng } = cellOf(lat, lng);
  const hour = Math.floor(now / 3_600_000);
  const out: Stop[] = [];
  for (let di = -3; di <= 3; di++) {
    for (let dj = -3; dj <= 3; dj++) {
      const ci = i + di;
      const cj = j + dj;
      const r = rng(hash(`p:${ci}:${cj}`));
      if (r() > 0.24) continue;
      const g = rng(hash(`g:${ci}:${cj}:${hour}`))();
      out.push({
        id: `p:${ci}:${cj}`,
        lat: (ci + 0.25 + r() * 0.5) * dLat, lng: (cj + 0.25 + r() * 0.5) * dLng,
        team: g < 0.05 ? 'leader' : g < 0.24 ? 'grunt' : null,
      });
    }
  }
  return out;
}

export function stopLoot(seed: number) {
  const r = rng(seed);
  const loot = { b1: 0, b2: 0, b3: 0, seeds: 0 };
  const n = 3 + Math.floor(r() * 3);
  for (let k = 0; k < n; k++) {
    const x = r();
    if (x < 0.05) loot.b3++; else if (x < 0.28) loot.b2++; else loot.b1++;
  }
  if (r() < 0.35) loot.seeds = 50;
  return loot;
}

// ---------- łapanie ----------
export type ThrowQ = 'ok' | 'nice' | 'great' | 'perfect';
/** Jakość rzutu z wielkości kręgu w chwili rzutu (1 = duży, 0.2 = najmniejszy). */
export function throwQuality(ring: number): ThrowQ {
  return ring < 0.36 ? 'perfect' : ring < 0.56 ? 'great' : ring < 0.8 ? 'nice' : 'ok';
}
export const THROW_MULT: Record<ThrowQ, number> = { ok: 1, nice: 1.15, great: 1.4, perfect: 1.75 };

export function catchChance(key: string, lvl: number, basket: Basket, q: ThrowQ): number {
  const base = RARITY[byKey(key).rarity].catchRate;
  const lvlFactor = 1.12 - 0.017 * lvl;
  return Math.min(0.96, Math.max(0.02, base * BASKETS[basket].mult * THROW_MULT[q] * lvlFactor));
}
export const fleeChance = (key: string) => RARITY[byKey(key).rarity].flee;
/** Jak szybko kurczy się krąg (ms na cykl) – rzadsze grzyby są trudniejsze. */
export const ringCycleMs = (r: Rarity) => [0, 1700, 1500, 1300, 1100, 950][r];
export const seedsForCatch = (r: Rarity) => [0, 60, 80, 120, 200, 400][r];

// ---------- ulepszanie i ewolucja ----------
export function upgradeCost(lvl: number) {
  return { seeds: 100 + Math.round((lvl * 30) / 10) * 10, spores: lvl < 10 ? 1 : lvl < 20 ? 2 : lvl < 30 ? 3 : 4 };
}
export const maxUpgradeLevel = (trainerLvl: number) => Math.min(MAX_LEVEL, trainerLvl + 5);
export const evolveCost = (s: GameShroom) => (s.stage === 1 ? 25 : 75);

// ---------- walki z Zespołem G ----------
export type Fighter = { key: string; lvl: number; iv: IV; hp: number; maxHp: number; energy: number };
export const fighter = (key: string, lvl: number, iv: IV): Fighter => {
  const h = maxHp(key, lvl, iv);
  return { key, lvl, iv, hp: h, maxHp: h, energy: 0 };
};

export function damage(att: Fighter, def: Fighter, charged: boolean, roll = 1): { dmg: number; eff: number } {
  const A = stats(att.key, att.lvl, att.iv).a;
  const D = stats(def.key, def.lvl, def.iv).d;
  const eff = effectiveness(byKey(att.key).type, byKey(def.key).type);
  const power = charged ? CHARGED_POWER : FAST_POWER;
  return { dmg: Math.max(1, Math.floor(0.5 * power * (A / D) * eff * 1.8 * roll) + 1), eff };
}
export { CHARGED_COST, FAST_ENERGY };

/** Poziom, przy którym grzyb ma CP najbliższe celowi. */
export function levelForCp(key: string, iv: IV, target: number) {
  let best = 1;
  for (let l = 1; l <= MAX_LEVEL; l++) if (Math.abs(cp(key, l, iv) - target) < Math.abs(cp(key, best, iv) - target)) best = l;
  return best;
}

/** Drużyna Zespołu G dopasowana do siły gracza (średnie CP jego 3 najlepszych grzybów). */
export function teamG(playerTop3Cp: number, kind: 'grunt' | 'leader', seed: number): Fighter[] {
  const r = rng(seed);
  const target = Math.max(60, playerTop3Cp) * (kind === 'leader' ? 1.02 : 0.88);
  const pool = SHROOMS.filter((s) => s.rarity < 5 && (kind === 'leader' ? s.stage >= 2 || s.rarity >= 3 : true));
  const team: Fighter[] = [];
  for (let k = 0; k < 3; k++) {
    // Zespół G lubi trujące grzyby: 55% szans na typ Toksyna
    const s = r() < 0.55 ? pick(r, pool.filter((x) => x.type === 'toksyna'), () => 1) : pick(r, pool, () => 1);
    const lo = kind === 'leader' ? 9 : 4;
    const iv = { a: lo + Math.floor(r() * (16 - lo)), d: lo + Math.floor(r() * (16 - lo)), h: lo + Math.floor(r() * (16 - lo)) };
    const t = target * (0.92 + r() * 0.16);
    team.push(fighter(s.key, levelForCp(s.key, iv, t), iv));
  }
  return team;
}

export function battleReward(kind: 'grunt' | 'leader', seed: number) {
  const r = rng(seed);
  return kind === 'leader'
    ? { seeds: 900 + Math.floor(r() * 4) * 50, b1: 6, b2: 3, b3: 1 + (r() < 0.4 ? 1 : 0), xp: XP.gLeader }
    : { seeds: 350 + Math.floor(r() * 4) * 50, b1: 4, b2: 1, b3: r() < 0.15 ? 1 : 0, xp: XP.gWin };
}

/** Ruch przeciwnika: specjalny, gdy ma energię (z lekką losowością), inaczej szybki. */
export const enemyUsesCharged = (f: Fighter, roll: number) => f.energy >= CHARGED_COST && roll < 0.75;

export type Battle = {
  mine: Fighter[]; foe: Fighter[]; mi: number; fi: number;
  shields: { me: number; foe: number };
  over: null | 'win' | 'lose';
  turn: number;
};
export type Action = 'fast' | 'charged' | 'shield' | { switch: number };
export type BEvent = { who: 'me' | 'foe'; kind: 'fast' | 'charged' | 'shield' | 'blocked' | 'faint' | 'switch' | 'next'; dmg?: number; eff?: number; key?: string };

export function startBattle(mine: Fighter[], foe: Fighter[], kind: 'grunt' | 'leader'): Battle {
  return { mine, foe, mi: 0, fi: 0, shields: { me: 2, foe: kind === 'leader' ? 2 : 1 }, over: null, turn: 0 };
}

const nextAlive = (list: Fighter[], from: number) => {
  for (let k = 0; k < list.length; k++) { const i = (from + k) % list.length; if (list[i].hp > 0) return i; }
  return -1;
};

/** Jedna tura: najpierw ruch gracza, potem przeciwnika. Zwraca nowy stan i zdarzenia do pokazania. */
export function battleTurn(b0: Battle, action: Action, r: () => number): { b: Battle; ev: BEvent[] } {
  const b: Battle = structuredCloneLite(b0);
  const ev: BEvent[] = [];
  if (b.over) return { b, ev };
  b.turn++;
  let me = b.mine[b.mi];
  let foe = b.foe[b.fi];
  let shieldUp = false;

  // ruch gracza
  if (typeof action === 'object') {
    if (b.mine[action.switch]?.hp > 0 && action.switch !== b.mi) { b.mi = action.switch; me = b.mine[b.mi]; ev.push({ who: 'me', kind: 'switch', key: me.key }); }
  } else if (action === 'shield') {
    shieldUp = b.shields.me > 0;
  } else if (action === 'charged' && me.energy >= CHARGED_COST) {
    me.energy -= CHARGED_COST;
    if (b.shields.foe > 0 && r() < 0.6) { b.shields.foe--; ev.push({ who: 'foe', kind: 'blocked' }); }
    else { const { dmg, eff } = damage(me, foe, true, 0.9 + r() * 0.2); foe.hp = Math.max(0, foe.hp - dmg); ev.push({ who: 'me', kind: 'charged', dmg, eff }); }
  } else {
    const { dmg, eff } = damage(me, foe, false, 0.9 + r() * 0.2);
    foe.hp = Math.max(0, foe.hp - dmg);
    me.energy = Math.min(100, me.energy + FAST_ENERGY);
    ev.push({ who: 'me', kind: 'fast', dmg, eff });
  }
  if (foe.hp <= 0) {
    ev.push({ who: 'foe', kind: 'faint', key: foe.key });
    const n = nextAlive(b.foe, b.fi);
    if (n < 0) { b.over = 'win'; return { b, ev }; }
    b.fi = n; foe = b.foe[n];
    ev.push({ who: 'foe', kind: 'next', key: foe.key });
    return { b, ev }; // nowy przeciwnik wchodzi – nie atakuje w tej turze
  }

  // ruch przeciwnika
  if (enemyUsesCharged(foe, r())) {
    foe.energy -= CHARGED_COST;
    if (shieldUp) { b.shields.me--; ev.push({ who: 'me', kind: 'blocked' }); }
    else { const { dmg, eff } = damage(foe, me, true, 0.9 + r() * 0.2); me.hp = Math.max(0, me.hp - dmg); ev.push({ who: 'foe', kind: 'charged', dmg, eff }); }
  } else {
    const { dmg, eff } = damage(foe, me, false, 0.9 + r() * 0.2);
    me.hp = Math.max(0, me.hp - dmg);
    foe.energy = Math.min(100, foe.energy + FAST_ENERGY);
    ev.push({ who: 'foe', kind: 'fast', dmg, eff });
  }
  if (me.hp <= 0) {
    ev.push({ who: 'me', kind: 'faint', key: me.key });
    const n = nextAlive(b.mine, b.mi);
    if (n < 0) { b.over = 'lose'; return { b, ev }; }
    b.mi = n;
    ev.push({ who: 'me', kind: 'next', key: b.mine[n].key });
  }
  return { b, ev };
}

function structuredCloneLite(b: Battle): Battle {
  return { ...b, mine: b.mine.map((f) => ({ ...f })), foe: b.foe.map((f) => ({ ...f })), shields: { ...b.shields } };
}
