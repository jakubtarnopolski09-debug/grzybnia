// GRZYBOBRANIE – mini-gra: baza 80 grzybów, typy, rzadkość, ewolucje i ruchy w walce.
// Każdy grzyb gry jest oparty na prawdziwym gatunku z atlasu (pole `latin`) – w Grzybodexie można otworzyć jego kartę.

export type GType = 'sciolka' | 'drewno' | 'toksyna' | 'wilgoc' | 'laka';
export type Rarity = 1 | 2 | 3 | 4 | 5; // pospolity … legendarny

/** Parametry rysunku (src/game/art.tsx). */
export type Art = {
  kind: 'cap' | 'ball' | 'shelf' | 'cluster' | 'morel' | 'cup' | 'ear' | 'coral' | 'spines' | 'club' | 'jelly' | 'star' | 'cage' | 'trumpet';
  cap: string; cap2: string;
  shape?: 'convex' | 'flat' | 'funnel' | 'bell' | 'umbrella' | 'shaggy';
  under?: string; pores?: boolean; spines?: boolean;
  stem?: string; stemShape?: 'stout' | 'slim' | 'tall';
  spots?: string; scales?: string; scabers?: string; zones?: string;
  ring?: string | boolean; volva?: string; bulb?: boolean; net?: boolean; cortina?: boolean;
  shelf?: 'oyster' | 'hoof' | 'tiers' | 'tongue';
  n?: number; warts?: boolean; truffle?: boolean; brain?: boolean;
};

export type GameShroom = {
  id: number; key: string; pl: string; en: string; latin: string;
  type: GType; rarity: Rarity; fam: string; stage: 1 | 2 | 3; evo?: string;
  base: { a: number; d: number; h: number };
  art: Art;
};

export const TYPES: Record<GType, { pl: string; en: string; color: string; icon: string }> = {
  sciolka: { pl: 'Ściółka', en: 'Litter', color: '#8A5A2B', icon: 'leaf' },
  drewno: { pl: 'Drewno', en: 'Wood', color: '#B0662E', icon: 'git-branch' },
  toksyna: { pl: 'Toksyna', en: 'Toxin', color: '#8B3FB0', icon: 'skull' },
  wilgoc: { pl: 'Wilgoć', en: 'Damp', color: '#2E7CC6', icon: 'water' },
  laka: { pl: 'Łąka', en: 'Meadow', color: '#4F9F3A', icon: 'flower' },
};

// Koło przewag: każdy typ jest mocny przeciw następnemu i słaby przeciw poprzedniemu.
export const TYPE_WHEEL: GType[] = ['sciolka', 'wilgoc', 'drewno', 'laka', 'toksyna'];
export function effectiveness(att: GType, def: GType): number {
  const i = TYPE_WHEEL.indexOf(att);
  const j = TYPE_WHEEL.indexOf(def);
  if ((i + 1) % 5 === j) return 1.4;
  if ((j + 1) % 5 === i) return 0.7;
  return 1;
}

export const RARITY: Record<Rarity, { pl: string; en: string; color: string; weight: number; catchRate: number; flee: number; spores: number }> = {
  1: { pl: 'Pospolity', en: 'Common', color: '#8B897C', weight: 100, catchRate: 0.55, flee: 0.08, spores: 3 },
  2: { pl: 'Niepospolity', en: 'Uncommon', color: '#3D8B57', weight: 42, catchRate: 0.4, flee: 0.12, spores: 4 },
  3: { pl: 'Rzadki', en: 'Rare', color: '#2E7CC6', weight: 13, catchRate: 0.26, flee: 0.18, spores: 6 },
  4: { pl: 'Epicki', en: 'Epic', color: '#8B3FB0', weight: 3.5, catchRate: 0.13, flee: 0.25, spores: 10 },
  5: { pl: 'Legendarny', en: 'Legendary', color: '#D9922B', weight: 0.6, catchRate: 0.06, flee: 0.32, spores: 20 },
};

// Ruchy: szybki (ładuje energię) i specjalny (zużywa energię) – po jednym na typ.
export const MOVES: Record<GType, { fast: [string, string]; charged: [string, string] }> = {
  sciolka: { fast: ['Grzybnia', 'Mycelium'], charged: ['Lawina liści', 'Leaf Avalanche'] },
  drewno: { fast: ['Drzazga', 'Splinter'], charged: ['Spróchniały pień', 'Rotten Trunk'] },
  toksyna: { fast: ['Jad', 'Venom'], charged: ['Trujący obłok', 'Toxic Cloud'] },
  wilgoc: { fast: ['Rosa', 'Dew'], charged: ['Ulewa', 'Downpour'] },
  laka: { fast: ['Źdźbło', 'Grass Blade'], charged: ['Czarci krąg', 'Fairy Ring'] },
};
export const FAST_POWER = 9;
export const FAST_ENERGY = 10;
export const CHARGED_POWER = 50;
export const CHARGED_COST = 40;

type Row = [key: string, pl: string, en: string, latin: string, type: GType, rarity: Rarity, fam: string, stage: 1 | 2 | 3, evo: string | undefined, base: [number, number, number], art: Art];

const ROWS: Row[] = [
  // ---- rodziny trzystopniowe ----
  ['borowiczek', 'Borowiczek', 'Porcinling', 'Boletus edulis', 'sciolka', 2, 'borowik', 1, 'borowik', [118, 112, 128],
    { kind: 'cap', shape: 'convex', cap: '#7A4A26', cap2: '#5A3318', pores: true, under: '#EDE3C2', stem: '#E8DDC2', stemShape: 'stout', net: true }],
  ['borowik', 'Borowik', 'Porcini', 'Boletus edulis', 'sciolka', 3, 'borowik', 2, 'borowik-wielki', [168, 152, 176],
    { kind: 'cap', shape: 'convex', cap: '#7A4A26', cap2: '#5A3318', pores: true, under: '#E8DCA8', stem: '#E8DDC2', stemShape: 'stout', net: true }],
  ['borowik-wielki', 'Borowik Wielki', 'Great Porcini', 'Boletus edulis', 'sciolka', 4, 'borowik', 3, undefined, [220, 198, 230],
    { kind: 'cap', shape: 'convex', cap: '#6E3F1E', cap2: '#4B2A12', pores: true, under: '#DCCB80', stem: '#E6D9BA', stemShape: 'stout', net: true }],
  ['kureczka', 'Kureczka', 'Chanterling', 'Cantharellus cibarius', 'sciolka', 1, 'kurka', 1, 'kurka', [102, 96, 110],
    { kind: 'cap', shape: 'funnel', cap: '#F2A623', cap2: '#D98A12', under: '#F4B43C', stem: '#F2AE36', stemShape: 'stout' }],
  ['kurka', 'Kurka', 'Chanterelle', 'Cantharellus cibarius', 'sciolka', 2, 'kurka', 2, 'kurka-zlota', [150, 140, 158],
    { kind: 'cap', shape: 'funnel', cap: '#F2A623', cap2: '#D98A12', under: '#F4B43C', stem: '#F2AE36', stemShape: 'stout' }],
  ['kurka-zlota', 'Kurka Złota', 'Golden Chanterelle', 'Cantharellus cibarius', 'sciolka', 3, 'kurka', 3, undefined, [196, 184, 206],
    { kind: 'cluster', n: 3, shape: 'funnel', cap: '#F7B52C', cap2: '#E0901A', under: '#F8C04A', stem: '#F4B840', stemShape: 'stout' }],
  ['muchomorek', 'Muchomorek', 'Flyling', 'Amanita muscaria', 'toksyna', 1, 'muchomor', 1, 'muchomor', [124, 92, 108],
    { kind: 'cap', shape: 'convex', cap: '#D7261E', cap2: '#A9150F', spots: '#FFF8E8', under: '#FFFDF5', stem: '#FBF7EC', stemShape: 'stout', bulb: true }],
  ['muchomor', 'Muchomor', 'Fly Agaric', 'Amanita muscaria', 'toksyna', 2, 'muchomor', 2, 'muchomor-wielki', [176, 128, 150],
    { kind: 'cap', shape: 'flat', cap: '#D7261E', cap2: '#A9150F', spots: '#FFF8E8', under: '#FFFDF5', stem: '#FBF7EC', stemShape: 'tall', ring: true, bulb: true }],
  ['muchomor-wielki', 'Muchomor Wielki', 'Great Fly Agaric', 'Amanita muscaria', 'toksyna', 3, 'muchomor', 3, undefined, [230, 166, 196],
    { kind: 'cap', shape: 'flat', cap: '#E0241A', cap2: '#9E120C', spots: '#FFF8E8', under: '#FFFDF5', stem: '#FBF7EC', stemShape: 'tall', ring: true, bulb: true }],
  ['paleczka', 'Pałeczka', 'Drumstickling', 'Macrolepiota procera', 'laka', 1, 'kania', 1, 'kania', [110, 100, 120],
    { kind: 'cap', shape: 'bell', cap: '#9A7650', cap2: '#6B4A2A', scales: '#5A3A20', under: '#F6F0E2', stem: '#BFA27C', stemShape: 'tall' }],
  ['kania', 'Kania', 'Parasol', 'Macrolepiota procera', 'laka', 2, 'kania', 2, 'kania-olbrzymia', [160, 140, 170],
    { kind: 'cap', shape: 'umbrella', cap: '#D2B996', cap2: '#8A6A44', scales: '#6B4A2A', under: '#F6F0E2', stem: '#BFA27C', stemShape: 'tall', ring: true }],
  ['kania-olbrzymia', 'Kania Olbrzymia', 'Giant Parasol', 'Macrolepiota procera', 'laka', 3, 'kania', 3, undefined, [206, 182, 224],
    { kind: 'cap', shape: 'umbrella', cap: '#D9C2A0', cap2: '#7E5E3A', scales: '#5E3E22', under: '#F8F2E6', stem: '#B8996F', stemShape: 'tall', ring: true }],
  ['purchaweczka', 'Purchaweczka', 'Puffling', 'Lycoperdon perlatum', 'laka', 1, 'purchawka', 1, 'purchawka', [88, 120, 118],
    { kind: 'ball', cap: '#F3EDDF', cap2: '#D8CDB4', warts: true }],
  ['purchawka', 'Purchawka', 'Puffball', 'Lycoperdon perlatum', 'laka', 2, 'purchawka', 2, 'czasznica', [128, 170, 168],
    { kind: 'ball', cap: '#EFE7D4', cap2: '#CFC2A4', warts: true }],
  ['czasznica', 'Czasznica', 'Giant Puffball', 'Calvatia gigantea', 'laka', 3, 'purchawka', 3, undefined, [160, 226, 240],
    { kind: 'ball', cap: '#FAF7EF', cap2: '#DED6C2' }],
  ['opieniek', 'Opieniek', 'Honeyling', 'Armillaria mellea', 'drewno', 1, 'opienka', 1, 'opienka', [108, 102, 104],
    { kind: 'cluster', n: 2, shape: 'convex', cap: '#C8963C', cap2: '#9C6D24', scales: '#6B4A1E', under: '#EFE2C4', stem: '#D9BE8A', stemShape: 'slim' }],
  ['opienka', 'Opieńka', 'Honey Fungus', 'Armillaria mellea', 'drewno', 2, 'opienka', 2, 'gaszcz-opienek', [150, 146, 150],
    { kind: 'cluster', n: 3, shape: 'convex', cap: '#C8963C', cap2: '#9C6D24', scales: '#6B4A1E', under: '#EFE2C4', stem: '#D9BE8A', stemShape: 'slim', ring: true }],
  ['gaszcz-opienek', 'Gąszcz Opieniek', 'Honey Thicket', 'Armillaria mellea', 'drewno', 3, 'opienka', 3, undefined, [196, 190, 198],
    { kind: 'cluster', n: 5, shape: 'flat', cap: '#C8963C', cap2: '#94661F', scales: '#6B4A1E', under: '#EFE2C4', stem: '#D9BE8A', stemShape: 'slim', ring: true }],
  ['boczniaczek', 'Boczniaczek', 'Oysterling', 'Pleurotus ostreatus', 'drewno', 1, 'boczniak', 1, 'boczniak', [100, 110, 112],
    { kind: 'shelf', shelf: 'oyster', n: 1, cap: '#8E9AA6', cap2: '#5F6B78', under: '#F1EEE6' }],
  ['boczniak', 'Boczniak', 'Oyster', 'Pleurotus ostreatus', 'drewno', 2, 'boczniak', 2, 'boczniak-krolewski', [146, 158, 160],
    { kind: 'shelf', shelf: 'oyster', n: 2, cap: '#8E9AA6', cap2: '#5F6B78', under: '#F1EEE6' }],
  ['boczniak-krolewski', 'Boczniak Królewski', 'King Oyster', 'Pleurotus ostreatus', 'drewno', 3, 'boczniak', 3, undefined, [190, 206, 212],
    { kind: 'shelf', shelf: 'oyster', n: 3, cap: '#7E8C9A', cap2: '#4E5A68', under: '#F4F1E8' }],
  ['czernidelko', 'Czernidełko', 'Inkling', 'Coprinus comatus', 'laka', 1, 'czernidlak', 1, 'czernidlak', [116, 94, 104],
    { kind: 'cap', shape: 'shaggy', cap: '#F4F1EA', cap2: '#C9C1B0', scales: '#B59E80', stem: '#F6F3EC', stemShape: 'slim' }],
  ['czernidlak', 'Czernidlak', 'Shaggy Mane', 'Coprinus comatus', 'laka', 2, 'czernidlak', 2, 'czernidlak-atramentowy', [164, 132, 146],
    { kind: 'cap', shape: 'shaggy', cap: '#F4F1EA', cap2: '#C9C1B0', scales: '#A88E6C', stem: '#F6F3EC', stemShape: 'tall' }],
  ['czernidlak-atramentowy', 'Czernidlak Atramentowy', 'Ink Lord', 'Coprinus comatus', 'laka', 3, 'czernidlak', 3, undefined, [214, 170, 190],
    { kind: 'cap', shape: 'shaggy', cap: '#ECE8DF', cap2: '#2A2A2A', scales: '#8A7458', stem: '#F6F3EC', stemShape: 'tall', ring: true }],
  ['bladzik', 'Bladzik', 'Palecap', 'Amanita phalloides', 'toksyna', 2, 'sromotnik', 1, 'sromotnik', [130, 98, 110],
    { kind: 'cap', shape: 'convex', cap: '#B2B984', cap2: '#7E8A52', under: '#FBFAF2', stem: '#F2F1E6', stemShape: 'stout', volva: '#F5F3EA' }],
  ['sromotnik', 'Sromotnik', 'Death Cap', 'Amanita phalloides', 'toksyna', 3, 'sromotnik', 2, 'sromotnik-smiertelny', [184, 136, 154],
    { kind: 'cap', shape: 'flat', cap: '#A8B07A', cap2: '#6E7A45', under: '#FBFAF2', stem: '#F2F1E6', stemShape: 'tall', ring: true, volva: '#F5F3EA' }],
  ['sromotnik-smiertelny', 'Sromotnik Śmiertelny', 'Deathly Cap', 'Amanita phalloides', 'toksyna', 4, 'sromotnik', 3, undefined, [238, 176, 200],
    { kind: 'cap', shape: 'flat', cap: '#98A266', cap2: '#5A6634', under: '#FBFAF2', stem: '#EFEEE2', stemShape: 'tall', ring: true, volva: '#F5F3EA' }],
  ['hubka', 'Hubka', 'Hoofling', 'Fomes fomentarius', 'drewno', 1, 'huba', 1, 'huba', [86, 132, 126],
    { kind: 'shelf', shelf: 'hoof', n: 1, cap: '#A39D90', cap2: '#5E584E', under: '#C9A46A' }],
  ['huba', 'Huba', 'Tinder Hoof', 'Fomes fomentarius', 'drewno', 2, 'huba', 2, 'huba-prastara', [122, 186, 178],
    { kind: 'shelf', shelf: 'hoof', n: 2, cap: '#9A9488', cap2: '#5E584E', under: '#C9A46A' }],
  ['huba-prastara', 'Huba Prastara', 'Ancient Hoof', 'Fomes fomentarius', 'drewno', 3, 'huba', 3, undefined, [156, 240, 232],
    { kind: 'shelf', shelf: 'hoof', n: 3, cap: '#8C8679', cap2: '#4A453C', under: '#C9A46A' }],

  // ---- rodziny dwustopniowe ----
  ['podgrzybek', 'Podgrzybek', 'Bayling', 'Imleria badia', 'sciolka', 1, 'podgrzybek', 1, 'podgrzybek-kasztanowy', [112, 106, 118],
    { kind: 'cap', shape: 'convex', cap: '#6A3B1F', cap2: '#4B2812', pores: true, under: '#E8D27A', stem: '#B88A5A', stemShape: 'stout' }],
  ['podgrzybek-kasztanowy', 'Podgrzybek Kasztanowy', 'Chestnut Bay', 'Imleria badia', 'sciolka', 2, 'podgrzybek', 2, undefined, [166, 154, 172],
    { kind: 'cap', shape: 'convex', cap: '#5E3018', cap2: '#3E200C', pores: true, under: '#DEC660', stem: '#B07E4E', stemShape: 'stout' }],
  ['maslaczek', 'Maślaczek', 'Slipling', 'Suillus luteus', 'sciolka', 1, 'maslak', 1, 'maslak', [104, 100, 116],
    { kind: 'cap', shape: 'convex', cap: '#8A5A2B', cap2: '#6E4420', pores: true, under: '#E9CF5E', stem: '#E6D79C', stemShape: 'slim' }],
  ['maslak', 'Maślak', 'Slippery Jack', 'Suillus luteus', 'sciolka', 2, 'maslak', 2, undefined, [154, 146, 170],
    { kind: 'cap', shape: 'convex', cap: '#8A5A2B', cap2: '#6E4420', pores: true, under: '#E9CF5E', stem: '#E6D79C', stemShape: 'stout', ring: '#7A6B8E' }],
  ['kozlarzyk', 'Koźlarzyk', 'Scaberling', 'Leccinum aurantiacum', 'sciolka', 2, 'kozlarz', 1, 'kozlarz-czerwony', [118, 110, 120],
    { kind: 'cap', shape: 'convex', cap: '#D8662A', cap2: '#B04A18', pores: true, under: '#EAE2D0', stem: '#EFE8DA', stemShape: 'stout', scabers: '#6B4A3A' }],
  ['kozlarz-czerwony', 'Koźlarz Czerwony', 'Red Scaber', 'Leccinum aurantiacum', 'sciolka', 3, 'kozlarz', 2, undefined, [172, 158, 174],
    { kind: 'cap', shape: 'convex', cap: '#D8662A', cap2: '#B04A18', pores: true, under: '#EAE2D0', stem: '#EFE8DA', stemShape: 'tall', scabers: '#5A3A2A' }],
  ['rydzyk', 'Rydzyk', 'Saffronling', 'Lactarius deliciosus', 'sciolka', 2, 'rydz', 1, 'rydz', [110, 108, 116],
    { kind: 'cap', shape: 'funnel', cap: '#E07B39', cap2: '#B9581F', zones: '#C4612A', under: '#F08A3E', stem: '#E8874A', stemShape: 'stout' }],
  ['rydz', 'Rydz', 'Saffron Milkcap', 'Lactarius deliciosus', 'sciolka', 3, 'rydz', 2, undefined, [160, 156, 168],
    { kind: 'cap', shape: 'funnel', cap: '#E07B39', cap2: '#B9581F', zones: '#B8551E', under: '#F08A3E', stem: '#E8874A', stemShape: 'stout' }],
  ['golabczyk', 'Gołąbczyk', 'Sickling', 'Russula emetica', 'toksyna', 1, 'golabek', 1, 'golabek-wymiotny', [120, 90, 104],
    { kind: 'cap', shape: 'convex', cap: '#E2322B', cap2: '#B71E18', under: '#FFFFFF', stem: '#FFFFFF', stemShape: 'stout' }],
  ['golabek-wymiotny', 'Gołąbek Wymiotny', 'The Sickener', 'Russula emetica', 'toksyna', 2, 'golabek', 2, undefined, [170, 126, 148],
    { kind: 'cap', shape: 'flat', cap: '#E2322B', cap2: '#B71E18', under: '#FFFFFF', stem: '#FFFFFF', stemShape: 'stout' }],
  ['lejkowczyk', 'Lejkowczyk', 'Trumpetling', 'Craterellus cornucopioides', 'wilgoc', 2, 'lejkowiec', 1, 'lejkowiec-dety', [106, 104, 112],
    { kind: 'trumpet', n: 1, cap: '#3A3434', cap2: '#141212', under: '#7A767A' }],
  ['lejkowiec-dety', 'Lejkowiec Dęty', 'Horn of Plenty', 'Craterellus cornucopioides', 'wilgoc', 3, 'lejkowiec', 2, undefined, [156, 152, 164],
    { kind: 'trumpet', n: 3, cap: '#2E2A2A', cap2: '#0E0C0C', under: '#6E6A6E' }],
  ['smardzik', 'Smardzik', 'Morelling', 'Morchella esculenta', 'wilgoc', 3, 'smardz', 1, 'smardz', [124, 116, 122],
    { kind: 'morel', cap: '#C9A56E', cap2: '#7A5A34', stem: '#EFE6D0' }],
  ['smardz', 'Smardz', 'Morel', 'Morchella esculenta', 'wilgoc', 4, 'smardz', 2, undefined, [178, 168, 176],
    { kind: 'morel', cap: '#B99561', cap2: '#6E5130', stem: '#EFE6D0' }],
  ['siarkoweczka', 'Siarkóweczka', 'Sulphling', 'Laetiporus sulphureus', 'drewno', 2, 'zolciak', 1, 'zolciak', [116, 110, 120],
    { kind: 'shelf', shelf: 'tiers', n: 2, cap: '#F6A531', cap2: '#F7DE5B' }],
  ['zolciak', 'Żółciak', 'Chicken of the Woods', 'Laetiporus sulphureus', 'drewno', 3, 'zolciak', 2, undefined, [168, 160, 176],
    { kind: 'shelf', shelf: 'tiers', n: 3, cap: '#F49A26', cap2: '#F7DE5B' }],
  ['uszaczek', 'Uszaczek', 'Earling', 'Auricularia auricula-judae', 'drewno', 1, 'uszak', 1, 'uszak', [90, 118, 116],
    { kind: 'ear', n: 1, cap: '#8A5444', cap2: '#4E2A20' }],
  ['uszak', 'Uszak', 'Jelly Ear', 'Auricularia auricula-judae', 'drewno', 2, 'uszak', 2, undefined, [132, 170, 168],
    { kind: 'ear', n: 2, cap: '#7A4636', cap2: '#4E2A20' }],
  ['twardzioszek', 'Twardzioszek', 'Ringling', 'Marasmius oreades', 'laka', 1, 'twardzioszek', 1, 'czarci-krag', [100, 102, 108],
    { kind: 'cluster', n: 2, shape: 'bell', cap: '#D8B98A', cap2: '#B8956A', under: '#F1E6CF', stem: '#E2CDA6', stemShape: 'slim' }],
  ['czarci-krag', 'Czarci Krąg', 'Fairy Ring', 'Marasmius oreades', 'laka', 2, 'twardzioszek', 2, undefined, [146, 150, 156],
    { kind: 'cluster', n: 5, shape: 'bell', cap: '#D8B98A', cap2: '#B08A5E', under: '#F1E6CF', stem: '#E2CDA6', stemShape: 'slim' }],
  ['pieczareczka', 'Pieczareczka', 'Fieldling', 'Agaricus campestris', 'laka', 1, 'pieczarka', 1, 'pieczarka', [108, 106, 112],
    { kind: 'cap', shape: 'convex', cap: '#FBF8F1', cap2: '#DCD2BE', under: '#E8A2A0', stem: '#FBF8F1', stemShape: 'stout' }],
  ['pieczarka', 'Pieczarka', 'Field Mushroom', 'Agaricus campestris', 'laka', 2, 'pieczarka', 2, undefined, [156, 154, 162],
    { kind: 'cap', shape: 'flat', cap: '#FBF8F1', cap2: '#D6CBB4', under: '#9A5A50', stem: '#FBF8F1', stemShape: 'stout', ring: true }],
  ['mleczajek', 'Mleczajek', 'Murkling', 'Lactarius necator', 'toksyna', 2, 'mleczaj', 1, 'mleczaj-paskudnik', [122, 100, 112],
    { kind: 'cap', shape: 'funnel', cap: '#5A5A32', cap2: '#2B2B18', under: '#EADBB8', stem: '#6A6A40', stemShape: 'stout' }],
  ['mleczaj-paskudnik', 'Mleczaj Paskudnik', 'Ugly Milkcap', 'Lactarius necator', 'toksyna', 3, 'mleczaj', 2, undefined, [176, 142, 160],
    { kind: 'cap', shape: 'funnel', cap: '#4A4A2A', cap2: '#1E1E10', zones: '#3A3A20', under: '#EADBB8', stem: '#5A5A36', stemShape: 'stout' }],
  ['lakoweczka', 'Lakóweczka', 'Amethling', 'Laccaria amethystina', 'wilgoc', 1, 'lakowka', 1, 'lakowka-ametystowa', [102, 98, 106],
    { kind: 'cap', shape: 'convex', cap: '#8A4FB0', cap2: '#5A2A7E', under: '#9A5FC0', stem: '#8A4FB0', stemShape: 'slim' }],
  ['lakowka-ametystowa', 'Lakówka Ametystowa', 'Amethyst Deceiver', 'Laccaria amethystina', 'wilgoc', 2, 'lakowka', 2, undefined, [150, 142, 154],
    { kind: 'cluster', n: 3, shape: 'flat', cap: '#7A3FA0', cap2: '#4E2272', under: '#8A4FB0', stem: '#7A3FA0', stemShape: 'slim' }],
  ['bagienniczek', 'Bagienniczek', 'Bogling', 'Leccinum holopus', 'wilgoc', 2, 'kozlarz-bagienny', 1, 'kozlarz-bagienny', [108, 112, 124],
    { kind: 'cap', shape: 'convex', cap: '#EDE7D6', cap2: '#B9B396', pores: true, under: '#F2EEE2', stem: '#F4F1E8', stemShape: 'stout', scabers: '#BDB6A0' }],
  ['kozlarz-bagienny', 'Koźlarz Bagienny', 'Bog Bolete', 'Leccinum holopus', 'wilgoc', 3, 'kozlarz-bagienny', 2, undefined, [158, 162, 180],
    { kind: 'cap', shape: 'convex', cap: '#E4DEC6', cap2: '#A8B08E', pores: true, under: '#F2EEE2', stem: '#F4F1E8', stemShape: 'tall', scabers: '#A9A28A' }],
  ['soplik', 'Soplik', 'Icicling', 'Hericium erinaceus', 'drewno', 3, 'soplowka', 1, 'soplowka', [118, 124, 128],
    { kind: 'spines', n: 1, cap: '#FBF7EE', cap2: '#E3D9C4' }],
  ['soplowka', 'Soplówka', "Lion's Mane", 'Hericium erinaceus', 'drewno', 4, 'soplowka', 2, undefined, [172, 180, 186],
    { kind: 'spines', n: 2, cap: '#FBF7EE', cap2: '#DCD0B6' }],

  // ---- pojedyncze ----
  ['piestrzenica', 'Piestrzenica', 'False Morel', 'Gyromitra esculenta', 'toksyna', 3, 'piestrzenica', 1, undefined, [180, 140, 160],
    { kind: 'morel', brain: true, cap: '#8A3E24', cap2: '#4E2010', stem: '#EAD9C8' }],
  ['zaslonak-rudy', 'Zasłonak Rudy', 'Fool\'s Webcap', 'Cortinarius orellanus', 'toksyna', 3, 'zaslonak', 1, undefined, [190, 136, 150],
    { kind: 'cap', shape: 'convex', cap: '#B4551F', cap2: '#8A3A10', under: '#C2672C', stem: '#D49A5A', stemShape: 'slim', cortina: true }],
  ['gaska-zielonka', 'Gąska Zielonka', 'Yellow Knight', 'Tricholoma equestre', 'toksyna', 2, 'gaska', 1, undefined, [162, 130, 146],
    { kind: 'cap', shape: 'flat', cap: '#E2C93C', cap2: '#A88E22', under: '#F0DE4E', stem: '#EDDC6A', stemShape: 'stout' }],
  ['muchomor-plamisty', 'Muchomor Plamisty', 'Panther Cap', 'Amanita pantherina', 'toksyna', 3, 'muchomor-plamisty', 1, undefined, [186, 140, 154],
    { kind: 'cap', shape: 'flat', cap: '#7A5A3A', cap2: '#4E3420', spots: '#FFFFFF', under: '#FFFFFF', stem: '#FFFFFF', stemShape: 'tall', ring: true, bulb: true }],
  ['muchomor-jadowity', 'Muchomor Jadowity', 'Destroying Angel', 'Amanita virosa', 'toksyna', 4, 'muchomor-jadowity', 1, undefined, [220, 160, 180],
    { kind: 'cap', shape: 'bell', cap: '#FFFFFF', cap2: '#DCD9CE', under: '#FFFFFF', stem: '#FFFFFF', stemShape: 'tall', ring: true, volva: '#F2F0E8' }],
  ['helmowka', 'Hełmówka Jadowita', 'Funeral Bell', 'Galerina marginata', 'toksyna', 2, 'helmowka', 1, undefined, [158, 120, 136],
    { kind: 'cluster', n: 3, shape: 'convex', cap: '#B8722E', cap2: '#8A501C', under: '#C08A4E', stem: '#8A6040', stemShape: 'slim', ring: true }],
  ['siedzun', 'Siedzuń Sosnowy', 'Cauliflower Fungus', 'Sparassis crispa', 'drewno', 3, 'siedzun', 1, undefined, [170, 176, 184],
    { kind: 'coral', cap: '#EADBB0', cap2: '#C2A672' }],
  ['czarka', 'Czarka Szkarłatna', 'Scarlet Cup', 'Sarcoscypha coccinea', 'wilgoc', 2, 'czarka', 1, undefined, [150, 138, 150],
    { kind: 'cup', n: 2, cap: '#D41E2A', cap2: '#F4E6DE' }],
  ['gwiazdosz', 'Gwiazdosz', 'Earthstar', 'Geastrum triplex', 'laka', 3, 'gwiazdosz', 1, undefined, [160, 180, 170],
    { kind: 'star', cap: '#C9A983', cap2: '#7A5A3A' }],
  ['okratek', 'Okratek', 'Devil\'s Fingers', 'Clathrus archeri', 'wilgoc', 4, 'okratek', 1, undefined, [216, 170, 186],
    { kind: 'cage', cap: '#D8332A', cap2: '#2A2420' }],
  ['trufla', 'Trufla Letnia', 'Summer Truffle', 'Tuber aestivum', 'sciolka', 5, 'trufla', 1, undefined, [250, 236, 250],
    { kind: 'ball', truffle: true, cap: '#2C2420', cap2: '#0E0A08' }],
  ['lisowka', 'Lisówka', 'False Chanterelle', 'Hygrophoropsis aurantiaca', 'sciolka', 1, 'lisowka', 1, undefined, [140, 124, 134],
    { kind: 'cap', shape: 'funnel', cap: '#F07C1E', cap2: '#C85A0E', under: '#F48A28', stem: '#E07A28', stemShape: 'slim' }],
  ['prochnilec', 'Próchnilec', 'Dead Man\'s Fingers', 'Xylaria polymorpha', 'drewno', 1, 'prochnilec', 1, undefined, [128, 150, 140],
    { kind: 'club', n: 3, cap: '#1E1C1A', cap2: '#4A4440' }],
  ['trzesak', 'Trzęsak', 'Yellow Brain', 'Tremella mesenterica', 'drewno', 2, 'trzesak', 1, undefined, [136, 158, 166],
    { kind: 'jelly', cap: '#F6C21E', cap2: '#D8920A' }],
  ['maslanka', 'Maślanka Wiązkowa', 'Sulphur Tuft', 'Hypholoma fasciculare', 'toksyna', 1, 'maslanka', 1, undefined, [150, 116, 130],
    { kind: 'cluster', n: 4, shape: 'convex', cap: '#E8C64A', cap2: '#C8862A', under: '#9AA84A', stem: '#E8D06A', stemShape: 'slim' }],
  ['ozorek', 'Ozorek Dębowy', 'Beefsteak Fungus', 'Fistulina hepatica', 'drewno', 3, 'ozorek', 1, undefined, [176, 170, 190],
    { kind: 'shelf', shelf: 'tongue', n: 1, cap: '#A8261E', cap2: '#6E140E', under: '#F2D8B8' }],
  ['borowik-szatanski', 'Borowik Szatański', 'Satan\'s Bolete', 'Rubroboletus satanas', 'toksyna', 4, 'borowik-szatanski', 1, undefined, [232, 176, 196],
    { kind: 'cap', shape: 'convex', cap: '#E4E0D6', cap2: '#B9B3A4', pores: true, under: '#D8322A', stem: '#E25A3A', stemShape: 'stout', bulb: true, net: true }],
  ['kolczak', 'Kolczak', 'Hedgehog', 'Hydnum repandum', 'sciolka', 2, 'kolczak', 1, undefined, [152, 150, 158],
    { kind: 'cap', shape: 'convex', cap: '#E8C998', cap2: '#C29A60', spines: true, under: '#F2DDB6', stem: '#F1E2C6', stemShape: 'stout' }],
  ['muchomor-cesarski', 'Muchomor Cesarski', 'Caesar\'s Mushroom', 'Amanita caesarea', 'sciolka', 5, 'muchomor-cesarski', 1, undefined, [256, 226, 244],
    { kind: 'cap', shape: 'convex', cap: '#F06A12', cap2: '#C8400A', under: '#F7CF2A', stem: '#F7D234', stemShape: 'tall', ring: true, volva: '#FFFFFF' }],
  ['borowik-krolewski', 'Borowik Królewski', 'Royal Bolete', 'Butyriboletus regius', 'sciolka', 5, 'borowik-krolewski', 1, undefined, [248, 240, 252],
    { kind: 'cap', shape: 'convex', cap: '#D85A7A', cap2: '#A8385A', pores: true, under: '#F4D23A', stem: '#F2D34A', stemShape: 'stout', net: true }],
];

export const SHROOMS: GameShroom[] = ROWS.map(([key, pl, en, latin, type, rarity, fam, stage, evo, [a, d, h], art], i) => ({
  id: i + 1, key, pl, en, latin, type, rarity, fam, stage, evo, base: { a, d, h }, art,
}));
export const SHROOM_BY_KEY = new Map(SHROOMS.map((s) => [s.key, s]));
export const byKey = (k: string) => SHROOM_BY_KEY.get(k)!;
