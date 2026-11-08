import { Ionicons } from '@expo/vector-icons';
import { File } from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { alpha } from '@/constants/palette';
import { type AlbumItem, albumUri, mimeOf } from '@/lib/storage';
import { useApp } from '@/context/app-context';
import { API_KEY, findSpecies, identify, MAX_PHOTOS, SCAN_TXT, type ScanPhoto, type ScanResult, toPhoto } from '@/lib/scanner';
import { FadeIn, Photo, ScreenTitle, StatusPill, Tap } from '@/components/common';
import { pickImages } from '@/screens/album';

// SKANER – EKRAN

export function ConfidenceBar({ value, color }: { value: number; color: string }) {
  const { s } = useApp();
  const grow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(grow, { toValue: value, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [grow, value]);
  return (
    <View style={s.barTrack}>
      <Animated.View style={[s.barFill, { backgroundColor: color, width: grow.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}

export function ScanLine({ height }: { height: number }) {
  const { s } = useApp();
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(y, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [y]);
  return (
    <Animated.View pointerEvents="none" style={[s.scanBand, { transform: [{ translateY: y.interpolate({ inputRange: [0, 1], outputRange: [-36, height - 40] }) }] }]}>
      <View style={s.scanGlow} />
      <View style={s.scanLine} />
    </Animated.View>
  );
}

export function ScannerScreen({ header }: { header: any }) {
  const { c, s, t, lang, album, addToAlbum, scanSeed, open } = useApp();
  const st = SCAN_TXT[lang];
  const { width } = useWindowDimensions();
  const finderH = Math.min(width - 32, 380);
  const [photos, setPhotos] = useState<ScanPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);

  const pushPhotos = (fresh: ScanPhoto[]) => {
    setPhotos((cur) => [...cur, ...fresh.filter((f) => !cur.some((p) => p.uri === f.uri))].slice(0, MAX_PHOTOS));
    setResult(null); setSaved(false); setError('');
  };

  const fromAlbum = async (item: AlbumItem) => {
    try {
      const uri = albumUri(item);
      pushPhotos([{ uri, base64: await new File(uri).base64(), mime: mimeOf(uri), fromAlbum: true }]);
    } catch (e: any) {
      setError(`${st.error}: ${e?.message ?? e}`);
    }
  };

  useEffect(() => {
    if (scanSeed) fromAlbum(scanSeed.item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanSeed?.n]);

  const add = async (src: 'camera' | 'gallery') => {
    setError('');
    const assets = await pickImages(src, { mediaTypes: ['images'], quality: 0.5, base64: true }, MAX_PHOTOS - photos.length);
    if (assets === null) { setError(st.noPermission); return; }
    const fresh = assets.map(toPhoto).filter((p): p is ScanPhoto => !!p);
    if (fresh.some((p) => p.base64.length > 9_500_000)) { setError(st.tooBig); return; }
    if (fresh.length) pushPhotos(fresh);
  };

  const analyze = async () => {
    if (!API_KEY) { setError(st.noKey); return; }
    setBusy(true); setError(''); setResult(null); setShowAlbum(false);
    try {
      setResult(await identify(photos, lang));
    } catch (e: any) {
      setError(`${st.error}: ${e?.message ?? e}`);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setPhotos([]); setResult(null); setError(''); setSaved(false); };
  const remove = (uri: string) => { setPhotos((cur) => cur.filter((p) => p.uri !== uri)); setResult(null); };
  const save = () => {
    addToAlbum(photos.filter((p) => !p.fromAlbum).map((p) => p.uri), result?.candidates[0]?.latin);
    setSaved(true);
  };

  const unknown = result ? Math.max(0, 100 - result.candidates.reduce((sum, x) => sum + x.confidence, 0)) : 0;
  const deadly = !!result && [...result.candidates.map((x) => x.latin), ...result.dangerous_lookalikes.map((l) => l.latin)]
    .some((l) => findSpecies(l)?.s === 'd');
  const canAdd = photos.length < MAX_PHOTOS && !busy;
  const newPhotos = photos.some((p) => !p.fromAlbum);

  return (
    <ScrollView style={s.flex} contentContainerStyle={{ paddingBottom: 130 }} keyboardShouldPersistTaps="handled">
      {header}
      <ScreenTitle title={t.tabs.scan} sub={t.scanSub} />

      {/* Wizjer */}
      <View style={[s.finder, { height: finderH }]}>
        {photos.length > 0 ? (
          <Image source={{ uri: photos[0].uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={s.finderEmpty}>
            <Ionicons name="scan-outline" size={52} color={c.cream} />
            <Text style={s.finderHint}>{st.hint}</Text>
          </View>
        )}
        {busy && <ScanLine height={finderH} />}
        <View style={[s.corner, { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 14 }]} />
        <View style={[s.corner, { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 14 }]} />
        <View style={[s.corner, { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 14 }]} />
        <View style={[s.corner, { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 14 }]} />
        {photos.length > 0 && (
          <View style={s.finderBadge}><Text style={s.finderBadgeText}>{photos.length}/{MAX_PHOTOS}</Text></View>
        )}
      </View>

      {/* Miniatury */}
      {photos.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 10 }}>
          {photos.map((p) => (
            <View key={p.uri}>
              <Image source={{ uri: p.uri }} style={s.thumb} />
              {!busy && (
                <Pressable onPress={() => remove(p.uri)} style={s.thumbX} hitSlop={6}>
                  <Ionicons name="close" size={12} color="#fff" />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Źródła zdjęć */}
      {canAdd && !result && (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 14 }}>
          {([
            ['camera', t.camera, () => add('camera')],
            ['images-outline', t.gallery, () => add('gallery')],
            ['albums-outline', t.fromAlbum, () => setShowAlbum((v) => !v)],
          ] as [string, string, () => void][]).map(([icon, label, fn], i) => (
            <Tap key={label} outer={s.flex} onPress={fn} style={i === 0 && !photos.length ? s.primaryBtn : [s.secondaryBtn, i === 2 && showAlbum && { borderColor: c.amber }]}>
              <Ionicons name={icon as any} size={18} color={i === 0 && !photos.length ? c.onAmber : c.ink} />
              <Text style={i === 0 && !photos.length ? s.primaryBtnText : s.secondaryBtnText}>{label}</Text>
            </Tap>
          ))}
        </View>
      )}

      {showAlbum && canAdd && !result && (
        album.length ? (
          <FlatList
            horizontal
            data={album}
            keyExtractor={(a) => a.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingTop: 10 }}
            renderItem={({ item }) => (
              <Tap onPress={() => fromAlbum(item)} style={s.thumb}>
                <Image source={{ uri: albumUri(item) }} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
              </Tap>
            )}
          />
        ) : (
          <Text style={[s.subtle, { paddingHorizontal: 20, marginTop: 10 }]}>{t.emptyAlbumPick}</Text>
        )
      )}

      {photos.length > 0 && !busy && !result && (
        <Tap onPress={analyze} outer={{ marginHorizontal: 16, marginTop: 12 }} style={[s.primaryBtn, { paddingVertical: 17 }]}>
          <Ionicons name="sparkles" size={18} color={c.onAmber} />
          <Text style={[s.primaryBtnText, { letterSpacing: 2 }]}>{st.analyze}</Text>
        </Tap>
      )}

      {busy && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, marginTop: 16 }}>
          <ActivityIndicator color={c.amber} />
          <Text style={s.subtle}>{st.analyzing}</Text>
        </View>
      )}

      {!!error && <Text style={s.scanError}>{error}</Text>}

      {/* Wyniki */}
      {result && (
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <Text style={s.scanWarn}>{st.warn}</Text>
          {deadly && (
            <FadeIn style={[s.deadlyBox, { backgroundColor: c.status.d }]}>
              <Ionicons name="warning" size={20} color="#fff" />
              <Text style={s.deadlyText}>{st.deadly}</Text>
            </FadeIn>
          )}

          {!result.is_mushroom || result.candidates.length === 0 ? (
            <Text style={[s.body, { marginTop: 16 }]}>{result.is_mushroom ? result.photo_feedback : st.notMushroom}</Text>
          ) : (
            <>
              <Text style={s.sectionLabelIn}>{st.matches}</Text>
              <View style={s.card}>
                {result.candidates.map((x, i) => {
                  const m = findSpecies(x.latin)!;
                  return (
                    <FadeIn key={m.latin} delay={i * 90}>
                      <Pressable onPress={() => open({ kind: 'species', m })} style={[s.match, i > 0 && { borderTopWidth: 1, borderTopColor: c.line }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <Photo latin={m.latin} style={s.rowPhoto} />
                          <View style={{ flex: 1, gap: 4 }}>
                            <Text style={s.rowName}>{lang === 'pl' ? m.pl : m.en}</Text>
                            <View style={{ flexDirection: 'row' }}><StatusPill st={m.s} small /></View>
                          </View>
                          <Text style={[s.matchPct, i === 0 && { color: c.amber }]}>{x.confidence}%</Text>
                        </View>
                        <ConfidenceBar value={x.confidence} color={c.status[m.s]} />
                        <Text style={s.matchWhy}>{x.key_features}</Text>
                      </Pressable>
                    </FadeIn>
                  );
                })}
                {unknown > 0 && (
                  <View style={[s.match, { borderTopWidth: 1, borderTopColor: c.line }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[s.rowName, { color: c.muted }]}>{st.unknown}</Text>
                      <Text style={[s.matchPct, { color: c.muted, fontSize: 20 }]}>{unknown}%</Text>
                    </View>
                    <ConfidenceBar value={unknown} color={c.status.i} />
                  </View>
                )}
              </View>
            </>
          )}

          {!!result.outside_atlas?.trim() && (
            <>
              <Text style={s.sectionLabelIn}>{st.outside}</Text>
              <Text style={s.body}>{result.outside_atlas}</Text>
            </>
          )}

          {result.dangerous_lookalikes.length > 0 && (
            <>
              <Text style={s.sectionLabelIn}>{st.lookalikes}</Text>
              <View style={{ gap: 8 }}>
                {result.dangerous_lookalikes.map((l) => {
                  const m = findSpecies(l.latin)!;
                  return (
                    <Tap key={m.latin} onPress={() => open({ kind: 'species', m })} style={[s.statusBox, { marginTop: 0, backgroundColor: alpha(c.status[m.s], c.dark ? '22' : '16'), borderLeftColor: c.status[m.s] }]}>
                      <Text style={[s.statusBoxTitle, { color: c.status[m.s] }]}>{(lang === 'pl' ? m.pl : m.en).toUpperCase()} · {t.label[m.s].toUpperCase()}</Text>
                      <Text style={s.body}>{l.how_to_tell}</Text>
                    </Tap>
                  );
                })}
              </View>
            </>
          )}

          {result.is_mushroom && !!result.photo_feedback && (
            <>
              <Text style={s.sectionLabelIn}>{st.photos}</Text>
              <Text style={s.body}>{result.photo_feedback}</Text>
            </>
          )}

          {result.verification_steps.length > 0 && (
            <>
              <Text style={s.sectionLabelIn}>{st.steps}</Text>
              {result.verification_steps.map((step, i) => (
                <View key={i} style={s.stepRow}>
                  <Text style={s.stepNum}>{i + 1}</Text>
                  <Text style={[s.body, { flex: 1 }]}>{step}</Text>
                </View>
              ))}
            </>
          )}

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 22 }}>
            {newPhotos && (
              <Tap outer={s.flex} onPress={save} disabled={saved} style={s.secondaryBtn}>
                <Ionicons name={saved ? 'checkmark' : 'download-outline'} size={18} color={c.ink} />
                <Text style={s.secondaryBtnText} numberOfLines={1}>{saved ? t.saved : t.saveToAlbum}</Text>
              </Tap>
            )}
            <Tap outer={s.flex} onPress={reset} style={s.primaryBtn}>
              <Ionicons name="refresh" size={18} color={c.onAmber} />
              <Text style={s.primaryBtnText}>{st.again}</Text>
            </Tap>
          </View>
        </View>
      )}

      {photos.length > 0 && !busy && !result && (
        <Pressable onPress={reset} style={{ marginTop: 14, alignSelf: 'center' }}>
          <Text style={s.link}>{lang === 'pl' ? 'usuń zdjęcia' : 'remove photos'}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
