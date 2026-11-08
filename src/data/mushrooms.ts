
// Atlas: lista gatunków, opisy, profile i sezony

// Status: e = jadalny, c = warunkowo, i = niejadalny, t = trujący, d = śmiertelnie trujący
export type Status = 'e' | 'c' | 'i' | 't' | 'd';
export type Mushroom = { id: number; latin: string; pl: string; en: string; s: Status; x?: string };
export const RAW = `Boletus edulis|Borowik szlachetny|King Bolete|e
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
Artomyces pyxidatus|Świecznik rozgałęziony|Candelabra Coral|c
Leccinum variicolor|Koźlarz różnobarwny|Mottled Bolete|e
Leccinum duriusculum|Koźlarz topolowy|Slate Bolete|e
Leccinum holopus|Koźlarz białawy|White Bolete|e
Leccinum vulpinum|Koźlarz lisi|Foxy Bolete|e
Suillus viscidus|Maślak lepki|Sticky Bolete|e
Hortiboletus rubellus|Podgrzybek czerwonawy|Ruby Bolete|e
Pleurotus ostreatus|Boczniak ostrygowaty|Oyster Mushroom|e
Pleurotus pulmonarius|Boczniak łyżkowaty|Pale Oyster|e
Pleurotus cornucopiae|Boczniak rożkowaty|Branching Oyster|e
Panellus serotinus|Łycznik późny|Late Fall Oyster|e
Lentinula edodes|Twardnik japoński (shiitake)|Shiitake|e|Sh
Neolentinus lepideus|Twardziak łuskowaty|Scaly Sawgill|e
Tricholoma portentosum|Gąska niekształtna|Charbonnier|e
Tricholoma columbetta|Gąska gołębia|Blue Spot Knight|e
Tricholoma populinum|Gąska topolowa|Poplar Knight|e
Tricholoma imbricatum|Gąska dachówkowata|Matt Knight|e
Tricholoma equestre|Gąska zielonka|Yellow Knight|t|Rh
Tricholoma pardinum|Gąska tygrysowana|Tiger Knight|t
Tricholoma sulphureum|Gąska siarkowa|Sulphur Knight|t
Tricholoma saponaceum|Gąska mydlana|Soapy Knight|i
Tricholoma album|Gąska biała|White Knight|i
Tricholomopsis rutilans|Rycerzyk czerwonozłoty|Plums and Custard|i
Clitocybe nebularis|Lejkówka szarawa|Clouded Funnel|t
Clitocybe rivulosa|Lejkówka jadowita|Fool's Funnel|t|Ms
Clitocybe odora|Lejkówka anyżkowa|Aniseed Funnel|e
Infundibulicybe geotropa|Lejkówka okazała|Trooping Funnel|e
Laccaria amethystina|Lakówka ametystowa|Amethyst Deceiver|e
Laccaria laccata|Lakówka pospolita|Deceiver|e
Laccaria bicolor|Lakówka dwubarwna|Bicoloured Deceiver|e
Marasmius oreades|Twardzioszek przydrożny|Fairy Ring Champignon|e
Megacollybia platyphylla|Pieniążnica szerokoblaszkowa|Whitelaced Shank|i
Gymnopus dryophilus|Łysostopek pospolity|Russet Toughshank|i
Rhodocollybia butyracea|Monetka maślana|Butter Cap|e
Mucidula mucida|Śluzowiec bukowy|Porcelain Fungus|e
Strobilurus esculentus|Szyszkowiec jadalny|Sprucecone Cap|e
Hygrophorus hypothejus|Wodnicha późna|Herald of Winter|e
Cuphophyllus pratensis|Kopułek łąkowy|Meadow Waxcap|e
Hygrocybe conica|Wilgotnica czerniejąca|Blackening Waxcap|t
Pluteus cervinus|Drobnołuszczak jeleni|Deer Shield|e
Volvariella bombycina|Pochwiak jedwabisty|Silky Rosegill|e
Entoloma sinuatum|Dzwonkówka trująca|Livid Pinkgill|t
Entoloma clypeatum|Dzwonkówka tarczowata|Shield Pinkgill|c
Clitopilus prunulus|Mącznik okazały|The Miller|e
Agrocybe praecox|Polówka wczesna|Spring Fieldcap|e
Cyclocybe aegerita|Polówka topolowa (pioppino)|Poplar Fieldcap|e
Hebeloma crustuliniforme|Włośnianka rosista|Poison Pie|t
Inocybe erubescens|Strzępiak ceglasty|Deadly Fibrecap|d|Ms
Inocybe geophylla|Strzępiak ziemistoblaszkowy|White Fibrecap|t|Ms
Mycena pura|Grzybówka fioletowawa|Lilac Bonnet|t|Ms
Mycena rosea|Grzybówka różowa|Rosy Bonnet|t|Ms
Mycena galericulata|Grzybówka hełmiasta|Common Bonnet|i
Mycena haematopus|Grzybówka krwista|Burgundydrop Bonnet|i
Psilocybe semilanceata|Łysiczka lancetowata|Liberty Cap|t|Ps
Panaeolus semiovatus|Kołpaczek półjajowaty|Egghead Mottlegill|i
Conocybe apala|Stożkówka mlecznobiała|Milky Conecap|i
Stropharia semiglobata|Pierścieniak półkulisty|Dung Roundhead|i
Lactarius necator|Mleczaj paskudnik|Ugly Milkcap|t
Russula paludosa|Gołąbek błotny|Bog Brittlegill|e
Russula heterophylla|Gołąbek różnoblaszkowy|Greasy Green Brittlegill|e
Hygrophoropsis aurantiaca|Lisówka pomarańczowa|False Chanterelle|i
Tapinella atrotomentosa|Krowiak aksamitny|Velvet Rollrim|i
Gomphidius glutinosus|Klejówka świerkowa|Slimy Spike|e
Amanita regalis|Muchomor królewski|Royal Fly Agaric|t|Mu
Phallus impudicus|Sromotnik bezwstydny|Common Stinkhorn|c|Ph
Mutinus caninus|Mądziak psi|Dog Stinkhorn|i
Clathrus archeri|Okratek australijski|Devil's Fingers|i
Tuber aestivum|Trufla letnia|Summer Truffle|e
Elaphomyces granulatus|Jeleniak sarni|Hart's Truffle|i
Peziza badia|Kustrzebka brunatna|Bay Cup|c|Cm
Scutellinia scutellata|Włośniczka tarczowata|Eyelash Cup|i
Xylaria hypoxylon|Próchnilec gałęzisty|Candlesnuff Fungus|i
Xylaria polymorpha|Próchnilec maczugowaty|Dead Man's Fingers|i
Schizophyllum commune|Rozszczepka pospolita|Split Gill|i
Gloeophyllum sepiarium|Niszczyca płotowa|Rusty Gilled Polypore|i
Daedaleopsis confragosa|Gmatwica chropowata|Blushing Bracket|i
Phaeolus schweinitzii|Murszak rdzawy|Dyer's Mazegill|i
Heterobasidion annosum|Korzeniowiec wieloletni|Root Rot Fungus|i
Auriscalpium vulgare|Szyszkogrzybek łyżeczkowaty|Earpick Fungus|i
Ramaria botrytis|Koralówka groniasta|Rosso Coral|e
Clavaria fragilis|Goździeniec robakowaty|White Worm Coral|i`;
export const MUSHROOMS: Mushroom[] = RAW.split('\n').map((line, id) => {
  const [latin, pl, en, s, x] = line.split('|');
  return { id, latin, pl, en, s: s as Status, x };
});

// ---- Opis wyglądu, siedliska i sezonu dla każdego gatunku: [polski, angielski] ----
export const DESC: Record<string, [string, string]> = {
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
  "Butyriboletus regius": ["Kapelusz różowy do czerwonego; rurki żółte; trzon żółty z siateczką. Bardzo rzadki w Polsce, w ciepłych lasach liściastych; chroniony, nie zbieraj. VI–IX.", "Pink to red cap; yellow pores; yellow netted stem. Very rare in Poland, in warm broadleaf woods; protected, do not pick. Jun–Sep."],
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
  "Hydnellum peckii": ["Młody biały, z wydzielinami jak krople krwi na powierzchni; dojrzały brązowy, twardy, z kolcami pod spodem. Smak bardzo ostry. Lasy iglaste, rzadki. VIII–X.", "White when young, with blood-red droplets on the surface; brown, tough and spiny underneath when mature. Very acrid taste. Conifer woods, rare. Aug–Oct."],
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
  "Amanita caesarea": ["Kapelusz jaskrawopomarańczowy; blaszki, trzon i pierścień żółte; duża, biała pochwa. Gatunek południowy, w Polsce praktycznie nie występuje. VII–X.", "Bright orange cap; gills, stem and ring yellow; large white volva. A southern species, practically absent in Poland. Jul–Oct."],
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
  "Ganoderma lucidum": ["Czerwonobrązowy, lakierowo błyszczący kapelusz na bocznym trzonie. Na pniach drzew liściastych, rzadki i chroniony. VI–X.", "Red-brown cap with a lacquered shine on a side stem. On broadleaf stumps, rare and protected. Jun–Oct."],
  "Fistulina hepatica": ["Czerwony, mięsisty owocnik przypominający surową wątrobę lub język; wydziela czerwony sok. Na dębach, VIII–X.", "Red, fleshy fruitbody resembling raw liver or a tongue; exudes red juice. On oaks, Aug–Oct."],
  "Inonotus obliquus": ["Czarna, spękana narośl jak zwęglone drewno, wewnątrz rdzawobrązowa. Na żywych brzozach. Używana do naparów, nie do jedzenia. Widoczny przez cały rok.", "Black, cracked growth like burnt wood, rusty-brown inside. On living birches. Used for teas, not as food. Visible all year."],
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
  "Imperator rhodopurpureus": ["Kapelusz różowy do purpurowego, guzowaty; pory czerwone; trzon z czerwoną siateczką. Miąższ żółty, mocno sinieje. Ciepłe lasy liściaste, bardzo rzadki. VII–IX.", "Pink to purple lumpy cap; red pores; stem with a red net. Yellow flesh bruises strongly blue. Warm broadleaf woods, very rare. Jul–Sep."],
  "Rubroboletus legaliae": ["Kapelusz różowawy do szarorożowego; pory czerwone; trzon z czerwoną siateczką; miąższ słabo sinieje, zapach chicorii. Ciepłe lasy dębowe, bardzo rzadki. VII–IX.", "Pinkish to grey-pink cap; red pores; stem with a red net; flesh bruises faintly blue, smells of chicory. Warm oak woods, very rare. Jul–Sep."],
  "Caloboletus radicans": ["Kapelusz białawy do szarego, masywny; pory żółte; trzon żółty, korzeniasto wydłużony. Miąższ sinieje, smak bardzo gorzki. Pod dębami, VII–IX.", "Whitish to grey, massive cap; yellow pores; yellow stem with a rooting base. Flesh bruises blue, taste very bitter. Under oaks, Jul–Sep."],
  "Aureoboletus projectellus": ["Kapelusz czerwonobrązowy; skórka wystaje poza brzeg; trzon bardzo wysoki z grubą siateczką. Gatunek inwazyjny z Ameryki, na Pomorzu w borach sosnowych, VIII–X.", "Red-brown cap whose skin overhangs the margin; very tall stem with a coarse net. Invasive species from North America, found in Pomeranian pine forests, Aug–Oct."],
  "Leccinellum crocipodium": ["Kapelusz żółtobrązowy, pękający w poletka; trzon żółty z żółtymi łuseczkami; miąższ czernieje. Pod dębami, rzadki, VII–IX.", "Yellow-brown cap cracking into patches; yellow stem with yellow scales; flesh blackens. Under oaks, rare, Jul–Sep."],
  "Cantharellus friesii": ["Mała kurka (1–4 cm), intensywnie pomarańczowa, z różowawym odcieniem. Lasy bukowe, rzadka i chroniona, VII–IX.", "A small chanterelle (1–4 cm), intensely orange with a pinkish tinge. Beech woods, rare and protected, Jul–Sep."],
  "Cantharellus pallens": ["Kurka bladożółta do niemal białej, pokryta białawym nalotem; po dotknięciu żółknie. Lasy liściaste, VII–IX.", "Pale yellow to almost white chanterelle with a whitish bloom; yellows when touched. Broadleaf woods, Jul–Sep."],
  "Craterellus lutescens": ["Kapelusz brązowawy, lejkowaty; spód i trzon jaskrawożółte do pomarańczowych, prawie gładkie. Wilgotne bory na wapieniach i torfowiskach, rzadki, IX–XI.", "Brownish funnel-shaped cap; underside and stem bright yellow to orange, almost smooth. Damp forests on limestone and bogs, rare, Sep–Nov."],
  "Hydnum rufescens": ["Mniejszy krewniak kolczaka obłączastego; kapelusz pomarańczowobrązowy, kolce nie zbiegają na trzon. Różne lasy, VIII–XI.", "Smaller relative of the Hedgehog; orange-brown cap, spines not running down the stem. Various woods, Aug–Nov."],
  "Phellodon niger": ["Ciemny, prawie czarny, twardy owocnik z szarymi kolcami pod spodem; często zrastają się w grupy. Bory sosnowe, rzadki. VIII–X.", "Dark, almost black, tough fruitbody with grey spines underneath; often fused in groups. Pine forests, rare. Aug–Oct."],
  "Hydnellum ferrugineum": ["Rdzawobrązowy, twardy, korkowaty owocnik z kolcami; młody wydziela czerwonawe krople. Bory iglaste, rzadki. VIII–X.", "Rusty-brown, tough, corky fruitbody with spines; young ones exude reddish droplets. Conifer forests, rare. Aug–Oct."],
  "Hydnellum caeruleum": ["Kapelusz białawy z niebieskim brzegiem, kolce i miąższ z niebieskimi strefami. Bory sosnowe, bardzo rzadki. VIII–X.", "Whitish cap with a blue margin; spines and flesh with blue zones. Pine forests, very rare. Aug–Oct."],
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
  "Amanita strobiliformis": ["Duży, biały kapelusz z grubymi, kanciastymi brodawkami; trzon z mączystym pierścieniem. Ciepłe lasy na wapieniach, rzadki. VII–X.", "Large white cap with thick angular warts; stem with a mealy ring. Warm woods on limestone, rare. Jul–Oct."],
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
  "Lycoperdon echinatum": ["Brązowa kulka pokryta długimi, zakrzywionymi kolcami jak jeż. Lasy bukowe na wapieniach, rzadka. VII–X.", "Brown ball covered with long curved spines like a hedgehog. Beech woods on limestone, rare. Jul–Oct."],
  "Scleroderma verrucosum": ["Bulwa żółtobrązowa z cienką, brodawkowatą skórą i wyraźnym, pomarszczonym trzonkiem. Lasy, VII–X.", "Yellow-brown tuber with a thin warty skin and a distinct wrinkled stalk. Woods, Jul–Oct."],
  "Geastrum fimbriatum": ["Mała gwiazda o 5–8 ramionach z kulką pośrodku, bez kołnierzyka; ujście włókienkowate. Ściółka iglasta, IX–XI.", "Small star with 5–8 rays and a central ball without a collar; fibrous mouth. Conifer litter, Sep–Nov."],
  "Astraeus hygrometricus": ["Gwiazda, której ramiona zamykają się w suchą pogodę i otwierają w wilgotną. Piaszczyste gleby, przez cały rok.", "A star whose rays close in dry weather and open in damp weather. Sandy soils, all year."],
  "Cyathus striatus": ["Mały, włochaty kubeczek z prążkowanym wnętrzem i „jajeczkami” zarodników. Na gałązkach, VIII–XI.", "Small hairy cup with a grooved inside holding ‘eggs’ of spores. On twigs, Aug–Nov."],
  "Sphaerobolus stellatus": ["Drobna pomarańczowa gwiazdka (2 mm), która wystrzeliwuje kulkę zarodników na kilka metrów. Na drewnie i trocinach. VI–XI.", "Tiny orange star (2 mm) that shoots its spore ball several metres. On wood and sawdust. Jun–Nov."],
  "Bovista nigrescens": ["Biała kula bez trzonu, z wiekiem czarna i papierowa; toczy się po łące. Pastwiska, VI–X.", "White ball without a stem, turning black and papery with age; rolls across meadows. Pastures, Jun–Oct."],
  "Bovista plumbea": ["Mała, biała kulka, potem ołowianoszara, papierowa. Krótka trawa, pastwiska, VI–X.", "Small white ball that turns lead-grey and papery. Short grass and pastures, Jun–Oct."],
  "Calvatia excipuliformis": ["Wysoka purchawka jak tłuczek moździerza: kulista główka na długim trzonie. Lasy i łąki, VII–X.", "Tall puffball shaped like a pestle: a round head on a long stem. Woods and meadows, Jul–Oct."],
  "Calvatia utriformis": ["Duża, biała purchawka, skóra pęka w wielokątne poletka. Pastwiska i wrzosowiska, VI–X.", "Large white puffball whose skin cracks into polygonal patches. Pastures and heaths, Jun–Oct."],
  "Auricularia mesenterica": ["Galaretowato-skórzasta półeczka: wierzch szary, włochaty, ze strefami; spód fioletowobrązowy, pofałdowany. Na martwym drewnie liściastym. Przez cały rok.", "Rubbery shelf: grey, hairy, zoned top; violet-brown, wrinkled underside. On dead broadleaf wood. All year."],
  "Exidia glandulosa": ["Czarne, galaretowate plamy na gałęziach dębów, z drobnymi brodawkami. Jesienią i zimą.", "Black jelly patches on oak branches, with tiny warts. Autumn and winter."],
  "Pseudohydnum gelatinosum": ["Półprzezroczysty, szarobiały, galaretowaty kapelusz z kolcami pod spodem. Na pniach iglastych, IX–XI.", "Translucent grey-white jelly cap with spines underneath. On conifer stumps, Sep–Nov."],
  "Calocera viscosa": ["Jaskrawożółte do pomarańczowych, rozwidlone, kleiste rożki jak poroże. Na drewnie iglastym, VIII–XII.", "Bright yellow to orange forked, sticky antler-like horns. On conifer wood, Aug–Dec."],
  "Ramaria flava": ["Żółty, gęsto rozgałęziony koralowiec; trudny do odróżnienia od innych koralówek. Lasy, VIII–X.", "Yellow, densely branched coral fungus; hard to tell apart from other corals. Woods, Aug–Oct."],
  "Ramaria aurea": ["Złotożółty koralowiec z grubym trzonem. Lasy, rzadki, VIII–X. Wiele podobnych koralówek przeczyszcza.", "Golden-yellow coral fungus with a thick stem. Woods, rare, Aug–Oct. Many similar corals are laxative."],
  "Clavulina cinerea": ["Szary, rozgałęziony koralowiec z tępymi końcówkami. Ściółka w różnych lasach, VIII–XI.", "Grey branched coral fungus with blunt tips. Leaf litter in various woods, Aug–Nov."],
  "Clavariadelphus pistillaris": ["Duża, żółtobrązowa maczuga do 30 cm, bez rozgałęzień. Lasy bukowe na wapieniach, rzadka i chroniona. VIII–X.", "Large yellow-brown club up to 30 cm, unbranched. Beech woods on limestone, rare and protected. Aug–Oct."],
  "Stereum hirsutum": ["Cienkie, falowane, żółtopomarańczowe skorupki, wierzch włochaty. Na martwym drewnie liściastym, przez cały rok.", "Thin wavy yellow-orange crusts with a hairy top. On dead broadleaf wood, all year."],
  "Leccinum variicolor": ["Kapelusz szarobrązowy, marmurkowy, często z jaśniejszymi smugami; trzon z ciemnymi łuskami, u podstawy często niebieskozielony. Miąższ w podstawie trzonu różowieje lub zielenieje. Pod brzozami na wilgotnych, torfiastych glebach, VII–X.", "Grey-brown, marbled cap often with paler streaks; stem with dark scales, often blue-green at the base. Flesh turns pink or green in the stem base. Under birch on damp, peaty soil, Jul–Oct."],
  "Leccinum duriusculum": ["Kapelusz szarobrązowy, twardy, w suchym czasie spękany; trzon z szarymi łuskami. Miąższ zwarty, po przekrojeniu różowieje, potem szarzeje, w podstawie trzonu niebieskozielony. Pod topolami i osikami, VII–X.", "Grey-brown, firm cap, cracked in dry weather; stem with grey scales. Flesh firm, turns pink then grey when cut, blue-green in the stem base. Under poplars and aspens, Jul–Oct."],
  "Leccinum holopus": ["Bardzo jasny koźlarz: kapelusz białawy do kremowego, czasem zielonkawy; trzon smukły, z białymi lub szarawymi łuskami. Miąższ miękki, wodnisty. Na torfowiskach i bagnistych brzezinach wśród mchów torfowców, VIII–X.", "A very pale scaber stalk: whitish to cream cap, sometimes greenish; slender stem with white or greyish scales. Flesh soft and watery. In bogs and wet birch woods among sphagnum, Aug–Oct."],
  "Leccinum vulpinum": ["Kapelusz rudopomarańczowy do lisiobrązowego, okazały; trzon z ciemnobrązowymi łuskami. Miąższ po przekrojeniu ciemnieje do fioletowoszarego. Pod sosnami, rzadziej świerkami, na kwaśnych glebach, VII–X.", "Large fox-orange to rusty-brown cap; stem with dark brown scales. Flesh darkens to violet-grey when cut. Under pines, less often spruce, on acid soils, Jul–Oct."],
  "Suillus viscidus": ["Kapelusz brudnobiały do szarooliwkowego, bardzo śluzowaty; rurki szare, kanciaste; trzon z białawym, śluzowatym pierścieniem. Miąższ słabo sinieje. Wyłącznie pod modrzewiami, VIII–X.", "Dirty white to grey-olive cap, very slimy; grey, angular pores; stem with a whitish slimy ring. Flesh bruises slightly blue. Only under larch, Aug–Oct."],
  "Hortiboletus rubellus": ["Mały podgrzybek z kapeluszem krwistoczerwonym do różowego, z wiekiem płowiejącym; pory żółte, sinieją; trzon żółty z czerwonymi punkcikami. W parkach, na trawnikach i skrajach lasów pod dębami, VII–IX.", "Small bolete with a blood-red to pink cap that fades with age; yellow pores that bruise blue; yellow stem with red dots. In parks, lawns and wood edges under oaks, Jul–Sep."],
  "Pleurotus ostreatus": ["Kapelusz muszlowaty, szary, brązowawy do niebieskoszarego, rośnie dachówkowato w kępach; blaszki białe, zbiegające na krótki, boczny trzon. Na pniach i kłodach drzew liściastych (buk, topola, wierzba), głównie późną jesienią i zimą, X–III.", "Shell-shaped cap, grey, brownish to blue-grey, growing in overlapping clusters; white gills running down a short side stem. On trunks and logs of broadleaf trees (beech, poplar, willow), mainly late autumn and winter, Oct–Mar."],
  "Pleurotus pulmonarius": ["Podobny do boczniaka ostrygowatego, ale jaśniejszy: kapelusz kremowobiały do jasnobrązowego, cieńszy. Rośnie latem, w cieplejszej porze roku. Na drewnie drzew liściastych, VI–IX.", "Like the Oyster Mushroom but paler: cream-white to light brown, thinner cap. Grows in the warm season. On broadleaf wood, Jun–Sep."],
  "Pleurotus cornucopiae": ["Owocniki kremowe do jasnożółtych, lejkowate, wyrastają kępami ze wspólnej podstawy; blaszki zbiegają głęboko i łączą się siateczką na trzonie. Na pniach wiązów i innych drzew liściastych, VI–X.", "Cream to pale yellow, funnel-shaped fruitbodies in clusters from a shared base; gills run far down and form a net on the stem. On elm stumps and other broadleaf trees, Jun–Oct."],
  "Panellus serotinus": ["Kapelusz muszlowaty, oliwkowozielony do żółtobrązowego, lepki, aksamitny; blaszki pomarańczowożółte; trzon bardzo krótki. Na martwym drewnie liściastym po pierwszych przymrozkach, X–XII.", "Shell-shaped, olive-green to yellow-brown, sticky, velvety cap; orange-yellow gills; very short stem. On dead broadleaf wood after the first frosts, Oct–Dec."],
  "Lentinula edodes": ["Kapelusz brązowy, z jaśniejszymi łuseczkami na brzegu; blaszki białe; trzon twardy, włóknisty. W Polsce nie rośnie dziko – to grzyb uprawny (na klockach dębowych i podłożach z trocin), dostępny przez cały rok.", "Brown cap with pale scales near the margin; white gills; tough, fibrous stem. Not wild in Poland – it is a cultivated mushroom (on oak logs and sawdust blocks), available all year."],
  "Neolentinus lepideus": ["Kapelusz białawy do kremowego, pokryty brązowymi łuskami; blaszki ząbkowane na ostrzu; trzon twardy, łuskowaty. Pachnie anyżem lub balsamem. Na drewnie iglastym, także na podkładach kolejowych i słupach, VI–X.", "Whitish to cream cap covered with brown scales; gills with serrated edges; tough, scaly stem. Smells of anise or balsam. On conifer wood, including railway sleepers and posts, Jun–Oct."],
  "Tricholoma portentosum": ["Kapelusz szary do czarniawego, z ciemnymi, promienistymi włókienkami, często z żółtawym odcieniem; blaszki białe, potem żółtawe; trzon biały do cytrynowego. Zapach mączny. W borach sosnowych na piaskach, późną jesienią, X–XII.", "Grey to blackish cap with dark radial fibres, often tinged yellow; white then yellowish gills; white to lemon stem. Mealy smell. In sandy pine forests, late autumn, Oct–Dec."],
  "Tricholoma columbetta": ["Owocnik czysto biały, jedwabisty; kapelusz z czasem z niebieskozielonymi lub różowymi plamkami; blaszki białe; trzon biały, często z niebieskawą podstawą. Zapach słabo mączny. Pod dębami, bukami i brzozami, VIII–X.", "Pure white, silky fruitbody; cap later with blue-green or pinkish spots; white gills; white stem, often bluish at the base. Faint mealy smell. Under oak, beech and birch, Aug–Oct."],
  "Tricholoma populinum": ["Kapelusz czerwonobrązowy, lepki, mięsisty; blaszki białe, z czasem rdzawo plamiste; trzon gruby, białawy. Mocny zapach mąki lub ogórka. Kępami pod topolami, często na piaszczystych nasypach i w alejach, IX–XI.", "Red-brown, sticky, fleshy cap; white gills that become rust-spotted; thick, whitish stem. Strong smell of flour or cucumber. In groups under poplars, often on sandy banks and avenues, Sep–Nov."],
  "Tricholoma imbricatum": ["Kapelusz brązowy, suchy, matowy, z drobnymi przylegającymi łuseczkami, często popękany; blaszki białawe z brązowymi plamkami; trzon brązowawy, pełny. Smak łagodny do lekko gorzkiego. Pod sosnami, IX–XI.", "Dry, matt brown cap with small adpressed scales, often cracked; whitish gills spotted brown; brownish, solid stem. Mild to slightly bitter taste. Under pines, Sep–Nov."],
  "Tricholoma equestre": ["Kapelusz siarkowożółty z oliwkowym lub brązowawym środkiem, lepki, często z ziarnkami piasku; blaszki cytrynowożółte; trzon żółty. Dawniej uważana za smaczny grzyb jadalny. W piaszczystych borach sosnowych, IX–XII.", "Sulphur-yellow cap with an olive or brownish centre, sticky, often with grains of sand; lemon-yellow gills; yellow stem. Formerly considered a good edible. In sandy pine forests, Sep–Dec."],
  "Tricholoma pardinum": ["Duża gąska: kapelusz szarobiały, pokryty ciemnoszarymi łuskami ułożonymi w koncentryczne kręgi; blaszki białawe do żółtawozielonych, łzawiące; trzon biały. Zapach mączny. W lasach bukowych i jodłowych na wapieniach, głównie w górach, VIII–X.", "A large knight: grey-white cap covered in dark grey scales in concentric rings; whitish to yellow-green gills that weep droplets; white stem. Mealy smell. In beech and fir woods on limestone, mainly in the mountains, Aug–Oct."],
  "Tricholoma sulphureum": ["Cały owocnik siarkowożółty, z czasem brązowiejący; blaszki grube, rzadkie, żółte. Bardzo silny, nieprzyjemny zapach gazu świetlnego lub smoły. W lasach liściastych i mieszanych, VIII–X.", "Whole fruitbody sulphur-yellow, browning with age; thick, distant yellow gills. Very strong, unpleasant smell of coal gas or tar. In broadleaf and mixed woods, Aug–Oct."],
  "Tricholoma saponaceum": ["Kapelusz bardzo zmienny: szarooliwkowy, zielonkawy do brązowego; blaszki białawe, rzadkie; trzon białawy, u podstawy często różowiejący. Wyraźny zapach mydła. W różnych lasach, VIII–XI.", "Very variable cap: grey-olive, greenish to brown; whitish, distant gills; whitish stem, often pinkish at the base. Distinct soapy smell. In many types of woodland, Aug–Nov."],
  "Tricholoma album": ["Owocnik biały do kremowego, mięsisty; blaszki białe, gęste. Zapach nieprzyjemny, gazowy lub ziemisty, smak gorzki lub ostry. Pod brzozami i dębami, VIII–X.", "White to cream, fleshy fruitbody; crowded white gills. Unpleasant gassy or earthy smell, bitter or acrid taste. Under birch and oak, Aug–Oct."],
  "Tricholomopsis rutilans": ["Kapelusz żółty, gęsto pokryty purpurowoczerwonymi łuseczkami; blaszki jaskrawożółte; trzon żółty z purpurowymi włókienkami. Na pniakach i korzeniach sosen i świerków, VII–XI.", "Yellow cap densely covered with purple-red scales; bright yellow gills; yellow stem with purple fibres. On conifer stumps and roots, Jul–Nov."],
  "Clitocybe nebularis": ["Duża lejkówka: kapelusz szary do szarobrązowego, jakby oszroniony, z czasem płaski lub wklęsły; blaszki kremowe, lekko zbiegające; trzon gruby, maczugowaty. Silny, słodkawo-kwaśny zapach. W ściółce lasów liściastych i iglastych, często w kręgach, IX–XI.", "A large funnel: grey to grey-brown, frosted-looking cap, later flat or depressed; cream gills, slightly decurrent; thick club-shaped stem. Strong, sweetish-sour smell. In leaf litter of broadleaf and conifer woods, often in rings, Sep–Nov."],
  "Clitocybe rivulosa": ["Mała, biaława lejkówka (2–5 cm) z oszronionym, z czasem spękanym kapeluszem; blaszki białawe, zbiegające. Rośnie w trawie na trawnikach, łąkach i w parkach, często w kręgach – razem z jadalnym twardzioszkiem przydrożnym, z którym bywa mylona. VIII–XI.", "A small, whitish funnel (2–5 cm) with a frosted, later cracked cap; whitish decurrent gills. Grows in grass on lawns, meadows and parks, often in rings – together with the edible Fairy Ring Champignon it is confused with. Aug–Nov."],
  "Clitocybe odora": ["Kapelusz niebieskozielony do szarozielonego, z wiekiem blaknie; blaszki zielonkawe do białawych; trzon zielonkawy. Bardzo silny zapach anyżu – najlepsza cecha rozpoznawcza. W lasach liściastych, VIII–X.", "Blue-green to grey-green cap that fades with age; greenish to whitish gills; greenish stem. Very strong aniseed smell – the best identifying feature. In broadleaf woods, Aug–Oct."],
  "Infundibulicybe geotropa": ["Duża lejkówka (do 20 cm) z kremowym do płowego kapeluszem, z charakterystycznym garbkiem w środku lejka; blaszki kremowe, zbiegające; trzon wysoki, gruby. W kręgach i szeregach w jasnych lasach liściastych, na skrajach i polanach, IX–XI.", "A large funnel (up to 20 cm) with a cream to buff cap and a characteristic central bump in the funnel; cream decurrent gills; tall, thick stem. In rings and lines in open broadleaf woods, edges and clearings, Sep–Nov."],
  "Laccaria amethystina": ["Mały grzyb (2–6 cm) cały intensywnie fioletowy, w suchym czasie blednie do szarolila; blaszki grube, rzadkie, fioletowe; trzon włóknisty. W lasach liściastych i mieszanych, VII–XI.", "Small (2–6 cm), entirely vivid violet, fading to greyish-lilac when dry; thick, distant violet gills; fibrous stem. In broadleaf and mixed woods, Jul–Nov."],
  "Laccaria laccata": ["Mały, pospolity grzyb o barwie od cielistej do pomarańczowobrązowej, zmiennej z wilgotnością; blaszki grube, rzadkie, różowawe; trzon włóknisty, twardy. W różnych lasach, VI–XI.", "Small, common mushroom from flesh-pink to orange-brown, changing with moisture; thick, distant pinkish gills; tough fibrous stem. In many woodland types, Jun–Nov."],
  "Laccaria bicolor": ["Podobna do lakówki pospolitej, ale z lila lub fioletowym nalotem na blaszkach i u podstawy trzonu; kapelusz płowobrązowy. W lasach iglastych i mieszanych, VII–X.", "Like the Deceiver but with a lilac or violet tinge on the gills and at the stem base; tawny-brown cap. In conifer and mixed woods, Jul–Oct."],
  "Marasmius oreades": ["Mały grzyb (2–5 cm) o kapeluszu płowym do jasnobrązowego, z tępym garbkiem; blaszki rzadkie, kremowe, wolne; trzon cienki, bardzo elastyczny – można go skręcić bez złamania. Rośnie w trawie, w kręgach (czarcie kręgi) na łąkach, pastwiskach i trawnikach, V–X.", "Small (2–5 cm) tan to light brown cap with a blunt bump; distant, cream, free gills; thin, very elastic stem – it can be twisted without breaking. Grows in grass in fairy rings on meadows, pastures and lawns, May–Oct."],
  "Megacollybia platyphylla": ["Kapelusz szarobrązowy, promieniście włóknisty; blaszki bardzo szerokie i rzadkie, białe; trzon białawy, z białymi sznurami grzybni przy podstawie. Na butwiejącym drewnie liściastym i w ściółce, VI–X.", "Grey-brown, radially fibrous cap; very broad, distant white gills; whitish stem with white mycelial cords at the base. On rotting broadleaf wood and litter, Jun–Oct."],
  "Gymnopus dryophilus": ["Mały, pospolity grzyb z kapeluszem rudobrązowym, płowiejącym; blaszki gęste, kremowe; trzon cienki, gładki, chrząstkowaty. Często masowo w ściółce lasów liściastych i iglastych, V–X. Mało wartościowy; opisywano po nim dolegliwości żołądkowe.", "Small, common mushroom with a russet, fading cap; crowded cream gills; thin, smooth, cartilaginous stem. Often in masses in broadleaf and conifer litter, May–Oct. Of little value; stomach upsets have been reported."],
  "Rhodocollybia butyracea": ["Kapelusz brązowy do ciemnoczerwonobrązowego, tłustawy w dotyku jak masło, blaknący; blaszki gęste, białawe; trzon maczugowaty, zgrubiały u podstawy. W ściółce lasów, zwłaszcza iglastych, IX–XII.", "Brown to dark reddish-brown cap, greasy to the touch like butter, fading; crowded whitish gills; club-shaped stem swollen at the base. In woodland litter, especially conifer, Sep–Dec."],
  "Mucidula mucida": ["Owocnik czysto biały, półprzejrzysty, pokryty grubą warstwą śluzu; blaszki rzadkie, białe; trzon cienki z błoniastym pierścieniem. Kępami na pniach i gałęziach buków, często wysoko, VIII–XI.", "Pure white, translucent fruitbody covered in thick slime; distant white gills; thin stem with a membranous ring. In clusters on beech trunks and branches, often high up, Aug–Nov."],
  "Strobilurus esculentus": ["Bardzo mały grzyb (1–3 cm) o brązowym kapeluszu i długim, cienkim trzonie. Wyrasta z zagrzebanych w ziemi szyszek świerkowych, wczesną wiosną, III–V.", "Very small (1–3 cm) mushroom with a brown cap and a long, thin stem. Grows from buried spruce cones in early spring, Mar–May."],
  "Hygrophorus hypothejus": ["Kapelusz oliwkowobrązowy, bardzo śluzowaty; blaszki żółte do pomarańczowych, zbiegające; trzon żółtawy, śluzowaty poniżej strefy pierścieniowej. W borach sosnowych, zwykle po pierwszych przymrozkach, X–XII.", "Olive-brown, very slimy cap; yellow to orange decurrent gills; yellowish stem, slimy below a ring zone. In pine forests, usually after the first frosts, Oct–Dec."],
  "Cuphophyllus pratensis": ["Kapelusz pomarańczowy do płowego, gruby w środku; blaszki rzadkie, grube, zbiegające, jaśniejsze od kapelusza; trzon krótki. Na niewapnowanych, nienawożonych łąkach i pastwiskach, IX–XI.", "Orange to buff cap, thick in the centre; distant, thick decurrent gills paler than the cap; short stem. On unfertilised, unimproved meadows and pastures, Sep–Nov."],
  "Hygrocybe conica": ["Kapelusz stożkowaty, pomarańczowy, czerwony lub żółty; blaszki żółtawe; cały owocnik po dotknięciu i z wiekiem czernieje. Na łąkach, pastwiskach, skrajach lasów, VII–XI.", "Conical, orange, red or yellow cap; yellowish gills; the whole fruitbody blackens when handled and with age. On meadows, pastures and wood edges, Jul–Nov."],
  "Pluteus cervinus": ["Kapelusz szarobrązowy, promieniście włóknisty; blaszki wolne, najpierw białe, potem różowe od zarodników; trzon białawy z ciemnymi włókienkami. Na butwiejącym drewnie i trocinach, V–XI.", "Grey-brown, radially fibrous cap; free gills, white at first then pink from the spores; whitish stem with dark fibres. On rotting wood and sawdust, May–Nov."],
  "Volvariella bombycina": ["Kapelusz biały do żółtawego, jedwabiście włóknisty; blaszki wolne, różowe; trzon u nasady w dużej, workowatej pochwie. W dziuplach i ranach żywych drzew liściastych, VI–IX. Rzadki.", "White to yellowish, silky-fibrous cap; free pink gills; stem base in a large, sac-like volva. In hollows and wounds of living broadleaf trees, Jun–Sep. Rare."],
  "Entoloma sinuatum": ["Duża dzwonkówka: kapelusz szarobiały do kremowego, jedwabisty; blaszki żółtawe, potem łososioworóżowe; trzon biały, gruby. Zapach mąki lub ogórka. W lasach liściastych pod dębami i bukami, VIII–X. Mylona z gąskami i z mącznikiem.", "A large pinkgill: grey-white to cream, silky cap; yellowish gills turning salmon-pink; thick white stem. Smells of flour or cucumber. In broadleaf woods under oak and beech, Aug–Oct. Confused with knights and the Miller."],
  "Entoloma clypeatum": ["Kapelusz szarobrązowy, z garbkiem, promieniście prążkowany; blaszki szare, potem różowe; trzon biały, włóknisty. Wiosną w ogrodach i zaroślach pod drzewami różowatymi (śliwy, głogi, tarnina, jabłonie), V–VI.", "Grey-brown cap with a bump, radially streaked; grey then pink gills; white fibrous stem. In spring in gardens and scrub under rosaceous trees (plum, hawthorn, blackthorn, apple), May–Jun."],
  "Clitopilus prunulus": ["Kapelusz biały do szarawego, zamszowy, nieregularny; blaszki zbiegające, białe, potem różowe; trzon krótki. Silny zapach świeżej mąki. W lasach liściastych i iglastych, VII–X; często w pobliżu borowików.", "White to greyish, suede-like, irregular cap; decurrent gills, white then pink; short stem. Strong smell of fresh flour. In broadleaf and conifer woods, Jul–Oct; often near porcini."],
  "Agrocybe praecox": ["Kapelusz kremowy do jasnobrązowego, gładki; blaszki szarobrązowe; trzon białawy z delikatnym pierścieniem. Późną wiosną i wczesnym latem w trawie, na zrębkach i w ogrodach, V–VII.", "Cream to light brown, smooth cap; grey-brown gills; whitish stem with a fragile ring. In late spring and early summer in grass, woodchip and gardens, May–Jul."],
  "Cyclocybe aegerita": ["Kępy owocników o jasnobrązowym, pomarszczonym kapeluszu; blaszki szarobrązowe; trzon z pierścieniem. Na pniach i ranach topoli i wierzb, V–X. Uprawiany jako pioppino.", "Clusters of fruitbodies with light brown, wrinkled caps; grey-brown gills; stem with a ring. On trunks and wounds of poplars and willows, May–Oct. Cultivated as pioppino."],
  "Hebeloma crustuliniforme": ["Kapelusz kremowy do jasnobrązowego, lepki; blaszki gliniaste, na ostrzu z kropelkami płynu; trzon białawy, mączysty u góry. Zapach rzodkiewki. W lasach i parkach, IX–XI.", "Cream to light brown, sticky cap; clay-coloured gills with droplets on the edges; whitish stem, mealy near the top. Smells of radish. In woods and parks, Sep–Nov."],
  "Inocybe erubescens": ["Kapelusz stożkowaty, biały do kremowego, promieniście włóknisty, często popękany; cały owocnik czerwienieje po uszkodzeniu i z wiekiem. Wczesnym latem pod bukami i lipami, w parkach i na skrajach lasów, V–VII. Mylony z pieczarkami i majówką.", "Conical, white to cream, radially fibrous cap, often cracked; the whole fruitbody reddens when damaged and with age. Early summer under beech and lime, in parks and wood edges, May–Jul. Confused with field mushrooms and St George's Mushroom."],
  "Inocybe geophylla": ["Mały, jedwabiście biały grzyb (1–4 cm) ze stożkowatym kapeluszem; blaszki szare, potem gliniastobrązowe; trzon biały. Ziemisty zapach. Przy ścieżkach w lasach liściastych i iglastych, VIII–X.", "Small (1–4 cm), silky white mushroom with a conical cap; grey then clay-brown gills; white stem. Earthy smell. Along paths in broadleaf and conifer woods, Aug–Oct."],
  "Mycena pura": ["Kapelusz lila do różowofioletowego, prążkowany na brzegu; blaszki białawe do bladolila; trzon kruchy. Wyraźny zapach rzodkiewki. W ściółce lasów, VI–XI.", "Lilac to pinkish-violet cap, striate at the margin; whitish to pale lilac gills; fragile stem. Distinct radish smell. In woodland litter, Jun–Nov."],
  "Mycena rosea": ["Większa i jaśniejsza od grzybówki fioletowawej: kapelusz różowy, blaszki białawe do bladoróżowych. Zapach rzodkiewki. W ściółce lasów liściastych, zwłaszcza bukowych, VIII–XI.", "Larger and paler than the Lilac Bonnet: pink cap, whitish to pale pink gills. Radish smell. In broadleaf litter, especially beech, Aug–Nov."],
  "Mycena galericulata": ["Kapelusz dzwonkowaty, szarobrązowy, prążkowany; blaszki białawe, potem różowawe, połączone poprzecznymi żyłkami; trzon twardy, gładki. Kępami na pniakach drzew liściastych, VI–XI.", "Bell-shaped, grey-brown, striate cap; whitish then pinkish gills joined by cross-veins; tough, smooth stem. In clusters on broadleaf stumps, Jun–Nov."],
  "Mycena haematopus": ["Kapelusz dzwonkowaty, winnoczerwony do brązowego, z ząbkowanym brzegiem; po przełamaniu trzonu wypływa ciemnoczerwony sok. Kępami na butwiejącym drewnie liściastym, VI–XI.", "Bell-shaped, wine-red to brown cap with a scalloped margin; the broken stem bleeds dark red juice. In clusters on rotting broadleaf wood, Jun–Nov."],
  "Psilocybe semilanceata": ["Mały grzyb (1–2,5 cm) o kapeluszu stożkowatym z ostrym, sutkowatym czubkiem, płowym do oliwkowobrązowego, lepkim; blaszki ciemnofioletowobrązowe; trzon cienki, falisty. W trawie na nawożonych pastwiskach i łąkach, IX–XI.", "Small (1–2.5 cm) mushroom with a conical cap ending in a sharp nipple, tan to olive-brown, sticky; dark purple-brown gills; thin, wavy stem. In grass on grazed meadows and pastures, Sep–Nov."],
  "Panaeolus semiovatus": ["Kapelusz jajowaty do dzwonkowatego, kremowy do płowego, gładki, lepki; blaszki ciemnoszare, nakrapiane czarnymi zarodnikami; trzon wysoki z pierścieniem. Na odchodach koni i krów, V–X.", "Egg- to bell-shaped, cream to buff, smooth, sticky cap; dark grey gills mottled with black spores; tall stem with a ring. On horse and cow dung, May–Oct."],
  "Conocybe apala": ["Delikatny grzyb o stożkowatym, mlecznobiałym kapeluszu i długim, bardzo kruchym trzonie; blaszki ochrowe. Pojawia się rano na trawnikach i znika do południa, VI–IX.", "A delicate mushroom with a conical milk-white cap and a long, very fragile stem; ochre gills. Appears in the morning on lawns and is gone by noon, Jun–Sep."],
  "Stropharia semiglobata": ["Kapelusz półkulisty, żółty, lepki; blaszki szare, potem fioletowoczarne; trzon długi, cienki, z pierścieniem. Na odchodach zwierząt i nawożonych pastwiskach, VI–XI.", "Hemispherical, yellow, sticky cap; grey then violet-black gills; long, thin stem with a ring. On animal dung and manured pastures, Jun–Nov."],
  "Lactarius necator": ["Kapelusz oliwkowobrązowy do niemal czarnego, lepki, z wywiniętym, filcowatym brzegiem; blaszki kremowe, plamiące się na brązowo; mleczko białe, bardzo ostre. Pod brzozami, VIII–X.", "Olive-brown to almost black, sticky cap with an inrolled felty margin; cream gills that spot brown; white, very acrid milk. Under birch, Aug–Oct."],
  "Russula paludosa": ["Duży gołąbek z kapeluszem jaskrawoczerwonym do pomarańczowoczerwonego, błyszczącym; blaszki kremowe do żółtawych; trzon biały, często z różowym nalotem. Smak łagodny. W wilgotnych borach sosnowych, wśród mchów, VII–X.", "A large brittlegill with a shiny bright red to orange-red cap; cream to yellowish gills; white stem often flushed pink. Mild taste. In damp pine forests among moss, Jul–Oct."],
  "Russula heterophylla": ["Kapelusz zielony, żółtozielony do oliwkowego, gładki; blaszki białe, bardzo gęste, rozwidlone przy trzonie; trzon biały. Smak łagodny. W lasach liściastych, zwłaszcza pod bukami i dębami, VI–IX.", "Green, yellow-green to olive, smooth cap; white, very crowded gills forking near the stem; white stem. Mild taste. In broadleaf woods, especially under beech and oak, Jun–Sep."],
  "Hygrophoropsis aurantiaca": ["Fałszywa kurka: kapelusz pomarańczowy, aksamitny, z cienkim, podwiniętym brzegiem; prawdziwe, cienkie, gęsto i wielokrotnie rozwidlone blaszki, jaskrawopomarańczowe; miąższ cienki, miękki. W borach iglastych, na pniakach i ściółce, VIII–XI.", "False chanterelle: orange, velvety cap with a thin inrolled margin; true, thin, crowded, repeatedly forked bright orange gills; thin, soft flesh. In conifer woods, on stumps and litter, Aug–Nov."],
  "Tapinella atrotomentosa": ["Duży, mięsisty grzyb: kapelusz brązowy z podwiniętym brzegiem; blaszki kremowe, zbiegające; trzon boczny, krótki, pokryty czarnobrązowym, aksamitnym filcem. Na pniakach sosen i świerków, VII–X.", "Large, fleshy mushroom: brown cap with an inrolled margin; cream decurrent gills; short side stem covered in black-brown velvet. On pine and spruce stumps, Jul–Oct."],
  "Gomphidius glutinosus": ["Kapelusz szarobrązowy do fioletowobrązowego, pokryty grubym śluzem; blaszki zbiegające, szare, potem czarniawe; trzon biały, u podstawy jaskrawożółty. Pod świerkami, VIII–X. Przed przyrządzeniem zdejmij śliską skórkę.", "Grey-brown to purplish-brown cap covered in thick slime; decurrent grey, later blackish gills; white stem, bright yellow at the base. Under spruce, Aug–Oct. Peel the slimy skin before cooking."],
  "Amanita regalis": ["Podobny do muchomora czerwonego, ale kapelusz brązowy do oliwkowobrązowego, z białymi do żółtawych kosmkami; trzon z pierścieniem i bulwą otoczoną pierścieniami kosmków. W świerczynach, głównie na północnym wschodzie Polski i w górach, VIII–X.", "Like the Fly Agaric but with a brown to olive-brown cap and white to yellowish warts; stem with a ring and a bulb ringed with warts. In spruce forests, mainly in north-east Poland and the mountains, Aug–Oct."],
  "Phallus impudicus": ["Najpierw białe, galaretowate „jajo” wielkości kurzego, częściowo w ziemi; potem z jaja szybko wyrasta biały, gąbczasty trzon z oliwkowym, śluzowatym, cuchnącym padliną kapeluszem, który zwabia muchy. W lasach i ogrodach, VI–X.", "First a white, jelly-filled ‘egg’ the size of a hen's egg, partly buried; then a white spongy stem rapidly emerges with an olive, slimy, carrion-smelling cap that attracts flies. In woods and gardens, Jun–Oct."],
  "Mutinus caninus": ["Mały, smukły sromotnik (do 10 cm): pomarańczowy, gąbczasty trzon z ciemnooliwkowym, śluzowatym czubkiem. Wyrasta z białego „jaja”. W wilgotnych lasach liściastych, VII–IX.", "A small, slender stinkhorn (up to 10 cm): orange, spongy stem with a dark olive, slimy tip. Emerges from a white ‘egg’. In damp broadleaf woods, Jul–Sep."],
  "Clathrus archeri": ["Z białego „jaja” wyrastają 4–7 czerwonych ramion rozpostartych jak rozgwiazda, pokrytych ciemnym, cuchnącym śluzem. Gatunek przywleczony z Australii, rozprzestrzenia się w Polsce. Na łąkach, skrajach lasów, w ogrodach, VII–X.", "From a white ‘egg’ emerge 4–7 red arms spread like a starfish, covered in dark, foul-smelling slime. Introduced from Australia and spreading in Poland. On meadows, wood edges and gardens, Jul–Oct."],
  "Tuber aestivum": ["Podziemny, bulwiasty owocnik (2–10 cm), czarny, pokryty piramidalnymi brodawkami; wnętrze jasnobrązowe z białymi żyłkami. Przyjemny, orzechowy zapach. Pod dębami, bukami i leszczyną na wapiennych glebach, VI–X. W Polsce gatunek chroniony – nie wykopuj.", "Underground, tuber-like fruitbody (2–10 cm), black with pyramidal warts; light brown interior with white veins. Pleasant, nutty smell. Under oak, beech and hazel on limestone soils, Jun–Oct. Protected in Poland – do not dig it up."],
  "Elaphomyces granulatus": ["Podziemny, kulisty owocnik (2–4 cm), żółtobrązowy, ziarnisty na powierzchni, wewnątrz z ciemnym, pylącym miąższem. Wykopywany przez dziki i sarny. W borach sosnowych i świerkowych, VIII–XI.", "Underground, round fruitbody (2–4 cm), yellow-brown and granular outside, with dark powdery flesh inside. Dug up by wild boar and deer. In pine and spruce forests, Aug–Nov."],
  "Peziza badia": ["Miseczka (3–8 cm) ciemnobrązowa do oliwkowobrązowej wewnątrz, jaśniejsza i ziarnista na zewnątrz, często nieregularna. Na gliniastej ziemi przy ścieżkach i w rowach, VII–X.", "Cup (3–8 cm), dark brown to olive-brown inside, paler and granular outside, often irregular. On clay soil along paths and ditches, Jul–Oct."],
  "Scutellinia scutellata": ["Mała miseczka (0,5–1,5 cm) jaskrawoczerwona do pomarańczowej, na brzegu z ciemnymi, sztywnymi włoskami jak rzęsy. Na bardzo mokrym, butwiejącym drewnie, VI–X.", "Small cup (0.5–1.5 cm), bright red to orange, edged with dark stiff hairs like eyelashes. On very wet, rotting wood, Jun–Oct."],
  "Xylaria hypoxylon": ["Twarde, rozgałęzione jak poroże, czarne u podstawy i białe od pyłu na końcach owocniki (2–8 cm). Na pniakach i martwym drewnie liściastym przez cały rok.", "Tough, antler-like branched fruitbodies (2–8 cm), black at the base and white-powdered at the tips. On stumps and dead broadleaf wood all year."],
  "Xylaria polymorpha": ["Czarne, twarde, maczugowate owocniki przypominające palce wystające z drewna; wewnątrz białe. U podstawy pniaków buków i innych drzew liściastych, przez cały rok.", "Black, hard, club-shaped fruitbodies like fingers poking from the wood; white inside. At the base of beech and other broadleaf stumps, all year."],
  "Schizophyllum commune": ["Małe (1–4 cm), wachlarzowate, białoszare, włochate owocniki bez trzonu; od spodu „blaszki” rozszczepione wzdłuż na pół. Na martwym drewnie, gałęziach i balotach siana przez cały rok.", "Small (1–4 cm), fan-shaped, grey-white, hairy fruitbodies without a stem; the ‘gills’ underneath are split lengthwise. On dead wood, branches and hay bales all year."],
  "Gloeophyllum sepiarium": ["Korkowate, półkoliste owocniki, na wierzchu strefowane rdzawo, brązowo i czarno z jaskrawożółtym brzegiem; spód z blaszkami lub labiryntem. Na drewnie iglastym, płotach i słupach, przez cały rok.", "Corky, semicircular brackets, zoned rust, brown and black on top with a bright yellow margin; underside with gills or a maze. On conifer wood, fences and posts, all year."],
  "Daedaleopsis confragosa": ["Płaskie, półkoliste owocniki, brązowe, strefowane; spód białawy z wydłużonymi porami, różowiejący po potarciu. Na martwych gałęziach wierzb, olch i brzóz, przez cały rok.", "Flat, semicircular, brown, zoned brackets; whitish underside with elongated pores that blush pink when rubbed. On dead branches of willow, alder and birch, all year."],
  "Phaeolus schweinitzii": ["Duże, rozetowate owocniki u podstawy pni sosen i modrzewi: młode miękkie, żółte z pomarańczowym brzegiem, potem rdzawobrązowe. Wywołuje brunatną zgniliznę korzeni. Używany do barwienia wełny, VII–X.", "Large rosette-shaped fruitbodies at the base of pines and larches: soft and yellow with an orange margin when young, then rusty brown. Causes brown root rot. Used to dye wool, Jul–Oct."],
  "Heterobasidion annosum": ["Twarde, nieregularne owocniki u podstawy pni i na korzeniach drzew iglastych: wierzch brązowy z białym brzegiem, spód biały z drobnymi porami. Groźny pasożyt lasów sosnowych i świerkowych. Owocnik wieloletni.", "Tough, irregular brackets at the base of conifer trunks and on roots: brown on top with a white margin, white underside with fine pores. A serious parasite of pine and spruce forests. Perennial fruitbody."],
  "Auriscalpium vulgare": ["Maleńki grzyb (1–2 cm) o brązowym, owłosionym kapeluszu przyczepionym bokiem do trzonu, od spodu z kolcami. Wyrasta wyłącznie z leżących szyszek sosnowych, przez cały rok.", "A tiny mushroom (1–2 cm) with a brown, hairy cap attached sideways to the stem, with spines underneath. Grows only from fallen pine cones, all year."],
  "Ramaria botrytis": ["Gruby, kalafiorowaty owocnik (do 15 cm): biały pień z gęstymi gałązkami zakończonymi różowymi do winnoczerwonych końcówkami. Miąższ biały. W buczynach i dąbrowach, VIII–X. Łatwo pomylić z trującymi koralówkami – zbieraj tylko pewne okazy.", "Thick, cauliflower-like fruitbody (up to 15 cm): white trunk with dense branches ending in pink to wine-red tips. White flesh. In beech and oak woods, Aug–Oct. Easily confused with poisonous corals – pick only certain specimens."],
  "Clavaria fragilis": ["Kępy białych, cienkich, kruchych, robakowatych maczużek (2–12 cm), nierozgałęzionych. W trawie na łąkach, trawnikach i w jasnych lasach, VIII–XI.", "Clusters of white, thin, brittle, worm-like unbranched clubs (2–12 cm). In grass on meadows, lawns and open woods, Aug–Nov."],
  "Artomyces pyxidatus": ["Białawy do żółtego koralowiec, każda końcówka zakończona małą koroną. Na murszejącym drewnie topoli i wierzb, rzadki. VI–IX.", "Whitish to yellow coral fungus, each tip ending in a small crown. On rotting poplar and willow wood, rare. Jun–Sep."],
};

// ---- Opisy: jak i dlaczego szkodzi / dlaczego jadalny ----
// Linijka RAW może mieć 5. pole z kodem opisu. Bez kodu: e->E, c->Cg, i->I, t->Gi
export const DEFAULT_PROFILE: Record<Status, string> = { e: 'E', c: 'Cg', i: 'I', t: 'Gi', d: 'Gi' };
export const WHY = {"pl": {"e": "Co warto wiedzieć", "c": "Warunki i dlaczego", "i": "Dlaczego niejadalny", "t": "Jak i dlaczego szkodzi", "d": "Jak i dlaczego zabija"}, "en": {"e": "Good to know", "c": "Conditions and why", "i": "Why inedible", "t": "How and why it harms", "d": "How and why it kills"}};
export const PROFILES: Record<string, { pl: string; en: string }> = {
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
  },
  "Ms": {
    "pl": "Muskaryna pobudza układ przywspółczulny. Objawy szybko, po 15 min–2 h: obfite pocenie, ślinienie i łzawienie, zwężone źrenice, nudności, wymioty, biegunka, zwolnione tętno, spadek ciśnienia, duszność. Przy dużej dawce (zwłaszcza strzępiaki) zatrucie może być śmiertelne, szczególnie u dzieci i osób z chorobami serca. Istnieje odtrutka (atropina) – natychmiast dzwoń pod 112.",
    "en": "Muscarine overstimulates the parasympathetic nervous system. Rapid onset, 15 min–2 h: heavy sweating, salivation and tears, pinpoint pupils, nausea, vomiting, diarrhoea, slow pulse, low blood pressure, breathing difficulty. A large dose (especially fibrecaps) can be fatal, particularly for children and people with heart disease. An antidote exists (atropine) – call 112 at once."
  },
  "Rh": {
    "pl": "Uważana dawniej za jadalną. Jedzona kilka razy w krótkim czasie (np. kilka posiłków dzień po dniu) może wywołać rabdomiolizę – rozpad mięśni szkieletowych: po 1–3 dniach osłabienie i bóle mięśni, zwłaszcza nóg, ciemny mocz, nudności, potem zaburzenia rytmu serca i niewydolność nerek. Opisano zgony we Francji i w Polsce. Mechanizm nie jest w pełni poznany. Gatunek nie znajduje się na liście grzybów dopuszczonych do obrotu w Polsce – nie jedz go.",
    "en": "Formerly considered edible. Eaten several times over a short period (e.g. several meals on consecutive days), it can cause rhabdomyolysis – breakdown of skeletal muscle: after 1–3 days muscle weakness and pain, especially in the legs, dark urine, nausea, then heart rhythm problems and kidney failure. Deaths have been reported in France and Poland. The mechanism is not fully understood. The species is not on Poland's list of mushrooms allowed for sale – do not eat it."
  },
  "Ps": {
    "pl": "Psylocybina działa psychoaktywnie: po 20–60 min zaburzenia postrzegania, omamy, niepokój, napady lęku i paniki, przyspieszone tętno, nudności; trwa 4–6 h. Główne zagrożenia to wypadki i urazy w czasie działania, ostre reakcje psychiczne oraz pomyłka z innymi małymi brązowymi grzybami, w tym śmiertelnie trującymi hełmówkami. W Polsce posiadanie tych grzybów jest przestępstwem.",
    "en": "Psilocybin is psychoactive: after 20–60 min distorted perception, hallucinations, anxiety, panic attacks, fast pulse, nausea; lasting 4–6 h. The main dangers are accidents and injuries while intoxicated, acute psychiatric reactions and confusion with other little brown mushrooms, including deadly Galerina species. Possession of these mushrooms is a criminal offence in Poland."
  },
  "Sh": {
    "pl": "Jadalny i ceniony, ale jedz tylko dobrze ugotowany lub usmażony. Surowy albo niedogotowany shiitake może wywołać zapalenie skóry (tzw. shiitake dermatitis): po 1–2 dniach swędzące, czerwone pręgi na ciele, utrzymujące się do kilku tygodni. Odpowiada za to lentinan, który rozkłada się w wysokiej temperaturze. Twardy trzon lepiej użyć tylko do wywaru.",
    "en": "Edible and prized, but eat it only well boiled or fried. Raw or undercooked shiitake can cause skin inflammation (shiitake dermatitis): after 1–2 days itchy red streaks on the body lasting up to several weeks. It is caused by lentinan, which breaks down at high temperature. Use the tough stem only for stock."
  },
  "Ph": {
    "pl": "Jadalny wyłącznie w stadium „jaja”, zanim wyrośnie trzon: zdejmij galaretę i skórkę, a twardy środek pokrój i usmaż. Dorosły owocnik cuchnie padliną i nie nadaje się do jedzenia. Uwaga: jajo sromotnika można pomylić z młodym muchomorem w pochwie – przekrój je zawsze wzdłuż; jeśli widać zarys kapelusza z blaszkami, to muchomor i trzeba go wyrzucić.",
    "en": "Edible only at the ‘egg’ stage, before the stem emerges: remove the jelly and skin, slice and fry the firm core. The mature fruitbody smells of carrion and is not eaten. Warning: a stinkhorn egg can be confused with a young Amanita still in its volva – always cut it lengthwise; if you see the outline of a cap with gills, it is an Amanita and must be thrown away."
  }
};

// ---- Sezon: miesiące odczytane z opisu gatunku (np. „VI–X”) ----
export const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };
export function seasonMonths(latin: string): Set<number> {
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
export const SEASON = new Map(MUSHROOMS.map((m) => [m.latin, seasonMonths(m.latin)]));
export const STATUS_ORDER: Record<Status, number> = { e: 0, c: 1, i: 2, t: 3, d: 4 };
