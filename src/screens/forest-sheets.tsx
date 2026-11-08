import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Mushroom } from '@/data/mushrooms';
import { useApp } from '@/context/app-context';
import { findSpecies } from '@/lib/scanner';
import { Photo, ScreenTitle, StatusPill, Tap } from '@/components/common';
import { type Forest, FOREST_SOURCES, FORESTS, VOIVODESHIPS } from '@/data/forests';
import { MAP_TXT } from '@/lib/map';

// Arkusz lasu i lista lasów

export function MonthStrip({ months }: { months: number[] }) {
  const { c, s, t } = useApp();
  const now = new Date().getMonth() + 1;
  return (
    <View style={s.calRow}>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((mo) => (
        <View key={mo} style={s.calCell}>
          <View style={[s.calBar, { backgroundColor: months.includes(mo) ? c.fern : c.card2 }, mo === now && { borderWidth: 2, borderColor: c.amber }]} />
          <Text style={[s.calLabel, mo === now && { color: c.ink, fontWeight: '800' }]}>{t.monthLetters[mo - 1]}</Text>
        </View>
      ))}
    </View>
  );
}

export function ForestSheet({ f }: { f: Forest }) {
  const { c, s, lang, open, back, showOnMap } = useApp();
  const mt = MAP_TXT[lang];
  const li = lang === 'pl' ? 0 : 1;
  const insets = useSafeAreaInsets();
  const species = f.species.map((l) => findSpecies(l)).filter(Boolean) as Mushroom[];
  const inSeason = f.months.includes(new Date().getMonth() + 1);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[s.forestHero, { paddingTop: insets.top + 64 }]}>
        <View style={[s.hill, { left: -60, width: 260, height: 260, bottom: -200, backgroundColor: c.hill1 }]} />
        <View style={[s.hill, { right: -80, width: 300, height: 300, bottom: -240, backgroundColor: c.hill2 }]} />
        <Tap onPress={back} style={[s.backBtn, { top: insets.top + 10 }]}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Tap>
        <Text style={s.heroKicker}>{VOIVODESHIPS[f.v].toUpperCase()}</Text>
        <Text style={[s.heroMonth, { fontSize: 32 }]}>{f.name}</Text>
        <View style={[s.pill, { marginTop: 10, backgroundColor: inSeason ? c.amber : 'rgba(255,255,255,0.18)' }]}>
          <Text style={[s.pillText, { color: inSeason ? c.onAmber : c.cream }]}>
            {inSeason ? (lang === 'pl' ? 'Teraz jest sezon' : 'In season now') : (lang === 'pl' ? 'Poza głównym sezonem' : 'Outside the main season')}
          </Text>
        </View>
      </View>
      <View style={s.sheetBody}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Tap outer={s.flex} onPress={() => showOnMap(f.lat, f.lng, 11)} style={s.primaryBtn}>
            <Ionicons name="map" size={18} color={c.onAmber} />
            <Text style={s.primaryBtnText}>{mt.showOnMap}</Text>
          </Tap>
          <Tap outer={s.flex} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`)} style={s.secondaryBtn}>
            <Ionicons name="navigate" size={18} color={c.ink} />
            <Text style={s.secondaryBtnText}>{mt.navigate}</Text>
          </Tap>
        </View>

        <Text style={s.sectionLabelIn}>{mt.aboutForest}</Text>
        <Text style={s.body}>{f.about[li]}</Text>

        <Text style={s.sectionLabelIn}>{mt.whenPick}</Text>
        <MonthStrip months={f.months} />
        <Text style={[s.body, { marginTop: 12 }]}>{f.when[li]}</Text>

        <Text style={s.sectionLabelIn}>{mt.typical}</Text>
        <View style={{ gap: 8 }}>
          {species.map((m) => (
            <Tap key={m.latin} onPress={() => open({ kind: 'species', m })} style={[s.row, { marginHorizontal: 0, marginBottom: 0 }]}>
              <Photo latin={m.latin} style={s.rowPhoto} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.rowName}>{lang === 'pl' ? m.pl : m.en}</Text>
                <View style={{ flexDirection: 'row' }}><StatusPill st={m.s} small /></View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Tap>
          ))}
        </View>

        <Text style={s.warn}>{mt.forestNote}</Text>
        <Text style={s.sectionLabelIn}>{mt.sources}</Text>
        {f.src.map((i) => (
          <Pressable key={i} onPress={() => Linking.openURL(FOREST_SOURCES[i][1])} style={{ paddingVertical: 4 }}>
            <Text style={s.link}>{FOREST_SOURCES[i][0]}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export function ForestListSheet() {
  const { c, s, lang, open, back } = useApp();
  const mt = MAP_TXT[lang];
  const insets = useSafeAreaInsets();
  const month = new Date().getMonth() + 1;
  const groups = Object.keys(VOIVODESHIPS).map((v) => ({ v, list: FORESTS.filter((f) => f.v === v) }));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 }}>
        <Tap onPress={back} style={[s.iconBtn, { width: 42, height: 42, borderRadius: 21 }]}>
          <Ionicons name="chevron-back" size={22} color={c.ink} />
        </Tap>
      </View>
      <ScreenTitle title={mt.forestsTitle} sub={mt.forestsSub(FORESTS.length)} />
      {groups.map(({ v, list }) => (
        <View key={v}>
          <Text style={s.sectionLabel}>{VOIVODESHIPS[v]}</Text>
          {list.map((f) => (
            <Tap key={f.id} onPress={() => open({ kind: 'forest', f })} style={s.row} scale={0.98}>
              <View style={[s.forestDot, { backgroundColor: f.months.includes(month) ? c.fern : c.card2 }]}>
                <Ionicons name="leaf" size={18} color={f.months.includes(month) ? c.cream : c.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowName}>{f.name}</Text>
                <Text style={s.subtle} numberOfLines={1}>{f.species.map((l) => { const m = findSpecies(l); return m ? (lang === 'pl' ? m.pl : m.en) : l; }).slice(0, 3).join(', ')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Tap>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
