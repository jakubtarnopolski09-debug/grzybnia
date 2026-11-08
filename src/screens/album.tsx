import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MUSHROOMS } from '@/data/mushrooms';
import { alpha } from '@/constants/palette';
import { albumUri } from '@/lib/storage';
import { useApp } from '@/context/app-context';
import { findSpecies } from '@/lib/scanner';
import { FadeIn, Glyph, Photo, ScreenTitle, StatusPill, Tap } from '@/components/common';
import { MAP_TXT } from '@/lib/map';

// ALBUM

export async function pickImages(source: 'camera' | 'gallery', options: ImagePicker.ImagePickerOptions, limit = 10) {
  const perm = source === 'camera'
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = source === 'camera'
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync({ ...options, allowsMultipleSelection: limit > 1, selectionLimit: limit });
  return res.canceled ? [] : res.assets;
}

export function AlbumScreen({ header }: { header: any }) {
  const { c, s, t, album, addToAlbum, open, lang } = useApp();
  const { width } = useWindowDimensions();
  const size = (width - 16 * 2 - 8 * 2) / 3;

  const add = async (src: 'camera' | 'gallery') => {
    const assets = await pickImages(src, { mediaTypes: ['images'], quality: 0.8 });
    if (assets === null) { Alert.alert(t.noPermission); return; }
    if (assets.length) addToAlbum(assets.map((a) => a.uri), undefined, src === 'camera');
  };

  return (
    <FlatList
      data={album}
      keyExtractor={(a) => a.id}
      numColumns={3}
      columnWrapperStyle={{ gap: 8, paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      ListHeaderComponent={
        <View>
          {header}
          <ScreenTitle title={t.albumTitle} sub={t.albumSub(album.length)} />
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 }}>
            <Tap outer={s.flex} onPress={() => add('camera')} style={s.primaryBtn}>
              <Ionicons name="camera" size={18} color={c.onAmber} />
              <Text style={s.primaryBtnText}>{t.camera}</Text>
            </Tap>
            <Tap outer={s.flex} onPress={() => add('gallery')} style={s.secondaryBtn}>
              <Ionicons name="images-outline" size={18} color={c.ink} />
              <Text style={s.secondaryBtnText}>{t.gallery}</Text>
            </Tap>
          </View>
        </View>
      }
      ListEmptyComponent={
        <FadeIn style={s.emptyBox}>
          <Glyph size={56} cap={c.status.d} />
          <Text style={[s.body, { textAlign: 'center', color: c.muted, marginTop: 14 }]}>{t.albumEmpty}</Text>
        </FadeIn>
      }
      renderItem={({ item, index }) => {
        const m = item.latin ? findSpecies(item.latin) : undefined;
        return (
          <FadeIn delay={(index % 9) * 30}>
            <Tap onPress={() => open({ kind: 'photo', id: item.id })} style={[s.gridItem, { width: size, height: size }]}>
              <Image source={{ uri: albumUri(item) }} style={StyleSheet.absoluteFill} />
              {m && (
                <View style={s.gridLabel}>
                  <View style={[s.dot, { backgroundColor: c.status[m.s] }]} />
                  <Text style={s.gridLabelText} numberOfLines={1}>{lang === 'pl' ? m.pl : m.en}</Text>
                </View>
              )}
            </Tap>
          </FadeIn>
        );
      }}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
}

export function PhotoSheet({ id }: { id: string }) {
  const { c, s, t, lang, album, updateAlbum, removeFromAlbum, sendToScanner, open, back, showOnMap } = useApp();
  const insets = useSafeAreaInsets();
  const item = album.find((a) => a.id === id);
  const [note, setNote] = useState(item?.note ?? '');
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState('');
  if (!item) return <View style={{ flex: 1, backgroundColor: c.bg }} />;
  const m = item.latin ? findSpecies(item.latin) : undefined;
  const uri = albumUri(item);
  const date = new Date(item.date).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const matches = q.trim()
    ? MUSHROOMS.filter((x) => `${x.latin} ${x.pl} ${x.en}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8)
    : [];

  const share = async () => {
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
  };
  const setHere = async () => {
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) { Alert.alert(MAP_TXT[lang].noLocation); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      updateAlbum(item.id, { lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e) {
      console.log('[album] lokalizacja', e);
    }
  };
  const del = () => Alert.alert(t.delQ, t.delMsg, [
    { text: t.cancel, style: 'cancel' },
    { text: t.del, style: 'destructive', onPress: () => { back(); removeFromAlbum(item.id); } },
  ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
      <View style={{ height: 420, backgroundColor: '#000' }}>
        <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={s.heroShade} />
        <Tap onPress={back} style={[s.backBtn, { top: insets.top + 10 }]}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Tap>
      </View>
      <View style={s.sheetBody}>
        <Text style={s.mono}>{date.toUpperCase()}</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {([
            ['scan', t.scanIt, () => sendToScanner(item), false],
            ['share-social-outline', t.share, share, false],
            ['trash-outline', t.del, del, true],
          ] as [string, string, () => void, boolean][]).map(([icon, label, fn, danger]) => (
            <Tap key={label} outer={s.flex} onPress={fn} style={[s.actionBtn, danger && { borderColor: alpha(c.status.d, '55') }]}>
              <Ionicons name={icon as any} size={20} color={danger ? c.status.d : c.ink} />
              <Text style={[s.actionText, danger && { color: c.status.d }]}>{label}</Text>
            </Tap>
          ))}
        </View>

        <Text style={s.sectionLabelIn}>{lang === 'pl' ? 'Gatunek' : 'Species'}</Text>
        {m && !picking ? (
          <Tap onPress={() => open({ kind: 'species', m })} style={s.row}>
            <Photo latin={m.latin} style={s.rowPhoto} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.rowName}>{lang === 'pl' ? m.pl : m.en}</Text>
              <View style={{ flexDirection: 'row' }}><StatusPill st={m.s} small /></View>
            </View>
            <Pressable onPress={() => setPicking(true)} hitSlop={8}><Text style={s.link}>{t.change}</Text></Pressable>
          </Tap>
        ) : !picking ? (
          <Tap onPress={() => setPicking(true)} style={s.secondaryBtn}>
            <Ionicons name="add" size={18} color={c.ink} />
            <Text style={s.secondaryBtnText}>{t.assign}</Text>
          </Tap>
        ) : (
          <View>
            <View style={[s.searchBox, { marginHorizontal: 0, marginTop: 0 }]}>
              <Ionicons name="search" size={18} color={c.muted} />
              <TextInput autoFocus value={q} onChangeText={setQ} placeholder={t.search} placeholderTextColor={c.muted} style={s.searchInput} />
              <Pressable onPress={() => { setPicking(false); setQ(''); }} hitSlop={10}><Ionicons name="close" size={18} color={c.muted} /></Pressable>
            </View>
            {matches.map((x) => (
              <Pressable key={x.latin} onPress={() => { updateAlbum(item.id, { latin: x.latin }); setPicking(false); setQ(''); }} style={s.pickRow}>
                <View style={[s.dot, { backgroundColor: c.status[x.s] }]} />
                <Text style={[s.body, { flex: 1 }]}>{lang === 'pl' ? x.pl : x.en}</Text>
                <Text style={s.latin}>{x.latin}</Text>
              </Pressable>
            ))}
            {!!item.latin && (
              <Pressable onPress={() => { updateAlbum(item.id, { latin: undefined }); setPicking(false); }} style={s.pickRow}>
                <Text style={[s.body, { color: c.muted }]}>{t.unassigned}</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={s.sectionLabelIn}>{MAP_TXT[lang].photoPlace}</Text>
        {item.lat != null && item.lng != null ? (
          <Tap onPress={() => showOnMap(item.lat!, item.lng!, 15)} style={s.linkBtn}>
            <Ionicons name="location" size={18} color={c.fern} />
            <Text style={[s.rowName, { flex: 1, fontSize: 15 }]}>{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</Text>
            <Ionicons name="map-outline" size={16} color={c.muted} />
          </Tap>
        ) : (
          <Tap onPress={setHere} style={s.secondaryBtn}>
            <Ionicons name="locate" size={18} color={c.ink} />
            <Text style={s.secondaryBtnText}>{MAP_TXT[lang].setHere}</Text>
          </Tap>
        )}

        <Text style={s.sectionLabelIn}>{lang === 'pl' ? 'Notatka' : 'Note'}</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          onEndEditing={() => updateAlbum(item.id, { note })}
          onBlur={() => updateAlbum(item.id, { note })}
          placeholder={t.note}
          placeholderTextColor={c.muted}
          multiline
          style={s.noteInput}
        />
      </View>
    </ScrollView>
  );
}
