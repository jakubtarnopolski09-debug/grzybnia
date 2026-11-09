import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Animated, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { Tap } from '@/components/common';
import { useApp } from '@/context/app-context';
import { MushroomArt } from '@/game/art';
import { byKey, RARITY, TYPES } from '@/game/data';
import { cp, evolveCost, type Inst, ivPercent, maxHp, maxUpgradeLevel, upgradeCost } from '@/game/logic';
import { evolve, level, toggleFav, transfer, upgrade, useGame } from '@/game/state';
import { GT } from '@/game/strings';
import { Bar, RarityBadge, TypeBadge } from '@/game/ui/parts';

type Sort = 'cp' | 'num' | 'new';

export function BoxView({ onBack }: { onBack: () => void }) {
  const { c, s, lang } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const [sort, setSort] = useState<Sort>('cp');
  const [sel, setSel] = useState<number | null>(null);

  if (sel != null && g.box.some((m) => m.uid === sel)) return <DetailView uid={sel} onBack={() => setSel(null)} />;

  const list = [...g.box].sort((a, b) =>
    sort === 'cp' ? cp(b.key, b.lvl, b.iv) - cp(a.key, a.lvl, a.iv)
    : sort === 'num' ? byKey(a.key).id - byKey(b.key).id || cp(b.key, b.lvl, b.iv) - cp(a.key, a.lvl, a.iv)
    : b.at - a.at);

  return (
    <FlatList
      data={list}
      keyExtractor={(m) => String(m.uid)}
      contentContainerStyle={{ paddingBottom: 130 }}
      initialNumToRender={12}
      ListHeaderComponent={
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, gap: 4 }}>
          <Pressable onPress={onBack} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="chevron-back" size={20} color={c.ink} />
            <Text style={[s.body, { fontWeight: '600' }]}>{gt.back}</Text>
          </Pressable>
          <Text style={s.h1}>{gt.box} ({g.box.length})</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            {(['cp', 'num', 'new'] as Sort[]).map((k) => (
              <Tap key={k} onPress={() => setSort(k)} style={[s.chip, sort === k && { backgroundColor: c.ink, borderColor: c.ink }]}>
                <Text style={[s.chipText, sort === k && { color: c.bg }]}>{k === 'cp' ? gt.sortCp : k === 'num' ? gt.sortNum : gt.sortNew}</Text>
              </Tap>
            ))}
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={[s.subtle, { textAlign: 'center', marginTop: 30, paddingHorizontal: 30 }]}>{gt.empty}</Text>}
      renderItem={({ item }) => {
        const sp = byKey(item.key);
        return (
          <Tap onPress={() => setSel(item.uid)} style={[s.row, { paddingVertical: 8 }]} scale={0.98}>
            <MushroomArt art={sp.art} stage={sp.stage} size={58} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={s.rowName} numberOfLines={1}>{sp[lang]} {item.fav ? '★' : ''}</Text>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <TypeBadge type={sp.type} small />
                <RarityBadge r={sp.rarity} small />
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: c.ink }}>{cp(item.key, item.lvl, item.iv)}</Text>
              <Text style={{ fontSize: 11, color: c.muted }}>CP · {ivPercent(item.iv)}%</Text>
            </View>
          </Tap>
        );
      }}
    />
  );
}

function DetailView({ uid, onBack }: { uid: number; onBack: () => void }) {
  const { c, s, lang } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const [msg, setMsg] = useState('');
  const [flash] = useState(() => new Animated.Value(0));
  const m = g.box.find((x) => x.uid === uid) as Inst;
  const sp = byKey(m.key);
  const spores = g.spores[sp.fam] ?? 0;
  const up = upgradeCost(m.lvl);
  const atMax = m.lvl >= maxUpgradeLevel(level(g));

  const doUpgrade = () => {
    const r = upgrade(uid);
    setMsg(r === 'ok' ? '' : r === 'seeds' ? gt.noSeeds : r === 'spores' ? gt.noSpores : gt.maxLvl);
  };
  const doEvolve = () => {
    const to = evolve(uid);
    if (!to) { setMsg(gt.noSpores); return; }
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 900, useNativeDriver: true }).start();
    setMsg(gt.evolved(byKey(to)[lang]));
  };
  const doTransfer = () => {
    Alert.alert(gt.transferQ, gt.transferMsg, [
      { text: gt.cancel, style: 'cancel' },
      { text: gt.transfer, style: 'destructive', onPress: () => { onBack(); transfer(uid); } },
    ]);
  };
  const ivRow = (label: string, v: number) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ width: 70, color: c.muted, fontSize: 12 }}>{label}</Text>
      <View style={{ flex: 1 }}><Bar value={v} max={15} color={v === 15 ? c.status.d : c.amber} /></View>
      <Text style={{ width: 22, textAlign: 'right', color: c.ink, fontSize: 12 }}>{v}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 140, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={onBack} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="chevron-back" size={20} color={c.ink} />
          <Text style={[s.body, { fontWeight: '600' }]}>{gt.back}</Text>
        </Pressable>
        <Pressable onPress={() => toggleFav(uid)} hitSlop={10}>
          <Ionicons name={m.fav ? 'star' : 'star-outline'} size={24} color={c.amber} />
        </Pressable>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 15, color: c.muted, fontWeight: '700' }}>CP <Text style={{ fontSize: 34, color: c.ink, fontWeight: '800' }}>{cp(m.key, m.lvl, m.iv)}</Text></Text>
        <View>
          <MushroomArt art={sp.art} stage={sp.stage} size={220} glow={sp.rarity >= 4 ? RARITY[sp.rarity].color : TYPES[sp.type].color} />
          <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 110, backgroundColor: '#fff', opacity: flash }} />
        </View>
        <Text style={s.h1}>{sp[lang]}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}><TypeBadge type={sp.type} /><RarityBadge r={sp.rarity} /></View>
      </View>

      <View style={[s.card, { gap: 8 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Stat label={gt.level} value={String(m.lvl)} />
          <Stat label={gt.hp} value={String(maxHp(m.key, m.lvl, m.iv))} />
          <Stat label={gt.iv} value={`${ivPercent(m.iv)}%`} />
          <Stat label={gt.spores} value={String(spores)} />
        </View>
        {ivRow(lang === 'pl' ? 'Atak' : 'Attack', m.iv.a)}
        {ivRow(lang === 'pl' ? 'Obrona' : 'Defence', m.iv.d)}
        {ivRow('HP', m.iv.h)}
      </View>

      {!!msg && <Text style={[s.body, { textAlign: 'center', fontWeight: '700', color: c.amber }]}>{msg}</Text>}

      <Tap onPress={doUpgrade} disabled={atMax} style={[s.primaryBtn, { flexDirection: 'column', gap: 2 }]}>
        <Text style={s.primaryBtnText}>{gt.upgrade} (+1 {gt.level.toLowerCase()})</Text>
        <Text style={{ color: c.onAmber, fontSize: 12 }}>{atMax ? gt.maxLvl : gt.upCost(up.seeds, up.spores)} · {lang === 'pl' ? 'masz' : 'you have'} {g.seeds} / {spores}</Text>
      </Tap>
      {sp.evo && (
        <Tap onPress={doEvolve} disabled={spores < evolveCost(sp)} style={[s.secondaryBtn, { flexDirection: 'column', gap: 2 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="sparkles" size={16} color={c.ink} />
            <Text style={s.secondaryBtnText}>{gt.evolve} → {g.dex[sp.evo] ? byKey(sp.evo)[lang] : '???'}</Text>
          </View>
          <Text style={{ color: c.muted, fontSize: 12 }}>{gt.evoCost(evolveCost(sp))} · {lang === 'pl' ? 'masz' : 'you have'} {spores}</Text>
        </Tap>
      )}
      <Tap onPress={doTransfer} style={s.secondaryBtn}>
        <Ionicons name="leaf-outline" size={16} color={c.ink} />
        <Text style={s.secondaryBtnText}>{gt.transfer}</Text>
      </Tap>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { c } = useApp();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: c.ink }}>{value}</Text>
      <Text style={{ fontSize: 11, color: c.muted }}>{label}</Text>
    </View>
  );
}
