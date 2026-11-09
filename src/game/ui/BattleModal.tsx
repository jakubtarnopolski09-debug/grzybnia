import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tap } from '@/components/common';
import { useApp } from '@/context/app-context';
import { MushroomArt } from '@/game/art';
import { byKey, CHARGED_COST, MOVES, TYPES } from '@/game/data';
import {
  type Action, type BEvent, type Battle, battleReward, battleTurn, cp, fighter, type Fighter, hash, type Inst, rng, startBattle, teamG,
} from '@/game/logic';
import { battleWon, top3Cp, useGame } from '@/game/state';
import { GT } from '@/game/strings';
import { BasketIcon, Bar, TypeBadge } from '@/game/ui/parts';

export type Camp = { id: string; kind: 'grunt' | 'leader' };
export type Rescue = { id: string; key: string; lvl: number; iv: Inst['iv'] };

export function BattleModal({ camp, onClose, onRescue }: { camp: Camp | null; onClose: () => void; onRescue: (r: Rescue) => void }) {
  return (
    <Modal visible={!!camp} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {camp && <BattleScene key={camp.id} camp={camp} onClose={onClose} onRescue={onRescue} />}
    </Modal>
  );
}

function BattleScene({ camp, onClose, onRescue }: { camp: Camp; onClose: () => void; onRescue: (r: Rescue) => void }) {
  const { c, s, lang } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const insets = useSafeAreaInsets();
  const [hour] = useState(() => Math.floor(Date.now() / 3_600_000)); // godzina wejścia do walki (stała na czas walki)
  const [foeTeam] = useState(() => teamG(top3Cp(g), camp.kind, hash(`${camp.id}:${hour}`)));
  const byCp = [...g.box].sort((a, b) => cp(b.key, b.lvl, b.iv) - cp(a.key, a.lvl, a.iv));
  const [team, setTeam] = useState<number[]>(() => byCp.slice(0, 3).map((m) => m.uid));
  const [slot, setSlot] = useState(0);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [events, setEvents] = useState<BEvent[]>([]);
  const [reward, setReward] = useState<ReturnType<typeof battleReward> | null>(null);
  const [showBench, setShowBench] = useState(false);
  const [hitMe] = useState(() => new Animated.Value(0));
  const [hitFoe] = useState(() => new Animated.Value(0));

  const name = (key: string) => byKey(key)[lang];
  const bump = (v: Animated.Value) => {
    v.setValue(0);
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 70, useNativeDriver: true }),
      Animated.timing(v, { toValue: -1, duration: 90, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  };

  const start = () => {
    const mine = team.map((uid) => g.box.find((m) => m.uid === uid)).filter(Boolean).map((m) => fighter(m!.key, m!.lvl, m!.iv));
    if (!mine.length) return;
    setBattle(startBattle(mine, foeTeam.map((f) => ({ ...f, hp: f.maxHp, energy: 0 })), camp.kind));
    setEvents([]);
    setReward(null);
  };

  const act = (a: Action) => {
    if (!battle || battle.over) return;
    const { b, ev } = battleTurn(battle, a, Math.random);
    setBattle(b);
    setEvents(ev);
    setShowBench(false);
    if (ev.some((e) => e.who === 'me' && (e.kind === 'fast' || e.kind === 'charged'))) bump(hitFoe);
    if (ev.some((e) => e.who === 'foe' && (e.kind === 'fast' || e.kind === 'charged'))) bump(hitMe);
    if (b.over === 'win') {
      const r = battleReward(camp.kind, hash(`${camp.id}:${hour}:r`));
      battleWon(camp.id, r);
      setReward(r);
    }
  };

  const evText = (e: BEvent) => {
    const effTxt = e.eff && e.eff > 1 ? ` ${gt.superEff}` : e.eff && e.eff < 1 ? ` ${gt.weakEff}` : '';
    const who = e.who === 'me' ? (lang === 'pl' ? 'Ty' : 'You') : 'G';
    if (e.kind === 'fast' || e.kind === 'charged') return `${who}: −${e.dmg} HP${effTxt}`;
    if (e.kind === 'blocked') return gt.blocked;
    if (e.kind === 'faint') return gt.fainted(name(e.key!));
    if (e.kind === 'switch' || e.kind === 'next') return `→ ${name(e.key!)}`;
    return '';
  };

  // ---------- przygotowanie ----------
  if (!battle) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: insets.bottom + 30, gap: 14 }}>
        <StatusBar barStyle={c.dark ? 'light-content' : 'dark-content'} />
        <Pressable onPress={onClose} hitSlop={10} style={{ alignSelf: 'flex-start' }}><Ionicons name="close" size={28} color={c.ink} /></Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: camp.kind === 'leader' ? '#7A1414' : c.status.d, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>G</Text>
          </View>
          <Text style={[s.h1, { flex: 1 }]}>{camp.kind === 'leader' ? gt.leader : gt.grunt}</Text>
        </View>
        <Text style={s.body}>{camp.kind === 'leader' ? gt.gLeaderIntro : gt.gIntro}</Text>
        <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-around' }]}>
          {foeTeam.map((f, i) => (
            <View key={i} style={{ alignItems: 'center', gap: 2 }}>
              <MushroomArt art={byKey(f.key).art} stage={byKey(f.key).stage} size={78} />
              <TypeBadge type={byKey(f.key).type} small />
              <Text style={{ fontSize: 12, color: c.ink, fontWeight: '700' }}>CP {cp(f.key, f.lvl, f.iv)}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.subtle, { fontSize: 12 }]}>{gt.typeHint}</Text>

        {!g.box.length ? <Text style={s.body}>{gt.needShrooms}</Text> : (
          <>
            <Text style={s.sectionLabelIn}>{gt.pickTeam}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[0, 1, 2].map((i) => {
                const m = g.box.find((x) => x.uid === team[i]);
                const sp = m && byKey(m.key);
                return (
                  <Tap key={i} outer={{ flex: 1 }} onPress={() => setSlot(i)} style={[s.card, { alignItems: 'center', padding: 8, borderColor: slot === i ? c.amber : c.line, borderWidth: slot === i ? 2 : 1 }]}>
                    {sp ? <MushroomArt art={sp.art} stage={sp.stage} size={70} /> : <View style={{ height: 70 }} />}
                    <Text style={{ fontSize: 11, color: c.ink }} numberOfLines={1}>{sp ? sp[lang] : '—'}</Text>
                    {m && <Text style={{ fontSize: 11, color: c.muted }}>CP {cp(m.key, m.lvl, m.iv)}</Text>}
                  </Tap>
                );
              })}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {byCp.slice(0, 30).map((m) => {
                const sp = byKey(m.key);
                const used = team.includes(m.uid);
                return (
                  <Tap key={m.uid} onPress={() => setTeam((cur) => { const n = cur.filter((u) => u !== m.uid); n[slot] = m.uid; return n.slice(0, 3); })} style={{ alignItems: 'center', width: 74, opacity: used ? 0.4 : 1 }}>
                    <MushroomArt art={sp.art} stage={sp.stage} size={56} />
                    <TypeBadge type={sp.type} small />
                    <Text style={{ fontSize: 11, color: c.ink }}>{cp(m.key, m.lvl, m.iv)}</Text>
                  </Tap>
                );
              })}
            </ScrollView>
            <Tap onPress={start} style={[s.primaryBtn, { paddingVertical: 16 }]}>
              <Ionicons name="flash" size={18} color={c.onAmber} />
              <Text style={s.primaryBtnText}>{gt.fight}</Text>
            </Tap>
          </>
        )}
      </ScrollView>
    );
  }

  // ---------- walka ----------
  const me = battle.mine[battle.mi];
  const foe = battle.foe[battle.fi];
  const meSp = byKey(me.key);
  const foeSp = byKey(foe.key);
  const charging = foe.energy >= CHARGED_COST && !battle.over;
  const side = (f: Fighter, sp: ReturnType<typeof byKey>, hit: Animated.Value, mine: boolean, team: Fighter[]) => (
    <View style={{ alignItems: mine ? 'flex-start' : 'flex-end', gap: 6 }}>
      <View style={{ width: '62%', backgroundColor: '#0006', borderRadius: 14, padding: 10, gap: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, flex: 1 }} numberOfLines={1}>{sp[lang]}</Text>
          <Text style={{ color: c.cream, fontSize: 12 }}>CP {cp(f.key, f.lvl, f.iv)}</Text>
        </View>
        <Bar value={f.hp} max={f.maxHp} color={f.hp / f.maxHp > 0.5 ? '#5DB57A' : f.hp / f.maxHp > 0.2 ? '#E6B03E' : '#F0525A'} track="#ffffff33" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ flex: 1 }}><Bar value={f.energy} max={CHARGED_COST} color={TYPES[sp.type].color} height={5} track="#ffffff22" /></View>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {team.map((t, i) => <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.hp > 0 ? '#fff' : '#ffffff40' }} />)}
          </View>
        </View>
      </View>
      <Animated.View style={{ alignSelf: mine ? 'flex-start' : 'flex-end', marginHorizontal: 18, transform: [{ translateX: hit.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) }] }}>
        <MushroomArt art={sp.art} stage={sp.stage} size={mine ? 150 : 130} />
      </Animated.View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.forest, paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12) + 6 }}>
      <StatusBar barStyle="light-content" />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', backgroundColor: c.hill1 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Text style={{ color: c.cream, fontWeight: '700' }}>{camp.kind === 'leader' ? gt.leader : gt.grunt}</Text>
        <Pressable onPress={onClose} hitSlop={10}><Ionicons name="close" size={24} color={c.cream} /></Pressable>
      </View>
      <View style={{ paddingHorizontal: 16 }}>{side(foe, foeSp, hitFoe, false, battle.foe)}</View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        {events.map((e, i) => <Text key={i} style={{ color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', textShadowColor: '#0009', textShadowRadius: 4 }}>{evText(e)}</Text>)}
        {charging && <Text style={{ color: '#FFB4A8', fontSize: 14, fontWeight: '800', marginTop: 4 }}>⚠ {gt.foeCharging}</Text>}
      </View>
      <View style={{ paddingHorizontal: 16 }}>{side(me, meSp, hitMe, true, battle.mine)}</View>

      {battle.over ? (
        <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: c.card, borderRadius: 20, padding: 16, gap: 10 }}>
          <Text style={[s.h1, { textAlign: 'center' }]}>{battle.over === 'win' ? gt.win : gt.lose}</Text>
          {battle.over === 'win' && reward ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={s.body}>+{reward.xp} XP</Text>
                <Text style={s.body}>+{reward.seeds} 🌱</Text>
                {(['b1', 'b2', 'b3'] as const).map((b) => reward[b] > 0 && (
                  <View key={b} style={{ flexDirection: 'row', alignItems: 'center' }}><BasketIcon kind={b} size={22} /><Text style={s.body}>×{reward[b]}</Text></View>
                ))}
              </View>
              {camp.kind === 'leader' && (
                <Tap onPress={() => { const f = foeTeam[0]; const r = rng(hash(camp.id + hour)); onRescue({ id: `rescue:${camp.id}:${hour}`, key: f.key, lvl: Math.max(1, Math.min(f.lvl, 25)), iv: { a: 10 + Math.floor(r() * 6), d: 10 + Math.floor(r() * 6), h: 10 + Math.floor(r() * 6) } }); }} style={s.primaryBtn}>
                  <Ionicons name="heart" size={17} color={c.onAmber} />
                  <Text style={s.primaryBtnText}>{gt.rescue}</Text>
                </Tap>
              )}
              <Tap onPress={onClose} style={s.secondaryBtn}><Text style={s.secondaryBtnText}>{gt.close}</Text></Tap>
            </>
          ) : (
            <>
              <Text style={[s.body, { textAlign: 'center' }]}>{gt.loseMsg}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Tap outer={{ flex: 1 }} onPress={() => setBattle(null)} style={s.primaryBtn}><Text style={s.primaryBtnText}>{gt.again}</Text></Tap>
                <Tap outer={{ flex: 1 }} onPress={onClose} style={s.secondaryBtn}><Text style={s.secondaryBtnText}>{gt.close}</Text></Tap>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16, marginTop: 8, gap: 8 }}>
          {showBench && (
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
              {battle.mine.map((f, i) => i !== battle.mi && (
                <Tap key={i} disabled={f.hp <= 0} onPress={() => act({ switch: i })} style={{ alignItems: 'center', backgroundColor: c.card, borderRadius: 14, padding: 6, opacity: f.hp > 0 ? 1 : 0.4 }}>
                  <MushroomArt art={byKey(f.key).art} stage={byKey(f.key).stage} size={52} />
                  <Text style={{ fontSize: 11, color: c.ink }}>{f.hp}/{f.maxHp}</Text>
                </Tap>
              ))}
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tap outer={{ flex: 1.2 }} onPress={() => act('fast')} style={[s.primaryBtn, { flexDirection: 'column', gap: 0, paddingVertical: 10 }]}>
              <Text style={s.primaryBtnText}>{gt.attack}</Text>
              <Text style={{ fontSize: 11, color: c.onAmber }}>{MOVES[meSp.type].fast[lang === 'pl' ? 0 : 1]}</Text>
            </Tap>
            <Tap outer={{ flex: 1.2 }} disabled={me.energy < CHARGED_COST} onPress={() => act('charged')} style={[s.primaryBtn, { flexDirection: 'column', gap: 0, paddingVertical: 10, backgroundColor: TYPES[meSp.type].color }]}>
              <Text style={[s.primaryBtnText, { color: '#fff' }]}>{gt.special}</Text>
              <Text style={{ fontSize: 11, color: '#fff' }}>{MOVES[meSp.type].charged[lang === 'pl' ? 0 : 1]}</Text>
            </Tap>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tap outer={{ flex: 1 }} disabled={battle.shields.me <= 0} onPress={() => act('shield')} style={[s.secondaryBtn, { paddingVertical: 10 }, charging && battle.shields.me > 0 && { borderColor: c.amber }]}>
              <Ionicons name="shield" size={15} color={c.ink} />
              <Text style={s.secondaryBtnText}>{gt.shield} ({battle.shields.me})</Text>
            </Tap>
            <Tap outer={{ flex: 1 }} disabled={!battle.mine.some((f, i) => i !== battle.mi && f.hp > 0)} onPress={() => setShowBench((v) => !v)} style={[s.secondaryBtn, { paddingVertical: 10 }]}>
              <Ionicons name="swap-horizontal" size={15} color={c.ink} />
              <Text style={s.secondaryBtnText}>{gt.switch}</Text>
            </Tap>
          </View>
        </View>
      )}
    </View>
  );
}
