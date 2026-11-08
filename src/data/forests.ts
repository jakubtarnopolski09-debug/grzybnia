
// POLECANE LASY

// Zebrane z artykułów i relacji grzybiarzy (źródła w FOREST_SOURCES). Współrzędne to przybliżony środek kompleksu
// leśnego – nie konkretne „miejscówki”. Pora zbioru to typowy sezon dla danego typu lasu; w danym roku decyduje pogoda.
export type Forest = {
  id: string; v: string; name: string; lat: number; lng: number;
  about: [string, string]; when: [string, string]; months: number[]; species: string[]; src: number[];
};

export const VOIVODESHIPS: Record<string, string> = {
  ds: 'Dolnośląskie', kp: 'Kujawsko-pomorskie', lb: 'Lubelskie', lu: 'Lubuskie', ld: 'Łódzkie', mp: 'Małopolskie',
  mz: 'Mazowieckie', op: 'Opolskie', pk: 'Podkarpackie', pd: 'Podlaskie', pm: 'Pomorskie', sl: 'Śląskie',
  sk: 'Świętokrzyskie', wn: 'Warmińsko-mazurskie', wp: 'Wielkopolskie', zp: 'Zachodniopomorskie',
};

export const FOREST_SOURCES: [string, string][] = [
  ['Triverna – Gdzie na grzyby w Polsce', 'https://triverna.pl/blog/gdzie-na-grzyby-w-polsce'],
  ['RMF24 – Gdzie na grzyby w Wielkopolsce', 'https://www.rmf24.pl/regiony/poznan/news-gdzie-na-grzyby-w-wielkopolsce-poznaj-najlepsze-miejscowki,nIdn,1019128'],
  ['RMF24 – Najlepsze miejsca na grzyby w Małopolsce', 'https://www.rmf24.pl/regiony/krakow/news-najlepsze-miejsca-na-grzyby-w-malopolsce-gdzie-jest-wysyp-i-,nIdn,1017031'],
  ['wroclaw.pl – Gdzie na grzyby na Dolnym Śląsku', 'https://www.wroclaw.pl/dla-mieszkanca/gdzie-na-grzyby-na-dolnym-slasku-2025-gdzie-na-grzyby-wokol-wroclawia-najlepsze-miejsca'],
  ['Nadleśnictwo Wymiarki – ścieżka grzybowa', 'https://wymiarki.zielonagora.lasy.gov.pl/en/o-nadlesnictwie/-/asset_publisher/kCS6/content/sciezka-grzybowa'],
  ['Interia – Gdzie szukać grzybów', 'https://wydarzenia.interia.pl/kraj/news-gdzie-szukac-grzybow-wskazujemy-gdzie-znajdziesz-ich-najwiec,nId,7753362'],
  // ogólne mapy lasów – do sprawdzenia zasięgu kompleksu, typu drzewostanu i aktualnych zakazów
  ['Bank Danych o Lasach – mapa lasów i zakazów', 'https://www.bdl.lasy.gov.pl/portal/mapy'],
  ['Lasy Państwowe – Czas w las (nadleśnictwa, miejsca postoju)', 'https://www.czaswlas.pl'],
];

// typowe pory zbioru dla typów lasu
export const W_BOR: [string, string] = ['Najlepiej od sierpnia do października, 3–7 dni po obfitym deszczu przy ciepłych nocach. Kurki już od lipca, podgrzybki i maślaki do listopada.', 'Best from August to October, 3–7 days after heavy rain with warm nights. Chanterelles from July, bay boletes and slippery jacks into November.'];
export const W_MIX: [string, string] = ['Pierwsze prawdziwki w czerwcu–lipcu, główny wysyp we wrześniu i październiku. Po suchym lecie szukaj w wilgotnych obniżeniach.', 'First porcini in June–July, main flush in September and October. After a dry summer search damp hollows.'];
export const W_MTN: [string, string] = ['W górach sezon zaczyna się wcześniej: borowiki od lipca, szczyt w sierpniu i wrześniu. Wyżej położone lasy kończą sezon już w październiku.', 'In the mountains the season starts earlier: boletes from July, peak in August and September. Higher forests finish by October.'];
export const M_BOR = [7, 8, 9, 10, 11];
export const M_MIX = [6, 7, 8, 9, 10];
export const M_MTN = [7, 8, 9, 10];

export const FORESTS: Forest[] = [
  // Dolnośląskie
  { id: 'bory-dolnoslaskie', v: 'ds', name: 'Bory Dolnośląskie', lat: 51.40, lng: 15.45, src: [0],
    about: ['Największy zwarty kompleks borów sosnowych w Polsce, na piaszczystych glebach między Bolesławcem a Przemkowem. Rozległe, płaskie, łatwe do chodzenia.', 'Poland’s largest continuous pine forest, on sandy soils between Bolesławiec and Przemków. Vast, flat and easy to walk.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius', 'Boletus pinophilus'] },
  { id: 'lasy-milickie', v: 'ds', name: 'Lasy Milickie (Dolina Baryczy)', lat: 51.50, lng: 17.22, src: [0, 3],
    about: ['Buczyny i bory sosnowe wokół Milicza i Żmigrodu. Część doliny to park krajobrazowy i rezerwaty – zbieraj tylko poza rezerwatami.', 'Beech woods and pine forests around Milicz and Żmigród. Parts of the valley are a landscape park and reserves – pick only outside reserves.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Leccinum scabrum'] },
  { id: 'gory-sowie', v: 'ds', name: 'Góry Sowie', lat: 50.68, lng: 16.45, src: [3, 5],
    about: ['Świerkowo-bukowe lasy górskie (Głuszyca, Zagórze Śląskie, Lubachów). Grzybiarze polecają je na prawdziwki i borowiki sosnowe.', 'Spruce-beech mountain forests (Głuszyca, Zagórze Śląskie, Lubachów). Pickers recommend them for porcini and pine boletes.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Boletus pinophilus', 'Cantharellus cibarius'] },

  // Kujawsko-pomorskie
  { id: 'bory-tucholskie', v: 'kp', name: 'Bory Tucholskie', lat: 53.66, lng: 18.05, src: [0],
    about: ['Ogromne bory sosnowe w gminach Tuchola, Śliwice i Osiek oraz wokół Jeziora Charzykowskiego. Słyną z podgrzybków i maślaków. Środek to park narodowy – tam nie zbieramy.', 'Huge pine forests around Tuchola, Śliwice and Osiek and Lake Charzykowskie. Famous for bay boletes and slippery jacks. The core is a national park – no picking there.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Suillus bovinus', 'Cantharellus cibarius'] },
  { id: 'pojezierze-brodnickie', v: 'kp', name: 'Pojezierze Brodnickie', lat: 53.33, lng: 19.45, src: [0],
    about: ['Rozległe lasy mieszane wśród jezior na wschód od Brodnicy. Wilgotne brzegi jezior sprzyjają koźlarzom.', 'Extensive mixed forests among lakes east of Brodnica. Damp lakeshores favour scaber stalks.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Leccinum scabrum', 'Cantharellus cibarius'] },
  { id: 'lasy-wloclawskie', v: 'kp', name: 'Lasy wokół Włocławka', lat: 52.57, lng: 19.20, src: [0],
    about: ['Bory i lasy mieszane Gostynińsko-Włocławskiego Parku Krajobrazowego. Polecane na prawdziwki i kozaki.', 'Pine and mixed forests of the Gostynin-Włocławek Landscape Park. Recommended for porcini and scaber stalks.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Leccinum scabrum', 'Leccinum aurantiacum', 'Imleria badia'] },

  // Lubelskie
  { id: 'lasy-janowskie', v: 'lb', name: 'Lasy Janowskie', lat: 50.67, lng: 22.37, src: [0],
    about: ['Część dawnej Puszczy Solskiej koło Janowa Lubelskiego – bory sosnowe i mieszane. Po deszczu kanie, podgrzybki i maślaki.', 'Part of the old Solska Forest near Janów Lubelski – pine and mixed forests. After rain: parasols, bay boletes and slippery jacks.'],
    when: W_BOR, months: M_BOR, species: ['Macrolepiota procera', 'Imleria badia', 'Suillus luteus', 'Boletus edulis'] },
  { id: 'roztocze', v: 'lb', name: 'Roztocze (Zwierzyniec – Szczebrzeszyn)', lat: 50.66, lng: 22.92, src: [0],
    about: ['Lasy jodłowo-bukowe i sosnowe na pagórkach Roztocza. Kurki i koźlarze. Roztoczański Park Narodowy i rezerwaty są wyłączone ze zbioru.', 'Fir-beech and pine forests on Roztocze’s hills. Chanterelles and scaber stalks. Roztocze National Park and reserves are off limits.'],
    when: W_MIX, months: M_MIX, species: ['Cantharellus cibarius', 'Leccinum scabrum', 'Boletus edulis'] },
  { id: 'lasy-parczewskie', v: 'lb', name: 'Lasy Parczewskie', lat: 51.60, lng: 22.98, src: [0],
    about: ['Rozległe lasy mieszane wokół Parczewa. Grzybiarze chwalą je za prawdziwki, rydze i kozaki.', 'Extensive mixed forests around Parczew. Praised for porcini, saffron milk caps and scaber stalks.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Lactarius deliciosus', 'Leccinum scabrum'] },

  // Lubuskie
  { id: 'notecka-drezdenko', v: 'lu', name: 'Puszcza Notecka – okolice Drezdenka', lat: 52.78, lng: 15.95, src: [0],
    about: ['Zachodnia część jednego z największych borów sosnowych w Polsce, między Drezdenkiem a Skwierzyną. Piaszczyste wydmy porośnięte sosną.', 'The western part of one of Poland’s largest pine forests, between Drezdenko and Skwierzyna. Sandy dunes covered with pine.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus pinophilus', 'Suillus luteus', 'Cantharellus cibarius'] },
  { id: 'bory-zarskie', v: 'lu', name: 'Bory Dolnośląskie – okolice Żar', lat: 51.53, lng: 15.12, src: [0, 4],
    about: ['Lubuska część Borów Dolnośląskich. W Nadleśnictwie Wymiarki jest kilkukilometrowa ścieżka edukacyjna o grzybach jadalnych i trujących.', 'The Lubusz part of the Lower Silesian Forest. Wymiarki Forest District has a several-kilometre educational trail about edible and poisonous mushrooms.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius'] },
  { id: 'lasy-nowosolskie', v: 'lu', name: 'Lasy koło Nowej Soli (Przyborów, Lubieszów)', lat: 51.80, lng: 15.77, src: [0],
    about: ['Lasy sosnowe i mieszane w dolinie Odry koło Nowej Soli, wymieniane przez grzybiarzy jako dobre na podgrzybki i maślaki.', 'Pine and mixed forests in the Oder valley near Nowa Sól, named by pickers as good for bay boletes and slippery jacks.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Boletus edulis'] },

  // Łódzkie
  { id: 'lasy-spalskie', v: 'ld', name: 'Lasy Spalskie', lat: 51.54, lng: 20.15, src: [0],
    about: ['Bory sosnowe nad Pilicą wokół Spały i Lubochni. Prawdziwki i maślaki, a w okolicach Lubochni kurki i kozaki.', 'Pine forests on the Pilica around Spała and Lubochnia. Porcini and slippery jacks, with chanterelles and scaber stalks near Lubochnia.'],
    when: W_BOR, months: M_BOR, species: ['Boletus edulis', 'Suillus luteus', 'Cantharellus cibarius', 'Leccinum scabrum'] },
  { id: 'lasy-lagiewnickie', v: 'ld', name: 'Las Łagiewnicki (Łódź)', lat: 51.84, lng: 19.47, src: [0],
    about: ['Duży las miejski na północy Łodzi – dobre miejsce na krótkie grzybobranie bez wyjazdu z miasta. W sezonie bywa tłoczno.', 'A large city forest in northern Łódź – good for a short foray without leaving town. Busy in season.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Leccinum scabrum', 'Xerocomus subtomentosus'] },
  { id: 'lasy-sulejowskie', v: 'ld', name: 'Lasy wokół Sulejowa', lat: 51.33, lng: 19.95, src: [0],
    about: ['Lasy Sulejowskiego Parku Krajobrazowego nad Zalewem Sulejowskim i w rejonie Piotrkowa Trybunalskiego. Kurki i kozaki.', 'Forests of Sulejów Landscape Park by the Sulejów Reservoir and around Piotrków Trybunalski. Chanterelles and scaber stalks.'],
    when: W_MIX, months: M_MIX, species: ['Cantharellus cibarius', 'Leccinum scabrum', 'Imleria badia'] },

  // Małopolskie
  { id: 'puszcza-niepolomicka', v: 'mp', name: 'Puszcza Niepołomicka', lat: 50.07, lng: 20.33, src: [0, 2],
    about: ['Lasy mieszane tuż za Krakowem. Polecana na borowiki szlachetne. Fragmenty są rezerwatami – tam zbiór jest zabroniony.', 'Mixed forests just outside Kraków. Recommended for porcini. Some parts are reserves where picking is forbidden.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Leccinum scabrum'] },
  { id: 'beskid-makowski', v: 'mp', name: 'Beskid Makowski (Pcim, Lubień)', lat: 49.75, lng: 19.97, src: [2],
    about: ['Górskie lasy koło Pcimia, Lubnia i masywu Zębalowej. W rankingu grzybowym jedne z najlepiej ocenianych w regionie: podgrzybki, borowiki, koźlarze, rydze.', 'Mountain forests near Pcim, Lubień and the Zębalowa massif. Among the region’s top-rated spots: bay boletes, porcini, scaber stalks, milk caps.'],
    when: [ 'Sezon w Małopolsce rusza zwykle na początku września, a październik to tradycyjnie najlepszy miesiąc. Borowiki mogą pojawić się już w sierpniu.', 'In Małopolska the season usually starts in early September, and October is traditionally the best month. Porcini may appear in August.'],
    months: [8, 9, 10], species: ['Imleria badia', 'Boletus edulis', 'Leccinum scabrum', 'Lactarius deliciosus'] },
  { id: 'orawa', v: 'mp', name: 'Orawa (Jabłonka)', lat: 49.48, lng: 19.70, src: [2],
    about: ['Świerkowe lasy górskie i podgórskie na Orawie. Wysoko w rankingu: borowiki, podgrzybki, maślaki i rydze.', 'Spruce mountain and foothill forests of Orawa. Highly rated: porcini, bay boletes, slippery jacks and milk caps.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Suillus grevillei', 'Lactarius deterrimus'] },
  { id: 'sadecczyzna', v: 'mp', name: 'Beskid Sądecki (Muszyna, Tylicz)', lat: 49.40, lng: 20.95, src: [0, 2],
    about: ['Lasy świerkowo-bukowe na stokach i skrajach młodników wokół Muszyny, Tylicza i Krynicy. Borowiki, podgrzybki i kurki.', 'Spruce-beech forests on slopes and young-stand edges around Muszyna, Tylicz and Krynica. Porcini, bay boletes and chanterelles.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius'] },

  // Mazowieckie
  { id: 'puszcza-kozienicka', v: 'mz', name: 'Puszcza Kozienicka', lat: 51.55, lng: 21.45, src: [0],
    about: ['Lasy mieszane na południe od Warszawy. Grzybiarze radzą jechać po większych deszczach. Rezerwaty wyłączone ze zbioru.', 'Mixed forests south of Warsaw. Pickers advise going after heavy rain. Reserves are off limits.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Leccinum scabrum', 'Cantharellus cibarius'] },
  { id: 'puszcza-kurpiowska', v: 'mz', name: 'Puszcza Kurpiowska (Zielona)', lat: 53.30, lng: 21.50, src: [0],
    about: ['Rozległe bory sosnowe na Kurpiach z polanami, na których szuka się kurek i kani.', 'Extensive pine forests of the Kurpie region, with clearings good for chanterelles and parasols.'],
    when: W_BOR, months: M_BOR, species: ['Cantharellus cibarius', 'Macrolepiota procera', 'Imleria badia', 'Suillus luteus'] },
  { id: 'puszcza-biala', v: 'mz', name: 'Puszcza Biała', lat: 52.70, lng: 21.70, src: [0],
    about: ['Bory sosnowe między Wyszkowem a Brokiem, nad Bugiem i Narwią. Polecana na prawdziwki, rydze i kozaki.', 'Pine forests between Wyszków and Brok, by the Bug and Narew rivers. Recommended for porcini, saffron milk caps and scaber stalks.'],
    when: W_BOR, months: M_BOR, species: ['Boletus edulis', 'Lactarius deliciosus', 'Leccinum scabrum', 'Imleria badia'] },

  // Opolskie
  { id: 'stobrawski', v: 'op', name: 'Stobrawski Park Krajobrazowy', lat: 50.92, lng: 17.78, src: [0],
    about: ['Bory i lasy mieszane przy duktach w dolinie Stobrawy. Podgrzybki. Rezerwaty wyłączone ze zbioru.', 'Pine and mixed forests along forest roads in the Stobrawa valley. Bay boletes. Reserves are off limits.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus edulis', 'Suillus luteus'] },
  { id: 'lasy-turawskie', v: 'op', name: 'Lasy Turawskie', lat: 50.72, lng: 18.10, src: [0],
    about: ['Bory sosnowe wokół Jeziora Turawskiego, na północny wschód od Opola.', 'Pine forests around Lake Turawa, north-east of Opole.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius'] },
  { id: 'gory-opawskie', v: 'op', name: 'Góry Opawskie (Głuchołazy)', lat: 50.30, lng: 17.40, src: [0],
    about: ['Lasy bukowe i świerkowe Parku Krajobrazowego Góry Opawskie. Zbieraj poza rezerwatami.', 'Beech and spruce forests of the Opawskie Mountains Landscape Park. Pick outside reserves.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius'] },

  // Podkarpackie
  { id: 'bieszczady', v: 'pk', name: 'Bieszczady (Cisna, Wetlina)', lat: 49.21, lng: 22.33, src: [0],
    about: ['Lasy bukowo-jodłowe wokół Cisnej, Wetliny i Ustrzyk Dolnych: prawdziwki, rydze, kurki. Bieszczadzki Park Narodowy jest wyłączony ze zbioru.', 'Beech-fir forests around Cisna, Wetlina and Ustrzyki Dolne: porcini, milk caps, chanterelles. Bieszczady National Park is off limits.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Lactarius deliciosus', 'Cantharellus cibarius'] },
  { id: 'beskid-niski', v: 'pk', name: 'Beskid Niski', lat: 49.47, lng: 21.75, src: [0],
    about: ['Lasy bukowe Beskidu Niskiego: borowiki, podgrzybki, maślaki i kozaki. Magurski Park Narodowy jest wyłączony ze zbioru.', 'Beech forests of the Low Beskids: porcini, bay boletes, slippery jacks and scaber stalks. Magura National Park is off limits.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Suillus luteus', 'Leccinum scabrum'] },
  { id: 'puszcza-sandomierska', v: 'pk', name: 'Puszcza Sandomierska (Głogów Młp.)', lat: 50.25, lng: 22.05, src: [0],
    about: ['Bory sosnowe i mieszane na północ od Rzeszowa – okolice Głogowa Małopolskiego, Julina i Brzózy Królewskiej.', 'Pine and mixed forests north of Rzeszów – around Głogów Małopolski, Julin and Brzóza Królewska.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus edulis', 'Suillus luteus', 'Cantharellus cibarius'] },

  // Podlaskie
  { id: 'puszcza-augustowska', v: 'pd', name: 'Puszcza Augustowska', lat: 53.90, lng: 23.20, src: [0],
    about: ['Ogromne bory sosnowe wokół Augustowa: kurki i podgrzybki. Rezerwaty i strefy ochronne wyłączone ze zbioru.', 'Vast pine forests around Augustów: chanterelles and bay boletes. Reserves and protection zones are off limits.'],
    when: W_BOR, months: M_BOR, species: ['Cantharellus cibarius', 'Imleria badia', 'Boletus edulis', 'Suillus luteus'] },
  { id: 'puszcza-knyszynska', v: 'pd', name: 'Puszcza Knyszyńska (Supraśl)', lat: 53.22, lng: 23.35, src: [0, 5],
    about: ['Lasy mieszane wokół Supraśla, Czarnej Białostockiej i Gródka: prawdziwki, kozaki, kurki. Uważaj na strefy ochronne.', 'Mixed forests around Supraśl, Czarna Białostocka and Gródek: porcini, scaber stalks, chanterelles. Watch for protected zones.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Leccinum scabrum', 'Cantharellus cibarius', 'Imleria badia'] },
  { id: 'bialowieza-obrzeza', v: 'pd', name: 'Obrzeża Puszczy Białowieskiej (Hajnówka)', lat: 52.75, lng: 23.50, src: [0],
    about: ['Tylko lasy gospodarcze wokół Hajnówki. W Białowieskim Parku Narodowym i rezerwatach zbieranie grzybów jest zabronione.', 'Only managed forests around Hajnówka. Picking is forbidden in Białowieża National Park and reserves.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Leccinum scabrum', 'Cantharellus cibarius'] },

  // Pomorskie
  { id: 'kaszuby-wdzydze', v: 'pm', name: 'Kaszuby – Wdzydze i Kościerzyna', lat: 54.03, lng: 17.95, src: [0],
    about: ['Bory i lasy mieszane wokół Kościerzyny, Chmielna i Wdzydzkiego Parku Krajobrazowego: podgrzybki i prawdziwki. Na Pomorzu sezon często kulminuje w październiku.', 'Pine and mixed forests around Kościerzyna, Chmielno and Wdzydze Landscape Park: bay boletes and porcini. In Pomerania the season often peaks in October.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus edulis', 'Cantharellus cibarius', 'Suillus luteus'] },
  { id: 'lasy-oliwskie', v: 'pm', name: 'Lasy Trójmiejskie', lat: 54.43, lng: 18.50, src: [0],
    about: ['Bukowe i mieszane lasy Trójmiejskiego Parku Krajobrazowego, tuż przy Gdańsku, Sopocie i Gdyni. Zbieraj poza rezerwatami.', 'Beech and mixed forests of the Tricity Landscape Park, right by Gdańsk, Sopot and Gdynia. Pick outside reserves.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius'] },
  { id: 'bory-chojnice', v: 'pm', name: 'Bory Tucholskie – Brusy i Chojnice', lat: 53.85, lng: 17.72, src: [0],
    about: ['Pomorska część Borów Tucholskich. Rozległe bory sosnowe na piaskach – podgrzybki, maślaki, kurki.', 'The Pomeranian part of the Tuchola Forest. Extensive pine forests on sand – bay boletes, slippery jacks, chanterelles.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius'] },

  // Śląskie
  { id: 'beskid-slaski', v: 'sl', name: 'Beskid Śląski', lat: 49.65, lng: 18.95, src: [0],
    about: ['Świerkowe lasy górskie wokół Wisły, Ustronia i Szczyrku.', 'Spruce mountain forests around Wisła, Ustroń and Szczyrk.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Lactarius deterrimus'] },
  { id: 'beskid-zywiecki', v: 'sl', name: 'Beskid Żywiecki', lat: 49.50, lng: 19.25, src: [0],
    about: ['Górskie lasy świerkowe i bukowe na południe od Żywca. Zbieraj poza rezerwatami.', 'Spruce and beech mountain forests south of Żywiec. Pick outside reserves.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius'] },
  { id: 'lasy-zlotopotockie', v: 'sl', name: 'Lasy Złotopotockie (Jura)', lat: 50.70, lng: 19.38, src: [0],
    about: ['Lasy Jury Krakowsko-Częstochowskiej wokół Złotego Potoku – sosna, buk i wapienne skałki.', 'Forests of the Kraków-Częstochowa Upland around Złoty Potok – pine, beech and limestone outcrops.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Boletus edulis', 'Cantharellus cibarius'] },
  { id: 'lasy-pszczynskie', v: 'sl', name: 'Lasy między Tychami a Pszczyną', lat: 50.05, lng: 18.95, src: [0],
    about: ['Kompleks Lasów Pszczyńskich i Kobiórskich, łatwo dostępny z miast Śląska.', 'The Pszczyna and Kobiór forest complex, easily reached from Silesian cities.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Leccinum scabrum', 'Boletus edulis'] },

  // Świętokrzyskie
  { id: 'cisowsko-orlowinskie', v: 'sk', name: 'Lasy Cisowsko-Orłowińskie', lat: 50.76, lng: 21.05, src: [0],
    about: ['Rozległe lasy jodłowe i sosnowe na południowy wschód od Kielc. Po deszczach podgrzybki i koźlarze.', 'Extensive fir and pine forests south-east of Kielce. After rain: bay boletes and scaber stalks.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Leccinum scabrum', 'Boletus edulis'] },
  { id: 'lasy-suchedniowskie', v: 'sk', name: 'Lasy Suchedniowskie', lat: 51.03, lng: 20.83, src: [0],
    about: ['Kompleksy leśne koło Suchedniowa i Skarżyska-Kamiennej, polecane na prawdziwki.', 'Forest complexes near Suchedniów and Skarżysko-Kamienna, recommended for porcini.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius'] },
  { id: 'sielpia-konskie', v: 'sk', name: 'Lasy wokół Sielpi i Końskich', lat: 51.10, lng: 20.37, src: [0],
    about: ['Bory sosnowe i mieszane w północno-zachodniej części województwa. Świętokrzyski Park Narodowy (Łysogóry) jest wyłączony ze zbioru.', 'Pine and mixed forests in the north-west of the region. Świętokrzyski National Park (Łysogóry) is off limits.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Boletus edulis'] },

  // Warmińsko-mazurskie
  { id: 'puszcza-piska', v: 'wn', name: 'Puszcza Piska', lat: 53.65, lng: 21.65, src: [0],
    about: ['Jeden z największych kompleksów leśnych w Polsce, bory sosnowe wokół Pisza i Rucianego-Nidy: borowiki i koźlarze.', 'One of Poland’s largest forests, pine woods around Pisz and Ruciane-Nida: porcini and scaber stalks.'],
    when: W_BOR, months: M_BOR, species: ['Boletus edulis', 'Leccinum scabrum', 'Imleria badia', 'Cantharellus cibarius'] },
  { id: 'puszcza-borecka', v: 'wn', name: 'Puszcza Borecka', lat: 54.10, lng: 22.05, src: [0],
    about: ['Lasy mieszane z dużym udziałem świerka na wschód od Giżycka. Zbieraj poza rezerwatami.', 'Mixed forests with much spruce east of Giżycko. Pick outside reserves.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Lactarius deterrimus'] },
  { id: 'lasy-warminskie', v: 'wn', name: 'Lasy Warmińskie (Barczewo, Dobre Miasto)', lat: 53.85, lng: 20.55, src: [0],
    about: ['Lasy wokół Olsztyna w stronę Barczewa i Dobrego Miasta: podgrzybki, kurki, maślaki.', 'Forests around Olsztyn towards Barczewo and Dobre Miasto: bay boletes, chanterelles, slippery jacks.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Cantharellus cibarius', 'Suillus luteus'] },
  { id: 'lasy-napiwodzkie', v: 'wn', name: 'Lasy koło Nidzicy i Szczytna', lat: 53.45, lng: 20.60, src: [0],
    about: ['Rozległe bory sosnowe na południu Mazur: kozaki i prawdziwki.', 'Extensive pine forests in southern Masuria: scaber stalks and porcini.'],
    when: W_BOR, months: M_BOR, species: ['Leccinum scabrum', 'Boletus edulis', 'Imleria badia'] },

  // Wielkopolskie
  { id: 'puszcza-notecka', v: 'wp', name: 'Puszcza Notecka (Sieraków, Pamiątkowo)', lat: 52.72, lng: 16.25, src: [0, 1],
    about: ['Ogromny bór sosnowy od Skwierzyny po Oborniki. Bazy wypadowe: Sieraków i Pamiątkowo. Borowiki, koźlarze, maślaki.', 'A huge pine forest stretching from Skwierzyna to Oborniki. Good bases: Sieraków and Pamiątkowo. Porcini, scaber stalks, slippery jacks.'],
    when: W_BOR, months: M_BOR, species: ['Boletus edulis', 'Imleria badia', 'Suillus luteus', 'Sparassis crispa'] },
  { id: 'puszcza-zielonka', v: 'wp', name: 'Puszcza Zielonka', lat: 52.55, lng: 17.05, src: [1],
    about: ['Lasy dębowo-sosnowe tuż na północ od Poznania (Czerwonak): podgrzybki, zajączki i borowiki.', 'Oak-pine forests just north of Poznań (Czerwonak): bay boletes, suede boletes and porcini.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Xerocomus subtomentosus', 'Boletus edulis'] },
  { id: 'nowy-tomysl', v: 'wp', name: 'Lasy Nowy Tomyśl – Zbąszyń – Miedzichowo', lat: 52.36, lng: 15.92, src: [0, 1],
    about: ['Grzybowy trójkąt przy autostradzie A2 (zjazdy Nowy Tomyśl i Trzciel), polecany przez lokalnych grzybiarzy.', 'A productive mushroom triangle by the A2 motorway (Nowy Tomyśl and Trzciel exits), recommended by local pickers.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus edulis', 'Suillus luteus'] },
  { id: 'bory-pilskie', v: 'wp', name: 'Bory koło Piły i Trzcianki', lat: 53.10, lng: 16.70, src: [1],
    about: ['Bory sosnowe w okolicach Dębogóry, Dzierżążna, Smolarni i Kaczor: borowiki i maślaki.', 'Pine forests around Dębogóra, Dzierżążno, Smolarnia and Kaczory: porcini and slippery jacks.'],
    when: W_BOR, months: M_BOR, species: ['Boletus edulis', 'Suillus luteus', 'Imleria badia'] },

  // Zachodniopomorskie
  { id: 'puszcza-drawska', v: 'zp', name: 'Puszcza Drawska', lat: 53.30, lng: 16.00, src: [0],
    about: ['Lasy wokół jezior i duktów na pograniczu z Ziemią Lubuską: borowiki, koźlarze, rydze. Drawieński Park Narodowy jest wyłączony ze zbioru.', 'Forests around lakes and forest roads on the Lubusz border: porcini, scaber stalks, milk caps. Drawa National Park is off limits.'],
    when: W_BOR, months: M_BOR, species: ['Boletus edulis', 'Leccinum scabrum', 'Lactarius deliciosus'] },
  { id: 'puszcza-bukowa', v: 'zp', name: 'Puszcza Bukowa', lat: 53.35, lng: 14.65, src: [0],
    about: ['Lasy bukowo-mieszane tuż przy Szczecinie. Uważaj na obszary chronione i rezerwaty.', 'Beech and mixed forests right by Szczecin. Watch for protected areas and reserves.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Cantharellus cibarius', 'Imleria badia'] },
  { id: 'polanow-miastko', v: 'zp', name: 'Bory koło Polanowa i Miastka', lat: 54.07, lng: 16.85, src: [0],
    about: ['Bory sosnowe na Pomorzu Środkowym: podgrzybki i maślaki.', 'Pine forests of central Pomerania: bay boletes and slippery jacks.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius'] },
  { id: 'puszcza-goleniowska', v: 'zp', name: 'Puszcza Goleniowska', lat: 53.60, lng: 14.85, src: [0],
    about: ['Lasy wokół Goleniowa i Nowogardu na północny wschód od Szczecina.', 'Forests around Goleniów and Nowogard north-east of Szczecin.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Boletus edulis', 'Leccinum scabrum'] },

  // ---- kolejne kompleksy leśne (opisy ogólne: typ lasu i położenie; zasięg sprawdzisz w Banku Danych o Lasach) ----
  // Dolnośląskie
  { id: 'gory-izerskie', v: 'ds', name: 'Góry Izerskie (Świeradów, Szklarska Poręba)', lat: 50.86, lng: 15.38, src: [6, 7],
    about: ['Rozległe świerczyny na grzbietach Gór Izerskich i torfowiskach Hali Izerskiej. Wilgotno i chłodno – sezon zaczyna się wcześnie.', 'Extensive spruce forests on the ridges of the Jizera Mountains and the Izera peat bogs. Damp and cool – the season starts early.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Imleria badia', 'Leccinum vulpinum', 'Gomphidius glutinosus', 'Amanita regalis'] },
  { id: 'gory-kaczawskie', v: 'ds', name: 'Góry Kaczawskie', lat: 50.97, lng: 15.95, src: [6, 7],
    about: ['Niskie góry z lasami bukowymi, świerkowymi i mieszanymi między Złotoryją a Bolkowem.', 'Low mountains with beech, spruce and mixed forests between Złotoryja and Bolków.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Boletus reticulatus', 'Cantharellus cibarius', 'Russula cyanoxantha', 'Hydnum repandum'] },
  { id: 'wzgorza-trzebnickie', v: 'ds', name: 'Wzgórza Trzebnickie (Lasy Trzebnickie)', lat: 51.30, lng: 17.05, src: [6, 7],
    about: ['Buczyny i dąbrowy na morenowych wzgórzach na północ od Wrocławia, poprzecinane wąwozami.', 'Beech and oak woods on moraine hills north of Wrocław, cut by ravines.'],
    when: W_MIX, months: M_MIX, species: ['Boletus reticulatus', 'Boletus edulis', 'Leccinum pseudoscabrum', 'Russula virescens', 'Craterellus cornucopioides'] },
  // Kujawsko-pomorskie
  { id: 'puszcza-bydgoska', v: 'kp', name: 'Puszcza Bydgoska', lat: 53.05, lng: 18.20, src: [6, 7],
    about: ['Bory sosnowe na piaskach i wydmach śródlądowych między Bydgoszczą a Toruniem.', 'Pine forests on sands and inland dunes between Bydgoszcz and Toruń.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Suillus bovinus', 'Cantharellus cibarius', 'Tricholoma portentosum'] },
  { id: 'wdecki-pk', v: 'kp', name: 'Wdecki Park Krajobrazowy (Bory Tucholskie)', lat: 53.53, lng: 18.35, src: [6, 7],
    about: ['Wschodnia część Borów Tucholskich wzdłuż doliny Wdy: bory sosnowe z jeziorami i rzeką.', 'The eastern part of the Tuchola Forest along the Wda valley: pine forests with lakes and the river.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus pinophilus', 'Suillus luteus', 'Leccinum vulpinum', 'Cantharellus cibarius'] },
  // Lubelskie
  { id: 'lasy-sobiborskie', v: 'lb', name: 'Lasy Sobiborskie (Polesie)', lat: 51.45, lng: 23.60, src: [6, 7],
    about: ['Wilgotne bory sosnowe i brzeziny z torfowiskami na Polesiu Lubelskim, przy Bugu.', 'Damp pine and birch forests with bogs in Lublin Polesie, near the Bug river.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Leccinum scabrum', 'Leccinum holopus', 'Russula paludosa', 'Cantharellus cibarius'] },
  { id: 'puszcza-solska', v: 'lb', name: 'Puszcza Solska (Józefów, Biłgoraj)', lat: 50.50, lng: 23.05, src: [6, 7],
    about: ['Duży kompleks borów sosnowych i jodłowych na pograniczu Roztocza, z dolinami Tanwi i Sopotu.', 'A large complex of pine and fir forests on the edge of Roztocze, with the Tanew and Sopot valleys.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus edulis', 'Suillus luteus', 'Cantharellus cibarius', 'Sarcodon imbricatus'] },
  { id: 'lasy-kozlowieckie', v: 'lb', name: 'Lasy Kozłowieckie (Lubartów)', lat: 51.43, lng: 22.55, src: [6, 7],
    about: ['Lasy mieszane i bory na północ od Lublina, w Kozłowieckim Parku Krajobrazowym.', 'Mixed and pine forests north of Lublin, in the Kozłowiecki Landscape Park.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Leccinum scabrum', 'Lactarius deliciosus'] },
  // Lubuskie
  { id: 'puszcza-rzepinska', v: 'lu', name: 'Puszcza Rzepińska', lat: 52.35, lng: 14.85, src: [6, 7],
    about: ['Bory sosnowe na piaskach między Rzepinem a Słubicami, przy granicy z Niemcami.', 'Pine forests on sand between Rzepin and Słubice, near the German border.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Boletus pinophilus', 'Tricholoma portentosum'] },
  { id: 'puszcza-lubuska', v: 'lu', name: 'Puszcza Lubuska (Łagów, Lubrza)', lat: 52.33, lng: 15.30, src: [6, 7],
    about: ['Lasy bukowe i mieszane wśród jezior Pojezierza Łagowskiego.', 'Beech and mixed forests among the lakes of the Łagów Lake District.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Boletus reticulatus', 'Cantharellus cibarius', 'Craterellus cornucopioides'] },
  { id: 'puszcza-gorzowska', v: 'lu', name: 'Puszcza Gorzowska', lat: 52.85, lng: 15.15, src: [6, 7],
    about: ['Bory sosnowe na północ od Gorzowa Wielkopolskiego, w stronę Strzelec Krajeńskich.', 'Pine forests north of Gorzów Wielkopolski, towards Strzelce Krajeńskie.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Boletus pinophilus', 'Cantharellus cibarius'] },
  // Łódzkie
  { id: 'zaleczanski-pk', v: 'ld', name: 'Załęczański Park Krajobrazowy (Warta)', lat: 51.15, lng: 18.60, src: [6, 7],
    about: ['Bory sosnowe i lasy mieszane na wapiennych wzgórzach w zakolu Warty koło Wielunia i Działoszyna.', 'Pine and mixed forests on limestone hills in a bend of the Warta near Wieluń and Działoszyn.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Suillus luteus', 'Lactarius deliciosus'] },
  { id: 'przedborski-pk', v: 'ld', name: 'Przedborski Park Krajobrazowy (Pilica)', lat: 51.05, lng: 19.90, src: [6, 7],
    about: ['Lasy sosnowe, jodłowe i bukowe nad Pilicą, na pograniczu Łódzkiego i Świętokrzyskiego.', 'Pine, fir and beech forests along the Pilica river, on the border of the Łódź and Świętokrzyskie regions.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Leccinum scabrum'] },
  // Małopolskie
  { id: 'beskid-wyspowy', v: 'mp', name: 'Beskid Wyspowy (Limanowa, Mszana Dolna)', lat: 49.70, lng: 20.25, src: [6, 7],
    about: ['Pojedyncze, zalesione „wyspy” górskie z buczynami i jedlinami między Limanową a Mszaną Dolną.', 'Isolated forested mountain ‘islands’ with beech and fir woods between Limanowa and Mszana Dolna.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Cantharellus cibarius', 'Hydnum repandum', 'Russula cyanoxantha'] },
  { id: 'puszcza-dulowska', v: 'mp', name: 'Puszcza Dulowska (Chrzanów)', lat: 50.13, lng: 19.48, src: [6, 7],
    about: ['Lasy jodłowe, bukowe i sosnowe między Chrzanowem a Krzeszowicami, w Parku Krajobrazowym Dolinki Krakowskie.', 'Fir, beech and pine forests between Chrzanów and Krzeszowice, in the Kraków Valleys Landscape Park.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Armillaria mellea'] },
  { id: 'beskid-maly', v: 'mp', name: 'Beskid Mały (Andrychów, Wadowice)', lat: 49.80, lng: 19.40, src: [6, 7],
    about: ['Buczyny i lasy świerkowo-jodłowe w niskim paśmie między Żywcem a Wadowicami.', 'Beech and spruce-fir forests in a low range between Żywiec and Wadowice.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Cantharellus cibarius', 'Imleria badia', 'Craterellus cornucopioides'] },
  // Mazowieckie
  { id: 'lasy-gostyninskie', v: 'mz', name: 'Lasy Gostynińsko-Włocławskie (Gostynin)', lat: 52.45, lng: 19.55, src: [6, 7],
    about: ['Bory sosnowe z licznymi jeziorami na zachodnim Mazowszu, w stronę Włocławka.', 'Pine forests with many lakes in western Mazovia, towards Włocławek.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius', 'Boletus pinophilus'] },
  { id: 'lasy-chojnowskie', v: 'mz', name: 'Lasy Chojnowskie (Piaseczno)', lat: 52.00, lng: 21.05, src: [6, 7],
    about: ['Lasy mieszane i bory na południe od Warszawy, w Chojnowskim Parku Krajobrazowym. Łatwo dojechać z miasta.', 'Mixed and pine forests south of Warsaw, in the Chojnów Landscape Park. Easy to reach from the city.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Boletus edulis', 'Leccinum scabrum', 'Suillus luteus'] },
  { id: 'mazowiecki-pk', v: 'mz', name: 'Mazowiecki Park Krajobrazowy (Otwock, Celestynów)', lat: 52.10, lng: 21.30, src: [6, 7],
    about: ['Bory sosnowe na wydmach na południowy wschód od Warszawy, z bagiennymi obniżeniami.', 'Pine forests on dunes south-east of Warsaw, with boggy hollows.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Suillus bovinus', 'Leccinum scabrum', 'Cantharellus cibarius'] },
  // Opolskie
  { id: 'bory-niemodlinskie', v: 'op', name: 'Bory Niemodlińskie', lat: 50.62, lng: 17.62, src: [6, 7],
    about: ['Bory sosnowe i lasy mieszane ze stawami rybnymi między Opolem a Niemodlinem.', 'Pine and mixed forests with fish ponds between Opole and Niemodlin.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus edulis', 'Suillus luteus', 'Cantharellus cibarius'] },
  { id: 'lasy-oleskie', v: 'op', name: 'Lasy Oleskie (Olesno, Dobrodzień)', lat: 50.80, lng: 18.40, src: [6, 7],
    about: ['Rozległe bory sosnowe i świerkowe na północnym wschodzie Opolszczyzny.', 'Extensive pine and spruce forests in the north-east of the Opole region.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus pinophilus', 'Suillus luteus', 'Leccinum scabrum'] },
  // Podkarpackie
  { id: 'pogorze-przemyskie', v: 'pk', name: 'Pogórze Przemyskie (Krasiczyn, Bircza)', lat: 49.70, lng: 22.55, src: [6, 7],
    about: ['Buczyny i jedliny karpackie na pogórzu na południe od Przemyśla. Mało ludzi, rozległe lasy.', 'Carpathian beech and fir woods in the foothills south of Przemyśl. Few people, extensive forests.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Cantharellus cibarius', 'Hydnum repandum', 'Craterellus cornucopioides'] },
  { id: 'gory-slonne', v: 'pk', name: 'Góry Słonne (Sanok, Ustrzyki Dolne)', lat: 49.48, lng: 22.40, src: [6, 7],
    about: ['Lasy bukowo-jodłowe na pograniczu Pogórza i Bieszczadów, między Sanokiem a Ustrzykami Dolnymi.', 'Beech and fir forests between the foothills and the Bieszczady, between Sanok and Ustrzyki Dolne.'],
    when: W_MTN, months: M_MTN, species: ['Boletus edulis', 'Cantharellus cibarius', 'Imleria badia', 'Russula virescens'] },
  // Podlaskie
  { id: 'lasy-sokolskie', v: 'pd', name: 'Lasy Wzgórz Sokólskich', lat: 53.40, lng: 23.55, src: [6, 7],
    about: ['Lasy mieszane i świerkowe na morenowych wzgórzach na północ od Puszczy Knyszyńskiej.', 'Mixed and spruce forests on moraine hills north of the Knyszyn Forest.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Leccinum aurantiacum', 'Amanita regalis'] },
  { id: 'lasy-lomzynskie', v: 'pd', name: 'Lasy Łomżyńskie (Nowogród, Zbójna)', lat: 53.20, lng: 21.95, src: [6, 7],
    about: ['Wschodnia część dawnej Puszczy Kurpiowskiej: bory sosnowe na piaskach nad Narwią.', 'The eastern part of the former Kurpie Forest: pine forests on sand along the Narew.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius', 'Tricholoma portentosum'] },
  // Pomorskie
  { id: 'puszcza-darzlubska', v: 'pm', name: 'Puszcza Darżlubska (Wejherowo, Puck)', lat: 54.68, lng: 18.20, src: [6, 7],
    about: ['Buczyny i bory sosnowe na wysoczyźnie między Wejherowem, Puckiem a Władysławowem.', 'Beech and pine forests on the upland between Wejherowo, Puck and Władysławowo.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Leccinum scabrum'] },
  { id: 'lasy-mirachowskie', v: 'pm', name: 'Lasy Mirachowskie (Kaszuby)', lat: 54.40, lng: 17.95, src: [6, 7],
    about: ['Lasy bukowe i mieszane wśród jezior i wzgórz w Kaszubskim Parku Krajobrazowym.', 'Beech and mixed forests among lakes and hills in the Kashubian Landscape Park.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Hydnum repandum'] },
  { id: 'lasy-bytowskie', v: 'pm', name: 'Lasy Bytowskie', lat: 54.17, lng: 17.50, src: [6, 7],
    about: ['Rozległe bory sosnowe i świerkowe na Pojezierzu Bytowskim.', 'Extensive pine and spruce forests in the Bytów Lake District.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Boletus pinophilus', 'Suillus luteus', 'Cantharellus cibarius', 'Leccinum vulpinum'] },
  // Śląskie
  { id: 'lasy-lublinieckie', v: 'sl', name: 'Lasy Lublinieckie', lat: 50.67, lng: 18.68, src: [6, 7],
    about: ['Duży kompleks borów sosnowych na północy województwa, wokół Lublińca.', 'A large complex of pine forests in the north of the region, around Lubliniec.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Boletus pinophilus', 'Cantharellus cibarius'] },
  { id: 'lasy-rudy', v: 'sl', name: 'Lasy Rudzkie (Kuźnia Raciborska, Rudy)', lat: 50.20, lng: 18.32, src: [6, 7],
    about: ['Bory sosnowe i lasy mieszane w Parku Krajobrazowym Cysterskie Kompozycje Krajobrazowe Rud Wielkich.', 'Pine and mixed forests in the Cistercian Landscape Compositions of Rudy Wielkie landscape park.'],
    when: W_MIX, months: M_MIX, species: ['Imleria badia', 'Boletus edulis', 'Suillus luteus', 'Leccinum scabrum'] },
  // Świętokrzyskie
  { id: 'lasy-daleszyckie', v: 'sk', name: 'Lasy Daleszyckie', lat: 50.80, lng: 20.90, src: [6, 7],
    about: ['Jedliny i lasy mieszane na południowo-wschodnich stokach Gór Świętokrzyskich, poza parkiem narodowym.', 'Fir and mixed forests on the south-eastern slopes of the Holy Cross Mountains, outside the national park.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Hydnum repandum'] },
  { id: 'lasy-starachowickie', v: 'sk', name: 'Lasy Starachowickie (Puszcza Iłżecka)', lat: 51.08, lng: 21.10, src: [6, 7],
    about: ['Jodłowe i sosnowe lasy dawnej Puszczy Iłżeckiej wokół Starachowic i Wąchocka.', 'Fir and pine forests of the former Iłża Forest around Starachowice and Wąchock.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Leccinum scabrum'] },
  // Warmińsko-mazurskie
  { id: 'puszcza-romincka', v: 'wn', name: 'Puszcza Romincka (Gołdap)', lat: 54.35, lng: 22.45, src: [6, 7],
    about: ['Świerczyny i lasy mieszane o chłodnym klimacie, przy granicy z obwodem królewieckim.', 'Spruce and mixed forests with a cool climate, by the border with the Kaliningrad region.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Leccinum aurantiacum', 'Amanita regalis', 'Gomphidius glutinosus', 'Lactarius deterrimus'] },
  { id: 'lasy-ilawskie', v: 'wn', name: 'Lasy Iławskie (Pojezierze Iławskie)', lat: 53.60, lng: 19.55, src: [6, 7],
    about: ['Lasy mieszane i bory wokół Jezioraka, z wieloma jeziorami i półwyspami.', 'Mixed and pine forests around Lake Jeziorak, with many lakes and peninsulas.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Leccinum scabrum'] },
  // Wielkopolskie
  { id: 'puszcza-pyzdrska', v: 'wp', name: 'Puszcza Pyzdrska (Nadwarciański PK)', lat: 52.15, lng: 17.65, src: [6, 7],
    about: ['Bory sosnowe na wydmach w dolinie Warty, między Pyzdrami a Wrześnią.', 'Pine forests on dunes in the Warta valley, between Pyzdry and Września.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Cantharellus cibarius', 'Tricholoma portentosum'] },
  { id: 'las-krotoszynski', v: 'wp', name: 'Las Krotoszyński', lat: 51.70, lng: 17.45, src: [6, 7],
    about: ['Jeden z największych kompleksów dąbrów w Polsce, ze starymi dębami i grabami.', 'One of the largest oak forests in Poland, with old oaks and hornbeams.'],
    when: W_MIX, months: M_MIX, species: ['Boletus reticulatus', 'Leccinum pseudoscabrum', 'Russula virescens', 'Fistulina hepatica', 'Laetiporus sulphureus'] },
  // Zachodniopomorskie
  { id: 'puszcza-wkrzanska', v: 'zp', name: 'Puszcza Wkrzańska (Police)', lat: 53.60, lng: 14.40, src: [6, 7],
    about: ['Bory sosnowe i lasy mieszane na północ od Szczecina, przy Zalewie Szczecińskim.', 'Pine and mixed forests north of Szczecin, by the Szczecin Lagoon.'],
    when: W_BOR, months: M_BOR, species: ['Imleria badia', 'Suillus luteus', 'Boletus edulis', 'Cantharellus cibarius'] },
  { id: 'puszcza-barlinecka', v: 'zp', name: 'Puszcza Barlinecka', lat: 52.98, lng: 15.25, src: [6, 7],
    about: ['Lasy bukowe, sosnowe i mieszane z jeziorami na granicy Pomorza Zachodniego i Ziemi Lubuskiej.', 'Beech, pine and mixed forests with lakes on the border of West Pomerania and the Lubusz region.'],
    when: W_MIX, months: M_MIX, species: ['Boletus edulis', 'Imleria badia', 'Cantharellus cibarius', 'Leccinum scabrum'] },
];
export const FOREST_BY_ID = new Map(FORESTS.map((f) => [f.id, f]));
