import { type Theme } from '@/constants/palette';
import { type Lang } from '@/i18n/strings';
import { HEADERS } from '@/lib/photos';
import { findSpecies } from '@/lib/scanner';

// MAPA

// Darmowe źródła: mapa OpenStreetMap i OpenTopoMap (Leaflet w WebView), obserwacje grzybów z iNaturalist,
// warstwa okresowych zakazów wstępu do lasu z Banku Danych o Lasach (Lasy Państwowe).
export const BANS_WMS = 'https://mapserver.bdl.lasy.gov.pl/ArcGIS/services/WMS_zakazy_wstepu_do_lasu/MapServer/WMSServer';

export const MAP_HTML = [
  '<!doctype html><html><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">',
  '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">',
  '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>',
  '<style>',
  'html,body,#map{margin:0;height:100%;background:#E6DECB;font-family:-apple-system,Roboto,sans-serif}',
  'body.dark #map{background:#0D1511}',
  'body.dark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.92) contrast(.88) saturate(.7)}',
  '.leaflet-bottom{bottom:96px}',
  '.leaflet-top{top:150px}',
  '.forest{width:30px;height:30px;border-radius:50%;background:#2F5A3C;border:3px solid #F4EAD5;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center}',
  '.forest i{width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:12px solid #F4EAD5;margin-top:-2px}',
  '.mine{width:18px;height:18px;border-radius:50%;background:#D9922B;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}',
  '.me{width:16px;height:16px;border-radius:50%;background:#2E7CF6;border:3px solid #fff;box-shadow:0 0 0 0 rgba(46,124,246,.6);animation:pulse 2s infinite}',
  '@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(46,124,246,.55)}70%{box-shadow:0 0 0 16px rgba(46,124,246,0)}100%{box-shadow:0 0 0 0 rgba(46,124,246,0)}}',
  '.pop{width:180px}.pop img{width:180px;height:120px;object-fit:cover;border-radius:10px;display:block;margin-bottom:6px}',
  '.pop b{display:block;font-size:14px}.pop i{display:block;color:#6E6C5F;font-size:12px}.pop span{display:block;color:#6E6C5F;font-size:11px;margin-top:2px}',
  '.pop a{display:block;margin-top:8px;padding:7px;border-radius:10px;background:#D9922B;color:#1B231C;text-align:center;font-weight:700;text-decoration:none}',
  '.leaflet-popup-content-wrapper{border-radius:14px}',
  '.spot{width:28px;height:28px;border-radius:9px;background:#D9922B;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);color:#1B231C;font:700 15px/22px sans-serif;text-align:center;transform:rotate(45deg)}',
  '.spot span{display:block;transform:rotate(-45deg)}',
  '.spot.new{background:#fff;border-color:#D9922B;animation:pop .9s infinite alternate}',
  '@keyframes pop{from{transform:rotate(45deg) scale(1)}to{transform:rotate(45deg) scale(1.15)}}',
  '.start{width:26px;height:26px;border-radius:50%;background:#2F5A3C;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);color:#fff;font:700 13px/20px sans-serif;text-align:center}',
  '</style></head><body><div id="map"></div><script>',
  'function send(o){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(o));}',
  'function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c];});}',
  'if(!window.L){send({type:"error",msg:"leaflet"});}',
  'var map=L.map("map",{zoomControl:false}).setView([52.1,19.4],6);',
  'var layers={',
  ' osm:L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap"}),',
  ' topo:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{maxZoom:17,subdomains:"abc",attribution:"&copy; OpenStreetMap, SRTM | &copy; OpenTopoMap (CC-BY-SA)"})',
  '};',
  'var base=layers.osm.addTo(map);',
  'var groups={forests:L.layerGroup().addTo(map),obs:L.layerGroup().addTo(map),mine:L.layerGroup().addTo(map),spots:L.layerGroup().addTo(map),trip:L.layerGroup().addTo(map)};',
  'var bans=null,me=null,meAcc=null,obsList=[],preview=null,tripLine=null,tripStart=null,backLine=null;',
  'var spotIcon=function(cls){return L.divIcon({className:"",html:"<div class=\\"spot "+(cls||"")+"\\"><span>\\u2605</span></div>",iconSize:[28,28],iconAnchor:[14,14]});};',
  'var startIcon=L.divIcon({className:"",html:"<div class=\\"start\\">S</div>",iconSize:[26,26],iconAnchor:[13,13]});',
  // długie przytrzymanie = nowa miejscówka. Własna obsługa dotyku (Android/iOS różnie zgłaszają contextmenu),
  // contextmenu zostaje jako zapas, z blokadą podwójnego zgłoszenia.
  'var lpTimer=null,lpStart=null,lpLast=0;',
  'function longPress(ll){var t=Date.now();if(t-lpLast<900)return;lpLast=t;send({type:"longpress",lat:ll.lat,lng:ll.lng});}',
  'var el=map.getContainer();',
  'el.addEventListener("touchstart",function(e){if(e.touches.length!==1){clearTimeout(lpTimer);return;}var tc=e.touches[0],pt={clientX:tc.clientX,clientY:tc.clientY};lpStart=[pt.clientX,pt.clientY];clearTimeout(lpTimer);lpTimer=setTimeout(function(){longPress(map.mouseEventToLatLng(pt));},650);},{passive:true});',
  'el.addEventListener("touchmove",function(e){var tc=e.touches[0];if(!lpStart||!tc||Math.abs(tc.clientX-lpStart[0])>10||Math.abs(tc.clientY-lpStart[1])>10)clearTimeout(lpTimer);},{passive:true});',
  'el.addEventListener("touchend",function(){clearTimeout(lpTimer);},{passive:true});',
  'map.on("contextmenu",function(e){longPress(e.latlng);});',
  'var forestIcon=L.divIcon({className:"",html:"<div class=\\"forest\\"><i></i></div>",iconSize:[30,30],iconAnchor:[15,15]});',
  'var mineIcon=L.divIcon({className:"",html:"<div class=\\"mine\\"></div>",iconSize:[18,18],iconAnchor:[9,9]});',
  'var meIcon=L.divIcon({className:"",html:"<div class=\\"me\\"></div>",iconSize:[16,16],iconAnchor:[8,8]});',
  'map.on("moveend",function(){var c=map.getCenter();send({type:"move",lat:c.lat,lng:c.lng,zoom:map.getZoom()});});',
  'window.app={',
  ' setBase:function(k){if(layers[k]&&layers[k]!==base){map.removeLayer(base);base=layers[k].addTo(map);base.bringToBack();}},',
  ' setDark:function(d){document.body.classList.toggle("dark",!!d);},',
  ' setForests:function(list){groups.forests.clearLayers();list.forEach(function(f){L.marker([f.lat,f.lng],{icon:forestIcon,title:f.name}).on("click",function(){send({type:"forest",id:f.id});}).addTo(groups.forests);});},',
  ' setMine:function(list){groups.mine.clearLayers();list.forEach(function(p){L.marker([p.lat,p.lng],{icon:mineIcon}).on("click",function(){send({type:"photo",id:p.id});}).addTo(groups.mine);});},',
  ' setObs:function(list){obsList=list;groups.obs.clearLayers();list.forEach(function(o,i){',
  '  var html="<div class=\\"pop\\">"+(o.photo?"<img src=\\""+esc(o.photo)+"\\">":"")+"<b>"+esc(o.name)+"</b><i>"+esc(o.latin)+"</i><span>"+esc(o.date)+"</span>"+(o.atlas?"<a href=\\"#\\" onclick=\\"send({type:\'species\',latin:obsList["+i+"].latin});return false;\\">"+esc(o.cta)+"</a>":"")+"</div>";',
  '  L.circleMarker([o.lat,o.lng],{radius:7,color:"#fff",weight:2,fillColor:o.color,fillOpacity:.95}).bindPopup(html).addTo(groups.obs);',
  ' });},',
  ' show:function(name,on){var g=groups[name];if(!g)return;if(on){g.addTo(map);}else{map.removeLayer(g);}},',
  ' setBans:function(url,names,on){if(bans){map.removeLayer(bans);bans=null;}if(on&&names){bans=L.tileLayer.wms(url,{layers:names,format:"image/png",transparent:true,opacity:.65,attribution:"Bank Danych o Lasach"}).addTo(map);}},',
  ' setMe:function(lat,lng,acc){if(!me){me=L.marker([lat,lng],{icon:meIcon,zIndexOffset:1000}).addTo(map);meAcc=L.circle([lat,lng],{radius:acc,color:"#2E7CF6",weight:1,fillOpacity:.08}).addTo(map);}else{me.setLatLng([lat,lng]);meAcc.setLatLng([lat,lng]).setRadius(acc);}window.app.drawBack();},',
  ' setSpots:function(list){groups.spots.clearLayers();list.forEach(function(p){L.marker([p.lat,p.lng],{icon:spotIcon(),title:p.name,zIndexOffset:500}).on("click",function(){send({type:"spot",id:p.id});}).addTo(groups.spots);});},',
  ' preview:function(lat,lng){if(preview){map.removeLayer(preview);preview=null;}if(lat!=null){preview=L.marker([lat,lng],{icon:spotIcon("new"),zIndexOffset:900}).addTo(map);}},',
  // wycieczka: ślad (linia), punkt startu i przerywana linia „powrót do startu” od mojej pozycji
  ' setTrip:function(start,track){groups.trip.clearLayers();tripLine=null;tripStart=null;backLine=null;if(!start)return;',
  '  tripLine=L.polyline(track.map(function(p){return [p.lat,p.lng];}),{color:"#D9922B",weight:5,opacity:.9}).addTo(groups.trip);',
  '  tripStart=L.marker([start.lat,start.lng],{icon:startIcon,zIndexOffset:800}).on("click",function(){send({type:"tripStart"});}).addTo(groups.trip);',
  '  backLine=L.polyline([],{color:"#2F5A3C",weight:3,dashArray:"6 8",opacity:.85}).addTo(groups.trip);window.app.drawBack();},',
  ' addTrack:function(lat,lng){if(tripLine)tripLine.addLatLng([lat,lng]);},',
  ' drawBack:function(){if(backLine&&tripStart&&me){backLine.setLatLngs([me.getLatLng(),tripStart.getLatLng()]);}},',
  ' fly:function(lat,lng,z){map.flyTo([lat,lng],z||map.getZoom(),{duration:1.1});},',
  ' resize:function(){map.invalidateSize();}',
  '};',
  'send({type:"ready"});',
  '</script></body></html>',
].join('\n');

export const MAP_TXT = {
  pl: {
    title: 'Mapa', street: 'Mapa', terrain: 'Teren',
    forests: 'Polecane lasy', obs: 'Znaleziska', mine: 'Moje', bans: 'Zakazy wstępu',
    locate: 'Moja lokalizacja', list: 'Lista lasów',
    obsHere: 'Szukaj znalezisk tutaj', obsLoading: 'Szukam znalezisk…',
    obsCount: (n: number, r: number, month: string) => `${n} znalezisk w promieniu ${r} km${month ? ` · ${month}` : ''}`,
    obsNone: 'Brak zgłoszonych znalezisk w tym miejscu', monthOnly: 'Tylko ten miesiąc', obsAtlasOnly: 'Tylko z atlasu',
    openAtlas: 'Otwórz w atlasie →', obsErr: 'Nie udało się pobrać znalezisk', bansErr: 'Nie udało się wczytać warstwy zakazów',
    noLocation: 'Brak dostępu do lokalizacji – włącz go w ustawieniach, żeby widzieć siebie na mapie.',
    loadErr: 'Mapa się nie wczytała. Sprawdź internet.',
    voiv: 'Województwo', aboutForest: 'O lesie', whenPick: 'Kiedy zbierać', typical: 'Typowe grzyby', navigate: 'Nawiguj', showOnMap: 'Pokaż na mapie',
    sources: 'Źródła', forestNote: 'Pinezka oznacza przybliżony środek kompleksu leśnego. Przed wejściem sprawdź zakazy wstępu, granice rezerwatów i parków narodowych – tam zbieranie grzybów jest zabronione.',
    forestsTitle: 'Polecane lasy', forestsSub: (n: number) => `${n} kompleksów leśnych w 16 województwach`,
    photoPlace: 'Miejsce', noPlace: 'Brak lokalizacji', setHere: 'Ustaw moją obecną lokalizację',
    // lasy w sezonie
    inSeason: 'W sezonie', seasonOn: (n: number) => `Pokazuję ${n} lasów, w których teraz trwa sezon`,
    // miejscówki
    spots: 'Miejscówki', newSpot: 'Nowa miejscówka', spotName: 'Nazwa', spotNote: 'Notatka (opcjonalnie): co rosło, kiedy…',
    spotDefault: (n: number) => `Miejscówka ${n}`, save: 'Zapisz', cancel: 'Anuluj', del: 'Usuń',
    delSpotQ: 'Usunąć tę miejscówkę?', fromYou: (d: string) => `${d} od ciebie`,
    spotHint: 'Przytrzymaj palec na mapie, aby dodać miejscówkę w dowolnym miejscu.', spotHere: 'Zapisz, gdzie jestem',
    spotSaved: 'Miejscówka zapisana', savedOn: (d: string) => `Zapisano ${d}`,
    // wycieczka
    trip: 'Wycieczka', tripStart: 'Start wycieczki', tripStarted: 'Zapamiętałem punkt startu. Ślad zapisuje się, gdy aplikacja jest otwarta.',
    tripWalked: (d: string, t: string) => `Przebyte ${d} · ${t}`, tripBack: (d: string, dir: string) => `Do startu ${d}, ${dir}`,
    tripAtStart: 'Jesteś przy punkcie startu', tripEnd: 'Zakończ', tripEndQ: 'Zakończyć wycieczkę?', tripEndMsg: 'Ślad trasy i punkt startu zostaną usunięte.',
    tripSummary: (d: string, t: string) => `Koniec wycieczki: ${d} w ${t}`, showStart: 'Pokaż start', waitGps: 'Czekam na sygnał GPS…',
    compassNorth: 'strzałka: północ u góry ekranu',
  },
  en: {
    title: 'Map', street: 'Map', terrain: 'Terrain',
    forests: 'Forests', obs: 'Finds', mine: 'Mine', bans: 'Entry bans',
    locate: 'My location', list: 'Forest list',
    obsHere: 'Search finds here', obsLoading: 'Searching finds…',
    obsCount: (n: number, r: number, month: string) => `${n} finds within ${r} km${month ? ` · ${month}` : ''}`,
    obsNone: 'No reported finds here', monthOnly: 'This month only', obsAtlasOnly: 'Atlas species only',
    openAtlas: 'Open in atlas →', obsErr: 'Could not load finds', bansErr: 'Could not load the entry-ban layer',
    noLocation: 'No location access – enable it in settings to see yourself on the map.',
    loadErr: 'The map did not load. Check your internet connection.',
    voiv: 'Voivodeship', aboutForest: 'About the forest', whenPick: 'When to pick', typical: 'Typical mushrooms', navigate: 'Navigate', showOnMap: 'Show on map',
    sources: 'Sources', forestNote: 'The pin marks the approximate centre of the forest. Before entering, check entry bans and the borders of reserves and national parks – picking mushrooms is forbidden there.',
    forestsTitle: 'Recommended forests', forestsSub: (n: number) => `${n} forests in all 16 voivodeships`,
    photoPlace: 'Place', noPlace: 'No location', setHere: 'Use my current location',
    inSeason: 'In season', seasonOn: (n: number) => `Showing ${n} forests where the season is on now`,
    spots: 'My spots', newSpot: 'New spot', spotName: 'Name', spotNote: 'Note (optional): what grew there, when…',
    spotDefault: (n: number) => `Spot ${n}`, save: 'Save', cancel: 'Cancel', del: 'Delete',
    delSpotQ: 'Delete this spot?', fromYou: (d: string) => `${d} from you`,
    spotHint: 'Press and hold anywhere on the map to add a spot.', spotHere: 'Save where I am',
    spotSaved: 'Spot saved', savedOn: (d: string) => `Saved ${d}`,
    trip: 'Trip', tripStart: 'Start a trip', tripStarted: 'Start point saved. The track is recorded while the app is open.',
    tripWalked: (d: string, t: string) => `Walked ${d} · ${t}`, tripBack: (d: string, dir: string) => `${d} to start, ${dir}`,
    tripAtStart: 'You are at the start point', tripEnd: 'Finish', tripEndQ: 'Finish the trip?', tripEndMsg: 'The track and start point will be removed.',
    tripSummary: (d: string, t: string) => `Trip finished: ${d} in ${t}`, showStart: 'Show start', waitGps: 'Waiting for GPS…',
    compassNorth: 'arrow: north is up',
  },
};

// Nazwy warstw z usługi WMS Lasów Państwowych – pobierane raz z GetCapabilities
export let banLayerNames: Promise<string | null> | null = null;
export function loadBanLayers(): Promise<string | null> {
  if (!banLayerNames) {
    banLayerNames = fetch(`${BANS_WMS}?request=GetCapabilities&service=WMS`, { headers: HEADERS })
      .then((r) => r.text())
      .then((xml) => {
        const names = Array.from(xml.matchAll(/<Layer[^>]*>\s*<Name>([^<]+)<\/Name>/g)).map((m) => m[1].trim());
        console.log('[mapa] warstwy zakazów:', names.join(','));
        return names.length ? names.join(',') : null;
      })
      .catch((e) => { console.log('[mapa] zakazy', e); banLayerNames = null; return null; });
  }
  return banLayerNames;
}

export type Obs = { lat: number; lng: number; name: string; latin: string; date: string; photo: string; color: string; atlas: boolean; cta: string };

export async function loadObservations(lat: number, lng: number, radius: number, month: number | null, lang: Lang, c: Theme, atlasOnly: boolean): Promise<Obs[]> {
  const params = [
    'iconic_taxa=Fungi', 'quality_grade=research', 'photos=true', 'per_page=200', 'order=desc', 'order_by=observed_on',
    `lat=${lat.toFixed(4)}`, `lng=${lng.toFixed(4)}`, `radius=${radius}`, `locale=${lang}`,
    ...(month ? [`month=${month}`] : []),
  ];
  const res = await fetch(`https://api.inaturalist.org/v1/observations?${params.join('&')}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const out: Obs[] = [];
  for (const o of json.results ?? []) {
    const latin: string = o.taxon?.name ?? '';
    const m = latin ? findSpecies(latin) : undefined;
    if (atlasOnly && !m) continue;
    const coords = o.geojson?.coordinates as [number, number] | undefined;
    if (!coords) continue;
    const name = m ? (lang === 'pl' ? m.pl : m.en) : (o.taxon?.preferred_common_name ?? latin);
    out.push({
      lat: coords[1], lng: coords[0], latin, name,
      date: o.observed_on ?? '',
      photo: (o.photos?.[0]?.url ?? '').replace('/square.', '/small.'),
      color: m ? c.status[m.s] : '#8B897C',
      atlas: !!m, cta: MAP_TXT[lang].openAtlas,
    });
  }
  return out;
}
