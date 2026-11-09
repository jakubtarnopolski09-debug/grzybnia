import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from 'react-native-svg';
import { Tap } from '@/components/common';
import { useApp } from '@/context/app-context';
import { SEASON } from '@/data/mushrooms';
import { MushroomArt } from '@/game/art';
import { byKey, RARITY } from '@/game/data';
import { CATCH_RADIUS, RADAR_RADIUS, type Spawn, spawnsAround, type Stop as Feeder, STOP_RADIUS, stopsAround, xpForLevel } from '@/game/logic';
import { campBeaten, level, searchStop, stopReady, useGame } from '@/game/state';
import { GT } from '@/game/strings';
import { type Camp, BattleModal, type Rescue } from '@/game/ui/BattleModal';
import { BoxView } from '@/game/ui/BoxView';
import { CatchModal } from '@/game/ui/CatchModal';
import { DexView } from '@/game/ui/DexView';
import { BasketIcon, Bar } from '@/game/ui/parts';
import { distance, formatDistance } from '@/lib/geo';

// GRZYBOBRANIE – ekran gry: radar wokół gracza (grzyby, paśniki, obozy Zespołu G), Grzybodex i kolekcja.

type View_ = 'radar' | 'dex' | 'box';
const month = () => new Date().getMonth() + 1;
const inSeason = (latin: string) => !!SEASON.get(latin)?.has(month());

/** `fixedPosition` – stała pozycja zamiast GPS (podgląd/testy); w aplikacji zawsze GPS. */
export function GameScreen({ header, active, fixedPosition }: { header: any; active: boolean; fixedPosition?: { lat: number; lng: number } }) {
  const { c, s, lang } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const { width } = useWindowDimensions();
  const [view, setView] = useState<View_>('radar');
  const [gps, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsPerm, setPerm] = useState<'?' | 'ok' | 'no'>('?');
  const me = fixedPosition ?? gps;
  const perm = fixedPosition ? 'ok' : gpsPerm;
  const [now, setNow] = useState(() => Date.now());
  const [toast, setToast] = useState('');
  const [catching, setCatching] = useState<Pick<Spawn, 'id' | 'key' | 'lvl' | 'iv'> | null>(null);
  const [camp, setCamp] = useState<Camp | null>(null);
  const [sweep] = useState(() => new Animated.Value(0));
  const [permTry, setPermTry] = useState(0);

  // lokalizacja – tylko gdy zakładka gry jest otwarta
  useEffect(() => {
    if (!active) return;
    if (fixedPosition) return;
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const p = await Location.requestForegroundPermissionsAsync();
      if (!p.granted) { setPerm('no'); return; }
      setPerm('ok');
      const w = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 },
        (pos) => setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      );
      if (cancelled) w.remove(); else sub = w;
    })().catch((e) => console.log('[gra] lokalizacja', e));
    return () => { cancelled = true; sub?.remove(); };
  }, [active, permTry, fixedPosition]);

  // zegar: nowe grzyby co 15 min, odnawianie paśników
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(Animated.timing(sweep, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [active, sweep]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const lvl = level(g);
  // pozycję zaokrąglamy do ~2 m, żeby drobny szum GPS nie przeliczał wszystkiego
  const meKey = me ? `${me.lat.toFixed(5)},${me.lng.toFixed(5)}` : '';
  const bucket = Math.floor(now / 60_000);
  const spawns = useMemo(
    () => (me ? spawnsAround(me.lat, me.lng, now, lvl, inSeason) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- przeliczamy przy ruchu (meKey) i co minutę
    [meKey, bucket, lvl],
  ).filter((sp) => !g.done[sp.id]);
  const stops = useMemo(
    () => (me ? stopsAround(me.lat, me.lng, now) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meKey, bucket],
  );

  const D = Math.min(Math.max(width, 320) - 32, 380); // max(): na webie przy SSR szerokość bywa 0
  const half = D / 2;
  const toXY = (p: { lat: number; lng: number }) => {
    if (!me) return null;
    const dx = (p.lng - me.lng) * 111_320 * Math.cos((me.lat * Math.PI) / 180);
    const dy = (p.lat - me.lat) * 111_320;
    if (Math.hypot(dx, dy) > RADAR_RADIUS) return null;
    return { x: half + (dx / RADAR_RADIUS) * half, y: half - (dy / RADAR_RADIUS) * half };
  };

  const tapSpawn = (sp: Spawn) => {
    const d = distance(me!, sp);
    if (d > CATCH_RADIUS) { setToast(gt.tooFar(formatDistance(d, lang))); return; }
    setCatching(sp);
  };
  const tapStop = (st: Feeder) => {
    const d = distance(me!, st);
    if (d > STOP_RADIUS) { setToast(gt.tooFar(formatDistance(d, lang))); return; }
    if (st.team) {
      if (campBeaten(g, st.id)) { setToast(gt.campBeaten); return; }
      setCamp({ id: st.id, kind: st.team });
      return;
    }
    const loot = searchStop(st.id);
    if (!loot) { setToast(gt.stopEmpty); return; }
    const parts = [loot.b1 && `${loot.b1}× ${lang === 'pl' ? 'koszyk' : 'basket'}`, loot.b2 && `${loot.b2}× ${lang === 'pl' ? 'wiklinowy' : 'wicker'}`, loot.b3 && `${loot.b3}× ${lang === 'pl' ? 'złoty' : 'golden'}`, loot.seeds && `${loot.seeds} ${gt.seeds.toLowerCase()}`].filter(Boolean);
    setToast(`${gt.stopGot} ${parts.join(', ')}`);
  };

  const onRescue = (r: Rescue) => { setCamp(null); setTimeout(() => setCatching(r), 400); };

  if (view === 'dex') return <View style={s.flex}>{header}<DexView onBack={() => setView('radar')} /></View>;
  if (view === 'box') return <View style={s.flex}>{header}<BoxView onBack={() => setView('radar')} /></View>;

  const xpNow = g.xp - xpForLevel(lvl);
  const xpNeed = xpForLevel(lvl + 1) - xpForLevel(lvl);

  return (
    <View style={s.flex}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        {header}
        {/* gracz: poziom, XP, przedmioty */}
        <View style={{ paddingHorizontal: 16, paddingTop: 4, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.amber, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '900', fontSize: 18, color: c.onAmber }}>{lvl}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[s.h1, { fontSize: 24 }]}>{gt.title}</Text>
              <Bar value={xpNow} max={xpNeed} color={c.fern} />
              <Text style={{ fontSize: 11, color: c.muted }}>{gt.lvl(lvl)} · {gt.xp(xpNow, xpNeed)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {(['b1', 'b2', 'b3'] as const).map((b) => (
              <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: c.card, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: c.line }}>
                <BasketIcon kind={b} size={22} /><Text style={{ color: c.ink, fontWeight: '700' }}>{g[b]}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: c.card, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: c.line }}>
              <Ionicons name="leaf" size={15} color={c.fern} /><Text style={{ color: c.ink, fontWeight: '700' }}>{g.seeds}</Text>
            </View>
          </View>
        </View>

        {/* radar */}
        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <View style={{ width: D, height: D, borderRadius: half, overflow: 'hidden', backgroundColor: c.forest }}>
            <Svg width={D} height={D} style={{ position: 'absolute' }}>
              <Defs>
                <RadialGradient id="radarBg" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor={c.hill2} />
                  <Stop offset="1" stopColor={c.forest} />
                </RadialGradient>
              </Defs>
              <Circle cx={half} cy={half} r={half} fill="url(#radarBg)" />
              {[0.33, 0.66].map((f) => <Circle key={f} cx={half} cy={half} r={half * f} stroke="#ffffff22" strokeWidth={1} fill="none" />)}
              <Circle cx={half} cy={half} r={(CATCH_RADIUS / RADAR_RADIUS) * half} stroke={c.amber} strokeWidth={2} strokeDasharray="6 6" fill={c.amber} fillOpacity={0.08} />
              <Line x1={half} y1={6} x2={half} y2={D - 6} stroke="#ffffff14" />
              <Line x1={6} y1={half} x2={D - 6} y2={half} stroke="#ffffff14" />
            </Svg>
            <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: D, height: D, transform: [{ rotate: sweep.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
              <View style={{ position: 'absolute', left: half, top: 0, width: 2, height: half, backgroundColor: '#ffffff30' }} />
            </Animated.View>
            <Text style={{ position: 'absolute', top: 6, left: half - 4, color: '#ffffffaa', fontSize: 11, fontWeight: '700' }}>N</Text>

            {stops.map((st) => {
              const p = toXY(st);
              if (!p) return null;
              const ready = st.team ? !campBeaten(g, st.id) : stopReady(g, st.id, now);
              const col = st.team === 'leader' ? '#7A1414' : st.team ? c.status.d : ready ? c.amber : '#8B897C';
              return (
                <Pressable key={st.id} onPress={() => tapStop(st)} hitSlop={8} style={{ position: 'absolute', left: p.x - 16, top: p.y - 16, width: 32, height: 32, borderRadius: 16, backgroundColor: col, borderWidth: 2.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', opacity: ready ? 1 : 0.6 }}>
                  {st.team ? <Text style={{ color: '#fff', fontWeight: '900' }}>G</Text> : <Ionicons name="basket" size={16} color="#fff" />}
                </Pressable>
              );
            })}
            {spawns.map((sp) => {
              const p = toXY(sp);
              if (!p) return null;
              const shroom = byKey(sp.key);
              const near = distance(me!, sp) <= CATCH_RADIUS;
              const sz = near ? 50 : 38;
              return (
                <Pressable key={sp.id} onPress={() => tapSpawn(sp)} hitSlop={6} style={{ position: 'absolute', left: p.x - sz / 2, top: p.y - sz * 0.8, opacity: near ? 1 : 0.75 }}>
                  <MushroomArt art={shroom.art} stage={shroom.stage} size={sz} glow={shroom.rarity >= 3 ? RARITY[shroom.rarity].color : undefined} />
                </Pressable>
              );
            })}
            {/* gracz */}
            <View pointerEvents="none" style={{ position: 'absolute', left: half - 9, top: half - 9, width: 18, height: 18, borderRadius: 9, backgroundColor: '#2E7CF6', borderWidth: 3, borderColor: '#fff' }} />

            {perm !== 'ok' || !me ? (
              <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: '#0007' }}>
                <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 10 }}>{perm === 'no' ? gt.noLoc : gt.waitGps}</Text>
                {perm === 'no' && (
                  <Tap onPress={() => setPermTry((n) => n + 1)} style={[s.primaryBtn, { paddingVertical: 10 }]}><Text style={s.primaryBtnText}>{gt.allow}</Text></Tap>
                )}
              </View>
            ) : null}
          </View>
          <Text style={[s.subtle, { fontSize: 12, textAlign: 'center', paddingHorizontal: 24, marginTop: 8 }]}>{gt.radarHint(CATCH_RADIUS)}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 14 }}>
          <Tap outer={s.flex} onPress={() => setView('dex')} style={s.primaryBtn}>
            <Ionicons name="book" size={18} color={c.onAmber} />
            <Text style={s.primaryBtnText}>{gt.dex}</Text>
          </Tap>
          <Tap outer={s.flex} onPress={() => setView('box')} style={s.secondaryBtn}>
            <Ionicons name="albums" size={18} color={c.ink} />
            <Text style={s.secondaryBtnText}>{gt.box} ({g.box.length})</Text>
          </Tap>
        </View>
        <Text style={[s.subtle, { fontSize: 11, textAlign: 'center', paddingHorizontal: 24, marginTop: 12 }]}>{gt.disclaimer}</Text>
      </ScrollView>

      {!!toast && (
        <View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, bottom: 110, backgroundColor: 'rgba(20,24,20,0.9)', borderRadius: 14, padding: 12 }}>
          <Text style={{ color: '#fff', fontSize: 13.5, textAlign: 'center' }}>{toast}</Text>
        </View>
      )}

      <CatchModal spawn={catching} onClose={() => setCatching(null)} />
      <BattleModal camp={camp} onClose={() => setCamp(null)} onRescue={onRescue} />
    </View>
  );
}
