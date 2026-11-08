import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { type Mushroom, MUSHROOMS, SEASON, type Status, STATUS_ORDER } from '@/data/mushrooms';
import { useApp } from '@/context/app-context';
import { FadeIn, Glyph, Photo, StatusPill, Tap } from '@/components/common';

// ATLAS

export function Hero({ month, list, scrollY }: { month: number; list: Mushroom[]; scrollY: Animated.Value }) {
  const { c, s, t } = useApp();
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [float]);
  const edible = list.filter((m) => m.s === 'e' || m.s === 'c').length;
  const toxic = list.filter((m) => m.s === 't' || m.s === 'd').length;
  return (
    <Animated.View
      style={[s.hero, {
        transform: [{ translateY: scrollY.interpolate({ inputRange: [-120, 0, 300], outputRange: [-20, 0, 70], extrapolate: 'clamp' }) }],
        opacity: scrollY.interpolate({ inputRange: [0, 280], outputRange: [1, 0.35], extrapolate: 'clamp' }),
      }]}
    >
      <Animated.View style={[s.orb, { backgroundColor: c.dark ? '#E9DDB8' : c.amber, transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] }]} />
      <View style={[s.hill, { left: -70, width: 280, height: 280, bottom: -205, backgroundColor: c.hill1 }]} />
      <View style={[s.hill, { right: -90, width: 320, height: 320, bottom: -250, backgroundColor: c.hill2 }]} />
      <View style={{ position: 'absolute', left: 46, bottom: 64 }}><Glyph size={20} cap={c.status.d} /></View>
      <View style={{ position: 'absolute', left: 74, bottom: 70 }}><Glyph size={13} cap="#B07A43" dots={false} /></View>
      <View style={{ position: 'absolute', right: 70, bottom: 58 }}><Glyph size={16} cap="#8A5A2E" dots={false} /></View>

      <Text style={s.heroKicker}>{t.kicker.toUpperCase()}</Text>
      <Text style={s.heroMonth}>{t.months[month - 1]}</Text>
      <Text style={s.heroStats}>{t.heroStats(list.length, edible, toxic)}</Text>
    </Animated.View>
  );
}

export function SeasonCard({ m }: { m: Mushroom }) {
  const { c, s, lang, open } = useApp();
  return (
    <Tap onPress={() => open({ kind: 'species', m })} style={s.seasonCard}>
      <Photo latin={m.latin} style={s.seasonPhoto} />
      <View style={[s.seasonDot, { backgroundColor: c.status[m.s] }]} />
      <Text style={s.seasonName} numberOfLines={2}>{lang === 'pl' ? m.pl : m.en}</Text>
    </Tap>
  );
}

export function SpeciesRow({ m, index }: { m: Mushroom; index: number }) {
  const { c, s, lang, open } = useApp();
  return (
    <FadeIn delay={(index % 8) * 35}>
      <Tap onPress={() => open({ kind: 'species', m })} style={s.row} scale={0.98}>
        <Photo latin={m.latin} style={s.rowPhoto} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={s.rowName} numberOfLines={2}>{lang === 'pl' ? m.pl : m.en}</Text>
          <Text style={s.latin} numberOfLines={1}>{m.latin}</Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}><StatusPill st={m.s} small /></View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={c.muted} />
      </Tap>
    </FadeIn>
  );
}

export function AtlasScreen({ header }: { header: any }) {
  const { c, s, t, lang } = useApp();
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [query, setQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const month = new Date().getMonth() + 1;

  const inSeason = useMemo(
    () => MUSHROOMS.filter((m) => SEASON.get(m.latin)?.has(month)).sort((a, b) => STATUS_ORDER[a.s] - STATUS_ORDER[b.s]),
    [month],
  );
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MUSHROOMS
      .filter((m) => (filter === 'all' || m.s === filter) && (!q || `${m.latin} ${m.pl} ${m.en}`.toLowerCase().includes(q)))
      .sort((a, b) => (lang === 'pl' ? a.pl.localeCompare(b.pl, 'pl') : a.en.localeCompare(b.en)));
  }, [query, filter, lang]);

  const listHeader = (
    <View>
      {header}
      <Hero month={month} list={inSeason} scrollY={scrollY} />

      <Text style={s.sectionLabel}>{t.inSeason}</Text>
      <FlatList
        horizontal
        data={inSeason.slice(0, 30)}
        keyExtractor={(m) => m.latin}
        renderItem={({ item }) => <SeasonCard m={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      />

      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color={c.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder={t.search} placeholderTextColor={c.muted} style={s.searchInput} />
        {!!query && (
          <Pressable onPress={() => setQuery('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={c.muted} />
          </Pressable>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
        {(['all', 'e', 'c', 'i', 't', 'd'] as const).map((k) => {
          const on = filter === k;
          return (
            <Tap key={k} onPress={() => setFilter(k)} style={[s.chip, on && { backgroundColor: c.ink, borderColor: c.ink }]}>
              {k !== 'all' && <View style={[s.dot, { backgroundColor: c.status[k] }]} />}
              <Text style={[s.chipText, on && { color: c.bg }]}>{k === 'all' ? t.all : t.label[k]}</Text>
            </Tap>
          );
        })}
      </ScrollView>
      <Text style={[s.mono, { paddingHorizontal: 20, marginBottom: 6 }]}>{t.count(data.length).toUpperCase()}</Text>
    </View>
  );

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(m: Mushroom) => String(m.id)}
      renderItem={({ item, index }: { item: Mushroom; index: number }) => <SpeciesRow m={item} index={index} />}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={<Text style={[s.subtle, { textAlign: 'center', marginTop: 30 }]}>{t.noResults}</Text>}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={10}
      windowSize={7}
      contentContainerStyle={{ paddingBottom: 120 }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    />
  );
}
