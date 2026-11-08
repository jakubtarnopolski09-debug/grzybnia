import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useApp } from '@/context/app-context';
import { findSpecies } from '@/lib/scanner';
import { Tap } from '@/components/common';
import { FOREST_BY_ID, FORESTS } from '@/data/forests';
import { BANS_WMS, loadBanLayers, loadObservations, MAP_HTML, MAP_TXT } from '@/lib/map';

// Mapa – ekran

export function MapChip({ on, label, icon, onPress, color }: { on: boolean; label: string; icon: string; onPress: () => void; color?: string }) {
  const { c, s } = useApp();
  return (
    <Tap onPress={onPress} style={[s.mapChip, on && { backgroundColor: c.ink, borderColor: c.ink }]}>
      <Ionicons name={icon as any} size={14} color={on ? (color ?? c.amber) : c.muted} />
      <Text style={[s.chipText, on && { color: c.bg }]}>{label}</Text>
    </Tap>
  );
}

export function MapScreen({ active, focus }: { active: boolean; focus: { lat: number; lng: number; zoom: number; n: number } | null }) {
  const { c, s, t, lang, album, open } = useApp();
  const mt = MAP_TXT[lang];
  const insets = useSafeAreaInsets();
  const web = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [base, setBase] = useState<'osm' | 'topo'>('osm');
  const [show, setShow] = useState({ forests: true, obs: false, mine: true, bans: false });
  const [center, setCenter] = useState({ lat: 52.1, lng: 19.4, zoom: 6 });
  const [me, setMe] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [locDenied, setLocDenied] = useState(false);
  const [obs, setObs] = useState<{ state: 'idle' | 'loading' | 'done' | 'error'; n: number; r: number }>({ state: 'idle', n: 0, r: 0 });
  const [monthOnly, setMonthOnly] = useState(true);
  const [toast, setToast] = useState('');
  const centeredOnMe = useRef(false);
  const js = (code: string) => web.current?.injectJavaScript(`try{${code}}catch(e){}; true;`);

  // lokalizacja na żywo – tylko gdy zakładka mapy jest otwarta
  useEffect(() => {
    if (!active) return;
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) { setLocDenied(true); return; }
      setLocDenied(false);
      const watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 4000 },
        (p) => setMe({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy ?? 30 }),
      );
      if (cancelled) watcher.remove(); else sub = watcher;
    })().catch((e) => console.log('[mapa] lokalizacja', e));
    return () => { cancelled = true; sub?.remove(); };
  }, [active]);

  useEffect(() => {
    if (!ready || !me) return;
    js(`window.app.setMe(${me.lat},${me.lng},${Math.round(me.acc)})`);
    if (!centeredOnMe.current && !focus) { centeredOnMe.current = true; js(`window.app.fly(${me.lat},${me.lng},12)`); }
    // celowo bez `focus`: zmiana celu na mapie nie ma ponownie wysyłać pozycji użytkownika
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, me]);

  useEffect(() => {
    if (!ready) return;
    js(`window.app.setForests(${JSON.stringify(FORESTS.map((f) => ({ id: f.id, lat: f.lat, lng: f.lng, name: f.name })))})`);
  }, [ready]);
  useEffect(() => {
    if (!ready) return;
    js(`window.app.setMine(${JSON.stringify(album.filter((a) => a.lat != null && a.lng != null).map((a) => ({ id: a.id, lat: a.lat, lng: a.lng })))})`);
  }, [ready, album]);
  useEffect(() => { if (ready) js(`window.app.setDark(${c.dark})`); }, [ready, c.dark]);
  useEffect(() => {
    if (!ready || !active) return;
    const id = setTimeout(() => js('window.app.resize()'), 120); // mapa była ukryta – przelicz jej rozmiar
    return () => clearTimeout(id);
  }, [ready, active]);
  useEffect(() => { if (ready) js(`window.app.setBase('${base}')`); }, [ready, base]);
  useEffect(() => {
    if (!ready) return;
    js(`window.app.show('forests',${show.forests});window.app.show('obs',${show.obs});window.app.show('mine',${show.mine})`);
  }, [ready, show.forests, show.obs, show.mine]);
  useEffect(() => {
    if (!ready) return;
    if (!show.bans) { js(`window.app.setBans('',null,false)`); return; }
    loadBanLayers().then((names) => {
      if (!names) { setToast(mt.bansErr); return; }
      js(`window.app.setBans(${JSON.stringify(BANS_WMS)},${JSON.stringify(names)},true)`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zmiana języka nie ma ponownie wczytywać warstwy zakazów
  }, [ready, show.bans]);
  useEffect(() => {
    if (ready && focus) js(`window.app.fly(${focus.lat},${focus.lng},${focus.zoom})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lecimy tylko przy nowym żądaniu (focus.n)
  }, [ready, focus?.n]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const searchObs = async (monthFlag = monthOnly) => {
    const r = center.zoom >= 12 ? 10 : center.zoom >= 10 ? 25 : 50;
    setObs({ state: 'loading', n: 0, r });
    try {
      const list = await loadObservations(center.lat, center.lng, r, monthFlag ? new Date().getMonth() + 1 : null, lang, c, true);
      js(`window.app.setObs(${JSON.stringify(list)})`);
      setObs({ state: 'done', n: list.length, r });
    } catch (e: any) {
      console.log('[mapa] iNaturalist', e?.message ?? e);
      setObs({ state: 'error', n: 0, r });
    }
  };

  const onMessage = (e: any) => {
    let msg: any;
    try { msg = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (msg.type === 'ready') setReady(true);
    else if (msg.type === 'move') setCenter({ lat: msg.lat, lng: msg.lng, zoom: msg.zoom });
    else if (msg.type === 'forest') { const f = FOREST_BY_ID.get(msg.id); if (f) open({ kind: 'forest', f }); }
    else if (msg.type === 'photo') open({ kind: 'photo', id: msg.id });
    else if (msg.type === 'species') { const m = findSpecies(msg.latin); if (m) open({ kind: 'species', m }); }
    else if (msg.type === 'error') setToast(mt.loadErr);
  };

  const toggle = (k: keyof typeof show) => {
    setShow((cur) => ({ ...cur, [k]: !cur[k] }));
    if (k === 'obs' && !show.obs && obs.state === 'idle') searchObs();
  };
  const monthName = t.months[new Date().getMonth()].toLowerCase();

  return (
    <View style={s.flex}>
      <WebView
        ref={web}
        source={{ html: MAP_HTML }}
        originWhitelist={['*']}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        applicationNameForUserAgent="GrzybniaApp/1.0"
        setSupportMultipleWindows={false}
        onError={() => setToast(mt.loadErr)}
        style={{ flex: 1, backgroundColor: c.card2 }}
      />

      {/* górny panel */}
      <View pointerEvents="box-none" style={[s.mapTop, { paddingTop: insets.top + 8 }]}>
        <View style={s.mapBar}>
          <Text style={[s.brand, { fontSize: 22 }]}>{mt.title}</Text>
          <View style={s.langSwitch}>
            {(['osm', 'topo'] as const).map((k) => (
              <Pressable key={k} onPress={() => setBase(k)} style={[s.langBtn, base === k && { backgroundColor: c.ink }]}>
                <Text style={[s.langText, base === k && { color: c.bg }]}>{k === 'osm' ? mt.street : mt.terrain}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 16, paddingTop: 8 }}>
          <MapChip on={show.forests} label={mt.forests} icon="leaf" color={c.fern} onPress={() => toggle('forests')} />
          <MapChip on={show.obs} label={mt.obs} icon="search" onPress={() => toggle('obs')} />
          <MapChip on={show.mine} label={mt.mine} icon="camera" onPress={() => toggle('mine')} />
          <MapChip on={show.bans} label={mt.bans} icon="ban" color={c.status.d} onPress={() => toggle('bans')} />
        </ScrollView>
      </View>

      {/* przyciski z prawej */}
      <View style={[s.mapFabs, { bottom: Math.max(insets.bottom, 12) + 92 }]}>
        <Tap onPress={() => open({ kind: 'forests' })} style={s.mapFab}>
          <Ionicons name="list" size={20} color={c.ink} />
        </Tap>
        <Tap onPress={() => (me ? js(`window.app.fly(${me.lat},${me.lng},14)`) : setToast(mt.noLocation))} style={[s.mapFab, { backgroundColor: c.amber, borderColor: c.amber }]}>
          <Ionicons name="locate" size={21} color={c.onAmber} />
        </Tap>
      </View>

      {/* panel znalezisk */}
      {show.obs && (
        <View style={[s.obsPanel, { bottom: Math.max(insets.bottom, 12) + 92 }]}>
          <Text style={[s.subtle, { fontSize: 12.5 }]} numberOfLines={2}>
            {obs.state === 'loading' ? mt.obsLoading
              : obs.state === 'error' ? mt.obsErr
              : obs.state === 'done' ? (obs.n ? mt.obsCount(obs.n, obs.r, monthOnly ? monthName : '') : mt.obsNone)
              : ''}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
            <Tap outer={s.flex} onPress={() => searchObs()} style={[s.primaryBtn, { paddingVertical: 9 }]}>
              {obs.state === 'loading' ? <ActivityIndicator color={c.onAmber} size="small" /> : <Ionicons name="refresh" size={15} color={c.onAmber} />}
              <Text style={[s.primaryBtnText, { fontSize: 13 }]}>{mt.obsHere}</Text>
            </Tap>
            <Tap onPress={() => { setMonthOnly((v) => !v); searchObs(!monthOnly); }} style={[s.secondaryBtn, { paddingVertical: 9 }, monthOnly && { borderColor: c.amber }]}>
              <Ionicons name={monthOnly ? 'calendar' : 'calendar-outline'} size={15} color={c.ink} />
              <Text style={[s.secondaryBtnText, { fontSize: 13 }]}>{monthOnly ? monthName : '12 mies.'}</Text>
            </Tap>
          </View>
        </View>
      )}

      {(!!toast || (locDenied && active)) && (
        <View style={[s.mapToast, { top: insets.top + 110 }]}>
          <Text style={{ color: '#fff', fontSize: 13, lineHeight: 18 }}>{toast || mt.noLocation}</Text>
        </View>
      )}
    </View>
  );
}
