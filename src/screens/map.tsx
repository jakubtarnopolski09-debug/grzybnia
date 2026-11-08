import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useApp } from '@/context/app-context';
import { findSpecies } from '@/lib/scanner';
import { Tap } from '@/components/common';
import { FOREST_BY_ID, FORESTS } from '@/data/forests';
import { BANS_WMS, loadBanLayers, loadObservations, MAP_HTML, MAP_TXT } from '@/lib/map';
import { bearing, directionName, distance, formatDistance, formatDuration, type LatLng, pathLength } from '@/lib/geo';
import { loadSpots, loadTrip, newSpotId, saveSpots, saveTrip, type Spot, type Trip } from '@/lib/spots';

// Mapa – ekran: lasy, znaleziska z iNaturalist, moje zdjęcia, zakazy wstępu,
// własne miejscówki (długie przytrzymanie) i wycieczka ze śladem GPS i kierunkiem powrotu do startu.

const TRACK_MIN_STEP = 8; // m – krótszych przesunięć nie dopisujemy do śladu (szum GPS)
const TRACK_MAX_ACC = 50; // m – punkty mniej dokładne pomijamy

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
  const [show, setShow] = useState({ forests: true, season: false, obs: false, mine: true, spots: true, bans: false });
  const [center, setCenter] = useState({ lat: 52.1, lng: 19.4, zoom: 6 });
  const [me, setMe] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [locDenied, setLocDenied] = useState(false);
  const [obs, setObs] = useState<{ state: 'idle' | 'loading' | 'done' | 'error'; n: number; r: number }>({ state: 'idle', n: 0, r: 0 });
  const [monthOnly, setMonthOnly] = useState(true);
  const [toast, setToast] = useState('');
  const centeredOnMe = useRef(false);
  const js = (code: string) => web.current?.injectJavaScript(`try{${code}}catch(e){}; true;`);

  // miejscówki
  const [spots, setSpots] = useState<Spot[]>(loadSpots);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ lat: number; lng: number; name: string; note: string } | null>(null);
  // wycieczka
  const [trip, setTrip] = useState<Trip | null>(loadTrip);
  const [heading, setHeading] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const syncedTrack = useRef(-1);
  const tripOn = !!trip;
  const month = new Date().getMonth() + 1;

  // lokalizacja na żywo – gdy mapa jest otwarta albo trwa wycieczka (wtedy częściej i dokładniej)
  const tracking = active || tripOn;
  useEffect(() => {
    if (!tracking) return;
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) { setLocDenied(true); return; }
      setLocDenied(false);
      const watcher = await Location.watchPositionAsync(
        tripOn
          ? { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 }
          : { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 4000 },
        (p) => {
          const pt = { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy ?? 30 };
          setMe(pt);
          if (pt.acc > TRACK_MAX_ACC) return;
          setTrip((cur) => {
            if (!cur) return cur;
            const last = cur.track[cur.track.length - 1];
            if (last && distance(last, pt) < TRACK_MIN_STEP) return cur;
            return { ...cur, track: [...cur.track, { lat: pt.lat, lng: pt.lng }] };
          });
        },
      );
      if (cancelled) watcher.remove(); else sub = watcher;
    })().catch((e) => console.log('[mapa] lokalizacja', e));
    return () => { cancelled = true; sub?.remove(); };
  }, [tracking, tripOn]);

  // kompas – tylko podczas wycieczki na otwartej mapie (strzałka do punktu startu)
  useEffect(() => {
    if (!active || !tripOn) return;
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    Location.watchHeadingAsync((h) => {
      const v = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
      setHeading((cur) => (cur == null || Math.abs(((v - cur + 540) % 360) - 180) >= 4 ? v : cur));
    })
      .then((w) => { if (cancelled) w.remove(); else sub = w; })
      .catch((e) => console.log('[mapa] kompas', e));
    return () => { cancelled = true; sub?.remove(); };
  }, [active, tripOn]);

  // zegar wycieczki
  useEffect(() => {
    if (!tripOn) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [tripOn]);

  // zapis wycieczki w telefonie i synchronizacja śladu z mapą (dopisujemy tylko nowe punkty)
  useEffect(() => { saveTrip(trip); }, [trip]);
  useEffect(() => {
    if (!ready) return;
    if (!trip) { js('window.app.setTrip(null)'); syncedTrack.current = -1; return; }
    const n = trip.track.length;
    if (syncedTrack.current >= 0 && n === syncedTrack.current + 1) {
      const p = trip.track[n - 1];
      js(`window.app.addTrack(${p.lat},${p.lng})`);
    } else if (n !== syncedTrack.current) {
      js(`window.app.setTrip(${JSON.stringify(trip.start)},${JSON.stringify(trip.track)})`);
    }
    syncedTrack.current = n;
     
  }, [ready, trip]);

  useEffect(() => {
    if (!ready || !me) return;
    js(`window.app.setMe(${me.lat},${me.lng},${Math.round(me.acc)})`);
    if (!centeredOnMe.current && !focus) { centeredOnMe.current = true; js(`window.app.fly(${me.lat},${me.lng},12)`); }
    // celowo bez `focus`: zmiana celu na mapie nie ma ponownie wysyłać pozycji użytkownika
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, me]);

  // lasy – wszystkie albo tylko te, w których teraz trwa sezon
  useEffect(() => {
    if (!ready) return;
    const list = show.season ? FORESTS.filter((f) => f.months.includes(month)) : FORESTS;
    js(`window.app.setForests(${JSON.stringify(list.map((f) => ({ id: f.id, lat: f.lat, lng: f.lng, name: f.name })))})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, show.season]);
  useEffect(() => {
    if (!ready) return;
    js(`window.app.setMine(${JSON.stringify(album.filter((a) => a.lat != null && a.lng != null).map((a) => ({ id: a.id, lat: a.lat, lng: a.lng })))})`);
     
  }, [ready, album]);
  useEffect(() => {
    if (!ready) return;
    js(`window.app.setSpots(${JSON.stringify(spots.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, name: p.name })))})`);
     
  }, [ready, spots]);
   
  useEffect(() => { if (ready) js(`window.app.setDark(${c.dark})`); }, [ready, c.dark]);
  useEffect(() => {
    if (!ready || !active) return;
    const id = setTimeout(() => js('window.app.resize()'), 120); // mapa była ukryta – przelicz jej rozmiar
    return () => clearTimeout(id);
     
  }, [ready, active]);
   
  useEffect(() => { if (ready) js(`window.app.setBase('${base}')`); }, [ready, base]);
  useEffect(() => {
    if (!ready) return;
    js(['forests', 'obs', 'mine', 'spots'].map((k) => `window.app.show('${k}',${show[k as keyof typeof show]})`).join(';'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, show.forests, show.obs, show.mine, show.spots]);
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
      const list = await loadObservations(center.lat, center.lng, r, monthFlag ? month : null, lang, c, true);
      js(`window.app.setObs(${JSON.stringify(list)})`);
      setObs({ state: 'done', n: list.length, r });
    } catch (e: any) {
      console.log('[mapa] iNaturalist', e?.message ?? e);
      setObs({ state: 'error', n: 0, r });
    }
  };

  // ---- miejscówki ----
  const startDraft = (p: LatLng) => {
    setSelectedSpot(null);
    setDraft({ lat: p.lat, lng: p.lng, name: mt.spotDefault(spots.length + 1), note: '' });
    js(`window.app.preview(${p.lat},${p.lng})`);
  };
  const cancelDraft = () => { setDraft(null); js('window.app.preview(null)'); };
  const saveDraft = () => {
    if (!draft) return;
    const spot: Spot = { id: newSpotId(), name: draft.name.trim() || mt.spotDefault(spots.length + 1), note: draft.note.trim(), lat: draft.lat, lng: draft.lng, date: new Date().toISOString() };
    const next = [...spots, spot];
    setSpots(next);
    saveSpots(next);
    setShow((cur) => ({ ...cur, spots: true }));
    cancelDraft();
    setToast(mt.spotSaved);
  };
  const removeSpot = (id: string) => {
    Alert.alert(mt.delSpotQ, '', [
      { text: mt.cancel, style: 'cancel' },
      { text: mt.del, style: 'destructive', onPress: () => {
        const next = spots.filter((p) => p.id !== id);
        setSpots(next);
        saveSpots(next);
        setSelectedSpot(null);
      } },
    ]);
  };
  const spot = selectedSpot ? spots.find((p) => p.id === selectedSpot) : undefined;

  // ---- wycieczka ----
  const startTrip = () => {
    if (!me) { setToast(locDenied ? mt.noLocation : mt.waitGps); return; }
    const start = { lat: me.lat, lng: me.lng };
    setTrip({ start, startedAt: Date.now(), track: [start] });
    setNow(Date.now());
    setToast(mt.tripStarted);
  };
  const endTrip = () => {
    Alert.alert(mt.tripEndQ, mt.tripEndMsg, [
      { text: mt.cancel, style: 'cancel' },
      { text: mt.tripEnd, style: 'destructive', onPress: () => {
        if (trip) setToast(mt.tripSummary(formatDistance(pathLength(trip.track), lang), formatDuration(Date.now() - trip.startedAt)));
        setTrip(null);
        setHeading(null);
      } },
    ]);
  };
  const back = trip && me ? { d: distance(me, trip.start), b: bearing(me, trip.start) } : null;

  const onMessage = (e: any) => {
    let msg: any;
    try { msg = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (msg.type === 'ready') setReady(true);
    else if (msg.type === 'move') setCenter({ lat: msg.lat, lng: msg.lng, zoom: msg.zoom });
    else if (msg.type === 'forest') { const f = FOREST_BY_ID.get(msg.id); if (f) open({ kind: 'forest', f }); }
    else if (msg.type === 'photo') open({ kind: 'photo', id: msg.id });
    else if (msg.type === 'species') { const m = findSpecies(msg.latin); if (m) open({ kind: 'species', m }); }
    else if (msg.type === 'longpress') startDraft({ lat: msg.lat, lng: msg.lng });
    else if (msg.type === 'spot') { setDraft(null); setSelectedSpot(msg.id); }
    else if (msg.type === 'tripStart' && trip) js(`window.app.fly(${trip.start.lat},${trip.start.lng},16)`);
    else if (msg.type === 'error') setToast(mt.loadErr);
  };

  const toggle = (k: keyof typeof show) => {
    const on = !show[k];
    setShow((cur) => ({ ...cur, [k]: on, ...(k === 'season' && on ? { forests: true } : {}) }));
    if (k === 'obs' && on && obs.state === 'idle') searchObs();
    if (k === 'season' && on) setToast(mt.seasonOn(FORESTS.filter((f) => f.months.includes(month)).length));
  };
  const monthName = t.months[month - 1].toLowerCase();
  const bottom = Math.max(insets.bottom, 12) + 92;

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
          <MapChip on={show.season} label={mt.inSeason} icon="calendar" color={c.fern} onPress={() => toggle('season')} />
          <MapChip on={show.spots} label={mt.spots} icon="star" onPress={() => toggle('spots')} />
          <MapChip on={show.obs} label={mt.obs} icon="search" onPress={() => toggle('obs')} />
          <MapChip on={show.mine} label={mt.mine} icon="camera" onPress={() => toggle('mine')} />
          <MapChip on={show.bans} label={mt.bans} icon="ban" color={c.status.d} onPress={() => toggle('bans')} />
        </ScrollView>
      </View>

      {/* przyciski z prawej */}
      <View style={[s.mapFabs, { bottom }]}>
        <Tap onPress={() => open({ kind: 'forests' })} style={s.mapFab}>
          <Ionicons name="list" size={20} color={c.ink} />
        </Tap>
        <Tap onPress={() => (me ? startDraft(me) : setToast(locDenied ? mt.noLocation : mt.waitGps))} style={s.mapFab}>
          <Ionicons name="star-outline" size={20} color={c.ink} />
        </Tap>
        <Tap onPress={tripOn ? () => js(`window.app.fly(${trip!.start.lat},${trip!.start.lng},16)`) : startTrip} style={[s.mapFab, tripOn && { backgroundColor: c.fern, borderColor: c.fern }]}>
          <Ionicons name="footsteps" size={20} color={tripOn ? '#fff' : c.ink} />
        </Tap>
        <Tap onPress={() => (me ? js(`window.app.fly(${me.lat},${me.lng},14)`) : setToast(locDenied ? mt.noLocation : mt.waitGps))} style={[s.mapFab, { backgroundColor: c.amber, borderColor: c.amber }]}>
          <Ionicons name="locate" size={21} color={c.onAmber} />
        </Tap>
      </View>

      {/* dolne panele: miejscówka, wycieczka, znaleziska */}
      <View pointerEvents="box-none" style={[s.mapBottom, { bottom }]}>
        {spot && (
          <View style={s.mapPanel}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Ionicons name="star" size={18} color={c.amber} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.mapPanelTitle} numberOfLines={1}>{spot.name}</Text>
                {!!spot.note && <Text style={[s.subtle, { fontSize: 12.5 }]} numberOfLines={2}>{spot.note}</Text>}
                <Text style={[s.subtle, { fontSize: 12 }]}>
                  {[me ? mt.fromYou(formatDistance(distance(me, spot), lang)) : '', mt.savedOn(new Date(spot.date).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB'))].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <Pressable onPress={() => setSelectedSpot(null)} hitSlop={10}><Ionicons name="close" size={20} color={c.muted} /></Pressable>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
              <Tap outer={s.flex} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}&travelmode=walking`)} style={[s.primaryBtn, { paddingVertical: 9 }]}>
                <Ionicons name="navigate" size={15} color={c.onAmber} />
                <Text style={[s.primaryBtnText, { fontSize: 13 }]}>{mt.navigate}</Text>
              </Tap>
              <Tap onPress={() => removeSpot(spot.id)} style={[s.secondaryBtn, { paddingVertical: 9 }]}>
                <Ionicons name="trash-outline" size={15} color={c.status.d} />
              </Tap>
            </View>
          </View>
        )}

        {trip && (
          <View style={s.mapPanel}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.fern, alignItems: 'center', justifyContent: 'center' }}>
                {back && back.d > 25
                  ? <Ionicons name="arrow-up" size={24} color="#fff" style={{ transform: [{ rotate: `${Math.round(back.b - (heading ?? 0))}deg` }] }} />
                  : <Ionicons name="flag" size={20} color="#fff" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.mapPanelTitle} numberOfLines={1}>
                  {!me ? mt.waitGps : back && back.d > 25 ? mt.tripBack(formatDistance(back.d, lang), directionName(back.b, lang)) : mt.tripAtStart}
                </Text>
                <Text style={[s.subtle, { fontSize: 12 }]} numberOfLines={1}>
                  {mt.tripWalked(formatDistance(pathLength(trip.track), lang), formatDuration(now - trip.startedAt))}
                  {heading == null && back && back.d > 25 ? ` · ${mt.compassNorth}` : ''}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
              <Tap outer={s.flex} onPress={() => js(`window.app.fly(${trip.start.lat},${trip.start.lng},16)`)} style={[s.secondaryBtn, { paddingVertical: 9 }]}>
                <Ionicons name="flag-outline" size={15} color={c.ink} />
                <Text style={[s.secondaryBtnText, { fontSize: 13 }]}>{mt.showStart}</Text>
              </Tap>
              <Tap outer={s.flex} onPress={endTrip} style={[s.secondaryBtn, { paddingVertical: 9 }]}>
                <Ionicons name="stop-circle-outline" size={15} color={c.status.d} />
                <Text style={[s.secondaryBtnText, { fontSize: 13 }]}>{mt.tripEnd}</Text>
              </Tap>
            </View>
          </View>
        )}

        {show.obs && (
          <View style={s.mapPanel}>
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
      </View>

      {(!!toast || (locDenied && active)) && (
        <View style={[s.mapToast, { top: insets.top + 110 }]}>
          <Text style={{ color: '#fff', fontSize: 13, lineHeight: 18 }}>{toast || mt.noLocation}</Text>
        </View>
      )}

      {/* nowa miejscówka: nazwa i notatka */}
      <Modal visible={!!draft} transparent animationType="slide" onRequestClose={cancelDraft} statusBarTranslucent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.flex}>
          <Pressable style={s.modalShade} onPress={cancelDraft}>
            <Pressable style={[s.modalCard, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]} onPress={() => {}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="star" size={20} color={c.amber} />
                <Text style={[s.mapPanelTitle, { fontSize: 18 }]}>{mt.newSpot}</Text>
              </View>
              {draft && (
                <>
                  <Text style={[s.subtle, { fontSize: 12 }]}>
                    {draft.lat.toFixed(5)}, {draft.lng.toFixed(5)}{me ? ` · ${mt.fromYou(formatDistance(distance(me, draft), lang))}` : ''}
                  </Text>
                  <TextInput
                    value={draft.name}
                    onChangeText={(v) => setDraft((d) => (d ? { ...d, name: v } : d))}
                    placeholder={mt.spotName}
                    placeholderTextColor={c.muted}
                    style={s.input}
                    selectTextOnFocus
                  />
                  <TextInput
                    value={draft.note}
                    onChangeText={(v) => setDraft((d) => (d ? { ...d, note: v } : d))}
                    placeholder={mt.spotNote}
                    placeholderTextColor={c.muted}
                    style={[s.input, { minHeight: 70, textAlignVertical: 'top' }]}
                    multiline
                  />
                  <Text style={[s.subtle, { fontSize: 12 }]}>{mt.spotHint}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Tap outer={s.flex} onPress={cancelDraft} style={s.secondaryBtn}>
                      <Text style={s.secondaryBtnText}>{mt.cancel}</Text>
                    </Tap>
                    <Tap outer={s.flex} onPress={saveDraft} style={s.primaryBtn}>
                      <Ionicons name="checkmark" size={18} color={c.onAmber} />
                      <Text style={s.primaryBtnText}>{mt.save}</Text>
                    </Tap>
                  </View>
                </>
              )}
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
