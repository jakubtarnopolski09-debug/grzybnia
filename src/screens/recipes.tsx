import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { type Mushroom } from '@/data/mushrooms';
import { alpha } from '@/constants/palette';
import { useApp } from '@/context/app-context';
import { type Recipe, RECIPES } from '@/data/recipes';
import { findSpecies } from '@/lib/scanner';
import { FadeIn, Photo, ScreenTitle, SheetHero, Tap } from '@/components/common';

// PRZEPISY

export function RecipeCard({ r, index }: { r: Recipe; index: number }) {
  const { c, s, t, lang, open } = useApp();
  const names = r.species.map((l) => findSpecies(l)).filter(Boolean) as Mushroom[];
  return (
    <FadeIn delay={index * 60}>
      <Tap onPress={() => open({ kind: 'recipe', r })} style={s.recipeCard} scale={0.98}>
        <View>
          <Photo latin={r.species[0]} style={s.recipePhoto} />
          <View style={s.timeChip}>
            <Ionicons name="time-outline" size={13} color={c.onAmber} />
            <Text style={s.timeChipText}>{t.min(r.time)}</Text>
          </View>
        </View>
        <View style={{ padding: 16, gap: 6 }}>
          <Text style={s.h2}>{r.title[lang === 'pl' ? 0 : 1]}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {names.slice(0, 3).map((m) => (
              <View key={m.latin} style={s.miniTag}>
                <View style={[s.dot, { backgroundColor: c.status[m.s] }]} />
                <Text style={s.miniTagText}>{lang === 'pl' ? m.pl : m.en}</Text>
              </View>
            ))}
            {names.length > 3 && <Text style={s.subtle}>+{names.length - 3}</Text>}
          </View>
        </View>
      </Tap>
    </FadeIn>
  );
}

export function RecipesScreen({ header }: { header: any }) {
  const { s, t } = useApp();
  return (
    <FlatList
      data={RECIPES}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={<View>{header}<ScreenTitle title={t.recipesTitle} sub={t.recipesSub} /></View>}
      renderItem={({ item, index }) => <RecipeCard r={item} index={index} />}
      contentContainerStyle={{ paddingBottom: 120 }}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      style={s.flex}
    />
  );
}

export function RecipeSheet({ r }: { r: Recipe }) {
  const { c, s, t, lang, open } = useApp();
  const li = lang === 'pl' ? 0 : 1;
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setDone((cur) => { const n = new Set(cur); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const species = r.species.map((l) => findSpecies(l)).filter(Boolean) as Mushroom[];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <SheetHero latin={r.species[0]} height={300} />
      <View style={s.sheetBody}>
        <FadeIn>
          <Text style={s.h1}>{r.title[li]}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
            <View style={s.metaItem}><Ionicons name="time-outline" size={16} color={c.fern} /><Text style={s.subtle}>{t.min(r.time)}</Text></View>
            <View style={s.metaItem}><Ionicons name="people-outline" size={16} color={c.fern} /><Text style={s.subtle}>{t.serves(r.serves)}</Text></View>
          </View>
        </FadeIn>

        <Text style={s.sectionLabelIn}>{t.mushrooms}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {species.map((m) => (
            <Tap key={m.latin} onPress={() => open({ kind: 'species', m })} style={s.speciesChip}>
              <Photo latin={m.latin} style={s.speciesChipPhoto} />
              <View>
                <Text style={[s.rowName, { fontSize: 14 }]}>{lang === 'pl' ? m.pl : m.en}</Text>
                <Text style={[s.pillText, { color: c.status[m.s], fontSize: 11 }]}>{t.label[m.s]}</Text>
              </View>
            </Tap>
          ))}
        </ScrollView>

        <Text style={s.sectionLabelIn}>{t.ingredients}</Text>
        <View style={s.card}>
          {r.ingredients[li].map((ing, i) => (
            <Pressable key={i} onPress={() => toggle(i)} style={s.ingRow}>
              <View style={[s.check, done.has(i) && { backgroundColor: c.fern, borderColor: c.fern }]}>
                {done.has(i) && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={[s.body, { flex: 1 }, done.has(i) && { color: c.muted, textDecorationLine: 'line-through' }]}>{ing}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.sectionLabelIn}>{t.steps}</Text>
        {r.steps[li].map((step, i) => (
          <FadeIn key={i} delay={i * 40} style={s.stepRow}>
            <Text style={s.stepNum}>{i + 1}</Text>
            <Text style={[s.body, { flex: 1 }]}>{step}</Text>
          </FadeIn>
        ))}

        {!!r.tip && (
          <View style={[s.statusBox, { backgroundColor: alpha(c.amber, c.dark ? '22' : '1C'), borderLeftColor: c.amber, marginTop: 20 }]}>
            <Text style={[s.statusBoxTitle, { color: c.amber }]}>{t.tip.toUpperCase()}</Text>
            <Text style={s.body}>{r.tip[li]}</Text>
          </View>
        )}
        <Text style={s.warn}>{t.cookSafety}</Text>
      </View>
    </ScrollView>
  );
}
