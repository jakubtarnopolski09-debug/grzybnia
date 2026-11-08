import { Ionicons } from '@expo/vector-icons';
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Sharing from 'expo-sharing';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Animated, Easing, FlatList, Image, Linking, Modal, Platform, Pressable, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, useColorScheme, useWindowDimensions, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Grzybnia – atlas grzybów, skaner, przepisy i album zdjęć (jeden plik: src/app/index.tsx)
// Potrzebne moduły: npx expo install expo-image-picker expo-file-system expo-sharing @expo/vector-icons react-native-webview expo-location

// Status: e = jadalny, c = warunkowo, i = niejadalny, t = trujący, d = śmiertelnie trujący
type Status = 'e' | 'c' | 'i' | 't' | 'd';
type Mushroom = { id: number; latin: string; pl: string; en: string; s: Status; x?: string };
const RAW = `Boletus edulis|Borowik szlachetny|King Bolete|e
Imleria badia|Podgrzybek brunatny|Bay Bolete|e
Boletus reticulatus|Borowik usiatkowany|Summer Bolete|e
Leccinum scabrum|Koźlarz babka|Birch Bolete|e
Leccinum aurantiacum|Koźlarz czerwony|Red-capped Scaber Stalk|e
Suillus luteus|Maślak zwyczajny|Slippery Jack|e
Suillus grevillei|Maślak żółty|Larch Bolete|e
Suillus granulatus|Maślak ziarnisty|Granulated Bolete|e
Suillus bovinus|Maślak sitarz|Jersey Cow Mushroom|e
Xerocomus subtomentosus|Podgrzybek zajączek|Suede Bolete|e
Xerocomellus chrysenteron|Podgrzybek złotawy|Red Cracking Bolete|e
Chalciporus piperatus|Maślak pieprzowy|Peppery Bolete|e
Gyroporus castaneus|Piaskowiec kasztanowaty|Chestnut Bolete|e
Strobilomyces strobilaceus|Szyszkowiec łuskowaty|Old Man of the Woods|e
Butyriboletus appendiculatus|Borowik żółtoobrączkowy|Butter Bolete|e
Butyriboletus regius|Borowik królewski|Royal Bolete|e
Hemileccinum impolitum|Borowik płowy|Iodine Bolete|e
Suillellus luridus|Borowik ponury|Lurid Bolete|c|Rb
Neoboletus luridiformis|Borowik ceglastopory|Scarletina Bolete|c|Rb
Rubroboletus satanas|Borowik szatański|Satan’s Bolete|t|Rb
Caloboletus calopus|Borowik żółtopory|Bitter Beech Bolete|i
Tylopilus felleus|Goryczak żółciowy|Bitter Bolete|i
Paxillus involutus|Krowiak podwinięty|Brown Roll-rim|d|Pa
Cantharellus cibarius|Pieprznik jadalny (kurka)|Golden Chanterelle|e
Cantharellus amethysteus|Pieprznik ametystowy|Amethyst Chanterelle|e
Craterellus tubaeformis|Pieprznik trąbkowy|Yellowfoot|e
Craterellus cornucopioides|Lejkowiec dęty|Horn of Plenty|e
Hydnum repandum|Kolczak obłączasty|Sweet Tooth|e
Sarcodon imbricatus|Sarniak dachówkowaty|Shingled Hedgehog|e
Hydnellum peckii|Kolczakówka Pecka|Bleeding Tooth Fungus|i
Lactarius deliciosus|Mleczaj rydz|Saffron Milk Cap|e
Lactarius deterrimus|Mleczaj świerkowy|False Saffron Milk Cap|e
Lactarius volemus|Mleczaj smaczny|Weeping Milk Cap|e
Lactarius piperatus|Mleczaj biel|Peppery Milk Cap|c|Cl
Lactarius torminosus|Mleczaj wełnianka|Woolly Milk Cap|t
Lactarius helvus|Mleczaj płowy|Fenugreek Milk Cap|t
Russula vesca|Gołąbek wyborny|Bare-toothed Russula|e
Russula virescens|Gołąbek zielonawy|Green-cracking Russula|e
Russula nigricans|Gołąbek czarniawy|Blackening Brittlegill|c
Russula fellea|Gołąbek żółciowy|Geranium Brittlegill|i
Russula emetica|Gołąbek wymiotny|The Sickener|t
Macrolepiota procera|Czubajka kania|Parasol Mushroom|e
Chlorophyllum rhacodes|Czubajka czerwieniejąca|Shaggy Parasol|c
Agaricus campestris|Pieczarka łąkowa|Meadow Mushroom|e|Ea
Agaricus arvensis|Pieczarka polna|Horse Mushroom|e|Ea
Agaricus bisporus|Pieczarka dwuzarodnikowa|Button Mushroom|e|Ea
Agaricus xanthodermus|Pieczarka karbolowa|Yellow-staining Mushroom|t
Lepista nuda|Gąsówka fioletowawa|Wood Blewit|c|Cn
Calocybe gambosa|Gąsówka wiosenna|St George’s Mushroom|e
Lepiota cristata|Czubeczek cuchnący|Stinking Dapperling|t|Lp
Lepiota brunneoincarnata|Czubeczek brązowoczerwony|Deadly Dapperling|d|Am
Amanita phalloides|Muchomor sromotnikowy|Death Cap|d|Am
Amanita virosa|Muchomor jadowity|Destroying Angel|d|Am
Amanita verna|Muchomor wiosenny|Fool’s Mushroom|d|Am
Amanita muscaria|Muchomor czerwony|Fly Agaric|t|Mu
Amanita pantherina|Muchomor plamisty|Panther Cap|t|Mu
Amanita citrina|Muchomor cytrynowy|False Death Cap|t
Amanita rubescens|Muchomor czerwieniejący|The Blusher|c|Cb
Amanita fulva|Muchomor rdzawy|Tawny Grisette|c|Cb
Amanita caesarea|Muchomor cesarski|Caesar’s Mushroom|e
Morchella esculenta|Smardz jadalny|Yellow Morel|c|Cm
Morchella elata|Smardz wyniosły|Black Morel|c|Cm
Verpa bohemica|Naparstniczka czeska|Wrinkled Thimble-cap|t|Gy
Gyromitra esculenta|Piestrzenica kasztanowata|False Morel|d|Gy
Helvella crispa|Piestrzyca kędzierzawa|White Elfin Saddle|c|Cm
Sarcoscypha coccinea|Czarka szkarłatna|Scarlet Elf Cup|i
Aleuria aurantia|Czarka pomarańczowa|Orange Peel Fungus|e
Armillaria mellea|Opieńka miodowa|Honey Fungus|c|Ca
Fomes fomentarius|Hubiak pospolity|Tinder Fungus|i
Laetiporus sulphureus|Żółciak siarkowy|Chicken of the Woods|c
Grifola frondosa|Żagiew listkowata|Hen of the Woods|e
Meripilus giganteus|Wachlarzowiec olbrzymi|Giant Polypore|c
Trametes versicolor|Wrośniak różnobarwny|Turkey Tail|i
Ganoderma lucidum|Lakownica żółtawa|Reishi|i
Fistulina hepatica|Ozorek dębowy|Beefsteak Fungus|e
Inonotus obliquus|Błyskoporek podkorowy|Chaga|i
Hericium erinaceus|Soplówka jeżowata|Lion’s Mane|e
Hericium coralloides|Soplówka gałęzista|Coral Tooth Fungus|e
Coprinus comatus|Czernidlak kołpakowaty|Shaggy Mane|e
Coprinopsis atramentaria|Czernidlak pospolity|Common Ink Cap|t|Co
Hypholoma fasciculare|Maślanka wiązkowa|Sulfur Tuft|t
Hypholoma capnoides|Maślanka świerkowa|Conifer Tuft|e|Ek
Kuehneromyces mutabilis|Łuszczak zmienny|Sheathed Woodtuft|e|Ek
Galerina marginata|Hełmówka jadowita|Funeral Bell|d|Am
Cortinarius orellanus|Zasłonak rudy|Fool’s Webcap|d|Or
Cortinarius rubellus|Zasłonak rudawy|Deadly Webcap|d|Or
Cortinarius caperatus|Płachetka zwyczajna|Gypsy Mushroom|e
Pholiota squarrosa|Łuskwiak nastroszony|Shaggy Scalycap|t
Flammulina velutipes|Płomiennica zimowa|Velvet Shank|e
Stropharia rugosoannulata|Pierścieniak uprawny|Wine Cap Stropharia|e
Calvatia gigantea|Czasznica olbrzymia|Giant Puffball|e|Ep
Lycoperdon perlatum|Purchawka chropowata|Common Puffball|e|Ep
Lycoperdon pyriforme|Purchawka gruszkowata|Pear-shaped Puffball|e|Ep
Scleroderma citrinum|Tęgoskór cytrynowy|Common Earthball|t
Geastrum triplex|Gwiazdosz potrójny|Collared Earthstar|i
Auricularia auricula-judae|Uszak bzowy|Jelly Ear|e
Tremella mesenterica|Trzęsak pomarańczowożółty|Witches’ Butter|e
Ramaria formosa|Koralówka strojna|Beautiful Coral|t
Sparassis crispa|Siedzuń sosnowy|Cauliflower Mushroom|e
Clavulina coralloides|Goździeniec grzebieniasty|Crested Coral|e
Boletus pinophilus|Borowik sosnowy|Pine Bolete|e
Boletus aereus|Borowik ciemnobrązowy|Dark Cep|e
Leccinum versipelle|Koźlarz pomarańczowożółty|Orange Birch Bolete|e
Leccinum pseudoscabrum|Koźlarz grabowy|Hornbeam Bolete|e
Suillus variegatus|Maślak pstry|Velvet Bolete|e
Suillus cavipes|Borowiec dęty|Hollow Bolete|e
Xerocomellus pruinatus|Podgrzybek aksamitny|Matt Bolete|e
Gyroporus cyanescens|Piaskowiec modrzak|Cornflower Bolete|e
Imperator rhodopurpureus|Borowik purpurowy|Old Rose Bolete|t|Rb
Rubroboletus legaliae|Borowik Le Gala|Le Gal’s Bolete|t|Rb
Caloboletus radicans|Borowik korzeniasty|Rooting Bolete|i
Aureoboletus projectellus|Złotak wysmukły|Projecting Bolete|e
Leccinellum crocipodium|Koźlarz żółtawy|Yellow Scaber Stalk|c
Cantharellus friesii|Pieprznik pomarańczowy|Orange Chanterelle|e
Cantharellus pallens|Pieprznik blady|Pale Chanterelle|e
Craterellus lutescens|Pieprznik żółtawy|Golden Trumpet|e
Hydnum rufescens|Kolczak rudawy|Terracotta Hedgehog|e
Phellodon niger|Korek czarny|Black Tooth|i
Hydnellum ferrugineum|Kolczakówka rdzawa|Mealy Tooth|i
Hydnellum caeruleum|Kolczakówka niebieskawa|Blue Tooth|i
Lactarius salmonicolor|Mleczaj jodłowy|Salmon Milk Cap|e
Lactarius pubescens|Mleczaj omszony|Downy Milk Cap|t
Lactarius quietus|Mleczaj dębowy|Oakbug Milk Cap|e
Lactarius rufus|Mleczaj rdzawy|Rufous Milk Cap|c|Cl
Lactarius glyciosmus|Mleczaj pachnący|Coconut Milk Cap|i
Lactarius camphoratus|Mleczaj wonny|Curry Milk Cap|e
Lactarius vellereus|Mleczaj chrząstka|Fleecy Milk Cap|i
Lactarius scrobiculatus|Mleczaj dołkowany|Spotted Milk Cap|t
Lactarius blennius|Mleczaj śluzowaty|Beech Milk Cap|t
Lactarius subdulcis|Mleczaj słodkawy|Mild Milk Cap|e
Russula aurea|Gołąbek złotawy|Gilded Brittlegill|e
Russula claroflava|Gołąbek żółtawy|Yellow Swamp Brittlegill|e
Russula ochroleuca|Gołąbek ochrowy|Common Ochre Brittlegill|i
Russula xerampelina|Gołąbek pachnący|Crab Brittlegill|e
Russula nobilis|Gołąbek bukowy|Beech Sickener|t
Russula foetens|Gołąbek śmierdzący|Stinking Russula|t
Russula aeruginea|Gołąbek trawiastozielony|Green Brittlegill|e
Russula decolorans|Gołąbek płowiejący|Copper Brittlegill|e
Russula integra|Gołąbek całobrzegi|Entire Brittlegill|e
Russula sanguinaria|Gołąbek krwisty|Bloody Brittlegill|t
Russula atropurpurea|Gołąbek czarnopurpurowy|Purple Brittlegill|i
Russula delica|Gołąbek smaczny|Milk-white Russula|e
Russula cyanoxantha|Gołąbek zmienny|Charcoal Burner|e
Russula fragilis|Gołąbek kruchy|Fragile Brittlegill|t
Russula sardonia|Gołąbek purpurowoczerwony|Primrose Brittlegill|t
Russula mustelina|Gołąbek brunatny|Russet Brittlegill|e
Agaricus silvaticus|Pieczarka zaroślowa|Scaly Wood Mushroom|e|Ea
Agaricus augustus|Pieczarka okazała|The Prince|e|Ea
Agaricus bitorquis|Pieczarka miejska|Pavement Mushroom|e|Ea
Chlorophyllum olivieri|Czubajka oliwkowa|Olivier’s Parasol|c
Macrolepiota mastoidea|Czubajka sutkowata|Slender Parasol|e
Lepista saeva|Gąsówka dwubarwna|Field Blewit|c|Cn
Lepista flaccida|Gąsówka ruda|Tawny Funnel Cap|i
Lepiota clypeolaria|Czubeczek wełnisty|Shield Dapperling|t|Lp
Lepiota castanea|Czubeczek kasztanowaty|Chestnut Dapperling|d|Am
Cystodermella cinnabarina|Ziarnówka cynobrowa|Cinnabar Powdercap|i
Amanita excelsa|Muchomor twardawy|Grey Spotted Amanita|t
Amanita crocea|Muchomor żółtawy|Orange Grisette|c|Cb
Amanita vaginata|Muchomor mętny|Grisette|c|Cb
Amanita porphyria|Muchomor porfirowy|Purple-brown Amanita|t
Amanita strobiliformis|Muchomor szyszkowaty|Warty Amanita|t
Amanita gemmata|Muchomor narcyzowy|Jewelled Amanita|t|Mu
Morchella semilibera|Smardz półwolny|Half-Free Morel|c|Cm
Morchella conica|Smardz stożkowaty|Conical Morel|c|Cm
Verpa conica|Naparstniczka stożkowata|Early Morel|t|Gy
Gyromitra gigas|Piestrzenica olbrzymia|Snow Morel|t|Gy
Gyromitra infula|Piestrzenica pochyła|Elfin Saddle|t|Gy
Disciotis venosa|Krążkownica wrębiasta|Bleeding Cup|c|Cm
Helvella lacunosa|Piestrzyca czarna|Black Elfin Saddle|c|Cm
Helvella elastica|Piestrzyca giętka|Flexible Saddle|t
Peziza vesiculosa|Krowiak pęcherzykowaty|Bladder Cup|i
Otidea onotica|Ucho zajączka|Hare’s Ear|i
Armillaria ostoyae|Opieńka ciemna|Dark Honey Fungus|c|Ca
Armillaria gallica|Opieńka żółtostopowa|Bulbous Honey Fungus|c|Ca
Fomitopsis pinicola|Pniarek obrzeżony|Red-Belted Conk|i
Piptoporus betulinus|Porek brzozowy|Birch Polypore|i
Trametes hirsuta|Wrośniak szorstki|Hairy Bracket|i
Cerioporus squamosus|Żagiew łuskowata|Dryad’s Saddle|c
Ganoderma applanatum|Lakownica spłaszczona|Artist’s Bracket|i
Daedalea quercina|Gmatwek dębowy|Oak Mazegill|i
Polyporus umbellatus|Żagiew okółkowa|Umbrella Polypore|c
Ischnoderma benzoinum|Smolucha świerkowa|Resinous Polypore|i
Phellinus igniarius|Czyreń ogniowy|Willow Bracket|i
Bjerkandera adusta|Szkieletnica szara|Smoky Bracket|i
Coprinellus micaceus|Czernidlak błyszczący|Mica Cap|c
Coprinellus disseminatus|Czernidlak gromadny|Fairy Inkcap|i
Parasola plicatilis|Czernidlak fałdowany|Pleated Inkcap|i
Hypholoma lateritium|Maślanka ceglasta|Brick Cap|e|Ek
Cortinarius violaceus|Zasłonak fioletowy|Violet Webcap|i
Cortinarius traganus|Zasłonak kozi|Gassy Webcap|t|Cx
Cortinarius sanguineus|Zasłonak krwisty|Bloodred Webcap|t|Cx
Cortinarius armillatus|Zasłonak opaskowany|Red-belted Webcap|t|Cx
Cortinarius glaucopus|Zasłonak sinostopy|Blue Foot Webcap|t|Cx
Pholiota aurivella|Łuskwiak złotawy|Golden Scalycap|i
Gymnopilus junonius|Łuszczak wspaniały|Laughing Gym|t
Gymnopilus penetrans|Łuszczak sosnowy|Common Rustgill|t
Stropharia aeruginosa|Pierścieniak grynszpanowy|Verdigris Agaric|t
Coprinopsis picacea|Czernidlak srokaty|Magpie Fungus|t
Psathyrella candolleana|Kruchaweczka zaroślowa|Pale Brittlestem|c
Lycoperdon pratense|Purchawka łąkowa|Meadow Puffball|e|Ep
Lycoperdon echinatum|Purchawka jeżowata|Spiny Puffball|e|Ep
Scleroderma verrucosum|Tęgoskór brodawkowaty|Scaly Earthball|t
Geastrum fimbriatum|Gwiazdosz frędzlowany|Fringed Earthstar|i
Astraeus hygrometricus|Gwiazdosz higrometryczny|False Earthstar|i
Cyathus striatus|Kubek prążkowany|Fluted Bird’s Nest|i
Sphaerobolus stellatus|Miotacz kulisty|Cannonball Fungus|i
Bovista nigrescens|Purchawka czarnawa|Black Puffball|e|Ep
Bovista plumbea|Purchawka ołowiana|Grey Puffball|e|Ep
Calvatia excipuliformis|Czasznica workowata|Pestle Puffball|e|Ep
Calvatia utriformis|Czasznica oczkowata|Mosaic Puffball|e|Ep
Auricularia mesenterica|Uszak kosmaty|Tripe Fungus|i
Exidia glandulosa|Kisielec pospolity|Black Witches’ Butter|i
Pseudohydnum gelatinosum|Zębożel żelatynowy|Toothed Jelly Fungus|e
Calocera viscosa|Pięknoróg lepki|Yellow Stagshorn|i
Ramaria flava|Koralówka żółta|Yellow Coral|t
Ramaria aurea|Koralówka złocista|Golden Coral|t
Clavulina cinerea|Goździeniec popielaty|Grey Coral|e
Clavariadelphus pistillaris|Buławka spłaszczona|Giant Club|c
Stereum hirsutum|Skórnik szorstki|Hairy Curtain Crust|i
Artomyces pyxidatus|Świecznik rozgałęziony|Candelabra Coral|c`;
const MUSHROOMS: Mushroom[] = RAW.split('\n').map((line, id) => {
  const [latin, pl, en, s, x] = line.split('|');
  return { id, latin, pl, en, s: s as Status, x };
});

// ---- Opis wyglądu, siedliska i sezonu dla każdego gatunku: [polski, angielski] ----
const DESC: Record<string, [string, string]> = {
  "Boletus edulis": ["Kapelusz brązowy, gruby, do 25 cm; rurki białe, z wiekiem żółtozielone; trzon gruby, jasny, z białą siateczką u góry. Miąższ biały, nie sinieje. Lasy iglaste i liściaste, VI–X.", "Brown, thick cap up to 25 cm; tubes white, later yellow-green; stout pale stem with a white net near the top. Flesh white, does not bruise blue. Conifer and broadleaf woods, Jun–Oct."],
  "Imleria badia": ["Kapelusz kasztanowobrązowy, matowy, po deszczu lepki; rurki kremowożółte, po ucisku sinieją; trzon brązowawy, bez siateczki. Głównie bory sosnowe i świerkowe, VIII–XI.", "Chestnut-brown cap, matt, sticky when wet; cream-yellow pores that bruise blue; brownish stem without a net. Mainly pine and spruce forests, Aug–Nov."],
  "Boletus reticulatus": ["Podobny do prawdziwka, ale kapelusz jaśniejszy, matowy, często popękany; siateczka pokrywa cały trzon. Pod dębami i bukami, pojawia się wcześnie, V–IX.", "Like the King Bolete but with a paler, matt, often cracked cap and a net covering the whole stem. Under oaks and beeches; appears early, May–Sep."],
  "Leccinum scabrum": ["Kapelusz szarobrązowy; rurki białawe; trzon biały, smukły, pokryty czarnymi łuseczkami. Miąższ biały, miękki, nie zmienia barwy lub lekko różowieje. Tylko pod brzozami, VI–X.", "Grey-brown cap; whitish pores; slender white stem covered in black scales. Flesh white and soft, unchanging or slightly pinkish. Only under birches, Jun–Oct."],
  "Leccinum aurantiacum": ["Kapelusz pomarańczowoczerwony; trzon biały z rdzawymi łuseczkami. Miąższ po przekrojeniu szybko szarzeje i czernieje. Pod osikami i topolami, VI–X.", "Orange-red cap; white stem with rusty scales. Cut flesh soon turns grey to black. Under aspens and poplars, Jun–Oct."],
  "Suillus luteus": ["Kapelusz brązowy, bardzo śluzowaty; rurki żółte; na trzonie wyraźny, błoniasty pierścień. Przed gotowaniem warto zdjąć skórkę. Pod sosnami, VI–XI.", "Brown, very slimy cap; yellow pores; a distinct membranous ring on the stem. Peel the cap skin before cooking. Under pines, Jun–Nov."],
  "Suillus grevillei": ["Kapelusz złotożółty do pomarańczowego, lepki; rurki żółte; trzon z pierścieniem. Rośnie wyłącznie pod modrzewiami, VII–X.", "Golden-yellow to orange sticky cap; yellow pores; stem with a ring. Grows only under larches, Jul–Oct."],
  "Suillus granulatus": ["Kapelusz pomarańczowobrązowy, lepki; młode rurki wydzielają mleczne krople; trzon bez pierścienia, u góry z drobnymi ziarenkami. Pod sosnami, VI–X.", "Orange-brown sticky cap; young pores weep milky droplets; stem without a ring, with fine granules at the top. Under pines, Jun–Oct."],
  "Suillus bovinus": ["Kapelusz rdzawobrązowy, lepki; duże, kanciaste pory oliwkowobrązowe; miąższ gumowaty. Rośnie gromadnie pod sosnami, VIII–XI.", "Rusty-brown sticky cap; large angular olive-brown pores; rubbery flesh. Grows in groups under pines, Aug–Nov."],
  "Xerocomus subtomentosus": ["Kapelusz oliwkowobrązowy, zamszowy, suchy; rurki jaskrawożółte, słabo sinieją; trzon żółtawy, bez siateczki. Różne lasy, VI–X.", "Olive-brown, suede-like dry cap; bright yellow pores that bruise slightly blue; yellowish stem without a net. Various woods, Jun–Oct."],
  "Xerocomellus chrysenteron": ["Kapelusz brązowy, z wiekiem pęka, a w szczelinach widać czerwonawy miąższ; rurki żółte, sinieją; trzon żółty z czerwienią u dołu. Lasy liściaste, VI–X.", "Brown cap that cracks to show reddish flesh; yellow pores bruising blue; yellow stem, red towards the base. Broadleaf woods, Jun–Oct."],
  "Chalciporus piperatus": ["Mały, kapelusz rudobrązowy; rurki rdzawe do miedzianych; u podstawy trzonu żółta grzybnia. Smak bardzo ostry, pieprzowy, raczej jako przyprawa. Pod sosnami i brzozami, VII–X.", "Small; rusty-brown cap; copper-rust pores; yellow mycelium at the stem base. Very hot, peppery taste, used more as a spice. Under pines and birches, Jul–Oct."],
  "Gyroporus castaneus": ["Kapelusz kasztanowy, zamszowy; rurki białe, potem słomkowe; trzon kruchy, w środku pusty z komorami. Rzadki, na piaszczystych glebach pod dębami, VII–X.", "Chestnut, velvety cap; white then straw-coloured pores; brittle stem, hollow with chambers inside. Rare, on sandy soil under oaks, Jul–Oct."],
  "Strobilomyces strobilaceus": ["Kapelusz pokryty dużymi, szaroczarnymi łuskami jak szyszka; rurki szare, po ucisku czerwienieją, potem czernieją. Lasy bukowe i mieszane, rzadki, VII–X.", "Cap covered in large grey-black scales like a pine cone; grey pores redden, then blacken when bruised. Beech and mixed woods, rare, Jul–Oct."],
  "Butyriboletus appendiculatus": ["Kapelusz brązowy; rurki cytrynowożółte; trzon żółty z siateczką, zwężony u podstawy. Miąższ żółty, słabo sinieje. Pod dębami i bukami, rzadki i chroniony, VII–IX.", "Brown cap; lemon-yellow pores; yellow netted stem, tapering at the base. Yellow flesh, slightly bruising blue. Under oaks and beeches, rare and protected, Jul–Sep."],
  "Butyriboletus regius": ["Kapelusz różowy do czerwonego; rurki żółte; trzon żółty z siateczką. Bardzo rzadki w Polsce, w ciepłych lasach liściastych; chroniony, nie zbieraj.", "Pink to red cap; yellow pores; yellow netted stem. Very rare in Poland, in warm broadleaf woods; protected, do not pick."],
  "Hemileccinum impolitum": ["Kapelusz jasnobrązowy, zamszowy; rurki żółte, nie sinieją; miąższ żółty z zapachem jodyny, zwłaszcza u podstawy trzonu. Pod dębami, rzadki, VII–IX.", "Pale brown, suede cap; yellow pores that don’t bruise; yellow flesh smelling of iodine, especially at the stem base. Under oaks, rare, Jul–Sep."],
  "Suillellus luridus": ["Kapelusz oliwkowobrązowy; pory pomarańczowoczerwone; trzon z czerwoną siateczką. Miąższ i pory natychmiast intensywnie sinieją. Pod dębami i bukami, VI–IX.", "Olive-brown cap; orange-red pores; stem with a red net. Flesh and pores bruise deep blue instantly. Under oaks and beeches, Jun–Sep."],
  "Neoboletus luridiformis": ["Kapelusz ciemnobrązowy, aksamitny; pory krwistoczerwone; trzon gęsto pokryty czerwonymi kropkami (bez siateczki). Miąższ żółty, błyskawicznie granatowieje. Lasy iglaste i bukowe, VI–X.", "Dark brown velvety cap; blood-red pores; stem densely dotted red (no net). Yellow flesh turns navy blue instantly. Conifer and beech woods, Jun–Oct."],
  "Rubroboletus satanas": ["Kapelusz białawy do szarego, masywny; pory czerwone; trzon brzuchaty z czerwoną siateczką. Miąższ słabo sinieje, starsze okazy cuchną. Ciepłe lasy na wapieniach, bardzo rzadki i chroniony, VII–IX.", "Whitish to grey, massive cap; red pores; bulbous stem with a red net. Flesh bruises faintly blue, old specimens stink. Warm woods on limestone, very rare and protected, Jul–Sep."],
  "Caloboletus calopus": ["Kapelusz szarobeżowy; rurki żółte; trzon jaskrawoczerwony z siateczką. Miąższ sinieje, smak bardzo gorzki, nie znika po gotowaniu. Lasy górskie i bukowe, VII–X.", "Grey-beige cap; yellow pores; bright red netted stem. Flesh bruises blue, taste very bitter and stays bitter after cooking. Mountain and beech woods, Jul–Oct."],
  "Tylopilus felleus": ["Wygląda jak prawdziwek, ale rurki z wiekiem różowieją, a trzon ma ciemną, brązową siateczkę. Bardzo gorzki: jeden okaz psuje całą potrawę. Lasy iglaste, VI–X.", "Looks like a King Bolete, but its pores turn pink with age and the stem has a dark brown net. Extremely bitter: one specimen ruins a whole dish. Conifer woods, Jun–Oct."],
  "Paxillus involutus": ["Kapelusz oliwkowobrązowy, lejkowaty, z mocno podwiniętym brzegiem; blaszki żółtobrązowe, łatwo się odrywają i brązowieją po dotknięciu. Bardzo pospolity w każdym lesie, VII–XI.", "Olive-brown funnel-shaped cap with a strongly inrolled margin; yellow-brown gills peel off easily and turn brown when touched. Very common in all woods, Jul–Nov."],
  "Cantharellus cibarius": ["Cały żółty do żółtopomarańczowego, lejkowaty; zamiast blaszek grube, rozwidlone listewki zbiegające na trzon. Miąższ biały, owocowy zapach. Lasy sosnowe i bukowe, VI–X.", "Yellow to orange-yellow throughout, funnel-shaped; thick forked ridges instead of true gills, running down the stem. White flesh, fruity smell. Pine and beech woods, Jun–Oct."],
  "Cantharellus amethysteus": ["Podobny do kurki, ale kapelusz pokryty drobnymi fioletowymi łuseczkami. Listewki żółte. Lasy liściaste, zwłaszcza bukowe, rzadszy, VII–IX.", "Like the Golden Chanterelle but the cap is covered with fine violet scales. Yellow ridges. Broadleaf woods, especially beech, less common, Jul–Sep."],
  "Craterellus tubaeformis": ["Kapelusz szarobrązowy, lejkowaty, z dziurką w środku; spód z szarymi, rozwidlonymi listewkami; trzon żółty, pusty. Wilgotne lasy iglaste wśród mchów, IX–XII.", "Grey-brown funnel cap with a hole in the centre; grey forked ridges below; yellow hollow stem. Damp conifer woods in moss, Sep–Dec."],
  "Craterellus cornucopioides": ["Czarny do szarego lejek przypominający trąbkę, cienki jak skóra; zewnętrzna strona gładka, szara. Liście buków i dębów, łatwo go przeoczyć, VIII–XI.", "Black to grey trumpet-shaped funnel, thin as leather; outer side smooth and grey. Under beech and oak leaves, easy to overlook, Aug–Nov."],
  "Hydnum repandum": ["Kapelusz kremowy do pomarańczowawego; pod spodem zamiast rurek drobne, łamliwe kolce. Miąższ biały, kruchy. Różne lasy, VII–XI. Nie ma groźnych sobowtórów.", "Cream to pale orange cap; brittle spines underneath instead of tubes. White, crumbly flesh. Various woods, Jul–Nov. No dangerous lookalikes."],
  "Sarcodon imbricatus": ["Duży, brązowy kapelusz z odstającymi, ciemnymi łuskami jak dachówki; spód z szarobrązowymi kolcami. Bory sosnowe na piaskach, rzadki, VIII–X.", "Large brown cap with raised dark scales like roof tiles; grey-brown spines underneath. Pine forests on sand, rare, Aug–Oct."],
  "Hydnellum peckii": ["Młody biały, z wydzielinami jak krople krwi na powierzchni; dojrzały brązowy, twardy, z kolcami pod spodem. Smak bardzo ostry. Lasy iglaste, rzadki.", "White when young, with blood-red droplets on the surface; brown, tough and spiny underneath when mature. Very acrid taste. Conifer woods, rare."],
  "Lactarius deliciosus": ["Kapelusz pomarańczowy z ciemniejszymi pierścieniami; blaszki pomarańczowe; mleczko marchewkowe, z czasem zielenieje. Pod sosnami, VIII–X. Ceniony do kiszenia.", "Orange cap with darker concentric zones; orange gills; carrot-orange milk that slowly turns green. Under pines, Aug–Oct. Prized for pickling."],
  "Lactarius deterrimus": ["Podobny do rydza; mleczko pomarańczowe, po kilku minutach czerwienieje; cały owocnik łatwo zielenieje. Pod świerkami, VIII–X.", "Like the Saffron Milk Cap; orange milk that reddens within minutes; the whole fruitbody easily turns green. Under spruces, Aug–Oct."],
  "Lactarius volemus": ["Kapelusz pomarańczowobrązowy, matowy; obfite, białe mleczko o łagodnym smaku; zapach śledziowy. Lasy liściaste i mieszane, VII–IX.", "Orange-brown matt cap; copious white milk with a mild taste; herring-like smell. Broadleaf and mixed woods, Jul–Sep."],
  "Lactarius piperatus": ["Duży, biały, lejkowaty kapelusz; bardzo gęste, wąskie blaszki; białe mleczko piekąco ostre. Lasy liściaste, VII–X.", "Large white funnel-shaped cap; very crowded narrow gills; white milk that burns hot. Broadleaf woods, Jul–Oct."],
  "Lactarius torminosus": ["Kapelusz łososioworóżowy z pierścieniami i wyraźnie wełnistym, kosmatym brzegiem; białe, ostre mleczko. Pod brzozami, VII–X.", "Salmon-pink zoned cap with a distinctly woolly, shaggy margin; white, acrid milk. Under birches, Jul–Oct."],
  "Lactarius helvus": ["Kapelusz płowobrązowy, filcowaty; wodniste, przejrzyste mleczko; suszony pachnie lubczykiem lub kozieradką. Torfowiska i wilgotne bory, VIII–X.", "Fawn, felty cap; watery, clear milk; smells of lovage or fenugreek when dried. Bogs and damp pine forests, Aug–Oct."],
  "Russula vesca": ["Kapelusz różowobrązowy do winnego; skórka nie sięga brzegu, odsłaniając miąższ i blaszki; blaszki białe. Smak łagodny, orzechowy. Lasy liściaste, VI–X.", "Pinkish-brown to wine-coloured cap; the skin stops short of the margin, exposing flesh and gills; white gills. Mild, nutty taste. Broadleaf woods, Jun–Oct."],
  "Russula virescens": ["Kapelusz zielonkawy, skórka spękana w drobne poletka; blaszki białe; trzon biały. Lasy liściaste, zwłaszcza dęby i buki, VII–IX.", "Greenish cap with skin cracked into small patches; white gills and stem. Broadleaf woods, especially oak and beech, Jul–Sep."],
  "Russula nigricans": ["Duży, białawy, potem brązowoczarny; rzadkie, grube blaszki. Miąższ po przekrojeniu najpierw czerwienieje, potem czernieje. Lasy liściaste i iglaste, VII–X.", "Large, whitish then brown-black; widely spaced thick gills. Cut flesh first reddens, then blackens. Broadleaf and conifer woods, Jul–Oct."],
  "Russula fellea": ["Cały słomkowożółty do ochrowego; zapach pelargonii, smak bardzo gorzki i ostry. Pod bukami, VIII–X.", "Straw to ochre-yellow throughout; smells of geranium, taste very bitter and acrid. Under beeches, Aug–Oct."],
  "Russula emetica": ["Kapelusz jaskrawoczerwony, błyszczący; blaszki i trzon czysto białe; smak palący. Wilgotne bory sosnowe, torfowiska, VII–X.", "Bright red shiny cap; pure white gills and stem; burning taste. Damp pine forests and bogs, Jul–Oct."],
  "Macrolepiota procera": ["Kapelusz do 30 cm, brązowe łuski na jasnym tle; trzon wysoki z brązowym wężykowatym wzorem; ruchomy, podwójny pierścień. Polany i skraje lasów, VII–X. Jemy tylko kapelusze.", "Cap up to 30 cm with brown scales on a pale background; tall stem with a brown snakeskin pattern; movable double ring. Clearings and woodland edges, Jul–Oct. Only the caps are eaten."],
  "Chlorophyllum rhacodes": ["Mniejsza od kani, z grubymi, odstającymi łuskami; trzon gładki, bez wzoru; miąższ po przekrojeniu czerwienieje. Lasy, parki, kompost, VII–XI.", "Smaller than the Parasol, with coarse, raised scales; smooth stem without a pattern; cut flesh reddens. Woods, parks and compost, Jul–Nov."],
  "Agaricus campestris": ["Kapelusz biały; blaszki różowe, potem czekoladowe; pierścień delikatny; podstawa trzonu bez bulwy i pochwy. Łąki i pastwiska, VII–X.", "White cap; gills pink, then chocolate-brown; delicate ring; stem base without a bulb or sheath. Meadows and pastures, Jul–Oct."],
  "Agaricus arvensis": ["Duża, biała pieczarka pachnąca anyżem; z czasem żółknie na kapeluszu; pierścień podwójny, zębatkowany od spodu. Łąki i pastwiska, VI–X.", "Large white Agaricus smelling of aniseed; the cap yellows with age; double ring, cog-wheel pattern underneath. Meadows and pastures, Jun–Oct."],
  "Agaricus bisporus": ["Pieczarka hodowlana ze sklepów; dziko na kompoście i nawożonej glebie. Kapelusz biały lub brązowy, blaszki różowe do brązowych. V–X.", "The cultivated shop mushroom; wild on compost and manured soil. White or brown cap, pink to brown gills. May–Oct."],
  "Agaricus xanthodermus": ["Wygląda jak pieczarka, ale podstawa trzonu po przekrojeniu natychmiast mocno żółknie; zapach karbolu lub atramentu, nasila się przy gotowaniu. Parki, ogrody, VII–X.", "Looks like a field mushroom, but the cut stem base instantly turns bright yellow; smells of carbolic or ink, stronger when cooked. Parks and gardens, Jul–Oct."],
  "Lepista nuda": ["Cały fioletowy do liliowego, z wiekiem brązowieje; blaszki fioletowe; zapach owocowy. Ściółka, kompost, późną jesienią do mrozów, IX–XII.", "Violet to lilac throughout, browning with age; violet gills; fruity smell. Leaf litter and compost, late autumn until frost, Sep–Dec."],
  "Calocybe gambosa": ["Kremowobiała, mięsista; gęste białe blaszki; wyraźny zapach świeżej mąki. Wiosną (IV–VI) w kręgach na łąkach i skrajach lasów.", "Creamy white and fleshy; crowded white gills; strong smell of fresh flour. In spring (Apr–Jun), in rings in meadows and woodland edges."],
  "Lepiota cristata": ["Mała (2–5 cm), biały kapelusz z brązowym środkiem i rdzawymi łuseczkami; nietrwały pierścień; nieprzyjemny, gumowy zapach. Ogrody, parki, VII–X.", "Small (2–5 cm); white cap with a brown centre and rusty scales; fragile ring; unpleasant rubbery smell. Gardens and parks, Jul–Oct."],
  "Lepiota brunneoincarnata": ["Mała (3–6 cm), kapelusz z różowobrązowymi łuseczkami; trzon z różowawymi pasami. Bardzo łatwo pomylić z małą kanią. Ciepłe trawiaste miejsca, VII–X.", "Small (3–6 cm); cap with pinkish-brown scales; stem with pinkish bands. Very easy to confuse with a small parasol. Warm grassy places, Jul–Oct."],
  "Amanita phalloides": ["Kapelusz oliwkowozielony do białawego; blaszki białe; pierścień; u podstawy bulwa w białej, workowatej pochwie. Pod dębami i bukami, VII–X. Najgroźniejszy grzyb w Polsce.", "Olive-green to whitish cap; white gills; ring; bulb in a white, sac-like volva at the base. Under oaks and beeches, Jul–Oct. Poland’s most dangerous mushroom."],
  "Amanita virosa": ["Cały czysto biały, kapelusz stożkowaty; trzon kosmaty, z pierścieniem i pochwą u podstawy. Mylony z białymi pieczarkami. Wilgotne lasy iglaste, VII–X.", "Pure white throughout; conical cap; shaggy stem with a ring and a volva at the base. Mistaken for white Agaricus. Damp conifer woods, Jul–Oct."],
  "Amanita verna": ["Cały biały, wiosenny krewniak sromotnika z pierścieniem i pochwą. Bardzo rzadki w Polsce, ciepłe lasy liściaste, V–VII.", "Pure white spring relative of the Death Cap, with a ring and volva. Very rare in Poland, in warm broadleaf woods, May–Jul."],
  "Amanita muscaria": ["Kapelusz czerwony z białymi brodawkami (deszcz może je zmyć); blaszki białe; pierścień; bulwa z pierścieniami brodawek. Pod brzozami i świerkami, VIII–X.", "Red cap with white warts (rain can wash them off); white gills; ring; bulb with rings of warts. Under birches and spruces, Aug–Oct."],
  "Amanita pantherina": ["Kapelusz brązowy z białymi brodawkami; brzeg prążkowany; u podstawy bulwa z wyraźnym, ostrym kołnierzykiem. Mylony z czerwieniejącym. Lasy, VII–X.", "Brown cap with white warts; striate margin; bulb with a distinct, sharp collar at the base. Confused with the Blusher. Woods, Jul–Oct."],
  "Amanita citrina": ["Kapelusz bladocytrynowy z płatami osłony; bulwa wyraźnie odgraniczona; zapach surowych ziemniaków. Bory sosnowe i lasy bukowe, VIII–X.", "Pale lemon cap with veil patches; sharply rimmed bulb; smells of raw potato. Pine and beech woods, Aug–Oct."],
  "Amanita rubescens": ["Kapelusz różowobrązowy z szarawymi brodawkami; pierścień prążkowany; miąższ i uszkodzenia (zwłaszcza podstawa trzonu) różowieją. Pospolity, VI–X.", "Pinkish-brown cap with greyish warts; striate ring; flesh and damaged parts, especially the stem base, turn pink. Common, Jun–Oct."],
  "Amanita fulva": ["Kapelusz pomarańczowobrązowy, z prążkowanym brzegiem; brak pierścienia; trzon w wysokiej, białej pochwie. Wilgotne lasy z brzozą, VI–X.", "Orange-brown cap with a striate margin; no ring; stem in a tall white volva. Damp woods with birch, Jun–Oct."],
  "Amanita caesarea": ["Kapelusz jaskrawopomarańczowy; blaszki, trzon i pierścień żółte; duża, biała pochwa. Gatunek południowy, w Polsce praktycznie nie występuje.", "Bright orange cap; gills, stem and ring yellow; large white volva. A southern species, practically absent in Poland."],
  "Morchella esculenta": ["Kapelusz jajowaty, żółtobrązowy, z nieregularnymi komorami jak gąbka; wnętrze całkowicie puste. Wiosną (IV–V) w świetlistych lasach, parkach, na rumowiskach. Chroniony.", "Egg-shaped, yellow-brown cap with irregular sponge-like pits; completely hollow inside. In spring (Apr–May) in open woods, parks, rubble. Protected."],
  "Morchella elata": ["Kapelusz stożkowaty, ciemny, z komorami ułożonymi w pionowe żebra; wnętrze puste. Wiosną, często na pogorzeliskach i zrębach. Chroniony.", "Conical dark cap with pits arranged in vertical ribs; hollow inside. Spring, often on burnt ground and clearings. Protected."],
  "Verpa bohemica": ["Pomarszczony, brązowy kapelusz osadzony luźno na szczycie trzonu jak naparstek; trzon wypełniony waciastym rdzeniem. Wczesną wiosną pod osikami i topolami.", "Wrinkled brown cap sitting loosely on top of the stem like a thimble; stem filled with cottony pith. Early spring under aspens and poplars."],
  "Gyromitra esculenta": ["Kapelusz brązowy, pofałdowany jak mózg (nie komorowaty jak u smardza); wnętrze z komorami, nie jednolicie puste. Wiosną w borach sosnowych na piaskach.", "Brown, brain-like folded cap (not pitted like a morel); inside chambered, not one hollow. In spring in pine forests on sand."],
  "Helvella crispa": ["Kremowobiały, siodłowato pofałdowany kapelusz; trzon biały, głęboko bruzdowany. Lasy liściaste, VIII–X.", "Creamy white, saddle-shaped folded cap; white, deeply furrowed stem. Broadleaf woods, Aug–Oct."],
  "Sarcoscypha coccinea": ["Szkarłatna czarka (2–5 cm) na opadłych gałązkach, zewnątrz biaława. Wczesną wiosną i zimą w wilgotnych lasach.", "Scarlet cup (2–5 cm) on fallen twigs, whitish outside. Late winter and early spring in damp woods."],
  "Aleuria aurantia": ["Jaskrawopomarańczowa, krucha czarka wyglądająca jak skórka pomarańczy. Rośnie na gołej ziemi przy drogach i ścieżkach, VIII–XI.", "Bright orange, brittle cup that looks like orange peel. Grows on bare soil by roads and paths, Aug–Nov."],
  "Armillaria mellea": ["Kępy miodowożółtych kapeluszy z ciemnymi łuseczkami; pierścień na trzonie; białe zarodniki. Na pniach i korzeniach drzew liściastych, IX–XI. Groźny pasożyt drzew.", "Clusters of honey-yellow caps with dark scales; ring on the stem; white spore print. On stumps and roots of broadleaf trees, Sep–Nov. A dangerous tree parasite."],
  "Fomes fomentarius": ["Kopytowata, szara, twarda huba na brzozach i bukach; wieloletnia. Dawniej służyła do rozpalania ognia (hubka).", "Hoof-shaped, grey, hard bracket on birches and beeches; perennial. Historically used to start fires (tinder)."],
  "Laetiporus sulphureus": ["Duże, nachodzące na siebie półki: wierzch pomarańczowy, spód siarkowożółty. Na dębach, wierzbach, drzewach owocowych, V–VIII. Jemy tylko młode, miękkie brzegi.", "Large overlapping shelves: orange on top, sulphur-yellow below. On oaks, willows and fruit trees, May–Aug. Eat only young, soft margins."],
  "Grifola frondosa": ["Szarobrązowy, rozgałęziony owocnik z licznych języczkowatych kapeluszy, do 50 cm. U podstawy starych dębów, IX–X. Rzadki i chroniony.", "Grey-brown branched fruitbody of many tongue-shaped caps, up to 50 cm. At the base of old oaks, Sep–Oct. Rare and protected."],
  "Meripilus giganteus": ["Ogromne, brązowe wachlarze w rozecie u podstawy buków; białe pory czernieją po dotknięciu. VII–X. Jadalne tylko młode brzegi.", "Huge brown fans in a rosette at the base of beeches; white pores blacken when touched. Jul–Oct. Only young margins are edible."],
  "Trametes versicolor": ["Cienkie, skórzaste, aksamitne półeczki z różnobarwnymi pasami (brąz, szary, niebieski). Na martwym drewnie, przez cały rok.", "Thin, leathery, velvety brackets with multicoloured bands (brown, grey, blue). On dead wood all year round."],
  "Ganoderma lucidum": ["Czerwonobrązowy, lakierowo błyszczący kapelusz na bocznym trzonie. Na pniach drzew liściastych, rzadki i chroniony.", "Red-brown cap with a lacquered shine on a side stem. On broadleaf stumps, rare and protected."],
  "Fistulina hepatica": ["Czerwony, mięsisty owocnik przypominający surową wątrobę lub język; wydziela czerwony sok. Na dębach, VIII–X.", "Red, fleshy fruitbody resembling raw liver or a tongue; exudes red juice. On oaks, Aug–Oct."],
  "Inonotus obliquus": ["Czarna, spękana narośl jak zwęglone drewno, wewnątrz rdzawobrązowa. Na żywych brzozach. Używana do naparów, nie do jedzenia.", "Black, cracked growth like burnt wood, rusty-brown inside. On living birches. Used for teas, not as food."],
  "Hericium erinaceus": ["Biała kula z długich, zwisających kolców jak grzywa. Na ranach starych dębów i buków, VIII–X. Bardzo rzadki i chroniony w Polsce.", "White ball of long hanging spines like a mane. On wounds of old oaks and beeches, Aug–Oct. Very rare and protected in Poland."],
  "Hericium coralloides": ["Biały, koralowato rozgałęziony owocnik z krótkimi kolcami. Na martwym drewnie buków i jodeł, VIII–X. Chroniony.", "White, coral-like branched fruitbody with short spines. On dead beech and fir wood, Aug–Oct. Protected."],
  "Coprinus comatus": ["Wysoki, biały, walcowaty kapelusz z odstającymi łuskami; blaszki od dołu czernieją i rozpływają się w atrament. Trawniki, pobocza, VI–XI. Jemy tylko zupełnie białe okazy w dniu zbioru.", "Tall, white cylindrical cap with shaggy scales; gills blacken from below and dissolve into ink. Lawns and roadsides, Jun–Nov. Eat only pure white specimens on the day of picking."],
  "Coprinopsis atramentaria": ["Szary, dzwonkowaty kapelusz bez łusek, rośnie kępkami; blaszki rozpływają się w czarny płyn. Przy pniach, w ogrodach, V–XI.", "Grey, bell-shaped cap without shaggy scales, in clusters; gills dissolve into black liquid. Near stumps and in gardens, May–Nov."],
  "Hypholoma fasciculare": ["Kępy siarkowożółtych kapeluszy; blaszki zielonkawożółte, potem oliwkowoczarne; smak bardzo gorzki. Na pniach, przez cały rok poza mrozami.", "Clusters of sulphur-yellow caps; greenish-yellow then olive-black gills; very bitter taste. On stumps, all year except in frost."],
  "Hypholoma capnoides": ["Kępy pomarańczowożółtych kapeluszy; blaszki szare (nie zielone); smak łagodny. Na pniach świerków i sosen, IX–XII.", "Clusters of orange-yellow caps; grey (not green) gills; mild taste. On spruce and pine stumps, Sep–Dec."],
  "Kuehneromyces mutabilis": ["Kępy miodowobrązowych kapeluszy, środek jaśnieje po wyschnięciu (dwubarwny); trzon z pierścieniem, poniżej łuseczkowaty. Na pniach liściastych, IV–XI.", "Clusters of honey-brown caps whose centre dries paler (two-toned); stem with a ring and scaly below it. On broadleaf stumps, Apr–Nov."],
  "Galerina marginata": ["Małe, brązowe kapelusze w kępkach; trzon z delikatnym pierścieniem, poniżej srebrzyste włókienka (nie łuski). Na drewnie iglastym, IX–XII.", "Small brown caps in tufts; stem with a delicate ring and silvery fibres below it (not scales). On conifer wood, Sep–Dec."],
  "Cortinarius orellanus": ["Kapelusz pomarańczowobrązowy, suchy, włókienkowaty; blaszki rdzawe; trzon bez pierścienia. Ciepłe lasy liściaste, rzadki, VIII–X.", "Orange-brown, dry, fibrous cap; rusty gills; stem without a ring. Warm broadleaf woods, rare, Aug–Oct."],
  "Cortinarius rubellus": ["Kapelusz rudobrązowy, stożkowaty z garbkiem; trzon z żółtymi pasami resztek osłony. Wilgotne lasy świerkowe wśród mchów, VIII–X.", "Rusty-brown conical cap with an umbo; stem with yellow bands of veil remnants. Damp spruce woods in moss, Aug–Oct."],
  "Cortinarius caperatus": ["Kapelusz słomkowy, jakby oszroniony białym nalotem; blaszki gliniaste; trzon z wyraźnym pierścieniem. Lasy iglaste i borówkowe, VIII–X.", "Straw-coloured cap that looks frosted with a white bloom; clay-coloured gills; stem with a distinct ring. Conifer woods with bilberry, Aug–Oct."],
  "Pholiota squarrosa": ["Kępy żółtych kapeluszy i trzonów gęsto pokrytych odstającymi, brązowymi łuskami. U podstawy drzew liściastych, VIII–XI.", "Clusters of yellow caps and stems densely covered in raised brown scales. At the base of broadleaf trees, Aug–Nov."],
  "Flammulina velutipes": ["Kępy pomarańczowych, lepkich kapeluszy; trzon aksamitny, ciemnobrązowy. Na drewnie wierzb i topól zimą, nawet po mrozie, X–III. Uprawiana jako enoki.", "Clusters of orange, sticky caps; velvety, dark brown stem. On willow and poplar wood in winter, even after frost, Oct–Mar. Cultivated as enoki."],
  "Stropharia rugosoannulata": ["Duży kapelusz winnoczerwony do brązowego; blaszki szarofioletowe; gruby pierścień z ząbkami. Uprawiany na słomie i zrębkach, VI–X.", "Large wine-red to brown cap; grey-violet gills; thick ring with a cogwheel pattern. Cultivated on straw and wood chips, Jun–Oct."],
  "Calvatia gigantea": ["Biała kula, nawet 50 cm średnicy, bez trzonu. Łąki, ogrody, skraje lasów, VII–IX. Jadalny tylko gdy wnętrze białe.", "White ball, up to 50 cm across, without a stem. Meadows, gardens and woodland edges, Jul–Sep. Edible only while the inside is white."],
  "Lycoperdon perlatum": ["Gruszkowata, biała kulka pokryta stożkowatymi kolcami, które łatwo się ścierają. Lasy, VII–X. Dojrzała wypuszcza brązowy pył.", "Pear-shaped white puffball covered in conical spines that rub off easily. Woods, Jul–Oct. Puffs brown dust when ripe."],
  "Lycoperdon pyriforme": ["Gruszkowate, brązowawe kulki rosnące gromadnie na murszejącym drewnie, z białymi sznurami grzybni. VIII–XI.", "Pear-shaped brownish puffballs growing in groups on rotting wood, with white mycelial cords. Aug–Nov."],
  "Scleroderma citrinum": ["Żółtawa bulwa z grubą, łuszczącą się skórą; wnętrze szybko czarnofioletowe i twarde. Kwaśne gleby w lasach, VII–X.", "Yellowish tuber with a thick, scaly rind; inside soon turns purple-black and firm. Acid soil in woods, Jul–Oct."],
  "Geastrum triplex": ["Zewnętrzna warstwa pęka w gwiazdę (4–8 ramion), środek z kulką i kołnierzykiem. Ściółka lasów liściastych, VIII–XI.", "Outer layer splits into a star (4–8 rays), with a central ball sitting in a collar. Broadleaf leaf litter, Aug–Nov."],
  "Auricularia auricula-judae": ["Brązowy, galaretowaty owocnik w kształcie ucha. Na bzie czarnym, przez cały rok. Używany w kuchni azjatyckiej.", "Brown, jelly-like ear-shaped fruitbody. On elder, all year round. Used in Asian cooking."],
  "Tremella mesenterica": ["Jaskrawożółta, pofałdowana galareta jak mózg, po wyschnięciu twardnieje. Na martwych gałęziach liściastych, jesienią i zimą.", "Bright yellow, brain-like folded jelly that hardens when dry. On dead broadleaf branches, autumn and winter."],
  "Ramaria formosa": ["Koralowiec różowopomarańczowy z żółtymi końcówkami gałązek; miąższ gorzkawy. Lasy bukowe, VIII–X.", "Coral fungus, pinkish-orange with yellow branch tips; bitterish flesh. Beech woods, Aug–Oct."],
  "Sparassis crispa": ["Kremowy owocnik przypominający gąbkę lub kalafior, z falistych płatów, do 40 cm. U podstawy sosen, VIII–X.", "Creamy fruitbody resembling a sponge or cauliflower, made of wavy lobes, up to 40 cm. At the base of pines, Aug–Oct."],
  "Clavulina coralloides": ["Biały, koralowato rozgałęziony grzybek z grzebieniastymi końcówkami. Ściółka w różnych lasach, VII–XI.", "Small white coral fungus with comb-like tips. Leaf litter in various woods, Jul–Nov."],
  "Boletus pinophilus": ["Kapelusz ciemny, mahoniowo-czerwonobrązowy; trzon z jasną siateczką; miąższ biały, pod skórką winny. Bory sosnowe, VII–X.", "Dark mahogany to red-brown cap; stem with a pale net; flesh white, wine-coloured under the skin. Pine forests, Jul–Oct."],
  "Boletus aereus": ["Kapelusz bardzo ciemny, czekoladowy do niemal czarnego, aksamitny; trzon brązowawy z siateczką. Ciepłe lasy dębowe, w Polsce bardzo rzadki, VII–IX.", "Very dark, chocolate to almost black velvety cap; brownish netted stem. Warm oak woods, very rare in Poland, Jul–Sep."],
  "Leccinum versipelle": ["Kapelusz pomarańczowy, skórka zwisa poza brzeg; trzon biały z czarnymi łuseczkami. Miąższ szybko szarofioletowieje, potem czernieje. Pod brzozami, VII–X.", "Orange cap whose skin overhangs the margin; white stem with black scales. Flesh quickly turns grey-violet, then black. Under birches, Jul–Oct."],
  "Leccinum pseudoscabrum": ["Kapelusz oliwkowobrązowy, pomarszczony; miąższ po przekrojeniu różowieje, potem czernieje. Pod grabami i leszczyną, VI–X.", "Olive-brown wrinkled cap; cut flesh turns pink, then black. Under hornbeam and hazel, Jun–Oct."],
  "Suillus variegatus": ["Kapelusz żółtobrązowy, pokryty drobnymi łuseczkami, lekko lepki po deszczu; rurki oliwkowe, słabo sinieją. Bory sosnowe na piaskach, VIII–X.", "Yellow-brown cap covered in fine scales, slightly sticky when wet; olive pores bruising faintly blue. Pine forests on sand, Aug–Oct."],
  "Suillus cavipes": ["Kapelusz rudobrązowy, włóknisty, suchy; pory żółte, promieniście wydłużone; trzon w środku pusty. Pod modrzewiami, VIII–X.", "Rusty-brown fibrous dry cap; yellow pores elongated radially; stem hollow inside. Under larches, Aug–Oct."],
  "Xerocomellus pruinatus": ["Kapelusz ciemnobrązowy, jakby oszroniony, nie pęka; pory żółte; trzon żółty z czerwonymi kropkami. Lasy liściaste, IX–XI.", "Dark brown, frosted-looking cap that does not crack; yellow pores; yellow stem with red dots. Broadleaf woods, Sep–Nov."],
  "Gyroporus cyanescens": ["Kapelusz słomkowy, filcowaty; cały owocnik po dotknięciu i przekrojeniu natychmiast intensywnie błękitnieje. Kwaśne, piaszczyste gleby, rzadki i chroniony, VII–X.", "Straw-coloured felty cap; the whole fruitbody instantly turns vivid blue when touched or cut. Acid sandy soils, rare and protected, Jul–Oct."],
  "Imperator rhodopurpureus": ["Kapelusz różowy do purpurowego, guzowaty; pory czerwone; trzon z czerwoną siateczką. Miąższ żółty, mocno sinieje. Ciepłe lasy liściaste, bardzo rzadki.", "Pink to purple lumpy cap; red pores; stem with a red net. Yellow flesh bruises strongly blue. Warm broadleaf woods, very rare."],
  "Rubroboletus legaliae": ["Kapelusz różowawy do szarorożowego; pory czerwone; trzon z czerwoną siateczką; miąższ słabo sinieje, zapach chicorii. Ciepłe lasy dębowe, bardzo rzadki.", "Pinkish to grey-pink cap; red pores; stem with a red net; flesh bruises faintly blue, smells of chicory. Warm oak woods, very rare."],
  "Caloboletus radicans": ["Kapelusz białawy do szarego, masywny; pory żółte; trzon żółty, korzeniasto wydłużony. Miąższ sinieje, smak bardzo gorzki. Pod dębami, VII–IX.", "Whitish to grey, massive cap; yellow pores; yellow stem with a rooting base. Flesh bruises blue, taste very bitter. Under oaks, Jul–Sep."],
  "Aureoboletus projectellus": ["Kapelusz czerwonobrązowy; skórka wystaje poza brzeg; trzon bardzo wysoki z grubą siateczką. Gatunek inwazyjny z Ameryki, na Pomorzu w borach sosnowych, VIII–X.", "Red-brown cap whose skin overhangs the margin; very tall stem with a coarse net. Invasive species from North America, found in Pomeranian pine forests, Aug–Oct."],
  "Leccinellum crocipodium": ["Kapelusz żółtobrązowy, pękający w poletka; trzon żółty z żółtymi łuseczkami; miąższ czernieje. Pod dębami, rzadki, VII–IX.", "Yellow-brown cap cracking into patches; yellow stem with yellow scales; flesh blackens. Under oaks, rare, Jul–Sep."],
  "Cantharellus friesii": ["Mała kurka (1–4 cm), intensywnie pomarańczowa, z różowawym odcieniem. Lasy bukowe, rzadka i chroniona, VII–IX.", "A small chanterelle (1–4 cm), intensely orange with a pinkish tinge. Beech woods, rare and protected, Jul–Sep."],
  "Cantharellus pallens": ["Kurka bladożółta do niemal białej, pokryta białawym nalotem; po dotknięciu żółknie. Lasy liściaste, VII–IX.", "Pale yellow to almost white chanterelle with a whitish bloom; yellows when touched. Broadleaf woods, Jul–Sep."],
  "Craterellus lutescens": ["Kapelusz brązowawy, lejkowaty; spód i trzon jaskrawożółte do pomarańczowych, prawie gładkie. Wilgotne bory na wapieniach i torfowiskach, rzadki, IX–XI.", "Brownish funnel-shaped cap; underside and stem bright yellow to orange, almost smooth. Damp forests on limestone and bogs, rare, Sep–Nov."],
  "Hydnum rufescens": ["Mniejszy krewniak kolczaka obłączastego; kapelusz pomarańczowobrązowy, kolce nie zbiegają na trzon. Różne lasy, VIII–XI.", "Smaller relative of the Hedgehog; orange-brown cap, spines not running down the stem. Various woods, Aug–Nov."],
  "Phellodon niger": ["Ciemny, prawie czarny, twardy owocnik z szarymi kolcami pod spodem; często zrastają się w grupy. Bory sosnowe, rzadki.", "Dark, almost black, tough fruitbody with grey spines underneath; often fused in groups. Pine forests, rare."],
  "Hydnellum ferrugineum": ["Rdzawobrązowy, twardy, korkowaty owocnik z kolcami; młody wydziela czerwonawe krople. Bory iglaste, rzadki.", "Rusty-brown, tough, corky fruitbody with spines; young ones exude reddish droplets. Conifer forests, rare."],
  "Hydnellum caeruleum": ["Kapelusz białawy z niebieskim brzegiem, kolce i miąższ z niebieskimi strefami. Bory sosnowe, bardzo rzadki.", "Whitish cap with a blue margin; spines and flesh with blue zones. Pine forests, very rare."],
  "Lactarius salmonicolor": ["Kapelusz łososiowopomarańczowy, bez zielenienia; mleczko pomarańczowe. Wyłącznie pod jodłami, w Polsce głównie w górach, VIII–X.", "Salmon-orange cap that doesn’t turn green; orange milk. Only under firs, in Poland mainly in mountains, Aug–Oct."],
  "Lactarius pubescens": ["Mniejszy i bledszy od wełnianki, kremoworóżowy, z kosmatym brzegiem, bez wyraźnych pierścieni; mleczko białe, ostre. Pod brzozami na trawnikach, VII–X.", "Smaller and paler than the Woolly Milk Cap, cream-pink with a shaggy margin and no clear zones; white, acrid milk. Under birches on lawns, Jul–Oct."],
  "Lactarius quietus": ["Kapelusz rudobrązowy z niewyraźnymi pierścieniami; mleczko białe, łagodne; charakterystyczny zapach pluskwy (oleisty). Tylko pod dębami, VIII–X.", "Reddish-brown cap with faint zones; white mild milk; characteristic oily ‘bedbug’ smell. Only under oaks, Aug–Oct."],
  "Lactarius rufus": ["Kapelusz ceglastoczerwony z ostrym garbkiem; mleczko białe, po chwili palące. Bory sosnowe, bardzo pospolity, VIII–X.", "Brick-red cap with a pointed umbo; white milk that burns after a moment. Pine forests, very common, Aug–Oct."],
  "Lactarius glyciosmus": ["Mały, kapelusz szaroliliowy; wyraźny zapach kokosa; mleczko białe, lekko ostre. Pod brzozami, VIII–X.", "Small, grey-lilac cap; distinct coconut smell; white, slightly acrid milk. Under birches, Aug–Oct."],
  "Lactarius camphoratus": ["Mały, kapelusz ciemnorudy; wodniste mleczko; zapach przyprawy curry lub cykorii, silniejszy po wyschnięciu. Lasy iglaste, VIII–XI.", "Small, dark reddish cap; watery milk; smells of curry spice or chicory, stronger when dried. Conifer woods, Aug–Nov."],
  "Lactarius vellereus": ["Bardzo duży, biały, filcowaty kapelusz; rzadkie blaszki; mleczko białe, łagodne, ale miąższ bardzo ostry. Lasy liściaste, VIII–X.", "Very large white felty cap; widely spaced gills; white mild milk but very acrid flesh. Broadleaf woods, Aug–Oct."],
  "Lactarius scrobiculatus": ["Duży, żółty, kosmaty kapelusz; trzon z żółtymi dołkami; mleczko białe, szybko żółknie na powietrzu. Górskie lasy świerkowe, VIII–X.", "Large yellow shaggy cap; stem with yellow pits; white milk that quickly turns yellow in air. Mountain spruce forests, Aug–Oct."],
  "Lactarius blennius": ["Kapelusz szarooliwkowy, śluzowaty, z ciemniejszymi kropkami w pierścieniach; mleczko białe, ostre, zasycha szaro. Pod bukami, VIII–XI.", "Grey-olive slimy cap with darker droplet-like spots in zones; white acrid milk drying grey. Under beeches, Aug–Nov."],
  "Lactarius subdulcis": ["Mały, kapelusz cynamonowobrązowy z ciemniejszym środkiem; mleczko białe, łagodne, po dłuższym czasie lekko gorzkawe. Pod bukami, VIII–XI.", "Small, cinnamon-brown cap with a darker centre; white milk, mild, later slightly bitterish. Under beeches, Aug–Nov."],
  "Russula aurea": ["Kapelusz pomarańczowoczerwony do złotego; blaszki i trzon żółtawe (wyjątek wśród gołąbków). Smak łagodny. Lasy liściaste, VII–IX.", "Orange-red to golden cap; gills and stem yellowish (unusual among brittlegills). Mild taste. Broadleaf woods, Jul–Sep."],
  "Russula claroflava": ["Kapelusz czysto żółty, błyszczący; blaszki kremowe; miąższ szarzeje po przekrojeniu. Wilgotne miejsca pod brzozami, torfowiska, VII–X.", "Pure yellow shiny cap; cream gills; cut flesh turns grey. Damp places under birches and bogs, Jul–Oct."],
  "Russula ochroleuca": ["Kapelusz ochrowożółty, matowy; blaszki białe; trzon biały, z wiekiem szarzeje. Smak lekko ostry. Bardzo pospolity w każdym lesie, VIII–XI.", "Ochre-yellow matt cap; white gills; white stem greying with age. Slightly acrid. Very common in all woods, Aug–Nov."],
  "Russula xerampelina": ["Kapelusz winnoczerwony do brązowego; trzon często różowawy; wyraźny zapach śledzia lub kraba, nasila się z wiekiem. Lasy iglaste, VIII–X.", "Wine-red to brown cap; stem often pinkish; distinct fishy or crab-like smell, stronger with age. Conifer woods, Aug–Oct."],
  "Russula nobilis": ["Kapelusz jaskrawoczerwony; blaszki białe; trzon biały; smak bardzo ostry; zapach kokosa lub owoców. Pod bukami, VII–X.", "Bright red cap; white gills and stem; very acrid taste; coconut or fruity smell. Under beeches, Jul–Oct."],
  "Russula foetens": ["Kapelusz ochrowobrązowy, śluzowaty, z prążkowanym brzegiem; zapach zjełczałego oleju; miąższ ostry. Lasy liściaste i iglaste, VII–X.", "Ochre-brown slimy cap with a grooved margin; smells of rancid oil; acrid flesh. Broadleaf and conifer woods, Jul–Oct."],
  "Russula aeruginea": ["Kapelusz trawiastozielony, gładki (nie spękany jak u zielonawego); blaszki kremowe; trzon biały z rdzawymi plamkami. Pod brzozami, VII–X.", "Grass-green smooth cap (not cracked like the Green-cracking Russula); cream gills; white stem with rusty spots. Under birches, Jul–Oct."],
  "Russula decolorans": ["Kapelusz pomarańczowy do miedzianego; miąższ i trzon po uszkodzeniu szarzeją, potem czernieją. Wilgotne bory sosnowe i świerkowe, VIII–X.", "Orange to copper cap; damaged flesh and stem turn grey, then black. Damp pine and spruce forests, Aug–Oct."],
  "Russula integra": ["Kapelusz zmienny: brązowy, winny, oliwkowy; blaszki ochrowe; smak łagodny, orzechowy. Lasy świerkowe, VIII–X.", "Variable cap: brown, wine-coloured or olive; ochre gills; mild, nutty taste. Spruce woods, Aug–Oct."],
  "Russula sanguinaria": ["Kapelusz krwistoczerwony, matowy; trzon często różowy; blaszki kremowe, lekko zbiegające; smak ostry. Pod sosnami, VIII–X.", "Blood-red matt cap; stem often pink; cream, slightly decurrent gills; acrid taste. Under pines, Aug–Oct."],
  "Russula atropurpurea": ["Kapelusz ciemnopurpurowy z prawie czarnym środkiem; blaszki białe; smak ostry; zapach owocowy. Pod dębami i bukami, VII–X.", "Dark purple cap with an almost black centre; white gills; acrid taste; fruity smell. Under oaks and beeches, Jul–Oct."],
  "Russula delica": ["Biały, lejkowaty, sztywny kapelusz, często pokryty ziemią; blaszki gęste; smak łagodny do lekko ostrego. Lasy liściaste, VII–X.", "White, stiff, funnel-shaped cap, often covered in soil; crowded gills; mild to slightly acrid. Broadleaf woods, Jul–Oct."],
  "Russula cyanoxantha": ["Kapelusz zmiennobarwny: fioletowy, niebieskawy, zielony; blaszki elastyczne, nie łamią się (wyjątek wśród gołąbków). Smak łagodny. Lasy liściaste, VII–X.", "Variably coloured cap: violet, bluish, green; gills flexible and do not break (unusual for brittlegills). Mild taste. Broadleaf woods, Jul–Oct."],
  "Russula fragilis": ["Mały, kruchy; kapelusz fioletowoczerwony, często z zielonkawym środkiem; blaszki białe, ząbkowane; smak ostry. Różne lasy, VII–X.", "Small and brittle; violet-red cap, often with a greenish centre; white, finely toothed gills; acrid. Various woods, Jul–Oct."],
  "Russula sardonia": ["Kapelusz fioletowoczerwony; blaszki cytrynowe; trzon fioletowy; smak bardzo ostry. Pod sosnami, VIII–XI.", "Violet-red cap; lemon-yellow gills; violet stem; very acrid taste. Under pines, Aug–Nov."],
  "Russula mustelina": ["Kapelusz brązowy jak łasica, twardy; blaszki kremowe; smak łagodny, orzechowy. Górskie lasy świerkowe, VIII–X.", "Brown cap like a weasel’s fur, firm; cream gills; mild nutty taste. Mountain spruce forests, Aug–Oct."],
  "Agaricus silvaticus": ["Kapelusz pokryty brązowymi włókienkami; miąższ po przekrojeniu wyraźnie czerwienieje. Lasy iglaste, VII–X.", "Cap covered in brown fibres; cut flesh turns distinctly red. Conifer woods, Jul–Oct."],
  "Agaricus augustus": ["Bardzo duża pieczarka z kapeluszem pokrytym złotobrązowymi łuskami; zapach migdałów; pierścień duży, zwisający. Lasy, parki, VII–X.", "Very large Agaricus with a cap covered in golden-brown scales; almond smell; large hanging ring. Woods and parks, Jul–Oct."],
  "Agaricus bitorquis": ["Biała, krępa, twarda pieczarka z podwójnym pierścieniem; potrafi przebić asfalt i bruk. Miasta, pobocza, V–X.", "White, stocky, firm Agaricus with a double ring; can push through asphalt and pavement. Towns and roadsides, May–Oct."],
  "Chlorophyllum olivieri": ["Podobna do czubajki czerwieniejącej, kapelusz z oliwkowoszarymi łuskami; miąższ czerwieniejący. Lasy iglaste, VIII–X.", "Similar to the Shaggy Parasol, with olive-grey scales on the cap; reddening flesh. Conifer woods, Aug–Oct."],
  "Macrolepiota mastoidea": ["Mniejsza od kani; kapelusz z wyraźnym, ostrym garbkiem i drobnymi łuseczkami; trzon prawie gładki. Polany i murawy, VIII–X. Uważaj na pomyłkę z trującymi czubeczkami.", "Smaller than the Parasol; cap with a distinct pointed umbo and fine scales; stem almost smooth. Clearings and grassland, Aug–Oct. Beware of confusion with poisonous dapperlings."],
  "Lepista saeva": ["Kapelusz beżowy do szarobrązowego; trzon wyraźnie fioletowy. Łąki i pastwiska, często w kręgach, IX–XII.", "Beige to grey-brown cap; distinctly violet stem. Meadows and pastures, often in rings, Sep–Dec."],
  "Lepista flaccida": ["Kapelusz rdzawopomarańczowy, lejkowaty, cienki; blaszki gęste, zbiegające. Ściółka iglasta, często gromadnie, IX–XII.", "Rusty-orange, thin, funnel-shaped cap; crowded decurrent gills. Conifer litter, often in groups, Sep–Dec."],
  "Lepiota clypeolaria": ["Mały, kapelusz białawy z brązowymi łuseczkami; trzon wełnisto-kosmaty, z nietrwałym pierścieniem. Lasy, VIII–X.", "Small whitish cap with brown scales; woolly shaggy stem with a fragile ring. Woods, Aug–Oct."],
  "Lepiota castanea": ["Bardzo mały (2–4 cm), kapelusz kasztanowobrązowy z drobnymi łuseczkami; trzon z rdzawymi włókienkami. Lasy liściaste, VIII–X.", "Very small (2–4 cm), chestnut-brown cap with fine scales; stem with rusty fibres. Broadleaf woods, Aug–Oct."],
  "Cystodermella cinnabarina": ["Kapelusz cynobrowoczerwony, ziarnisty; trzon w dolnej części ziarnisty jak kapelusz. Bory sosnowe, IX–XI.", "Cinnabar-red granular cap; lower stem granular like the cap. Pine forests, Sep–Nov."],
  "Amanita excelsa": ["Kapelusz szarobrązowy z szarymi płatkami osłony; pierścień prążkowany; bulwa bez wyraźnej pochwy. Różne lasy, VI–X.", "Grey-brown cap with grey veil patches; striate ring; bulb without a clear volva. Various woods, Jun–Oct."],
  "Amanita crocea": ["Kapelusz pomarańczowy z prążkowanym brzegiem; trzon z pomarańczowym wzorem; brak pierścienia; duża biała pochwa. Pod brzozami, VII–IX.", "Orange cap with a striate margin; stem with an orange pattern; no ring; large white volva. Under birches, Jul–Sep."],
  "Amanita vaginata": ["Kapelusz szary z prążkowanym brzegiem; brak pierścienia; trzon w białej, workowatej pochwie. Różne lasy, VI–X.", "Grey cap with a striate margin; no ring; stem in a white sac-like volva. Various woods, Jun–Oct."],
  "Amanita porphyria": ["Kapelusz szarofioletowobrązowy; szary pierścień; bulwa odgraniczona; zapach surowych ziemniaków. Bory iglaste, VIII–X.", "Grey purple-brown cap; grey ring; rimmed bulb; smells of raw potato. Conifer forests, Aug–Oct."],
  "Amanita strobiliformis": ["Duży, biały kapelusz z grubymi, kanciastymi brodawkami; trzon z mączystym pierścieniem. Ciepłe lasy na wapieniach, rzadki.", "Large white cap with thick angular warts; stem with a mealy ring. Warm woods on limestone, rare."],
  "Amanita gemmata": ["Kapelusz słomkowożółty z białymi płatkami; brzeg prążkowany; nietrwały pierścień; bulwa z kołnierzykiem. Bory sosnowe, VI–X.", "Straw-yellow cap with white patches; striate margin; fragile ring; bulb with a collar. Pine forests, Jun–Oct."],
  "Morchella semilibera": ["Mały kapelusz z komorami, dolna połowa wolna od trzonu (jak spódniczka); trzon długi i pusty. Wiosną w lasach łęgowych. Chroniony.", "Small pitted cap whose lower half hangs free from the stem like a skirt; long hollow stem. Spring in riverside woods. Protected."],
  "Morchella conica": ["Kapelusz stożkowaty, szarobrązowy, z komorami w pionowych rzędach; wnętrze puste. Wiosną w lasach i ogrodach. Chroniony.", "Conical grey-brown cap with pits in vertical rows; hollow inside. Spring in woods and gardens. Protected."],
  "Verpa conica": ["Gładki, brązowy kapelusz jak naparstek, przyczepiony tylko na szczycie trzonu. Wiosną pod krzewami i w zaroślach.", "Smooth brown thimble-like cap attached only at the top of the stem. Spring under shrubs and in thickets."],
  "Gyromitra gigas": ["Duży, brązowożółty, pofałdowany kapelusz na grubym, białym trzonie. Wczesną wiosną przy pniach, głównie w górach.", "Large, yellow-brown folded cap on a thick white stem. Early spring near stumps, mainly in mountains."],
  "Gyromitra infula": ["Kapelusz brązowy, siodłowaty, z 2–3 płatami; trzon jasny. Jesienią na murszejącym drewnie iglastym.", "Brown, saddle-shaped cap with 2–3 lobes; pale stem. Autumn on rotting conifer wood."],
  "Disciotis venosa": ["Brązowa czarka do 15 cm z żyłkowanym środkiem; wyraźny zapach chloru (wybielacza). Wiosną w wilgotnych lasach łęgowych.", "Brown cup up to 15 cm with a veined centre; distinct bleach (chlorine) smell. Spring in damp riverside woods."],
  "Helvella lacunosa": ["Ciemnoszary do czarnego, pofałdowany kapelusz; trzon szary, z głębokimi komorami i żebrami. Lasy, VIII–X.", "Dark grey to black folded cap; grey stem with deep chambers and ribs. Woods, Aug–Oct."],
  "Helvella elastica": ["Kapelusz szarobrązowy, siodłowaty (2 płaty); trzon biały, gładki, elastyczny. Wilgotne lasy, VIII–X.", "Grey-brown saddle-shaped cap (2 lobes); smooth, white, elastic stem. Damp woods, Aug–Oct."],
  "Peziza vesiculosa": ["Jasnobrązowa, krucha czarka z wywiniętym do środka brzegiem. Na obornikach i kompoście, wiosną i jesienią.", "Pale brown, brittle cup with an incurved margin. On manure and compost, spring and autumn."],
  "Otidea onotica": ["Pomarańczowożółta, wydłużona i rozcięta z boku czarka w kształcie ucha zająca. Lasy liściaste, VIII–X.", "Orange-yellow, elongated cup split on one side, shaped like a hare’s ear. Broadleaf woods, Aug–Oct."],
  "Armillaria ostoyae": ["Kępy brązowych kapeluszy z ciemnymi łuskami; pierścień z brązowym brzegiem. Na drzewach iglastych, IX–XI. Groźny pasożyt.", "Clusters of brown caps with dark scales; ring with a brown edge. On conifers, Sep–Nov. A dangerous parasite."],
  "Armillaria gallica": ["Kapelusz żółtobrązowy; trzon zgrubiały u podstawy, z delikatnym pierścieniem. Na korzeniach drzew liściastych, często pojedynczo, IX–XI.", "Yellow-brown cap; stem swollen at the base with a delicate ring. On roots of broadleaf trees, often solitary, Sep–Nov."],
  "Fomitopsis pinicola": ["Twarda huba z czerwonopomarańczowym pasem na brzegu i białymi porami. Na świerkach i innych drzewach, przez cały rok.", "Tough bracket with a red-orange band near the edge and white pores. On spruces and other trees, all year."],
  "Piptoporus betulinus": ["Biała do jasnobrązowej, gładka huba w kształcie poduszki. Tylko na brzozach, przez cały rok. Zabrał ją ze sobą Ötzi.", "Smooth, white to pale brown cushion-shaped bracket. Only on birches, all year. Ötzi the Iceman carried it."],
  "Trametes hirsuta": ["Szarobiała, mocno owłosiona huba z cienkimi strefami. Na martwym drewnie liściastym, przez cały rok.", "Grey-white, distinctly hairy bracket with thin zones. On dead broadleaf wood, all year."],
  "Cerioporus squamosus": ["Duży, kremowy kapelusz z brązowymi łuskami jak skrzydło bażanta; zapach świeżego ogórka lub arbuza. Na drzewach liściastych, V–VII. Jemy tylko młode, miękkie.", "Large cream cap with brown scales like a pheasant’s wing; smells of fresh cucumber or watermelon. On broadleaf trees, May–Jul. Eat only young, soft ones."],
  "Ganoderma applanatum": ["Płaska, twarda, wieloletnia huba z brązowym wierzchem i białym spodem, na którym zarysowania brązowieją. Na pniach liściastych, przez cały rok.", "Flat, hard, perennial bracket with a brown top and white underside that browns when scratched. On broadleaf stumps, all year."],
  "Daedalea quercina": ["Korkowata, brązowa huba z grubymi, labiryntowymi porami pod spodem. Na pniach dębów, przez cały rok.", "Corky brown bracket with thick maze-like pores underneath. On oak stumps, all year."],
  "Polyporus umbellatus": ["Kępa wielu małych, szarobrązowych kapeluszy na rozgałęzionym, wspólnym trzonie. U podstawy dębów i buków, VII–IX. Rzadki i chroniony.", "Cluster of many small grey-brown caps on a branched shared stem. At the base of oaks and beeches, Jul–Sep. Rare and protected."],
  "Ischnoderma benzoinum": ["Ciemnobrązowa, aksamitna huba, młoda wydziela bursztynowe krople; zapach anyżu. Na martwych świerkach i sosnach, jesienią.", "Dark brown velvety bracket that exudes amber droplets when young; anise smell. On dead spruces and pines, autumn."],
  "Phellinus igniarius": ["Twarda, kopytowata, szaroczarna, spękana huba z rdzawymi porami. Na wierzbach i innych liściastych, wieloletnia.", "Hard, hoof-shaped, grey-black, cracked bracket with rusty pores. On willows and other broadleaf trees, perennial."],
  "Bjerkandera adusta": ["Szarobiałe, cienkie półeczki z charakterystycznie dymnoszarymi do czarnych porami. Na martwym drewnie, przez cały rok.", "Thin grey-white brackets with characteristic smoky grey to black pores. On dead wood, all year."],
  "Coprinellus micaceus": ["Kępy małych, brązowych, prążkowanych kapeluszy pokrytych błyszczącymi drobinkami jak mika. Przy pniach drzew liściastych, IV–XI.", "Clusters of small brown grooved caps dusted with glittering mica-like granules. Around broadleaf stumps, Apr–Nov."],
  "Coprinellus disseminatus": ["Setki drobnych, szarobiałych, dzwonkowatych kapeluszy na pniach i wokół nich. IV–XI.", "Hundreds of tiny grey-white bell-shaped caps on and around stumps. Apr–Nov."],
  "Parasola plicatilis": ["Drobny, delikatny kapelusz jak parasolka, mocno plisowany; żyje kilka godzin. Trawniki, V–X.", "Tiny, delicate, heavily pleated cap like a small umbrella; lives only a few hours. Lawns, May–Oct."],
  "Hypholoma lateritium": ["Kępy ceglastoczerwonych kapeluszy z jaśniejszym brzegiem; blaszki szarooliwkowe; smak lekko gorzkawy. Na pniach dębów i buków, IX–XII.", "Clusters of brick-red caps with paler margins; grey-olive gills; slightly bitter taste. On oak and beech stumps, Sep–Dec."],
  "Cortinarius violaceus": ["Cały ciemnofioletowy, łuseczkowaty kapelusz; zapach cedrowego drewna. Lasy wilgotne, rzadki i chroniony, VIII–X.", "Entirely dark violet with a scaly cap; smells of cedar wood. Damp woods, rare and protected, Aug–Oct."],
  "Cortinarius traganus": ["Kapelusz liliowy; miąższ szafranowobrązowy; nieprzyjemny zapach gazu lub acetylenu, czasem owocowy. Lasy iglaste, VIII–X.", "Lilac cap; saffron-brown flesh; unpleasant smell of gas or acetylene, sometimes fruity. Conifer woods, Aug–Oct."],
  "Cortinarius sanguineus": ["Cały krwistoczerwony: kapelusz, blaszki i trzon. Wilgotne lasy świerkowe, VIII–X.", "Entirely blood-red: cap, gills and stem. Damp spruce woods, Aug–Oct."],
  "Cortinarius armillatus": ["Kapelusz rdzawobrązowy; trzon z kilkoma czerwonymi opaskami. Pod brzozami na wilgotnych miejscach, VIII–X.", "Rusty-brown cap; stem with several red bands. Under birches in damp places, Aug–Oct."],
  "Cortinarius glaucopus": ["Kapelusz oliwkowobrązowy, lepki; trzon niebieskawy u góry, z odgraniczoną bulwą. Lasy iglaste, VIII–X.", "Olive-brown sticky cap; stem bluish near the top, with a rimmed bulb. Conifer woods, Aug–Oct."],
  "Pholiota aurivella": ["Duże, złotożółte, lepkie kapelusze z brązowymi, przylegającymi łuskami. Wysoko na pniach drzew liściastych, IX–XI.", "Large golden-yellow sticky caps with brown appressed scales. High on broadleaf trunks, Sep–Nov."],
  "Gymnopilus junonius": ["Duże, złotopomarańczowe kępy na pniach; pierścień; zarodniki rdzawe; smak bardzo gorzki. VIII–XI.", "Large golden-orange clusters on stumps; ring on the stem; rusty spores; very bitter taste. Aug–Nov."],
  "Gymnopilus penetrans": ["Mały, rdzawopomarańczowy kapelusz; blaszki żółte, z rdzawymi plamami; smak gorzki. Na drewnie iglastym, VIII–XI.", "Small rusty-orange cap; yellow gills with rusty spots; bitter taste. On conifer wood, Aug–Nov."],
  "Stropharia aeruginosa": ["Kapelusz niebieskozielony, śluzowaty, z białymi płatkami; pierścień; blaszki szarofioletowe. Lasy, VIII–XI.", "Blue-green slimy cap with white flecks; ring; grey-violet gills. Woods, Aug–Nov."],
  "Coprinopsis picacea": ["Kapelusz jajowaty, czarny z białymi płatami jak upierzenie sroki; blaszki rozpływają się. Lasy bukowe, IX–XI.", "Egg-shaped black cap with white patches like a magpie’s plumage; gills dissolve. Beech woods, Sep–Nov."],
  "Psathyrella candolleana": ["Kremowobiały, bardzo kruchy kapelusz z resztkami osłony na brzegu; blaszki brązowofioletowe. Przy pniach, w parkach, V–X.", "Creamy white, very brittle cap with veil fragments on the margin; brown-violet gills. Near stumps and in parks, May–Oct."],
  "Lycoperdon pratense": ["Mała, biała, spłaszczona kulka z błoną oddzielającą zarodniki od podstawy. Łąki i trawniki, VII–X.", "Small white flattened puffball with a membrane separating spores from the base. Meadows and lawns, Jul–Oct."],
  "Lycoperdon echinatum": ["Brązowa kulka pokryta długimi, zakrzywionymi kolcami jak jeż. Lasy bukowe na wapieniach, rzadka.", "Brown ball covered with long curved spines like a hedgehog. Beech woods on limestone, rare."],
  "Scleroderma verrucosum": ["Bulwa żółtobrązowa z cienką, brodawkowatą skórą i wyraźnym, pomarszczonym trzonkiem. Lasy, VII–X.", "Yellow-brown tuber with a thin warty skin and a distinct wrinkled stalk. Woods, Jul–Oct."],
  "Geastrum fimbriatum": ["Mała gwiazda o 5–8 ramionach z kulką pośrodku, bez kołnierzyka; ujście włókienkowate. Ściółka iglasta, IX–XI.", "Small star with 5–8 rays and a central ball without a collar; fibrous mouth. Conifer litter, Sep–Nov."],
  "Astraeus hygrometricus": ["Gwiazda, której ramiona zamykają się w suchą pogodę i otwierają w wilgotną. Piaszczyste gleby, przez cały rok.", "A star whose rays close in dry weather and open in damp weather. Sandy soils, all year."],
  "Cyathus striatus": ["Mały, włochaty kubeczek z prążkowanym wnętrzem i „jajeczkami” zarodników. Na gałązkach, VIII–XI.", "Small hairy cup with a grooved inside holding ‘eggs’ of spores. On twigs, Aug–Nov."],
  "Sphaerobolus stellatus": ["Drobna pomarańczowa gwiazdka (2 mm), która wystrzeliwuje kulkę zarodników na kilka metrów. Na drewnie i trocinach.", "Tiny orange star (2 mm) that shoots its spore ball several metres. On wood and sawdust."],
  "Bovista nigrescens": ["Biała kula bez trzonu, z wiekiem czarna i papierowa; toczy się po łące. Pastwiska, VI–X.", "White ball without a stem, turning black and papery with age; rolls across meadows. Pastures, Jun–Oct."],
  "Bovista plumbea": ["Mała, biała kulka, potem ołowianoszara, papierowa. Krótka trawa, pastwiska, VI–X.", "Small white ball that turns lead-grey and papery. Short grass and pastures, Jun–Oct."],
  "Calvatia excipuliformis": ["Wysoka purchawka jak tłuczek moździerza: kulista główka na długim trzonie. Lasy i łąki, VII–X.", "Tall puffball shaped like a pestle: a round head on a long stem. Woods and meadows, Jul–Oct."],
  "Calvatia utriformis": ["Duża, biała purchawka, skóra pęka w wielokątne poletka. Pastwiska i wrzosowiska, VI–X.", "Large white puffball whose skin cracks into polygonal patches. Pastures and heaths, Jun–Oct."],
  "Auricularia mesenterica": ["Galaretowato-skórzasta półeczka: wierzch szary, włochaty, ze strefami; spód fioletowobrązowy, pofałdowany. Na martwym drewnie liściastym.", "Rubbery shelf: grey, hairy, zoned top; violet-brown, wrinkled underside. On dead broadleaf wood."],
  "Exidia glandulosa": ["Czarne, galaretowate plamy na gałęziach dębów, z drobnymi brodawkami. Jesienią i zimą.", "Black jelly patches on oak branches, with tiny warts. Autumn and winter."],
  "Pseudohydnum gelatinosum": ["Półprzezroczysty, szarobiały, galaretowaty kapelusz z kolcami pod spodem. Na pniach iglastych, IX–XI.", "Translucent grey-white jelly cap with spines underneath. On conifer stumps, Sep–Nov."],
  "Calocera viscosa": ["Jaskrawożółte do pomarańczowych, rozwidlone, kleiste rożki jak poroże. Na drewnie iglastym, VIII–XII.", "Bright yellow to orange forked, sticky antler-like horns. On conifer wood, Aug–Dec."],
  "Ramaria flava": ["Żółty, gęsto rozgałęziony koralowiec; trudny do odróżnienia od innych koralówek. Lasy, VIII–X.", "Yellow, densely branched coral fungus; hard to tell apart from other corals. Woods, Aug–Oct."],
  "Ramaria aurea": ["Złotożółty koralowiec z grubym trzonem. Lasy, rzadki, VIII–X. Wiele podobnych koralówek przeczyszcza.", "Golden-yellow coral fungus with a thick stem. Woods, rare, Aug–Oct. Many similar corals are laxative."],
  "Clavulina cinerea": ["Szary, rozgałęziony koralowiec z tępymi końcówkami. Ściółka w różnych lasach, VIII–XI.", "Grey branched coral fungus with blunt tips. Leaf litter in various woods, Aug–Nov."],
  "Clavariadelphus pistillaris": ["Duża, żółtobrązowa maczuga do 30 cm, bez rozgałęzień. Lasy bukowe na wapieniach, rzadka i chroniona.", "Large yellow-brown club up to 30 cm, unbranched. Beech woods on limestone, rare and protected."],
  "Stereum hirsutum": ["Cienkie, falowane, żółtopomarańczowe skorupki, wierzch włochaty. Na martwym drewnie liściastym, przez cały rok.", "Thin wavy yellow-orange crusts with a hairy top. On dead broadleaf wood, all year."],
  "Artomyces pyxidatus": ["Białawy do żółtego koralowiec, każda końcówka zakończona małą koroną. Na murszejącym drewnie topoli i wierzb, rzadki.", "Whitish to yellow coral fungus, each tip ending in a small crown. On rotting poplar and willow wood, rare."],
};

// ---- Opisy: jak i dlaczego szkodzi / dlaczego jadalny ----
// Linijka RAW może mieć 5. pole z kodem opisu. Bez kodu: e->E, c->Cg, i->I, t->Gi
const DEFAULT_PROFILE: Record<Status, string> = { e: 'E', c: 'Cg', i: 'I', t: 'Gi', d: 'Gi' };
const WHY = {"pl": {"e": "Co warto wiedzieć", "c": "Warunki i dlaczego", "i": "Dlaczego niejadalny", "t": "Jak i dlaczego szkodzi", "d": "Jak i dlaczego zabija"}, "en": {"e": "Good to know", "c": "Conditions and why", "i": "Why inedible", "t": "How and why it harms", "d": "How and why it kills"}};
const PROFILES: Record<string, { pl: string; en: string }> = {
  "E": {
    "pl": "Brak znanych toksyn. Obrabiaj termicznie co najmniej 15 min: ciepło rozbija chitynę i białka wrażliwe na temperaturę, które w surowym grzybie mogą dawać wzdęcia i biegunkę. Jedz tylko młode, zdrowe okazy: stary lub zepsuty grzyb zatruwa jak zepsute mięso (bakterie, rozpad białek), zwykle po 1–6 h. Zacznij od małej porcji, bo zdarzają się nietolerancje. Grzyby gromadzą metale ciężkie i skażenia, więc nie zbieraj przy drogach.",
    "en": "No known toxins. Cook at least 15 min: heat breaks down chitin and heat-sensitive proteins that can cause bloating and diarrhoea when raw. Eat only young, healthy specimens: old or spoiled mushrooms poison like spoiled meat (bacteria, protein breakdown), usually after 1–6 h. Start with a small portion, as intolerances occur. Mushrooms accumulate heavy metals and pollutants, so avoid roadsides."
  },
  "Ea": {
    "pl": "Jadalna, ale w koszyku łatwo o śmiertelną pomyłkę: biała pieczarka bywa brana za muchomora sromotnikowego lub jadowitego. Pieczarka ma blaszki różowe, potem czekoladowe; muchomor ma blaszki białe i bulwę z pochwą u nasady. Pieczarkę karbolową poznasz po zapachu karbolu i żółknięciu u podstawy. Gotuj; gromadzi kadm i inne metale, więc nie jedz jej często.",
    "en": "Edible, but a fatal mix-up is easy: white Agaricus is mistaken for the Death Cap or Destroying Angel. Agaricus has pink, then chocolate-brown gills; Amanita has white gills and a sheathed bulb at the base. The Yellow Stainer smells of carbolic acid and yellows at the base. Cook it; it accumulates cadmium and other metals, so don’t eat it often."
  },
  "Ep": {
    "pl": "Jadalna tylko dopóki wnętrze jest jednolicie białe i jędrne; gdy żółknie lub ciemnieje, daje dolegliwości żołądkowe. Zawsze przekrój owocnik na pół: w młodym muchomorze (tzw. jaju) widać zarys kapelusza i trzonu, w purchawce nie. Pomylenie z młodym muchomorem sromotnikowym jest śmiertelne. Smaż lub gotuj.",
    "en": "Edible only while the inside is uniformly white and firm; once yellow or dark it causes stomach upset. Always cut it in half: a young Amanita ‘egg’ shows a cap and stem outline, a puffball does not. Mistaking a young Death Cap for a puffball is fatal. Fry or boil."
  },
  "Ek": {
    "pl": "Jadalny gatunek, ale rośnie w kępach na drewnie, tak jak śmiertelnie trująca hełmówka jadowita (amatoksyny) i trująca maślanka wiązkowa. Łuszczak ma łuskowatą dolną część trzonu i pierścień, mimo to mylą się nawet doświadczeni. Zbieraj tylko przy pełnej pewności; gotuj.",
    "en": "Edible species, but it grows in tufts on wood just like the deadly Funeral Bell (amatoxins) and the poisonous Sulfur Tuft. Kuehneromyces has a scaly lower stem and a ring, yet even experts mix them up. Pick only with total certainty; cook."
  },
  "Cg": {
    "pl": "Jadalny pod warunkiem właściwego przygotowania: długie gotowanie (ok. 15–20 min), odlanie wody lub tylko młode okazy. Surowy lub niedogotowany zawiera związki drażniące żołądek: nudności, wymioty, biegunka 1–6 h po jedzeniu, zwykle mija po 1–2 dniach. Informacje o niektórych gatunkach są rozbieżne, więc zacznij od małej porcji.",
    "en": "Edible only if prepared properly: long boiling (about 15–20 min), discarding the water, or only young specimens. Raw or undercooked it contains stomach irritants: nausea, vomiting, diarrhoea 1–6 h after eating, usually gone in 1–2 days. Sources differ on some species, so start with a small portion."
  },
  "Cm": {
    "pl": "Surowe i niedogotowane smardze oraz piestrzyce zawierają toksyny rozkładane przez ciepło (m.in. hemolizyny niszczące krwinki); ich skład nie jest w pełni poznany. Objawy po 1–12 h: wymioty, biegunka, zawroty głowy, drżenie, zaburzenia koordynacji; z alkoholem silniejsze. Gotuj min. 10–15 min i odlej wodę, nigdy nie jedz surowych ani w dużej ilości. Piestrzyce lepiej omijać.",
    "en": "Raw or undercooked morels and elfin saddles contain heat-labile toxins (including haemolysins that destroy red blood cells); their composition is not fully understood. Symptoms after 1–12 h: vomiting, diarrhoea, dizziness, tremor, loss of coordination; worse with alcohol. Boil at least 10–15 min and discard the water; never eat raw or in large amounts. Better to avoid elfin saddles."
  },
  "Rb": {
    "pl": "Borowiki czerwonopore. Borowik szatański, purpurowy i Le Gala zawierają m.in. bolesatynę, lektynę blokującą syntezę białek i zlepiającą krwinki: silne wymioty i biegunka 1–6 h po jedzeniu, odwodnienie, w ciężkich przypadkach uszkodzenie jelit i krążenia. Borowik ponury i ceglastopory są jadalne dopiero po gotowaniu min. 15–20 min i nigdy z alkoholem (możliwa reakcja jak po czernidlaku).",
    "en": "Red-pored boletes. Satan’s, Old Rose and Le Gal’s Bolete contain bolesatine, a lectin that blocks protein synthesis and clumps red blood cells: severe vomiting and diarrhoea 1–6 h after eating, dehydration, and in serious cases gut and circulatory damage. Lurid and Scarletina Bolete are edible only after boiling at least 15–20 min and never with alcohol (an ink-cap-type reaction is possible)."
  },
  "Ca": {
    "pl": "Surowa lub niedogotowana opieńka podrażnia żołądek (nudności, wymioty, biegunka 1–6 h po jedzeniu), a u części osób szkodzi nawet po obróbce. Gotuj min. 15–20 min, wodę odlej, zbieraj tylko młode kapelusze. Rośnie w kępach na drewnie, jak śmiertelnie trująca hełmówka jadowita i trująca maślanka wiązkowa; opieńka ma białe zarodniki i pierścień na trzonie.",
    "en": "Raw or undercooked honey fungus irritates the stomach (nausea, vomiting, diarrhoea 1–6 h after eating), and some people react even after cooking. Boil at least 15–20 min, discard the water, pick only young caps. It grows in tufts on wood like the deadly Funeral Bell and the poisonous Sulfur Tuft; honey fungus has a white spore print and a ring on the stem."
  },
  "Cl": {
    "pl": "Mleczny sok zawiera ostre, palące związki drażniące. Surowy lub krótko gotowany daje pieczenie w ustach i żołądku, nudności, wymioty i biegunkę po 30 min–3 h. Po długim moczeniu, gotowaniu lub zasoleniu i odlaniu wody traci ostrość i bywa jadany. Smak i wartość kulinarna są niewielkie.",
    "en": "The milky sap contains sharp, burning irritants. Raw or briefly cooked it causes burning in mouth and stomach, nausea, vomiting and diarrhoea after 30 min–3 h. After long soaking, boiling or salting and discarding the water it loses its sharpness and is sometimes eaten. Culinary value is low."
  },
  "Cb": {
    "pl": "Muchomor czerwieniejący i muchomory pochwiaste zawierają w stanie surowym hemolizyny niszczące krwinki; ciepło je rozkłada. Surowe lub niedogotowane dają nudności, wymioty i anemię hemolityczną po 1–6 h. Gotuj dokładnie i odlej wodę. Główne ryzyko to pomyłka z muchomorem plamistym lub sromotnikowym, więc zbieraj tylko przy pełnej pewności.",
    "en": "The Blusher and the grisettes contain haemolysins when raw that destroy red blood cells; heat breaks them down. Raw or undercooked they cause nausea, vomiting and haemolytic anaemia after 1–6 h. Cook thoroughly and discard the water. The main danger is mistaking them for the Panther Cap or Death Cap, so pick only with total certainty."
  },
  "Cn": {
    "pl": "Jadalna dopiero po obróbce: surowa daje nudności, wymioty i biegunkę 1–4 h po jedzeniu, a u uczulonych reakcje alergiczne. Gotuj min. 15–20 min. Fioletowa barwa myli: podobne są zasłonaki, rodzaj z gatunkami śmiertelnie trującymi. Sprawdź zapach i blaszki i zbieraj tylko przy pełnej pewności.",
    "en": "Edible only after cooking: raw it causes nausea, vomiting and diarrhoea 1–4 h after eating, and allergic reactions in sensitive people. Boil at least 15–20 min. The violet colour misleads: webcaps look similar, a genus with deadly species. Check smell and gills and pick only with total certainty."
  },
  "Am": {
    "pl": "Amatoksyny (α-amanityna) blokują polimerazę RNA II, więc komórki przestają produkować białka. Najpierw ginie wątroba, potem nerki. Przebieg: 6–24 h bez objawów, potem silne wymioty i biegunka (do 2 dni), pozorna poprawa 2.–3. dnia, a 3.–5. dnia niewydolność wątroby i nerek, śpiączka, często zgon bez przeszczepu wątroby. Toksyn nie niszczy gotowanie, suszenie ani mrożenie, wystarczy jeden okaz. Przy podejrzeniu dzwoń od razu pod 112, zabierz resztki grzyba i nie czekaj na objawy.",
    "en": "Amatoxins (α-amanitin) block RNA polymerase II, so cells stop making proteins. The liver dies first, then the kidneys. Course: 6–24 h with no symptoms, then severe vomiting and diarrhoea (up to 2 days), a false recovery on day 2–3, and on day 3–5 liver and kidney failure, coma, often death without a liver transplant. Cooking, drying and freezing do not destroy the toxins, and one specimen is enough. If you suspect it, call 112 at once, keep leftovers and don’t wait for symptoms."
  },
  "Or": {
    "pl": "Orelanina uszkadza kanaliki nerkowe. Objawy pojawiają się bardzo późno, po 2–20 dniach (zwykle 2–5) od zjedzenia: pragnienie, ból pleców i boków, nudności, potem ostra niewydolność nerek; część chorych wymaga dializ lub przeszczepu. Gotowanie jej nie niszczy. Wczesne leczenie decyduje o wyniku, więc po zjedzeniu nie czekaj na objawy: 112.",
    "en": "Orellanine damages the kidney tubules. Symptoms appear very late, 2–20 days (usually 2–5) after eating: thirst, back and flank pain, nausea, then acute kidney failure; some patients need dialysis or a transplant. Cooking does not destroy it. Early treatment decides the outcome, so don’t wait for symptoms: call 112."
  },
  "Gy": {
    "pl": "Gyromitryna rozpada się w organizmie (i w parze podczas gotowania) do monometylohydrazyny, która blokuje witaminę B6: uszkadza wątrobę, niszczy krwinki i atakuje układ nerwowy. Objawy po 6–12 h: wymioty, biegunka, ból głowy, potem drgawki, żółtaczka, niewydolność wątroby; piestrzenica kasztanowata bywa śmiertelna. Gotowanie i suszenie nie gwarantują bezpieczeństwa. Pozostałe piestrzenice i naparstniczki: toksyczność mniejsza lub niepewna, nie jedz.",
    "en": "Gyromitrin breaks down in the body (and in steam while cooking) into monomethylhydrazine, which blocks vitamin B6: it damages the liver, destroys red blood cells and attacks the nervous system. Symptoms after 6–12 h: vomiting, diarrhoea, headache, then seizures, jaundice and liver failure; the False Morel can be fatal. Cooking and drying do not guarantee safety. Other false morels and thimble-caps: lower or uncertain toxicity, don’t eat."
  },
  "Mu": {
    "pl": "Kwas ibotenowy i muscymol działają na układ nerwowy. Objawy po 30 min–3 h: senność, splątanie, zaburzenia równowagi, omamy, drgawki, czasem wymioty. Muchomor plamisty jest silniejszy od czerwonego. Zwykle mija w 12–24 h, ale możliwe są groźne zatrucia, zwłaszcza u dzieci; zgony są rzadkie. Wezwij pomoc (112).",
    "en": "Ibotenic acid and muscimol act on the nervous system. Symptoms after 30 min–3 h: drowsiness, confusion, loss of balance, hallucinations, seizures, sometimes vomiting. The Panther Cap is stronger than the Fly Agaric. It usually passes in 12–24 h, but severe poisoning is possible, especially in children; deaths are rare. Call 112."
  },
  "Co": {
    "pl": "Sam nie szkodzi, ale koprin blokuje rozkład alkoholu (dehydrogenazę aldehydową), więc gromadzi się aldehyd octowy. Po wypiciu alkoholu w ciągu 2–3 dni (nawet do 5) od zjedzenia: zaczerwienienie twarzy, kołatanie serca, nudności, zawroty głowy po 20 min–kilku godzinach. Obciąża serce i krążenie, zwykle mija w kilka godzin. Gotuj, jedz młode okazy i nie pij alkoholu.",
    "en": "On its own it is harmless, but coprine blocks alcohol breakdown (aldehyde dehydrogenase), so acetaldehyde builds up. If you drink alcohol within 2–3 days (up to 5) of eating it: flushing, palpitations, nausea and dizziness after 20 min to a few hours. It strains the heart and circulation and usually passes in a few hours. Cook it, eat young specimens and avoid alcohol."
  },
  "Pa": {
    "pl": "Antygen krowiaka wywołuje reakcję immunologiczną: po wielokrotnym jedzeniu organizm tworzy przeciwciała i niszczy własne krwinki czerwone (hemoliza). Objawy po 1–3 h: wymioty, ból brzucha, potem żółtaczka, ciemny mocz, niewydolność nerek, wstrząs; opisano zgony. Gotowanie nie pomaga. Dawniej uważany za jadalny po obróbce, co okazało się błędem. Nie jedz; 112.",
    "en": "The roll-rim’s antigen triggers an immune reaction: after repeated meals the body makes antibodies and destroys its own red blood cells (haemolysis). Symptoms after 1–3 h: vomiting, abdominal pain, then jaundice, dark urine, kidney failure and shock; deaths have been reported. Cooking does not help. It was once considered edible when cooked, which proved wrong. Don’t eat; call 112."
  },
  "Gi": {
    "pl": "Związki drażniące (np. ostre żywice, fenole, saponiny) podrażniają błonę śluzową żołądka i jelit: nudności, wymioty, biegunka, kolki. Początek po 30 min–3 h (czasem do 6, a przy maślance wiązkowej do 10 h), zwykle mija w 1–2 dni. Ryzyko odwodnienia, zwłaszcza u dzieci i starszych; w ciężkich przypadkach (maślanka wiązkowa) możliwe uszkodzenie wątroby. Toksyczność części gatunków jest słabo poznana.",
    "en": "Irritants (e.g. sharp resins, phenols, saponins) inflame the lining of the stomach and gut: nausea, vomiting, diarrhoea, cramps. Onset 30 min–3 h (sometimes up to 6, up to 10 h for Sulfur Tuft); usually passes in 1–2 days. Risk of dehydration, especially for children and the elderly; severe cases (Sulfur Tuft) can damage the liver. The toxicity of some species is poorly studied."
  },
  "Lp": {
    "pl": "Małe czubeczki z rodzaju Lepiota: wiele gatunków zawiera amatoksyny, a toksyczność pozostałych jest słabo poznana. Przy zatruciu: 6–24 h bez objawów, potem wymioty, biegunka i uszkodzenie wątroby i nerek. Traktuj je jak potencjalnie śmiertelne; przy podejrzeniu 112.",
    "en": "Small Lepiota dapperlings: many species contain amatoxins and the toxicity of the rest is poorly known. In poisoning: 6–24 h with no symptoms, then vomiting, diarrhoea and liver and kidney damage. Treat them as potentially deadly; call 112 if you suspect it."
  },
  "Cx": {
    "pl": "Toksyczność tego zasłonaka nie jest potwierdzona, ale rodzaj zawiera śmiertelnie trujące gatunki z orelaniną (uszkodzenie nerek po 2–20 dniach, bez wcześniejszych objawów). Brak wiarygodnych danych, więc traktuj jako niebezpieczny i nie jedz.",
    "en": "The toxicity of this webcap is not confirmed, but the genus includes deadly orellanine species (kidney damage after 2–20 days with no early symptoms). No reliable data, so treat it as dangerous and don’t eat it."
  },
  "I": {
    "pl": "Niejadalny: miąższ twardy, korkowaty, gorzki lub niesmaczny, bez wartości kulinarnej. Zwykle nie jest silnie trujący, ale zjedzenie może dać dolegliwości żołądkowe (nudności, biegunka po 1–6 h). Część gatunków ma zastosowanie lecznicze lub barwierskie, nie jako pokarm.",
    "en": "Inedible: flesh tough, corky, bitter or unpleasant, with no culinary value. Usually not strongly poisonous, but eating it may cause stomach upset (nausea, diarrhoea after 1–6 h). Some species are used medicinally or as dyes, not as food."
  }
};

// ===================== MOTYW: las za dnia i las nocą =====================
type Lang = 'pl' | 'en';
type ThemeMode = 'system' | 'light' | 'dark';
type Theme = {
  dark: boolean;
  bg: string; card: string; card2: string; ink: string; muted: string; line: string;
  forest: string; hill1: string; hill2: string; fern: string; amber: string; onAmber: string; cream: string;
  status: Record<Status, string>;
};

const LIGHT: Theme = {
  dark: false,
  bg: '#F1EBDD', card: '#FBF8F0', card2: '#E6DECB', ink: '#1B231C', muted: '#6E6C5F', line: '#DCD2BE',
  forest: '#1F3B2D', hill1: '#2C5240', hill2: '#3F6B4A', fern: '#4F7F49', amber: '#D9922B', onAmber: '#1B231C', cream: '#F4EAD5',
  status: { e: '#3D8B57', c: '#C98E14', i: '#8B897C', t: '#D2612A', d: '#C0282E' },
};
const DARK: Theme = {
  dark: true,
  bg: '#0D1511', card: '#15211A', card2: '#1D2C23', ink: '#EAE4D3', muted: '#8F9C8C', line: '#24352A',
  forest: '#13261B', hill1: '#1C3627', hill2: '#2A4A35', fern: '#86B779', amber: '#E8A645', onAmber: '#13190F', cream: '#F4EAD5',
  status: { e: '#5DB57A', c: '#E6B03E', i: '#A19F93', t: '#EE8550', d: '#F0525A' },
};

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
const alpha = (hex: string, a: string) => hex + a; // '#RRGGBB' + 'AA'

// polska odmiana: 1 gatunek, 2 gatunki, 5 gatunków
const plural = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;

const L = {
  pl: {
    brand: 'Grzybnia',
    tabs: { atlas: 'Atlas', map: 'Mapa', scan: 'Skaner', recipes: 'Przepisy', album: 'Zdjęcia' },
    months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
    monthLetters: ['S', 'L', 'M', 'K', 'M', 'C', 'L', 'S', 'W', 'P', 'L', 'G'],
    label: { e: 'Jadalny', c: 'Warunkowo', i: 'Niejadalny', t: 'Trujący', d: 'Śmiertelny' },
    desc: {
      e: 'Jadalny. Zbieraj tylko okazy, które rozpoznajesz na pewno.',
      c: 'Jadalny dopiero po właściwej obróbce (np. długie gotowanie). Surowy lub źle przygotowany szkodzi.',
      i: 'Niejadalny: twardy, gorzki albo bez wartości kulinarnej.',
      t: 'Trujący. Wywołuje zatrucie pokarmowe lub inne objawy.',
      d: 'ŚMIERTELNIE TRUJĄCY. Nie jedz i nie wkładaj do jednego koszyka z jadalnymi.',
    },
    kicker: 'Teraz w lesie',
    heroStats: (n: number, e: number, d: number) => `${n} ${plural(n, 'gatunek', 'gatunki', 'gatunków')} w sezonie · ${e} jadalnych · ${d} trujących`,
    inSeason: 'W sezonie',
    search: 'Szukaj gatunku…', all: 'Wszystkie',
    count: (n: number) => `${n} ${plural(n, 'gatunek', 'gatunki', 'gatunków')}`,
    noResults: 'Nic nie znaleziono',
    season: 'Sezon', look: 'Wygląd i siedlisko', recipesWith: 'Przepisy z tym grzybem', more: 'Więcej o gatunku',
    wiki: 'Wikipedia', commons: 'Zdjęcia – Wikimedia Commons', inat: 'Obserwacje – iNaturalist', noPhoto: 'Brak zdjęcia',
    warn: 'Aplikacja jest tylko informacyjna. Nigdy nie jedz grzyba wyłącznie na jej podstawie – zapytaj grzyboznawcę (sanepid).',
    recipesTitle: 'Przepisy', recipesSub: 'Kuchnia z grzybów z atlasu',
    min: (n: number) => `${n} min`, serves: (n: number) => `${n} ${plural(n, 'porcja', 'porcje', 'porcji')}`,
    mushrooms: 'Grzyby', ingredients: 'Składniki', steps: 'Przygotowanie', tip: 'Wskazówka',
    cookSafety: 'Gotuj tylko grzyby, których jesteś pewien, i zawsze obrabiaj je termicznie.',
    albumTitle: 'Moje zdjęcia', albumSub: (n: number) => n ? `${n} ${plural(n, 'zdjęcie', 'zdjęcia', 'zdjęć')} z grzybobrań` : 'Twoje znaleziska z lasu',
    camera: 'Aparat', gallery: 'Galeria',
    albumEmpty: 'Nie masz jeszcze zdjęć. Zrób zdjęcie na grzybobraniu – zostanie zapisane tutaj, możesz je opisać, przypisać do gatunku i wysłać do skanera.',
    note: 'Notatka: miejsce, pogoda, co zauważyłeś…', assign: 'Przypisz gatunek', change: 'Zmień', unassigned: 'Bez gatunku',
    scanIt: 'Skanuj', share: 'Udostępnij', del: 'Usuń',
    delQ: 'Usunąć to zdjęcie?', delMsg: 'Zdjęcie zniknie z albumu w aplikacji.', cancel: 'Anuluj',
    noPermission: 'Brak dostępu do aparatu lub zdjęć. Włącz go w ustawieniach telefonu.',
    scanSub: 'Rozpoznaj grzyba ze zdjęcia', fromAlbum: 'Album', saveToAlbum: 'Zapisz zdjęcia w albumie', saved: 'Zapisano w albumie',
    emptyAlbumPick: 'Album jest pusty.',
  },
  en: {
    brand: 'Mycelium',
    tabs: { atlas: 'Atlas', map: 'Map', scan: 'Scanner', recipes: 'Recipes', album: 'Photos' },
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthLetters: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    label: { e: 'Edible', c: 'Conditional', i: 'Inedible', t: 'Poisonous', d: 'Deadly' },
    desc: {
      e: 'Edible. Only pick specimens you identify with certainty.',
      c: 'Edible only after proper preparation (e.g. long cooking). Harmful raw or badly prepared.',
      i: 'Inedible: tough, bitter or of no culinary value.',
      t: 'Poisonous. Causes food poisoning or other symptoms.',
      d: 'DEADLY. Do not eat, and never mix into a basket with edible species.',
    },
    kicker: 'In the forest now',
    heroStats: (n: number, e: number, d: number) => `${n} species in season · ${e} edible · ${d} poisonous`,
    inSeason: 'In season',
    search: 'Search species…', all: 'All',
    count: (n: number) => `${n} species`,
    noResults: 'Nothing found',
    season: 'Season', look: 'Appearance and habitat', recipesWith: 'Recipes with this mushroom', more: 'More about this species',
    wiki: 'Wikipedia', commons: 'Photos – Wikimedia Commons', inat: 'Observations – iNaturalist', noPhoto: 'No photo',
    warn: 'This app is informational only. Never eat a mushroom based on an app alone – ask a certified mycologist.',
    recipesTitle: 'Recipes', recipesSub: 'Cooking with mushrooms from the atlas',
    min: (n: number) => `${n} min`, serves: (n: number) => `${n} servings`,
    mushrooms: 'Mushrooms', ingredients: 'Ingredients', steps: 'Method', tip: 'Tip',
    cookSafety: 'Only cook mushrooms you are certain of, and always cook them thoroughly.',
    albumTitle: 'My photos', albumSub: (n: number) => n ? `${n} photo${n === 1 ? '' : 's'} from your forays` : 'Your finds from the forest',
    camera: 'Camera', gallery: 'Gallery',
    albumEmpty: 'No photos yet. Take a photo on your next foray – it will be saved here, and you can add notes, link a species and send it to the scanner.',
    note: 'Note: place, weather, what you noticed…', assign: 'Link a species', change: 'Change', unassigned: 'No species',
    scanIt: 'Scan', share: 'Share', del: 'Delete',
    delQ: 'Delete this photo?', delMsg: 'The photo will be removed from the in-app album.', cancel: 'Cancel',
    noPermission: 'No access to the camera or photos. Enable it in your phone settings.',
    scanSub: 'Identify a mushroom from a photo', fromAlbum: 'Album', saveToAlbum: 'Save photos to album', saved: 'Saved to album',
    emptyAlbumPick: 'The album is empty.',
  },
};
type Strings = typeof L.pl;

// ---- Sezon: miesiące odczytane z opisu gatunku (np. „VI–X”) ----
const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };
function seasonMonths(latin: string): Set<number> {
  const text = DESC[latin]?.[0] ?? '';
  const out = new Set<number>();
  const add = (a: number, b: number) => {
    for (let m = a, guard = 0; guard < 12; m = (m % 12) + 1, guard++) { out.add(m); if (m === b) break; }
  };
  const re = /\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\s*[–-]\s*(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/g;
  let hit: RegExpExecArray | null;
  while ((hit = re.exec(text))) add(ROMAN[hit[1]], ROMAN[hit[2]]);
  const low = text.toLowerCase();
  if (low.includes('cały rok') || low.includes('wieloletni')) for (let m = 1; m <= 12; m++) out.add(m);
  if (!out.size) {
    if (low.includes('wczesną wiosną')) add(3, 4); else if (low.includes('wiosn')) add(3, 5);
    if (low.includes('jesieni')) add(9, 11);
    if (low.includes('zim')) add(12, 2);
  }
  return out;
}
const SEASON = new Map(MUSHROOMS.map((m) => [m.latin, seasonMonths(m.latin)]));
const STATUS_ORDER: Record<Status, number> = { e: 0, c: 1, i: 2, t: 3, d: 4 };

// ---- Zapis w telefonie: album zdjęć i ustawienia (expo-file-system) ----
type AlbumItem = { id: string; name: string; date: string; note: string; latin?: string; lat?: number; lng?: number };
type Settings = { lang: Lang; theme: ThemeMode };

function albumDir() {
  const dir = new Directory(Paths.document, 'album');
  if (!dir.exists) dir.create();
  return dir;
}
const albumUri = (item: AlbumItem) => new File(albumDir(), item.name).uri;
const albumIndexFile = () => new File(Paths.document, 'album.json');
const settingsFile = () => new File(Paths.document, 'settings.json');

function readJson<T>(file: File, fallback: T): T {
  try {
    return file.exists ? (JSON.parse(file.textSync()) as T) : fallback;
  } catch (e) {
    console.log('[zapis] odczyt', e);
    return fallback;
  }
}
function writeJson(file: File, value: unknown) {
  try {
    if (!file.exists) file.create();
    file.write(JSON.stringify(value));
  } catch (e) {
    console.log('[zapis] zapis', e);
  }
}
function copyIntoAlbum(sourceUri: string): AlbumItem {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const ext = (sourceUri.split('?')[0].split('.').pop() ?? '').toLowerCase();
  const name = `${id}.${['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'}`;
  new File(sourceUri).copy(new File(albumDir(), name));
  return { id, name, date: new Date().toISOString(), note: '' };
}
const mimeOf = (uri: string) => {
  const u = uri.toLowerCase();
  return u.endsWith('.png') ? 'image/png' : u.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
};

// ---- Wspólny stan aplikacji ----
type Tab = 'atlas' | 'map' | 'scan' | 'recipes' | 'album';
type Sheet = { kind: 'species'; m: Mushroom } | { kind: 'recipe'; r: Recipe } | { kind: 'photo'; id: string } | { kind: 'forest'; f: Forest } | { kind: 'forests' };
type App = {
  c: Theme; s: Styles; lang: Lang; t: Strings;
  photoOf: (latin: string) => string | null | undefined;
  open: (sheet: Sheet) => void; back: () => void;
  album: AlbumItem[];
  addToAlbum: (uris: string[], latin?: string, withLocation?: boolean) => void;
  showOnMap: (lat: number, lng: number, zoom?: number) => void;
  updateAlbum: (id: string, patch: Partial<AlbumItem>) => void;
  removeFromAlbum: (id: string) => void;
  sendToScanner: (item: AlbumItem) => void;
  scanSeed: { item: AlbumItem; n: number } | null;
};
const AppCtx = createContext<App | null>(null);
const useApp = () => useContext(AppCtx)!;

// ---- Zdjęcia: Wikipedia (EN, potem PL), a gdy obrazek się nie wczyta – iNaturalist ----
// Serwer obrazków Wikimedia często odrzuca aplikacje (HTTP 403), dlatego po kilku takich błędach
// aplikacja przestaje próbować Wikipedii i od razu bierze zdjęcia z iNaturalist.
type Photos = Record<string, string | null>;
const USER_AGENT = 'GrzybyAtlas/1.0 (React Native mushroom field guide)';
const HEADERS = { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let wikiImageErrors = 0;
const WIKI_ERROR_LIMIT = 3;

async function wikiThumbs(host: string, titles: string[]): Promise<Photos> {
  const out: Photos = {};
  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    const url = `https://${host}/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&pilimit=50&titles=${encodeURIComponent(chunk.join('|'))}`;
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) { console.log(`[zdjęcia] ${host}: HTTP ${res.status}`); continue; }
      const json = await res.json();
      const back: Record<string, string> = {};
      for (const n of json.query?.normalized ?? []) back[n.to] = back[n.from] ?? n.from;
      for (const r of json.query?.redirects ?? []) back[r.to] = back[r.from] ?? r.from;
      for (const p of Object.values<any>(json.query?.pages ?? {})) {
        const original = back[p.title] ?? p.title;
        if (p.thumbnail?.source) out[original] = p.thumbnail.source;
      }
    } catch (e: any) {
      console.log(`[zdjęcia] ${host}: ${e?.message ?? e}`);
    }
  }
  return out;
}

async function loadAllPhotos(latins: string[], onUpdate: (p: Photos) => void) {
  let found: Photos = await wikiThumbs('en.wikipedia.org', latins);
  onUpdate(found);
  const missing = latins.filter((l) => !found[l]);
  if (missing.length) {
    found = { ...found, ...(await wikiThumbs('pl.wikipedia.org', missing)) };
    onUpdate(found);
  }
}

// iNaturalist: zdjęcie domyślne gatunku. Zapytania idą po kolei co 0,7 s (limit API),
// tylko dla grzybów widocznych na ekranie, a wynik jest zapamiętywany.
const inatCache = new Map<string, Promise<string | null>>();
let inatQueue: Promise<unknown> = Promise.resolve();

function inatPhoto(latin: string): Promise<string | null> {
  const cached = inatCache.get(latin);
  if (cached) return cached;
  const job = inatQueue.then(async () => {
    try {
      const res = await fetch(`https://api.inaturalist.org/v1/taxa?rank=species&per_page=1&q=${encodeURIComponent(latin)}`, { headers: HEADERS });
      if (!res.ok) { console.log(`[zdjęcia] iNaturalist: HTTP ${res.status}`); return null; }
      const json = await res.json();
      const taxon = json.results?.[0];
      if (!taxon || taxon.name?.toLowerCase() !== latin.toLowerCase()) return null;
      return (taxon.default_photo?.medium_url as string | undefined) ?? null;
    } catch (e: any) {
      console.log(`[zdjęcia] iNaturalist: ${e?.message ?? e}`);
      return null;
    } finally {
      await sleep(700);
    }
  });
  inatQueue = job;
  inatCache.set(latin, job);
  return job;
}

// większa wersja tego samego zdjęcia do widoku szczegółów
const bigger = (url: string) =>
  url.includes('wikimedia.org') ? url.replace(/\/\d+px-/, '/960px-') : url.replace('/medium.', '/large.');

// ===================== PRZEPISY =====================
// species: nazwy łacińskie z atlasu – przepis pojawia się też w karcie każdego z tych grzybów
type Recipe = {
  id: string;
  title: [string, string];
  time: number;
  serves: number;
  species: string[];
  ingredients: [string[], string[]];
  steps: [string[], string[]];
  tip?: [string, string];
};

const RECIPES: Recipe[] = [
  {
    id: 'zupa',
    title: ['Zupa grzybowa z borowików', 'Wild bolete soup'],
    time: 60, serves: 4,
    species: ['Boletus edulis', 'Imleria badia', 'Boletus reticulatus', 'Boletus pinophilus', 'Leccinum scabrum'],
    ingredients: [
      ['500 g świeżych borowików lub podgrzybków (albo 40 g suszonych)', '1 cebula', '1 marchewka', '1 korzeń pietruszki', '2 l bulionu warzywnego', '2 łyżki masła', '200 ml śmietany 18%', '1 łyżka mąki', 'liść laurowy, 3 ziela angielskie', 'sól, pieprz, natka pietruszki'],
      ['500 g fresh boletes (or 40 g dried)', '1 onion', '1 carrot', '1 parsley root', '2 l vegetable stock', '2 tbsp butter', '200 ml sour cream (18%)', '1 tbsp flour', 'bay leaf, 3 allspice berries', 'salt, pepper, parsley'],
    ],
    steps: [
      ['Oczyść grzyby i pokrój w plasterki. Suszone namocz na 2 godziny, wodę z moczenia zachowaj.', 'Warzywa pokrój w kostkę i gotuj w bulionie z liściem laurowym i zielem angielskim przez 20 minut.', 'Na maśle zeszklij posiekaną cebulę, dodaj grzyby i smaż około 8 minut.', 'Przełóż grzyby do zupy (z wodą z moczenia) i gotuj razem 25 minut.', 'Śmietanę wymieszaj z mąką i kilkoma łyżkami gorącej zupy, wlej do garnka i zagotuj.', 'Dopraw solą i pieprzem, posyp natką. Podawaj z ziemniakami albo łazankami.'],
      ['Clean the mushrooms and slice them. Soak dried ones for 2 hours and keep the soaking water.', 'Dice the vegetables and simmer them in the stock with the bay leaf and allspice for 20 minutes.', 'Soften the chopped onion in butter, add the mushrooms and fry for about 8 minutes.', 'Add the mushrooms (and soaking water) to the soup and simmer together for 25 minutes.', 'Mix the cream with the flour and a few spoons of hot soup, stir into the pot and bring to the boil.', 'Season with salt and pepper and sprinkle with parsley. Serve with potatoes or noodles.'],
    ],
    tip: ['Grzyby leśne gotuj łącznie co najmniej 20–30 minut.', 'Cook wild mushrooms for at least 20–30 minutes in total.'],
  },
  {
    id: 'kurki',
    title: ['Kurki w śmietanie', 'Chanterelles in cream'],
    time: 25, serves: 2,
    species: ['Cantharellus cibarius', 'Cantharellus amethysteus', 'Craterellus tubaeformis'],
    ingredients: [
      ['400 g kurek', '1 cebula', '1 ząbek czosnku', '2 łyżki masła', '150 ml śmietany 30%', 'koperek', 'sól, pieprz'],
      ['400 g chanterelles', '1 onion', '1 garlic clove', '2 tbsp butter', '150 ml double cream', 'dill', 'salt, pepper'],
    ],
    steps: [
      ['Oczyść kurki pędzelkiem, większe przekrój. Nie mocz ich długo w wodzie.', 'Na maśle zeszklij cebulę, dodaj czosnek.', 'Dodaj kurki i smaż na dużym ogniu, aż odparuje woda – około 10 minut.', 'Wlej śmietanę i duś 5 minut, aż sos zgęstnieje.', 'Dopraw solą i pieprzem, posyp koperkiem. Podawaj z młodymi ziemniakami lub makaronem.'],
      ['Brush the chanterelles clean and halve the larger ones. Don’t soak them in water.', 'Soften the onion in butter, then add the garlic.', 'Add the chanterelles and fry over high heat until the liquid evaporates – about 10 minutes.', 'Pour in the cream and simmer for 5 minutes until the sauce thickens.', 'Season and sprinkle with dill. Serve with new potatoes or pasta.'],
    ],
  },
  {
    id: 'kania',
    title: ['Kania panierowana', 'Breaded parasol mushroom'],
    time: 20, serves: 2,
    species: ['Macrolepiota procera'],
    ingredients: [
      ['4 młode kapelusze kani (bez trzonów)', '2 jajka', '4 łyżki mąki', '6 łyżek bułki tartej', 'sól, pieprz', 'olej lub masło klarowane do smażenia'],
      ['4 young parasol caps (no stems)', '2 eggs', '4 tbsp flour', '6 tbsp breadcrumbs', 'salt, pepper', 'oil or clarified butter for frying'],
    ],
    steps: [
      ['Odetnij twarde trzony, kapelusze oczyść z łusek i piasku.', 'Posól i popieprz kapelusze z obu stron.', 'Obtocz je w mące, potem w roztrzepanych jajkach i w bułce tartej.', 'Smaż na rozgrzanym tłuszczu po 3–4 minuty z każdej strony, aż będą złote.', 'Podawaj od razu z ziemniakami i surówką.'],
      ['Cut off the tough stems and clean the caps of scales and sand.', 'Season the caps on both sides.', 'Coat them in flour, then beaten egg, then breadcrumbs.', 'Fry in hot fat for 3–4 minutes per side until golden.', 'Serve straight away with potatoes and salad.'],
    ],
    tip: ['Zbieraj tylko duże okazy z ruchomym pierścieniem i wężykowatym wzorem na trzonie. Małe „kanie” bywają śmiertelnie trującymi czubeczkami.', 'Pick only large specimens with a movable ring and a snakeskin pattern on the stem. Small “parasols” may be deadly dapperlings.'],
  },
  {
    id: 'rydze',
    title: ['Rydze smażone na maśle', 'Saffron milk caps fried in butter'],
    time: 15, serves: 2,
    species: ['Lactarius deliciosus', 'Lactarius deterrimus', 'Lactarius salmonicolor'],
    ingredients: [
      ['300 g młodych rydzów', '2 łyżki masła', 'sól, pieprz', 'świeży chleb'],
      ['300 g young saffron milk caps', '2 tbsp butter', 'salt, pepper', 'fresh bread'],
    ],
    steps: [
      ['Oczyść rydze, nie myj ich długo.', 'Rozgrzej masło na patelni.', 'Połóż rydze blaszkami do góry i smaż 4–5 minut, potem przewróć i smaż kolejne 4–5 minut.', 'Posól pod koniec smażenia, popieprz. Podawaj od razu z chlebem.'],
      ['Clean the milk caps without washing them for long.', 'Heat the butter in a pan.', 'Lay the caps gills up and fry for 4–5 minutes, then turn and fry another 4–5 minutes.', 'Salt at the end and add pepper. Serve at once with bread.'],
    ],
    tip: ['Zielone plamy na rydzach po zebraniu są naturalne i nieszkodliwe.', 'Green stains on milk caps after picking are natural and harmless.'],
  },
  {
    id: 'marynata',
    title: ['Grzyby marynowane', 'Pickled mushrooms'],
    time: 50, serves: 6,
    species: ['Suillus luteus', 'Suillus grevillei', 'Imleria badia', 'Armillaria mellea'],
    ingredients: [
      ['1 kg małych grzybów', '500 ml wody', '200 ml octu 10%', '2 łyżki cukru', '1 łyżka soli', '1 cebula', '6 ziaren ziela angielskiego, 10 ziaren pieprzu', '3 liście laurowe', '1 łyżeczka gorczycy'],
      ['1 kg small mushrooms', '500 ml water', '200 ml 10% vinegar', '2 tbsp sugar', '1 tbsp salt', '1 onion', '6 allspice berries, 10 peppercorns', '3 bay leaves', '1 tsp mustard seeds'],
    ],
    steps: [
      ['Maślakom zdejmij śliską skórkę z kapeluszy, pozostałe grzyby oczyść.', 'Gotuj grzyby w osolonej wodzie 15 minut (opieńki co najmniej 20 minut), wodę wylej.', 'Zagotuj wodę z octem, cukrem, solą i przyprawami – to zalewa.', 'Przełóż grzyby do wyparzonych słoików, przekładając plasterkami cebuli.', 'Zalej gorącą zalewą, zakręć i pasteryzuj 15 minut.', 'Odstaw na co najmniej 2 dni przed jedzeniem.'],
      ['Peel the slimy skin off slippery jack caps and clean the other mushrooms.', 'Boil the mushrooms in salted water for 15 minutes (honey fungus at least 20 minutes) and discard the water.', 'Boil the water with the vinegar, sugar, salt and spices to make the brine.', 'Pack the mushrooms into sterilised jars, layered with onion slices.', 'Pour over the hot brine, close the jars and pasteurise for 15 minutes.', 'Leave for at least 2 days before eating.'],
    ],
    tip: ['Opieńki są jadalne tylko po co najmniej 20 minutach gotowania z odlaniem wody.', 'Honey fungus is edible only after at least 20 minutes of boiling, with the water discarded.'],
  },
  {
    id: 'jajecznica',
    title: ['Jajecznica z leśnymi grzybami', 'Scrambled eggs with wild mushrooms'],
    time: 15, serves: 2,
    species: ['Imleria badia', 'Boletus edulis', 'Cantharellus cibarius', 'Coprinus comatus'],
    ingredients: [
      ['200 g grzybów', '5 jajek', '1 łyżka masła', '½ cebuli', 'szczypiorek', 'sól, pieprz'],
      ['200 g mushrooms', '5 eggs', '1 tbsp butter', '½ onion', 'chives', 'salt, pepper'],
    ],
    steps: [
      ['Grzyby pokrój, cebulę drobno posiekaj.', 'Smaż grzyby z cebulą na maśle około 10 minut, aż odparuje woda.', 'Wbij jajka, posól i mieszaj na małym ogniu, aż się zetną.', 'Posyp szczypiorkiem i podawaj z chlebem.'],
      ['Slice the mushrooms and finely chop the onion.', 'Fry the mushrooms and onion in butter for about 10 minutes until the liquid evaporates.', 'Crack in the eggs, season and stir over low heat until set.', 'Sprinkle with chives and serve with bread.'],
    ],
    tip: ['Czernidlak kołpakowaty nadaje się tylko w dniu zbioru i tylko wtedy, gdy blaszki są całkiem białe.', 'Shaggy mane is only good on the day of picking, and only while the gills are completely white.'],
  },
  {
    id: 'pierogi',
    title: ['Pierogi z kapustą i grzybami', 'Pierogi with sauerkraut and mushrooms'],
    time: 90, serves: 4,
    species: ['Boletus edulis', 'Imleria badia'],
    ingredients: [
      ['Ciasto: 500 g mąki, 250 ml ciepłej wody, 2 łyżki oleju, szczypta soli', 'Farsz: 500 g kiszonej kapusty', '30 g suszonych borowików lub podgrzybków', '1 cebula', '2 łyżki masła', 'sól, pieprz'],
      ['Dough: 500 g flour, 250 ml warm water, 2 tbsp oil, a pinch of salt', 'Filling: 500 g sauerkraut', '30 g dried boletes', '1 onion', '2 tbsp butter', 'salt, pepper'],
    ],
    steps: [
      ['Grzyby namocz na noc, ugotuj w tej samej wodzie 20 minut, odcedź i drobno posiekaj.', 'Kapustę odciśnij, posiekaj i gotuj 30 minut, potem odcedź.', 'Cebulę zeszklij na maśle, dodaj kapustę i grzyby, duś 10 minut, dopraw i ostudź.', 'Z mąki, wody, oleju i soli zagnieć gładkie ciasto, rozwałkuj cienko i wykrawaj krążki.', 'Nakładaj farsz na krążki i dokładnie sklejaj brzegi.', 'Gotuj partiami w osolonej wodzie 2–3 minuty od wypłynięcia.'],
      ['Soak the mushrooms overnight, simmer them in the same water for 20 minutes, drain and chop finely.', 'Squeeze the sauerkraut, chop it and simmer for 30 minutes, then drain.', 'Soften the onion in butter, add the sauerkraut and mushrooms, cook for 10 minutes, season and cool.', 'Knead a smooth dough from the flour, water, oil and salt, roll it thin and cut out circles.', 'Put filling on each circle and seal the edges well.', 'Boil in batches in salted water for 2–3 minutes after they float.'],
    ],
    tip: ['Wywar z gotowania suszonych grzybów świetnie nadaje się do barszczu.', 'The water from cooking the dried mushrooms makes a great base for beetroot soup.'],
  },
];

const RECIPE_BY_ID = new Map(RECIPES.map((r) => [r.id, r]));
const recipesFor = (latin: string) => RECIPES.filter((r) => r.species.includes(latin));

// ===================== SKANER (rozpoznawanie ze zdjęcia przez Claude API) =====================
// Klucz API: utwórz w https://platform.claude.com (Console) i wpisz do pliku .env w głównym folderze projektu:
//   EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
// UWAGA: klucz zapisany w aplikacji da się z niej wyciągnąć. Do testów na własnym telefonie jest OK,
// ale przed publikacją w sklepie przenieś zapytanie do własnego serwera (proxy) i trzymaj klucz tam.
const API_KEY: string = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const MODEL = 'claude-sonnet-5-5'; // dokładniej, ale drożej: 'claude-opus-5-5'
const MAX_PHOTOS = 3;

type ScanPhoto = { uri: string; base64: string; mime: string; fromAlbum?: boolean };
type Candidate = { latin: string; confidence: number; key_features: string };
type Lookalike = { latin: string; how_to_tell: string };
type ScanResult = {
  is_mushroom: boolean;
  photo_feedback: string;
  candidates: Candidate[];
  outside_atlas?: string;
  dangerous_lookalikes: Lookalike[];
  verification_steps: string[];
};

const SCAN_TXT = {
  pl: {
    open: 'SKANUJ', title: 'Skaner', camera: 'Aparat', gallery: 'Galeria', analyze: 'ANALIZUJ', again: 'NOWY SKAN', close: 'ZAMKNIJ', back: 'WRÓĆ',
    hint: 'Do 3 zdjęć: kapelusz z góry, spód (blaszki / rurki / kolce) i cały trzon razem z podstawą wykopaną z ziemi. Im więcej cech widać, tym trafniejszy wynik.',
    analyzing: 'Porównuję z atlasem…',
    warn: 'To tylko szacunek AI na podstawie zdjęć. Procenty to ocena modelu, nie pewność. Nigdy nie jedz grzyba na podstawie skanu – pokaż go grzyboznawcy (sanepid).',
    deadly: 'Wśród możliwych gatunków jest grzyb ŚMIERTELNIE TRUJĄCY. Nie zbieraj go razem z innymi i myj ręce po dotknięciu.',
    matches: 'Najbardziej prawdopodobne', unknown: 'Inny gatunek / nie wiadomo', outside: 'Możliwy gatunek spoza atlasu',
    lookalikes: 'Groźne sobowtóry – jak odróżnić', photos: 'Co widać na zdjęciach', steps: 'Jak się upewnić',
    notMushroom: 'Na zdjęciu nie widać grzyba. Spróbuj z bliska, w dobrym świetle.',
    noKey: 'Brak klucza API. Utwórz klucz w Claude Console (platform.claude.com), wpisz go do pliku .env jako EXPO_PUBLIC_ANTHROPIC_API_KEY=… i uruchom ponownie: npx expo start -c',
    noPermission: 'Brak dostępu do aparatu lub zdjęć. Włącz go w ustawieniach telefonu.',
    error: 'Nie udało się przeanalizować zdjęcia', tooBig: 'Zdjęcie jest za duże. Zrób je jeszcze raz albo wybierz mniejsze.',
  },
  en: {
    open: 'SCAN', title: 'Scanner', camera: 'Camera', gallery: 'Gallery', analyze: 'ANALYSE', again: 'NEW SCAN', close: 'CLOSE', back: 'BACK',
    hint: 'Up to 3 photos: cap from above, underside (gills / pores / spines) and the whole stem including the base dug out of the soil. The more features visible, the better the result.',
    analyzing: 'Comparing with the atlas…',
    warn: 'This is only an AI estimate from photos. Percentages are the model’s judgement, not certainty. Never eat a mushroom based on a scan – show it to a mushroom expert.',
    deadly: 'One of the possible species is DEADLY POISONOUS. Keep it apart from other mushrooms and wash your hands after touching it.',
    matches: 'Most likely', unknown: 'Other species / unknown', outside: 'Possible species outside the atlas',
    lookalikes: 'Dangerous lookalikes – how to tell', photos: 'What the photos show', steps: 'How to make sure',
    notMushroom: 'No mushroom visible in the photo. Try closer, in good light.',
    noKey: 'No API key. Create one in the Claude Console (platform.claude.com), put it in .env as EXPO_PUBLIC_ANTHROPIC_API_KEY=… and restart with: npx expo start -c',
    noPermission: 'No access to the camera or photos. Enable it in your phone settings.',
    error: 'Could not analyse the photo', tooBig: 'The photo is too large. Take it again or choose a smaller one.',
  },
};

const BY_LATIN = new Map(MUSHROOMS.map((m) => [m.latin.toLowerCase(), m]));
const findSpecies = (latin: string) => BY_LATIN.get(latin.trim().toLowerCase());

const REPORT_TOOL = {
  name: 'report_identification',
  description: 'Report the identification of the mushroom in the photos against the atlas.',
  input_schema: {
    type: 'object',
    properties: {
      is_mushroom: { type: 'boolean', description: 'Whether the photos show a mushroom / fungus at all.' },
      photo_feedback: { type: 'string', description: 'Which identifying features are visible and which are missing; which extra photo to take.' },
      candidates: {
        type: 'array', maxItems: 5,
        description: 'Best matches from the atlas, most likely first. Confidences are integers 0-100 and must sum to at most 100.',
        items: {
          type: 'object',
          properties: {
            latin: { type: 'string', description: 'Latin name copied exactly from the atlas list.' },
            confidence: { type: 'integer', minimum: 0, maximum: 100 },
            key_features: { type: 'string', description: 'Visible features that support or argue against this species.' },
          },
          required: ['latin', 'confidence', 'key_features'],
        },
      },
      outside_atlas: { type: 'string', description: 'If the mushroom may be a species not in the atlas, name it (Latin + common name). Otherwise empty string.' },
      dangerous_lookalikes: {
        type: 'array', maxItems: 4,
        description: 'Poisonous or deadly atlas species that could be confused with the candidates.',
        items: {
          type: 'object',
          properties: {
            latin: { type: 'string', description: 'Latin name copied exactly from the atlas list.' },
            how_to_tell: { type: 'string' },
          },
          required: ['latin', 'how_to_tell'],
        },
      },
      verification_steps: {
        type: 'array', maxItems: 7, items: { type: 'string' },
        description: 'Concrete, safe checks the user can do with the physical mushroom to confirm or rule out the candidates.',
      },
    },
    required: ['is_mushroom', 'photo_feedback', 'candidates', 'outside_atlas', 'dangerous_lookalikes', 'verification_steps'],
  },
};

function systemPrompt(lang: Lang) {
  const atlas = MUSHROOMS.map((m) => `${m.latin} (${m.pl}; ${m.en})`).join('\n');
  return `You are a careful mycology assistant inside a Polish mushroom field-guide app. The user photographs a mushroom; you compare it with the atlas below and call the report_identification tool.

Rules:
- Always answer by calling the report_identification tool exactly once. Do not answer with plain text.
- Pick candidates ONLY from the atlas list and copy the Latin name exactly. If it looks like a species outside the atlas, say so in outside_atlas.
- Be honest and conservative with confidence. A photo rarely proves a species. Lower the confidence when key features are not visible (underside, cut flesh and its colour change, ring, base of the stem / volva, smell, spore print, substrate). Confidences sum to at most 100; the rest means "other / unknown".
- Always list dangerous lookalikes, especially deadly ones (Amanita phalloides, A. virosa, Galerina marginata, Cortinarius orellanus/rubellus, Lepiota, Gyromitra) whenever they are plausible.
- verification_steps: concrete checks with the physical specimen, e.g. dig out the whole base and look for a sac-like volva, check gill/spore colour, take a spore print on white and black paper, cut the flesh and watch for colour change for a few minutes, smell, note the substrate and nearby trees. Never suggest tasting. The last step is always to show the mushroom to a certified mushroom expert (in Poland: sanepid) before eating.
- Never state or imply that a mushroom is safe to eat.
- Write all text fields in ${lang === 'pl' ? 'Polish' : 'English'}.

Atlas:
${atlas}`;
}

async function identify(photos: ScanPhoto[], lang: Lang): Promise<ScanResult> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt(lang),
      tools: [REPORT_TOOL],
      tool_choice: { type: 'auto' },
      messages: [{
        role: 'user',
        content: [
          ...photos.map((p) => ({ type: 'image', source: { type: 'base64', media_type: p.mime, data: p.base64 } })),
          { type: 'text', text: lang === 'pl' ? 'Jaki to grzyb?' : 'Which mushroom is this?' },
        ],
      }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
  const blocks: any[] = json.content ?? [];
  const tool = blocks.find((b) => b.type === 'tool_use');
  let r: ScanResult | null = tool ? (tool.input as ScanResult) : null;
  if (!r) {
    // zapas: gdyby model odpowiedział tekstem z JSON-em zamiast narzędziem
    const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('');
    const found = text.match(/\{[\s\S]*\}/);
    if (found) { try { r = JSON.parse(found[0]); } catch {} }
  }
  if (!r) throw new Error('No result');
  return normalizeResult(r);
}

// Model czasem zwraca listy jako tekst (np. "[...]") albo liczby jako napisy – sprowadzamy wszystko do właściwych typów
const asText = (v: any): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
function asArray(v: any): any[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return v.split(/\n+/).map((x) => x.replace(/^\s*(\d+[.)]|[-•])\s*/, '').trim()).filter(Boolean);
  }
  return [];
}
function normalizeResult(raw: any): ScanResult {
  const candidates = asArray(raw.candidates)
    .filter((c) => c && typeof c.latin === 'string' && findSpecies(c.latin))
    .map((c) => ({ latin: c.latin, confidence: Math.max(0, Math.min(100, Math.round(Number(c.confidence) || 0))), key_features: asText(c.key_features) }))
    .sort((a, b) => b.confidence - a.confidence);
  return {
    is_mushroom: raw.is_mushroom !== false && raw.is_mushroom !== 'false',
    photo_feedback: asText(raw.photo_feedback),
    outside_atlas: asText(raw.outside_atlas),
    candidates,
    dangerous_lookalikes: asArray(raw.dangerous_lookalikes)
      .filter((l) => l && typeof l.latin === 'string' && findSpecies(l.latin))
      .map((l) => ({ latin: l.latin, how_to_tell: asText(l.how_to_tell) })),
    verification_steps: asArray(raw.verification_steps).map(asText).filter(Boolean),
  };
}

const SUPPORTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const toPhoto = (a: ImagePicker.ImagePickerAsset): ScanPhoto | null =>
  a.base64 ? { uri: a.uri, base64: a.base64, mime: a.mimeType && SUPPORTED.includes(a.mimeType) ? a.mimeType : 'image/jpeg' } : null;

// ===================== WSPÓLNE ELEMENTY =====================

// Przycisk, który lekko „ugina się” pod palcem
function Tap({ onPress, onLongPress, style, outer, children, scale = 0.97, disabled }: {
  onPress?: () => void; onLongPress?: () => void; style?: any; outer?: any; children?: any; scale?: number; disabled?: boolean;
}) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (x: number) => Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} disabled={disabled} onPressIn={() => to(scale)} onPressOut={() => to(1)} style={outer}>
      <Animated.View style={[style, { transform: [{ scale: v }] }, disabled && { opacity: 0.5 }]}>{children}</Animated.View>
    </Pressable>
  );
}

// Mały grzybek z kształtów – logo i ozdobniki
function Glyph({ size = 24, cap, stem = '#F1E6CF', dots = true }: { size?: number; cap: string; stem?: string; dots?: boolean }) {
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

function Photo({ latin, style, big, empty = '' }: { latin: string; style: any; big?: boolean; empty?: string }) {
  const { c, s, photoOf } = useApp();
  const url = photoOf(latin);
  const fade = useRef(new Animated.Value(0)).current;
  const [wikiFailed, setWikiFailed] = useState(false);
  const [alt, setAlt] = useState<string | null | undefined>(undefined); // zdjęcie z iNaturalist
  const useWiki = !!url && !wikiFailed && wikiImageErrors < WIKI_ERROR_LIMIT;
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
        <Animated.Image
          key={src}
          source={{ uri: src, headers: { 'User-Agent': USER_AGENT } }}
          style={[StyleSheet.absoluteFill, { opacity: fade }]}
          resizeMode="cover"
          onError={() => {
            if (useWiki) { wikiImageErrors += 1; setWikiFailed(true); } else setAlt(null);
          }}
          onLoad={() => { fade.setValue(0); Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start(); }}
        />
      )}
    </View>
  );
}

function StatusPill({ st, small }: { st: Status; small?: boolean }) {
  const { c, s, t } = useApp();
  return (
    <View style={[s.pill, { backgroundColor: alpha(c.status[st], c.dark ? '2E' : '22') }, small && { paddingHorizontal: 8, paddingVertical: 3 }]}>
      <View style={[s.dot, { backgroundColor: c.status[st] }]} />
      <Text style={[s.pillText, { color: c.status[st] }, small && { fontSize: 11 }]}>{t.label[st]}</Text>
    </View>
  );
}

// Pasek z logo, przełącznikiem języka i trybem nocnym
function TopBar({ setLang, toggleTheme }: { setLang: (l: Lang) => void; toggleTheme: () => void }) {
  const { c, s, t, lang } = useApp();
  const insets = useSafeAreaInsets();
  const spin = useRef(new Animated.Value(c.dark ? 1 : 0)).current;
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

function ScreenTitle({ title, sub }: { title: string; sub: string }) {
  const { s } = useApp();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
      <Text style={s.h1}>{title}</Text>
      <Text style={s.subtle}>{sub}</Text>
    </View>
  );
}

// Wejście elementu: delikatne pojawienie się od dołu
function FadeIn({ delay = 0, children, style }: { delay?: number; children: any; style?: any }) {
  const v = useRef(new Animated.Value(0)).current;
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
const TABS: Tab[] = ['atlas', 'map', 'scan', 'recipes', 'album'];
const TAB_ICON: Record<Tab, string> = { atlas: 'leaf', map: 'map', scan: 'scan', recipes: 'restaurant', album: 'images' };

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { c, s, t } = useApp();
  const insets = useSafeAreaInsets();
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
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
function SheetHero({ latin, height = 340, children }: { latin: string; height?: number; children?: any }) {
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

// ===================== ATLAS =====================

function Hero({ month, list, scrollY }: { month: number; list: Mushroom[]; scrollY: Animated.Value }) {
  const { c, s, t } = useApp();
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [float]);
  const edible = list.filter((m) => m.s === 'e' || m.s === 'c').length;
  const toxic = list.filter((m) => m.s === 't' || m.s === 'd').length;
  return (
    <Animated.View
      style={[s.hero, {
        transform: [{ translateY: scrollY.interpolate({ inputRange: [-120, 0, 300], outputRange: [-20, 0, 70], extrapolate: 'clamp' }) }],
        opacity: scrollY.interpolate({ inputRange: [0, 280], outputRange: [1, 0.35], extrapolate: 'clamp' }),
      }]}
    >
      <Animated.View style={[s.orb, { backgroundColor: c.dark ? '#E9DDB8' : c.amber, transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] }]} />
      <View style={[s.hill, { left: -70, width: 280, height: 280, bottom: -205, backgroundColor: c.hill1 }]} />
      <View style={[s.hill, { right: -90, width: 320, height: 320, bottom: -250, backgroundColor: c.hill2 }]} />
      <View style={{ position: 'absolute', left: 46, bottom: 64 }}><Glyph size={20} cap={c.status.d} /></View>
      <View style={{ position: 'absolute', left: 74, bottom: 70 }}><Glyph size={13} cap="#B07A43" dots={false} /></View>
      <View style={{ position: 'absolute', right: 70, bottom: 58 }}><Glyph size={16} cap="#8A5A2E" dots={false} /></View>

      <Text style={s.heroKicker}>{t.kicker.toUpperCase()}</Text>
      <Text style={s.heroMonth}>{t.months[month - 1]}</Text>
      <Text style={s.heroStats}>{t.heroStats(list.length, edible, toxic)}</Text>
    </Animated.View>
  );
}

function SeasonCard({ m }: { m: Mushroom }) {
  const { c, s, lang, open } = useApp();
  return (
    <Tap onPress={() => open({ kind: 'species', m })} style={s.seasonCard}>
      <Photo latin={m.latin} style={s.seasonPhoto} />
      <View style={[s.seasonDot, { backgroundColor: c.status[m.s] }]} />
      <Text style={s.seasonName} numberOfLines={2}>{lang === 'pl' ? m.pl : m.en}</Text>
    </Tap>
  );
}

function SpeciesRow({ m, index }: { m: Mushroom; index: number }) {
  const { c, s, lang, open } = useApp();
  return (
    <FadeIn delay={(index % 8) * 35}>
      <Tap onPress={() => open({ kind: 'species', m })} style={s.row} scale={0.98}>
        <Photo latin={m.latin} style={s.rowPhoto} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={s.rowName} numberOfLines={2}>{lang === 'pl' ? m.pl : m.en}</Text>
          <Text style={s.latin} numberOfLines={1}>{m.latin}</Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}><StatusPill st={m.s} small /></View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={c.muted} />
      </Tap>
    </FadeIn>
  );
}

function AtlasScreen({ header }: { header: any }) {
  const { c, s, t, lang } = useApp();
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [query, setQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const month = new Date().getMonth() + 1;

  const inSeason = useMemo(
    () => MUSHROOMS.filter((m) => SEASON.get(m.latin)?.has(month)).sort((a, b) => STATUS_ORDER[a.s] - STATUS_ORDER[b.s]),
    [month],
  );
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MUSHROOMS
      .filter((m) => (filter === 'all' || m.s === filter) && (!q || `${m.latin} ${m.pl} ${m.en}`.toLowerCase().includes(q)))
      .sort((a, b) => (lang === 'pl' ? a.pl.localeCompare(b.pl, 'pl') : a.en.localeCompare(b.en)));
  }, [query, filter, lang]);

  const listHeader = (
    <View>
      {header}
      <Hero month={month} list={inSeason} scrollY={scrollY} />

      <Text style={s.sectionLabel}>{t.inSeason}</Text>
      <FlatList
        horizontal
        data={inSeason.slice(0, 30)}
        keyExtractor={(m) => m.latin}
        renderItem={({ item }) => <SeasonCard m={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      />

      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color={c.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder={t.search} placeholderTextColor={c.muted} style={s.searchInput} />
        {!!query && (
          <Pressable onPress={() => setQuery('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={c.muted} />
          </Pressable>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
        {(['all', 'e', 'c', 'i', 't', 'd'] as const).map((k) => {
          const on = filter === k;
          return (
            <Tap key={k} onPress={() => setFilter(k)} style={[s.chip, on && { backgroundColor: c.ink, borderColor: c.ink }]}>
              {k !== 'all' && <View style={[s.dot, { backgroundColor: c.status[k] }]} />}
              <Text style={[s.chipText, on && { color: c.bg }]}>{k === 'all' ? t.all : t.label[k]}</Text>
            </Tap>
          );
        })}
      </ScrollView>
      <Text style={[s.mono, { paddingHorizontal: 20, marginBottom: 6 }]}>{t.count(data.length).toUpperCase()}</Text>
    </View>
  );

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(m: Mushroom) => String(m.id)}
      renderItem={({ item, index }: { item: Mushroom; index: number }) => <SpeciesRow m={item} index={index} />}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={<Text style={[s.subtle, { textAlign: 'center', marginTop: 30 }]}>{t.noResults}</Text>}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={10}
      windowSize={7}
      contentContainerStyle={{ paddingBottom: 120 }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    />
  );
}

// ===================== KARTA GATUNKU =====================

function SeasonStrip({ latin }: { latin: string }) {
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

function RecipeMini({ r }: { r: Recipe }) {
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

function SpeciesSheet({ m }: { m: Mushroom }) {
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

// ===================== PRZEPISY =====================

function RecipeCard({ r, index }: { r: Recipe; index: number }) {
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

function RecipesScreen({ header }: { header: any }) {
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

function RecipeSheet({ r }: { r: Recipe }) {
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

// ===================== ALBUM =====================

async function pickImages(source: 'camera' | 'gallery', options: ImagePicker.ImagePickerOptions, limit = 10) {
  const perm = source === 'camera'
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = source === 'camera'
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync({ ...options, allowsMultipleSelection: limit > 1, selectionLimit: limit });
  return res.canceled ? [] : res.assets;
}

function AlbumScreen({ header }: { header: any }) {
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

function PhotoSheet({ id }: { id: string }) {
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

// ===================== POLECANE LASY =====================
// Zebrane z artykułów i relacji grzybiarzy (źródła w FOREST_SOURCES). Współrzędne to przybliżony środek kompleksu
// leśnego – nie konkretne „miejscówki”. Pora zbioru to typowy sezon dla danego typu lasu; w danym roku decyduje pogoda.
type Forest = {
  id: string; v: string; name: string; lat: number; lng: number;
  about: [string, string]; when: [string, string]; months: number[]; species: string[]; src: number[];
};

const VOIVODESHIPS: Record<string, string> = {
  ds: 'Dolnośląskie', kp: 'Kujawsko-pomorskie', lb: 'Lubelskie', lu: 'Lubuskie', ld: 'Łódzkie', mp: 'Małopolskie',
  mz: 'Mazowieckie', op: 'Opolskie', pk: 'Podkarpackie', pd: 'Podlaskie', pm: 'Pomorskie', sl: 'Śląskie',
  sk: 'Świętokrzyskie', wn: 'Warmińsko-mazurskie', wp: 'Wielkopolskie', zp: 'Zachodniopomorskie',
};

const FOREST_SOURCES: [string, string][] = [
  ['Triverna – Gdzie na grzyby w Polsce', 'https://triverna.pl/blog/gdzie-na-grzyby-w-polsce'],
  ['RMF24 – Gdzie na grzyby w Wielkopolsce', 'https://www.rmf24.pl/regiony/poznan/news-gdzie-na-grzyby-w-wielkopolsce-poznaj-najlepsze-miejscowki,nIdn,1019128'],
  ['RMF24 – Najlepsze miejsca na grzyby w Małopolsce', 'https://www.rmf24.pl/regiony/krakow/news-najlepsze-miejsca-na-grzyby-w-malopolsce-gdzie-jest-wysyp-i-,nIdn,1017031'],
  ['wroclaw.pl – Gdzie na grzyby na Dolnym Śląsku', 'https://www.wroclaw.pl/dla-mieszkanca/gdzie-na-grzyby-na-dolnym-slasku-2025-gdzie-na-grzyby-wokol-wroclawia-najlepsze-miejsca'],
  ['Nadleśnictwo Wymiarki – ścieżka grzybowa', 'https://wymiarki.zielonagora.lasy.gov.pl/en/o-nadlesnictwie/-/asset_publisher/kCS6/content/sciezka-grzybowa'],
  ['Interia – Gdzie szukać grzybów', 'https://wydarzenia.interia.pl/kraj/news-gdzie-szukac-grzybow-wskazujemy-gdzie-znajdziesz-ich-najwiec,nId,7753362'],
];

// typowe pory zbioru dla typów lasu
const W_BOR: [string, string] = ['Najlepiej od sierpnia do października, 3–7 dni po obfitym deszczu przy ciepłych nocach. Kurki już od lipca, podgrzybki i maślaki do listopada.', 'Best from August to October, 3–7 days after heavy rain with warm nights. Chanterelles from July, bay boletes and slippery jacks into November.'];
const W_MIX: [string, string] = ['Pierwsze prawdziwki w czerwcu–lipcu, główny wysyp we wrześniu i październiku. Po suchym lecie szukaj w wilgotnych obniżeniach.', 'First porcini in June–July, main flush in September and October. After a dry summer search damp hollows.'];
const W_MTN: [string, string] = ['W górach sezon zaczyna się wcześniej: borowiki od lipca, szczyt w sierpniu i wrześniu. Wyżej położone lasy kończą sezon już w październiku.', 'In the mountains the season starts earlier: boletes from July, peak in August and September. Higher forests finish by October.'];
const M_BOR = [7, 8, 9, 10, 11];
const M_MIX = [6, 7, 8, 9, 10];
const M_MTN = [7, 8, 9, 10];

const FORESTS: Forest[] = [
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
];
const FOREST_BY_ID = new Map(FORESTS.map((f) => [f.id, f]));

// ===================== MAPA =====================
// Darmowe źródła: mapa OpenStreetMap i OpenTopoMap (Leaflet w WebView), obserwacje grzybów z iNaturalist,
// warstwa okresowych zakazów wstępu do lasu z Banku Danych o Lasach (Lasy Państwowe).
const BANS_WMS = 'https://mapserver.bdl.lasy.gov.pl/ArcGIS/services/WMS_zakazy_wstepu_do_lasu/MapServer/WMSServer';

const MAP_HTML = [
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
  'var groups={forests:L.layerGroup().addTo(map),obs:L.layerGroup().addTo(map),mine:L.layerGroup().addTo(map)};',
  'var bans=null,me=null,meAcc=null,obsList=[];',
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
  ' setMe:function(lat,lng,acc){if(!me){me=L.marker([lat,lng],{icon:meIcon,zIndexOffset:1000}).addTo(map);meAcc=L.circle([lat,lng],{radius:acc,color:"#2E7CF6",weight:1,fillOpacity:.08}).addTo(map);}else{me.setLatLng([lat,lng]);meAcc.setLatLng([lat,lng]).setRadius(acc);}},',
  ' fly:function(lat,lng,z){map.flyTo([lat,lng],z||map.getZoom(),{duration:1.1});},',
  ' resize:function(){map.invalidateSize();}',
  '};',
  'send({type:"ready"});',
  '</script></body></html>',
].join('\n');

const MAP_TXT = {
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
  },
};

// Nazwy warstw z usługi WMS Lasów Państwowych – pobierane raz z GetCapabilities
let banLayerNames: Promise<string | null> | null = null;
function loadBanLayers(): Promise<string | null> {
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

type Obs = { lat: number; lng: number; name: string; latin: string; date: string; photo: string; color: string; atlas: boolean; cta: string };

async function loadObservations(lat: number, lng: number, radius: number, month: number | null, lang: Lang, c: Theme, atlasOnly: boolean): Promise<Obs[]> {
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

function MapChip({ on, label, icon, onPress, color }: { on: boolean; label: string; icon: string; onPress: () => void; color?: string }) {
  const { c, s } = useApp();
  return (
    <Tap onPress={onPress} style={[s.mapChip, on && { backgroundColor: c.ink, borderColor: c.ink }]}>
      <Ionicons name={icon as any} size={14} color={on ? (color ?? c.amber) : c.muted} />
      <Text style={[s.chipText, on && { color: c.bg }]}>{label}</Text>
    </Tap>
  );
}

function MapScreen({ active, focus }: { active: boolean; focus: { lat: number; lng: number; zoom: number; n: number } | null }) {
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
  }, [ready, show.bans]);
  useEffect(() => {
    if (ready && focus) js(`window.app.fly(${focus.lat},${focus.lng},${focus.zoom})`);
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

// ---- Arkusz lasu i lista lasów ----

function MonthStrip({ months }: { months: number[] }) {
  const { c, s, t } = useApp();
  const now = new Date().getMonth() + 1;
  return (
    <View style={s.calRow}>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((mo) => (
        <View key={mo} style={s.calCell}>
          <View style={[s.calBar, { backgroundColor: months.includes(mo) ? c.fern : c.card2 }, mo === now && { borderWidth: 2, borderColor: c.amber }]} />
          <Text style={[s.calLabel, mo === now && { color: c.ink, fontWeight: '800' }]}>{t.monthLetters[mo - 1]}</Text>
        </View>
      ))}
    </View>
  );
}

function ForestSheet({ f }: { f: Forest }) {
  const { c, s, t, lang, open, back, showOnMap } = useApp();
  const mt = MAP_TXT[lang];
  const li = lang === 'pl' ? 0 : 1;
  const insets = useSafeAreaInsets();
  const species = f.species.map((l) => findSpecies(l)).filter(Boolean) as Mushroom[];
  const inSeason = f.months.includes(new Date().getMonth() + 1);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[s.forestHero, { paddingTop: insets.top + 64 }]}>
        <View style={[s.hill, { left: -60, width: 260, height: 260, bottom: -200, backgroundColor: c.hill1 }]} />
        <View style={[s.hill, { right: -80, width: 300, height: 300, bottom: -240, backgroundColor: c.hill2 }]} />
        <Tap onPress={back} style={[s.backBtn, { top: insets.top + 10 }]}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Tap>
        <Text style={s.heroKicker}>{VOIVODESHIPS[f.v].toUpperCase()}</Text>
        <Text style={[s.heroMonth, { fontSize: 32 }]}>{f.name}</Text>
        <View style={[s.pill, { marginTop: 10, backgroundColor: inSeason ? c.amber : 'rgba(255,255,255,0.18)' }]}>
          <Text style={[s.pillText, { color: inSeason ? c.onAmber : c.cream }]}>
            {inSeason ? (lang === 'pl' ? 'Teraz jest sezon' : 'In season now') : (lang === 'pl' ? 'Poza głównym sezonem' : 'Outside the main season')}
          </Text>
        </View>
      </View>
      <View style={s.sheetBody}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Tap outer={s.flex} onPress={() => showOnMap(f.lat, f.lng, 11)} style={s.primaryBtn}>
            <Ionicons name="map" size={18} color={c.onAmber} />
            <Text style={s.primaryBtnText}>{mt.showOnMap}</Text>
          </Tap>
          <Tap outer={s.flex} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`)} style={s.secondaryBtn}>
            <Ionicons name="navigate" size={18} color={c.ink} />
            <Text style={s.secondaryBtnText}>{mt.navigate}</Text>
          </Tap>
        </View>

        <Text style={s.sectionLabelIn}>{mt.aboutForest}</Text>
        <Text style={s.body}>{f.about[li]}</Text>

        <Text style={s.sectionLabelIn}>{mt.whenPick}</Text>
        <MonthStrip months={f.months} />
        <Text style={[s.body, { marginTop: 12 }]}>{f.when[li]}</Text>

        <Text style={s.sectionLabelIn}>{mt.typical}</Text>
        <View style={{ gap: 8 }}>
          {species.map((m) => (
            <Tap key={m.latin} onPress={() => open({ kind: 'species', m })} style={[s.row, { marginHorizontal: 0, marginBottom: 0 }]}>
              <Photo latin={m.latin} style={s.rowPhoto} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.rowName}>{lang === 'pl' ? m.pl : m.en}</Text>
                <View style={{ flexDirection: 'row' }}><StatusPill st={m.s} small /></View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Tap>
          ))}
        </View>

        <Text style={s.warn}>{mt.forestNote}</Text>
        <Text style={s.sectionLabelIn}>{mt.sources}</Text>
        {f.src.map((i) => (
          <Pressable key={i} onPress={() => Linking.openURL(FOREST_SOURCES[i][1])} style={{ paddingVertical: 4 }}>
            <Text style={s.link}>{FOREST_SOURCES[i][0]}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function ForestListSheet() {
  const { c, s, lang, open, back } = useApp();
  const mt = MAP_TXT[lang];
  const insets = useSafeAreaInsets();
  const month = new Date().getMonth() + 1;
  const groups = Object.keys(VOIVODESHIPS).map((v) => ({ v, list: FORESTS.filter((f) => f.v === v) }));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 }}>
        <Tap onPress={back} style={[s.iconBtn, { width: 42, height: 42, borderRadius: 21 }]}>
          <Ionicons name="chevron-back" size={22} color={c.ink} />
        </Tap>
      </View>
      <ScreenTitle title={mt.forestsTitle} sub={mt.forestsSub(FORESTS.length)} />
      {groups.map(({ v, list }) => (
        <View key={v}>
          <Text style={s.sectionLabel}>{VOIVODESHIPS[v]}</Text>
          {list.map((f) => (
            <Tap key={f.id} onPress={() => open({ kind: 'forest', f })} style={s.row} scale={0.98}>
              <View style={[s.forestDot, { backgroundColor: f.months.includes(month) ? c.fern : c.card2 }]}>
                <Ionicons name="leaf" size={18} color={f.months.includes(month) ? c.cream : c.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowName}>{f.name}</Text>
                <Text style={s.subtle} numberOfLines={1}>{f.species.map((l) => { const m = findSpecies(l); return m ? (lang === 'pl' ? m.pl : m.en) : l; }).slice(0, 3).join(', ')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Tap>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

// ===================== SKANER – EKRAN =====================

function ConfidenceBar({ value, color }: { value: number; color: string }) {
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

function ScanLine({ height }: { height: number }) {
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

function ScannerScreen({ header }: { header: any }) {
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

// ===================== ARKUSZE (karta grzyba, przepis, zdjęcie) =====================

function SheetView({ sheet }: { sheet: Sheet }) {
  const { c } = useApp();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v]);
  return (
    <Animated.View style={{ flex: 1, backgroundColor: c.bg, opacity: v, transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }] }}>
      <StatusBar barStyle="light-content" />
      {sheet.kind === 'species' && <SpeciesSheet m={sheet.m} />}
      {sheet.kind === 'recipe' && <RecipeSheet r={sheet.r} />}
      {sheet.kind === 'photo' && <PhotoSheet id={sheet.id} />}
      {sheet.kind === 'forest' && <ForestSheet f={sheet.f} />}
      {sheet.kind === 'forests' && <ForestListSheet />}
    </Animated.View>
  );
}
const sheetKey = (sh: Sheet) =>
  sh.kind === 'species' ? sh.m.latin : sh.kind === 'recipe' ? sh.r.id : sh.kind === 'photo' ? sh.id : sh.kind === 'forest' ? sh.f.id : 'forests';

// ===================== APLIKACJA =====================

export default function GrzybniaApp() {
  const system = useColorScheme();
  const [settings, setSettings] = useState<Settings>(() => ({ lang: 'pl', theme: 'system', ...readJson<Partial<Settings>>(settingsFile(), {}) }));
  const saveSettings = (patch: Partial<Settings>) =>
    setSettings((cur) => { const next = { ...cur, ...patch }; writeJson(settingsFile(), next); return next; });
  const dark = settings.theme === 'system' ? system === 'dark' : settings.theme === 'dark';
  const c = dark ? DARK : LIGHT;
  const s = dark ? STYLES_DARK : STYLES_LIGHT;
  const lang = settings.lang;

  // zdjęcia gatunków
  const [photos, setPhotos] = useState<Photos>({});
  const [photosDone, setPhotosDone] = useState(false);
  useEffect(() => {
    let alive = true;
    loadAllPhotos([...MUSHROOMS].sort((a, b) => a.pl.localeCompare(b.pl, 'pl')).map((m) => m.latin), (p) => alive && setPhotos(p))
      .finally(() => alive && setPhotosDone(true));
    return () => { alive = false; };
  }, []);
  const photoOf = (latin: string) => photos[latin] ?? (photosDone ? null : undefined);

  // album
  const [album, setAlbum] = useState<AlbumItem[]>(() => readJson<AlbumItem[]>(albumIndexFile(), []));
  const commitAlbum = (fn: (cur: AlbumItem[]) => AlbumItem[]) =>
    setAlbum((cur) => { const next = fn(cur); writeJson(albumIndexFile(), next); return next; });
  const addToAlbum = (uris: string[], latin?: string, withLocation?: boolean) => {
    const items: AlbumItem[] = [];
    for (const uri of uris) {
      try {
        const it = copyIntoAlbum(uri);
        items.push(latin ? { ...it, latin } : it);
      } catch (e) {
        console.log('[album] kopiowanie', e);
      }
    }
    if (!items.length) return;
    commitAlbum((cur) => [...items, ...cur]);
    if (withLocation) {
      // zapisz, gdzie zrobiono zdjęcie – potem widać je na mapie jako „Moje”
      (async () => {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (!perm.granted) return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
          .catch(() => Location.getLastKnownPositionAsync());
        if (!pos) return;
        const ids = items.map((i) => i.id);
        commitAlbum((cur) => cur.map((a) => (ids.includes(a.id) ? { ...a, lat: pos.coords.latitude, lng: pos.coords.longitude } : a)));
      })().catch((e) => console.log('[album] lokalizacja', e));
    }
  };
  const updateAlbum = (id: string, patch: Partial<AlbumItem>) => commitAlbum((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const removeFromAlbum = (id: string) => {
    const it = album.find((a) => a.id === id);
    if (it) { try { new File(albumDir(), it.name).delete(); } catch (e) { console.log('[album] usuwanie', e); } }
    commitAlbum((cur) => cur.filter((a) => a.id !== id));
  };

  // nawigacja
  const [tab, setTab] = useState<Tab>('atlas');
  const fade = useRef(new Animated.Value(1)).current;
  const switchTab = (k: Tab) => {
    if (k === tab) return;
    setTab(k);
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };
  const [stack, setStack] = useState<Sheet[]>([]);
  const open = (sheet: Sheet) => setStack((cur) => [...cur, sheet]);
  const back = () => setStack((cur) => cur.slice(0, -1));
  const [scanSeed, setScanSeed] = useState<{ item: AlbumItem; n: number } | null>(null);
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom: number; n: number } | null>(null);
  const showOnMap = (lat: number, lng: number, zoom = 12) => {
    setMapFocus({ lat, lng, zoom, n: Date.now() });
    setStack([]);
    switchTab('map');
  };
  const sendToScanner = (item: AlbumItem) => {
    setScanSeed({ item, n: Date.now() });
    setStack([]);
    switchTab('scan');
  };

  const ctx: App = {
    c, s, lang, t: L[lang], photoOf, open, back,
    album, addToAlbum, updateAlbum, removeFromAlbum, sendToScanner, scanSeed, showOnMap,
  };
  const header = <TopBar setLang={(l) => saveSettings({ lang: l })} toggleTheme={() => saveSettings({ theme: dark ? 'light' : 'dark' })} />;
  const top = stack[stack.length - 1];

  return (
    <AppCtx.Provider value={ctx}>
      <View style={s.root}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        {TABS.map((k) => (
          <Animated.View
            key={k}
            style={[s.flex, { display: tab === k ? 'flex' : 'none' }, tab === k && {
              opacity: fade,
              transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            }]}
          >
            {k === 'atlas' && <AtlasScreen header={header} />}
            {k === 'map' && <MapScreen active={tab === 'map'} focus={mapFocus} />}
            {k === 'scan' && <ScannerScreen header={header} />}
            {k === 'recipes' && <RecipesScreen header={header} />}
            {k === 'album' && <AlbumScreen header={header} />}
          </Animated.View>
        ))}
        <TabBar tab={tab} setTab={switchTab} />

        <Modal visible={stack.length > 0} animationType="slide" onRequestClose={back} statusBarTranslucent>
          {top && <SheetView key={`${stack.length}-${sheetKey(top)}`} sheet={top} />}
        </Modal>
      </View>
    </AppCtx.Provider>
  );
}

// ===================== STYLE =====================

function makeStyles(c: Theme) {
  const shadow = Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: c.dark ? 0.4 : 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
    default: { elevation: 6 },
  });
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg },
    flex: { flex: 1 },
    mono: { fontFamily: MONO, fontSize: 11, color: c.muted, letterSpacing: 0.5 },
    subtle: { fontSize: 14, color: c.muted },
    h1: { fontFamily: SERIF, fontSize: 32, fontWeight: '700', color: c.ink, letterSpacing: -0.5 },
    h2: { fontFamily: SERIF, fontSize: 22, fontWeight: '700', color: c.ink },
    body: { fontSize: 15.5, lineHeight: 23, color: c.ink },
    latin: { fontStyle: 'italic', color: c.muted, fontSize: 13 },
    link: { color: c.fern, fontWeight: '700', fontSize: 14, textDecorationLine: 'underline' },
    warn: { marginTop: 24, fontSize: 12.5, lineHeight: 18, color: c.muted, borderLeftWidth: 3, borderLeftColor: c.status.d, paddingLeft: 10 },

    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
    brand: { fontFamily: SERIF, fontSize: 24, fontWeight: '700', color: c.ink, letterSpacing: -0.3 },
    langSwitch: { flexDirection: 'row', backgroundColor: c.card2, borderRadius: 99, padding: 3 },
    langBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
    langText: { fontSize: 12, fontWeight: '800', color: c.muted },
    iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' },

    pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, alignSelf: 'flex-start' },
    pillText: { fontSize: 12, fontWeight: '800' },
    dot: { width: 8, height: 8, borderRadius: 4 },

    tabWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'stretch' },
    tabBar: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 26, padding: 6, borderWidth: 1, borderColor: c.line, ...shadow },
    tabPill: { position: 'absolute', top: 6, bottom: 6, left: 6, borderRadius: 20, backgroundColor: c.amber },
    tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 2 },
    tabLabel: { fontSize: 11, fontWeight: '700' },

    heroShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 140, backgroundColor: 'rgba(0,0,0,0.28)' },
    backBtn: { position: 'absolute', left: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
    sheetBody: { marginTop: -26, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: c.bg, paddingHorizontal: 20, paddingTop: 26 },
    sectionLabel: { fontFamily: MONO, fontSize: 11, color: c.muted, letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 20, marginTop: 22, marginBottom: 10 },
    sectionLabelIn: { fontFamily: MONO, fontSize: 11, color: c.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 26, marginBottom: 10 },
    card: { backgroundColor: c.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: c.line },

    hero: { marginHorizontal: 16, height: 220, borderRadius: 30, backgroundColor: c.forest, padding: 22, overflow: 'hidden' },
    orb: { position: 'absolute', right: 34, top: 26, width: 54, height: 54, borderRadius: 27, opacity: 0.95 },
    hill: { position: 'absolute', borderRadius: 999 },
    heroKicker: { fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: alpha(c.cream, 'B3') },
    heroMonth: { fontFamily: SERIF, fontSize: 42, fontWeight: '700', color: c.cream, marginTop: 4, letterSpacing: -1 },
    heroStats: { fontSize: 13, color: alpha(c.cream, 'D9'), marginTop: 6, maxWidth: '78%' },

    seasonCard: { width: 128, backgroundColor: c.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: c.line },
    seasonPhoto: { width: 128, height: 128 },
    seasonDot: { position: 'absolute', top: 10, left: 10, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
    seasonName: { fontSize: 13, fontWeight: '700', color: c.ink, padding: 10, minHeight: 52 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: c.card, borderRadius: 20, padding: 10, marginHorizontal: 16, marginBottom: 8, borderWidth: 1, borderColor: c.line },
    rowPhoto: { width: 64, height: 64, borderRadius: 14 },
    rowName: { fontSize: 16, fontWeight: '700', color: c.ink, letterSpacing: -0.2 },

    searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.card, borderRadius: 18, paddingHorizontal: 14, marginHorizontal: 16, marginTop: 20, borderWidth: 1, borderColor: c.line },
    searchInput: { flex: 1, fontSize: 16, color: c.ink, paddingVertical: 13 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, borderWidth: 1, borderColor: c.line, backgroundColor: c.card },
    chipText: { fontSize: 13, fontWeight: '700', color: c.ink },

    calRow: { flexDirection: 'row', gap: 4 },
    calCell: { flex: 1, alignItems: 'center', gap: 6 },
    calBar: { width: '100%', height: 26, borderRadius: 7 },
    calLabel: { fontSize: 11, color: c.muted, fontWeight: '600' },

    statusBox: { marginTop: 22, borderRadius: 16, padding: 14, borderLeftWidth: 4 },
    statusBoxTitle: { fontFamily: MONO, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
    linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: c.line },

    recipeMini: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 18, padding: 10, borderWidth: 1, borderColor: c.line },
    recipeMiniPhoto: { width: 56, height: 56, borderRadius: 12 },
    recipeCard: { marginHorizontal: 16, backgroundColor: c.card, borderRadius: 26, overflow: 'hidden', borderWidth: 1, borderColor: c.line },
    recipePhoto: { width: '100%', height: 170 },
    timeChip: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: c.amber, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
    timeChipText: { fontSize: 12, fontWeight: '800', color: c.onAmber },
    miniTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: c.card2, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 99 },
    miniTagText: { fontSize: 12, fontWeight: '600', color: c.ink },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    speciesChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.card, borderRadius: 99, padding: 5, paddingRight: 16, borderWidth: 1, borderColor: c.line },
    speciesChipPhoto: { width: 40, height: 40, borderRadius: 20 },
    ingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 },
    check: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    stepRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
    stepNum: { fontFamily: SERIF, fontSize: 26, fontWeight: '700', color: c.amber, width: 28, lineHeight: 28 },

    primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: c.amber, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 12 },
    primaryBtnText: { fontSize: 15, fontWeight: '800', color: c.onAmber },
    secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: c.card, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 12, borderWidth: 1.5, borderColor: c.line },
    secondaryBtnText: { fontSize: 15, fontWeight: '700', color: c.ink },
    emptyBox: { alignItems: 'center', marginHorizontal: 32, marginTop: 30 },
    gridItem: { borderRadius: 16, overflow: 'hidden', backgroundColor: c.card2 },
    gridLabel: { position: 'absolute', left: 6, right: 6, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
    gridLabelText: { flex: 1, color: '#fff', fontSize: 11, fontWeight: '700' },
    actionBtn: { alignItems: 'center', gap: 4, backgroundColor: c.card, borderRadius: 16, paddingVertical: 12, borderWidth: 1, borderColor: c.line },
    actionText: { fontSize: 12, fontWeight: '700', color: c.ink },
    pickRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: c.line },
    noteInput: { minHeight: 100, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, fontSize: 15, color: c.ink, textAlignVertical: 'top' },

    mapTop: { position: 'absolute', left: 0, right: 0, top: 0 },
    mapBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: c.card, borderRadius: 22, borderWidth: 1, borderColor: c.line, ...shadow },
    mapChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, ...shadow },
    mapFabs: { position: 'absolute', right: 16, gap: 10 },
    mapFab: { width: 50, height: 50, borderRadius: 25, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', ...shadow },
    obsPanel: { position: 'absolute', left: 16, right: 82, backgroundColor: c.card, borderRadius: 20, padding: 12, borderWidth: 1, borderColor: c.line, ...shadow },
    mapToast: { position: 'absolute', left: 16, right: 16, backgroundColor: 'rgba(20,24,20,0.88)', borderRadius: 14, padding: 12 },
    forestHero: { backgroundColor: c.forest, paddingHorizontal: 22, paddingBottom: 52, overflow: 'hidden' },
    forestDot: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    finder: { marginHorizontal: 16, borderRadius: 30, backgroundColor: c.forest, overflow: 'hidden' },
    finderEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 14 },
    finderHint: { color: alpha(c.cream, 'D9'), fontSize: 14, lineHeight: 21, textAlign: 'center' },
    corner: { position: 'absolute', width: 34, height: 34, borderColor: c.amber },
    finderBadge: { position: 'absolute', top: 22, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
    finderBadgeText: { color: '#fff', fontFamily: MONO, fontSize: 11 },
    scanBand: { position: 'absolute', left: 0, right: 0, top: 0, height: 40 },
    scanGlow: { flex: 1, backgroundColor: alpha(c.amber, '33') },
    scanLine: { height: 3, backgroundColor: c.amber },
    thumb: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden', backgroundColor: c.card2 },
    thumbX: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: c.status.d, alignItems: 'center', justifyContent: 'center' },
    scanError: { marginTop: 16, marginHorizontal: 20, color: c.status.d, fontWeight: '700', fontSize: 14, lineHeight: 20 },
    scanWarn: { fontSize: 13, lineHeight: 19, color: c.ink, backgroundColor: c.card2, padding: 14, borderRadius: 16 },
    deadlyBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderRadius: 16, padding: 14, marginTop: 10 },
    deadlyText: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 14, lineHeight: 20 },
    match: { paddingVertical: 12 },
    matchPct: { fontFamily: SERIF, fontSize: 28, fontWeight: '700', color: c.ink },
    matchWhy: { fontSize: 13.5, lineHeight: 20, color: c.muted, marginTop: 8 },
    barTrack: { height: 8, borderRadius: 4, backgroundColor: c.card2, marginTop: 10, overflow: 'hidden' },
    barFill: { height: 8, borderRadius: 4 },
  });
}
type Styles = ReturnType<typeof makeStyles>;
const STYLES_LIGHT = makeStyles(LIGHT);
const STYLES_DARK = makeStyles(DARK);
