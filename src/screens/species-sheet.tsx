import { Ionicons } from '@expo/vector-icons';
import { Linking, ScrollView, Text, View } from 'react-native';
import { DEFAULT_PROFILE, DESC, type Mushroom, PROFILES, SEASON, WHY } from '@/data/mushrooms';
import { alpha } from '@/constants/palette';
import { useApp } from '@/context/app-context';
import { type Recipe, recipesFor } from '@/data/recipes';
import { FadeIn, Photo, SheetHero, StatusPill, Tap } from '@/components/common';

// KARTA GATUNKU

export function SeasonStrip({ latin }: { latin: string }) {
  const { c, s, t } = useApp();
  const months = SEASON.get(latin) ?? new Set<number>();
  const now = new Date().getMonth() + 1;
  return (
    <View style={s.calRow}>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((mo) => (
        <View key={mo} style={s.calCell}>
          <View style={[s.calBar, { backgroundColor: months.has(mo) ? c.fern : c.card2 }, mo === now && { borderWidth: 2, borderColor: c.amber }]} />
          <Text style={[s.calLabel, mo === now && { color: c.ink, fontWeight: '800' }]}>{t.monthLetters[mo - 1]}</Text>
        </View>
      ))}
    </View>
  );
}

export function RecipeMini({ r }: { r: Recipe }) {
  const { c, s, t, lang, open } = useApp();
  return (
    <Tap onPress={() => open({ kind: 'recipe', r })} style={s.recipeMini}>
      <Photo latin={r.species[0]} style={s.recipeMiniPhoto} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowName} numberOfLines={2}>{r.title[lang === 'pl' ? 0 : 1]}</Text>
        <Text style={s.subtle}>{t.min(r.time)} · {t.serves(r.serves)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={c.muted} />
    </Tap>
  );
}

export function SpeciesSheet({ m }: { m: Mushroom }) {
  const { c, s, t, lang } = useApp();
  const li = lang === 'pl' ? 0 : 1;
  const profile = PROFILES[m.x ?? DEFAULT_PROFILE[m.s]];
  const recipes = recipesFor(m.latin);
  const q = encodeURIComponent(m.latin);
  const links: [string, string, string][] = [
    [t.wiki, `https://${lang}.wikipedia.org/wiki/Special:Search?search=${q}`, 'book-outline'],
    [t.commons, `https://commons.wikimedia.org/w/index.php?search=${q}&ns6=1`, 'images-outline'],
    [t.inat, `https://www.inaturalist.org/taxa/search?q=${q}`, 'earth-outline'],
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <SheetHero latin={m.latin}>
        <View style={{ position: 'absolute', left: 20, bottom: 40 }}><StatusPill st={m.s} /></View>
      </SheetHero>
      <View style={s.sheetBody}>
        <FadeIn>
          <Text style={s.h1}>{lang === 'pl' ? m.pl : m.en}</Text>
          <Text style={s.subtle}>{lang === 'pl' ? m.en : m.pl}</Text>
          <Text style={[s.latin, { fontSize: 17, color: c.fern, marginTop: 6 }]}>{m.latin}</Text>
        </FadeIn>

        <FadeIn delay={60}>
          <Text style={s.sectionLabelIn}>{t.season}</Text>
          <SeasonStrip latin={m.latin} />
        </FadeIn>

        <FadeIn delay={120}>
          <View style={[s.statusBox, { backgroundColor: alpha(c.status[m.s], c.dark ? '22' : '18'), borderLeftColor: c.status[m.s] }]}>
            <Text style={[s.statusBoxTitle, { color: c.status[m.s] }]}>{t.label[m.s].toUpperCase()}</Text>
            <Text style={s.body}>{t.desc[m.s]}</Text>
          </View>
        </FadeIn>

        {!!DESC[m.latin] && (
          <FadeIn delay={160}>
            <Text style={s.sectionLabelIn}>{t.look}</Text>
            <Text style={s.body}>{DESC[m.latin][li]}</Text>
          </FadeIn>
        )}

        <FadeIn delay={200}>
          <Text style={s.sectionLabelIn}>{WHY[lang][m.s]}</Text>
          <View style={s.card}>
            <Text style={s.body}>{profile[lang]}</Text>
          </View>
        </FadeIn>

        {recipes.length > 0 && (
          <FadeIn delay={240}>
            <Text style={s.sectionLabelIn}>{t.recipesWith}</Text>
            <View style={{ gap: 8 }}>{recipes.map((r) => <RecipeMini key={r.id} r={r} />)}</View>
          </FadeIn>
        )}

        <Text style={s.sectionLabelIn}>{t.more}</Text>
        <View style={{ gap: 8 }}>
          {links.map(([label, url, icon]) => (
            <Tap key={label} onPress={() => Linking.openURL(url)} style={s.linkBtn}>
              <Ionicons name={icon as any} size={18} color={c.fern} />
              <Text style={[s.rowName, { flex: 1, fontSize: 15 }]}>{label}</Text>
              <Ionicons name="open-outline" size={16} color={c.muted} />
            </Tap>
          ))}
        </View>
        <Text style={s.warn}>{t.warn}</Text>
      </View>
    </ScrollView>
  );
}
