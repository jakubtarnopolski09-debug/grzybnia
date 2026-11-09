import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusPill, Tap } from '@/components/common';
import { useApp } from '@/context/app-context';
import { MushroomArt } from '@/game/art';
import { type GameShroom, MOVES, RARITY, SHROOMS } from '@/game/data';
import { useGame } from '@/game/state';
import { GT } from '@/game/strings';
import { RarityBadge, TypeBadge } from '@/game/ui/parts';
import { findSpecies } from '@/lib/scanner';

export function DexView({ onBack }: { onBack: () => void }) {
  const { c, s, lang } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const { width } = useWindowDimensions();
  const [sel, setSel] = useState<GameShroom | null>(null);
  const cols = 4;
  const size = (Math.max(width, 320) - 32 - (cols - 1) * 8) / cols;
  const caught = SHROOMS.filter((x) => g.dex[x.key] === 2).length;

  return (
    <View style={s.flex}>
      <FlatList
        data={SHROOMS}
        keyExtractor={(x) => x.key}
        numColumns={cols}
        columnWrapperStyle={{ gap: 8, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 8, paddingBottom: 130 }}
        initialNumToRender={16}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6, gap: 4 }}>
            <Pressable onPress={onBack} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="chevron-back" size={20} color={c.ink} />
              <Text style={[s.body, { fontWeight: '600' }]}>{gt.back}</Text>
            </Pressable>
            <Text style={s.h1}>{gt.dex}</Text>
            <Text style={s.subtle}>{gt.dexCount(caught, SHROOMS.length)}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const st = g.dex[item.key];
          return (
            <Tap onPress={() => st && setSel(item)} style={{ width: size, alignItems: 'center', backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: st === 2 ? RARITY[item.rarity].color + '66' : c.line, paddingVertical: 6 }}>
              <MushroomArt art={item.art} stage={item.stage} size={size - 14} silhouette={st !== 2} />
              <Text style={{ fontSize: 10, color: c.muted }}>#{String(item.id).padStart(3, '0')}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: c.ink, textAlign: 'center' }} numberOfLines={1}>{st ? item[lang] : gt.unknown}</Text>
            </Tap>
          );
        }}
      />
      <DexEntry sp={sel} onClose={() => setSel(null)} />
    </View>
  );
}

function DexEntry({ sp, onClose }: { sp: GameShroom | null; onClose: () => void }) {
  const { c, s, t, lang, open } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const insets = useSafeAreaInsets();
  if (!sp) return null;
  const caught = g.dex[sp.key] === 2;
  const family = SHROOMS.filter((x) => x.fam === sp.fam).sort((a, b) => a.stage - b.stage);
  const real = findSpecies(sp.latin);
  const mv = MOVES[sp.type];
  return (
    <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: insets.bottom + 30, gap: 14 }}>
        <Pressable onPress={onClose} hitSlop={10} style={{ alignSelf: 'flex-start' }}><Ionicons name="close" size={28} color={c.ink} /></Pressable>
        <View style={{ alignItems: 'center' }}>
          <MushroomArt art={sp.art} stage={sp.stage} size={210} silhouette={!caught} glow={caught && sp.rarity >= 4 ? RARITY[sp.rarity].color : undefined} />
          <Text style={[s.mono, { marginTop: 4 }]}>#{String(sp.id).padStart(3, '0')}</Text>
          <Text style={s.h1}>{sp[lang]}</Text>
          {!caught && <Text style={s.subtle}>{gt.seen} · {gt.notCaught}</Text>}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}><TypeBadge type={sp.type} /><RarityBadge r={sp.rarity} /></View>
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabelIn}>{gt.attacks}</Text>
          <Text style={s.body}>{gt.fast}: {mv.fast[lang === 'pl' ? 0 : 1]} · {gt.charged}: {mv.charged[lang === 'pl' ? 0 : 1]}</Text>
        </View>

        {family.length > 1 && (
          <View style={s.card}>
            <Text style={s.sectionLabelIn}>{gt.family}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {family.map((f, i) => (
                <View key={f.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {i > 0 && <Ionicons name="arrow-forward" size={16} color={c.muted} />}
                  <View style={{ alignItems: 'center', width: 86 }}>
                    <MushroomArt art={f.art} stage={f.stage} size={72} silhouette={g.dex[f.key] !== 2} />
                    <Text style={{ fontSize: 11, color: c.ink, textAlign: 'center' }} numberOfLines={2}>{g.dex[f.key] ? f[lang] : gt.unknown}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {real && (
          <View style={s.card}>
            <Text style={s.sectionLabelIn}>{gt.inAtlas}</Text>
            <Text style={[s.body, { fontWeight: '700' }]}>{lang === 'pl' ? real.pl : real.en}</Text>
            <Text style={[s.latin, { marginBottom: 8 }]}>{real.latin}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Text style={s.subtle}>{gt.real}:</Text>
              <StatusPill st={real.s} />
            </View>
            <Text style={[s.subtle, { fontSize: 12, marginBottom: 10 }]}>{gt.disclaimer}</Text>
            <Tap onPress={() => { onClose(); open({ kind: 'species', m: real }); }} style={s.secondaryBtn}>
              <Ionicons name="book-outline" size={17} color={c.ink} />
              <Text style={s.secondaryBtnText}>{t.more}</Text>
            </Tap>
          </View>
        )}
      </ScrollView>
    </Modal>
  );
}
