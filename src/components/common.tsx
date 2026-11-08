import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Status } from '@/data/mushrooms';
import { alpha } from '@/constants/palette';
import { type Lang } from '@/i18n/strings';
import { type Tab, useApp } from '@/context/app-context';
import { bigger, inatPhoto, USER_AGENT, WIKI_ERROR_LIMIT, wikiImages } from '@/lib/photos';

// WSPÓLNE ELEMENTY

// Przycisk, który lekko „ugina się” pod palcem
export function Tap({ onPress, onLongPress, style, outer, children, scale = 0.97, disabled }: {
  onPress?: () => void; onLongPress?: () => void; style?: any; outer?: any; children?: any; scale?: number; disabled?: boolean;
}) {
  const v = useState(() => new Animated.Value(1))[0];
  const to = (x: number) => Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} disabled={disabled} onPressIn={() => to(scale)} onPressOut={() => to(1)} style={outer}>
      <Animated.View style={[style, { transform: [{ scale: v }] }, disabled && { opacity: 0.5 }]}>{children}</Animated.View>
    </Pressable>
  );
}

// Mały grzybek z kształtów – logo i ozdobniki
export function Glyph({ size = 24, cap, stem = '#F1E6CF', dots = true }: { size?: number; cap: string; stem?: string; dots?: boolean }) {
  const capH = size * 0.56;
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View style={{ width: size, height: capH, backgroundColor: cap, borderTopLeftRadius: size / 2, borderTopRightRadius: size / 2, borderBottomLeftRadius: size * 0.14, borderBottomRightRadius: size * 0.14 }}>
        {dots && (
          <>
            <View style={{ position: 'absolute', width: size * 0.16, height: size * 0.16, borderRadius: size, backgroundColor: '#F6EEDC', left: size * 0.2, top: capH * 0.32 }} />
            <View style={{ position: 'absolute', width: size * 0.12, height: size * 0.12, borderRadius: size, backgroundColor: '#F6EEDC', left: size * 0.5, top: capH * 0.15 }} />
            <View style={{ position: 'absolute', width: size * 0.13, height: size * 0.13, borderRadius: size, backgroundColor: '#F6EEDC', right: size * 0.16, top: capH * 0.45 }} />
          </>
        )}
      </View>
      <View style={{ width: size * 0.34, height: size - capH, backgroundColor: stem, borderBottomLeftRadius: size * 0.14, borderBottomRightRadius: size * 0.14 }} />
    </View>
  );
}

// Zdjęcie gatunku. expo-image trzyma obrazki w cache na dysku i w pamięci, więc po pierwszym
// wczytaniu pojawiają się natychmiast, także bez internetu; sam też zmniejsza je do rozmiaru widoku.
const PHOTO_HEADERS = { 'User-Agent': USER_AGENT };
export function Photo({ latin, style, big, empty = '' }: { latin: string; style: any; big?: boolean; empty?: string }) {
  const { c, s, photoOf } = useApp();
  const url = photoOf(latin);
  const [wikiFailed, setWikiFailed] = useState(false);
  const [alt, setAlt] = useState<string | null | undefined>(undefined); // zdjęcie z iNaturalist
  const useWiki = !!url && !wikiFailed && wikiImages.errors < WIKI_ERROR_LIMIT;
  const needAlt = url === null || (!!url && !useWiki);

  useEffect(() => {
    if (!needAlt || alt !== undefined) return;
    let alive = true;
    inatPhoto(latin).then((u) => alive && setAlt(u));
    return () => { alive = false; };
  }, [needAlt, latin, alt]);

  const base = useWiki ? url : alt;
  const src = base ? (big ? bigger(base) : base) : null;
  const showEmpty = !src && needAlt && alt === null;

  return (
    <View style={[style, { backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }]}>
      <View style={{ opacity: c.dark ? 0.25 : 0.18 }}>
        <Glyph size={big ? 64 : 26} cap={c.muted} stem={c.muted} dots={false} />
      </View>
      {showEmpty && !!empty && <Text style={[s.mono, { marginTop: 6 }]}>{empty}</Text>}
      {!!src && (
        <Image
          source={{ uri: src, headers: PHOTO_HEADERS }}
          recyclingKey={latin}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={{ duration: 300, skipOnCacheHit: 'all' } as any}
          onError={() => {
            if (useWiki) { wikiImages.errors += 1; setWikiFailed(true); } else setAlt(null);
          }}
        />
      )}
    </View>
  );
}

export function StatusPill({ st, small }: { st: Status; small?: boolean }) {
  const { c, s, t } = useApp();
  return (
    <View style={[s.pill, { backgroundColor: alpha(c.status[st], c.dark ? '2E' : '22') }, small && { paddingHorizontal: 8, paddingVertical: 3 }]}>
      <View style={[s.dot, { backgroundColor: c.status[st] }]} />
      <Text style={[s.pillText, { color: c.status[st] }, small && { fontSize: 11 }]}>{t.label[st]}</Text>
    </View>
  );
}

// Pasek z logo, przełącznikiem języka i trybem nocnym
export function TopBar({ setLang, toggleTheme }: { setLang: (l: Lang) => void; toggleTheme: () => void }) {
  const { c, s, t, lang } = useApp();
  const insets = useSafeAreaInsets();
  const spin = useState(() => new Animated.Value(c.dark ? 1 : 0))[0];
  useEffect(() => {
    Animated.spring(spin, { toValue: c.dark ? 1 : 0, useNativeDriver: true, friction: 6 }).start();
  }, [c.dark, spin]);
  return (
    <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Glyph size={26} cap={c.status.d} />
        <Text style={s.brand}>{t.brand}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={s.langSwitch}>
          {(['pl', 'en'] as Lang[]).map((l) => (
            <Pressable key={l} onPress={() => setLang(l)} style={[s.langBtn, lang === l && { backgroundColor: c.ink }]}>
              <Text style={[s.langText, lang === l && { color: c.bg }]}>{l.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
        <Tap onPress={toggleTheme} style={s.iconBtn}>
          <Animated.View style={{ transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
            <Ionicons name={c.dark ? 'sunny' : 'moon'} size={18} color={c.ink} />
          </Animated.View>
        </Tap>
      </View>
    </View>
  );
}

export function ScreenTitle({ title, sub }: { title: string; sub: string }) {
  const { s } = useApp();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
      <Text style={s.h1}>{title}</Text>
      <Text style={s.subtle}>{sub}</Text>
    </View>
  );
}

// Wejście elementu: delikatne pojawienie się od dołu
export function FadeIn({ delay = 0, children, style }: { delay?: number; children: any; style?: any }) {
  const v = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 380, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v, delay]);
  return (
    <Animated.View style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}

// Dolne menu z przesuwanym podświetleniem
export const TABS: Tab[] = ['atlas', 'map', 'scan', 'recipes', 'album'];
export const TAB_ICON: Record<Tab, string> = { atlas: 'leaf', map: 'map', scan: 'scan', recipes: 'restaurant', album: 'images' };

export function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { c, s, t } = useApp();
  const insets = useSafeAreaInsets();
  const [w, setW] = useState(0);
  const x = useState(() => new Animated.Value(0))[0];
  const idx = TABS.indexOf(tab);
  const itemW = w / TABS.length;
  useEffect(() => {
    Animated.spring(x, { toValue: idx * itemW, useNativeDriver: true, friction: 9, tension: 90 }).start();
  }, [idx, itemW, x]);
  return (
    <View pointerEvents="box-none" style={[s.tabWrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <View style={s.tabBar} onLayout={(e) => setW(e.nativeEvent.layout.width - 12)}>
        {w > 0 && <Animated.View style={[s.tabPill, { width: itemW, transform: [{ translateX: x }] }]} />}
        {TABS.map((k) => {
          const on = k === tab;
          return (
            <Pressable key={k} onPress={() => setTab(k)} style={s.tabItem} accessibilityRole="tab" accessibilityState={{ selected: on }}>
              <Ionicons name={(on ? TAB_ICON[k] : `${TAB_ICON[k]}-outline`) as any} size={20} color={on ? c.onAmber : c.muted} />
              <Text style={[s.tabLabel, { color: on ? c.onAmber : c.muted }]}>{t.tabs[k]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Nagłówek arkusza: zdjęcie na całą szerokość z przyciskiem powrotu
export function SheetHero({ latin, height = 340, children }: { latin: string; height?: number; children?: any }) {
  const { s, back } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height }}>
      <Photo latin={latin} style={StyleSheet.absoluteFill} big />
      <View style={s.heroShade} />
      <Tap onPress={back} style={[s.backBtn, { top: insets.top + 10 }]}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </Tap>
      {children}
    </View>
  );
}
