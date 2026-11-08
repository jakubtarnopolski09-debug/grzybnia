
// PRZEPISY

// species: nazwy łacińskie z atlasu – przepis pojawia się też w karcie każdego z tych grzybów
export type Recipe = {
  id: string;
  title: [string, string];
  time: number;
  serves: number;
  species: string[];
  ingredients: [string[], string[]];
  steps: [string[], string[]];
  tip?: [string, string];
};

export const RECIPES: Recipe[] = [
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
  {
    id: 'boczniaki',
    title: ['Boczniaki w panierce', 'Breaded oyster mushrooms'],
    time: 30, serves: 3,
    species: ['Pleurotus ostreatus', 'Pleurotus pulmonarius', 'Pleurotus cornucopiae'],
    ingredients: [
      ['500 g boczniaków (całe kapelusze)', '2 jajka', '4 łyżki mąki', '6 łyżek bułki tartej', '1 łyżeczka słodkiej papryki', 'olej do smażenia', 'sól, pieprz', 'cytryna do podania'],
      ['500 g oyster mushrooms (whole caps)', '2 eggs', '4 tbsp flour', '6 tbsp breadcrumbs', '1 tsp sweet paprika', 'oil for frying', 'salt, pepper', 'lemon to serve'],
    ],
    steps: [
      ['Odetnij twarde końcówki trzonów; większe kapelusze przekrój na pół. Nie myj pod bieżącą wodą – przetrzyj ściereczką.', 'Kapelusze sparz 2–3 minuty we wrzącej, osolonej wodzie i dokładnie osusz.', 'Mąkę wymieszaj z papryką, solą i pieprzem; jajka roztrzep w osobnej misce.', 'Obtaczaj kapelusze kolejno w mące, jajku i bułce tartej, mocno dociskając panierkę.', 'Smaż na rozgrzanym oleju po 3–4 minuty z każdej strony, aż będą złociste.', 'Odsącz na ręczniku papierowym i podawaj od razu z cytryną, surówką i ziemniakami.'],
      ['Trim off the tough stem ends; halve larger caps. Do not rinse under running water – wipe with a cloth.', 'Blanch the caps for 2–3 minutes in boiling salted water and dry them thoroughly.', 'Mix the flour with the paprika, salt and pepper; beat the eggs in a separate bowl.', 'Coat the caps in flour, then egg, then breadcrumbs, pressing the coating on firmly.', 'Fry in hot oil for 3–4 minutes on each side until golden.', 'Drain on paper towels and serve at once with lemon, salad and potatoes.'],
    ],
    tip: ['Dzikie boczniaki zbieraj zimą z pni drzew liściastych – w tym czasie trudno je z czymś pomylić. Sklepowe też się nadają.', 'Pick wild oysters in winter from broadleaf trunks – at that time they are hard to confuse with anything. Shop-bought ones work too.'],
  },
  {
    id: 'sos',
    title: ['Sos grzybowy', 'Wild mushroom sauce'],
    time: 35, serves: 4,
    species: ['Boletus edulis', 'Imleria badia', 'Leccinum scabrum', 'Leccinum aurantiacum', 'Xerocomus subtomentosus', 'Suillus luteus'],
    ingredients: [
      ['500 g świeżych grzybów leśnych', '1 duża cebula', '2 łyżki masła', '250 ml bulionu', '200 ml śmietany 18%', '1 łyżka mąki', 'koperek lub natka pietruszki', 'sól, pieprz'],
      ['500 g fresh wild mushrooms', '1 large onion', '2 tbsp butter', '250 ml stock', '200 ml sour cream (18%)', '1 tbsp flour', 'dill or parsley', 'salt, pepper'],
    ],
    steps: [
      ['Grzyby oczyść i pokrój w kostkę lub plasterki.', 'Na maśle zeszklij posiekaną cebulę, dodaj grzyby i smaż 10 minut, aż odparuje woda.', 'Wlej bulion i duś pod przykryciem 15 minut.', 'Śmietanę wymieszaj z mąką, zahartuj kilkoma łyżkami gorącego sosu i wlej do patelni.', 'Zagotuj, mieszając, aż sos zgęstnieje; dopraw solą i pieprzem.', 'Posyp koperkiem. Podawaj z kopytkami, kaszą, kluskami śląskimi lub mięsem.'],
      ['Clean the mushrooms and dice or slice them.', 'Soften the chopped onion in butter, add the mushrooms and fry for 10 minutes until the liquid has evaporated.', 'Pour in the stock and simmer covered for 15 minutes.', 'Mix the cream with the flour, temper it with a few spoons of hot sauce and stir into the pan.', 'Bring to the boil, stirring, until the sauce thickens; season with salt and pepper.', 'Sprinkle with dill. Serve with potato dumplings, buckwheat, noodles or meat.'],
    ],
    tip: ['Mieszanka kilku gatunków daje najlepszy smak. Maślakom zdejmij śliską skórkę z kapelusza.', 'A mix of species gives the best flavour. Peel the slimy skin off slippery jack caps.'],
  },
  {
    id: 'risotto',
    title: ['Risotto z prawdziwkami', 'Porcini risotto'],
    time: 45, serves: 4,
    species: ['Boletus edulis', 'Boletus pinophilus', 'Boletus reticulatus', 'Boletus aereus', 'Imleria badia'],
    ingredients: [
      ['300 g ryżu arborio', '300 g świeżych prawdziwków (lub 30 g suszonych)', '1 szalotka', '1 ząbek czosnku', '1,2 l gorącego bulionu', '100 ml białego wina', '3 łyżki masła', '50 g startego parmezanu', 'sól, pieprz, natka pietruszki'],
      ['300 g arborio rice', '300 g fresh porcini (or 30 g dried)', '1 shallot', '1 garlic clove', '1.2 l hot stock', '100 ml white wine', '3 tbsp butter', '50 g grated parmesan', 'salt, pepper, parsley'],
    ],
    steps: [
      ['Suszone grzyby namocz w 300 ml ciepłej wody na 30 minut; wodę przecedź i dodaj do bulionu.', 'Grzyby pokrój i podsmaż na 1 łyżce masła 8 minut, odłóż.', 'Na 1 łyżce masła zeszklij posiekaną szalotkę i czosnek, dodaj ryż i smaż 2 minuty, aż ziarna staną się szkliste.', 'Wlej wino i mieszaj, aż odparuje.', 'Dolewaj bulion po jednej chochli, za każdym razem czekając, aż ryż go wchłonie, przez około 18 minut. W połowie dodaj grzyby.', 'Zdejmij z ognia, wmieszaj resztę masła i parmezan, dopraw i odstaw na 2 minuty. Posyp natką.'],
      ['Soak dried mushrooms in 300 ml warm water for 30 minutes; strain the water and add it to the stock.', 'Slice the mushrooms and fry them in 1 tbsp butter for 8 minutes, set aside.', 'Soften the chopped shallot and garlic in 1 tbsp butter, add the rice and fry for 2 minutes until translucent.', 'Pour in the wine and stir until it evaporates.', 'Add the stock one ladle at a time, waiting each time until it is absorbed, for about 18 minutes. Add the mushrooms halfway.', 'Take off the heat, stir in the remaining butter and parmesan, season and rest for 2 minutes. Sprinkle with parsley.'],
    ],
    tip: ['Ryżu nie płucz – skrobia nadaje risotto kremowość.', 'Do not rinse the rice – the starch makes the risotto creamy.'],
  },
  {
    id: 'uszka',
    title: ['Uszka z grzybami do barszczu', 'Mushroom dumplings for beetroot soup'],
    time: 100, serves: 6,
    species: ['Boletus edulis', 'Imleria badia', 'Boletus pinophilus'],
    ingredients: [
      ['Ciasto: 300 g mąki, 1 jajko, ok. 120 ml ciepłej wody, szczypta soli', 'Farsz: 50 g suszonych borowików lub podgrzybków', '1 duża cebula', '2 łyżki masła', '2 łyżki bułki tartej', 'sól, pieprz'],
      ['Dough: 300 g flour, 1 egg, about 120 ml warm water, a pinch of salt', 'Filling: 50 g dried boletes', '1 large onion', '2 tbsp butter', '2 tbsp breadcrumbs', 'salt, pepper'],
    ],
    steps: [
      ['Grzyby namocz na noc, następnego dnia gotuj w tej samej wodzie 30 minut. Odcedź, wywar zachowaj do barszczu.', 'Cebulę drobno posiekaj i zeszklij na maśle.', 'Grzyby bardzo drobno posiekaj lub zmiel, wymieszaj z cebulą i bułką tartą, dopraw solą i pieprzem.', 'Z mąki, jajka, wody i soli zagnieć elastyczne ciasto, przykryj i odstaw na 20 minut.', 'Rozwałkuj ciasto bardzo cienko, pokrój w kwadraty 4×4 cm, na każdy nałóż odrobinę farszu, złóż w trójkąt i sklej końce w uszko.', 'Gotuj partiami w osolonej wodzie 2 minuty od wypłynięcia. Podawaj w czystym barszczu.'],
      ['Soak the mushrooms overnight and the next day simmer them in the same water for 30 minutes. Drain and keep the stock for the soup.', 'Chop the onion finely and soften it in butter.', 'Chop or mince the mushrooms very finely, mix with the onion and breadcrumbs, season with salt and pepper.', 'Knead an elastic dough from the flour, egg, water and salt, cover and rest for 20 minutes.', 'Roll the dough very thin, cut into 4×4 cm squares, put a little filling on each, fold into a triangle and join the corners into an ‘ear’.', 'Boil in batches in salted water for 2 minutes after they float. Serve in clear beetroot soup.'],
    ],
    tip: ['Uszka można zamrozić na surowo i gotować prosto z zamrażarki.', 'The dumplings can be frozen raw and cooked straight from the freezer.'],
  },
  {
    id: 'gulasz',
    title: ['Gulasz z grzybów leśnych', 'Wild mushroom goulash'],
    time: 50, serves: 4,
    species: ['Imleria badia', 'Leccinum scabrum', 'Leccinum aurantiacum', 'Leccinum versipelle', 'Suillus luteus', 'Xerocomus subtomentosus', 'Boletus edulis'],
    ingredients: [
      ['800 g grzybów leśnych', '150 g wędzonego boczku (opcjonalnie)', '2 cebule', '1 czerwona papryka', '2 łyżki koncentratu pomidorowego', '1 łyżeczka słodkiej i ½ łyżeczki wędzonej papryki', '300 ml bulionu', '2 łyżki oleju', 'majeranek, sól, pieprz'],
      ['800 g wild mushrooms', '150 g smoked bacon (optional)', '2 onions', '1 red pepper', '2 tbsp tomato paste', '1 tsp sweet and ½ tsp smoked paprika', '300 ml stock', '2 tbsp oil', 'marjoram, salt, pepper'],
    ],
    steps: [
      ['Grzyby oczyść i pokrój na duże kawałki; koźlarzom z twardymi trzonami odetnij ich dolną część.', 'W garnku podsmaż pokrojony boczek, dodaj olej i pokrojoną w piórka cebulę, smaż do zezłocenia.', 'Dodaj grzyby i smaż na dużym ogniu 10 minut.', 'Dodaj pokrojoną paprykę, koncentrat i przyprawy, smaż jeszcze 2 minuty.', 'Wlej bulion i duś pod przykryciem 25 minut, aż sos zgęstnieje.', 'Dopraw majerankiem, solą i pieprzem. Podawaj z kaszą, ziemniakami lub chlebem.'],
      ['Clean the mushrooms and cut into large pieces; trim the tough lower stems of scaber stalks.', 'Fry the diced bacon in a pot, add the oil and the onion cut into wedges and fry until golden.', 'Add the mushrooms and fry over high heat for 10 minutes.', 'Add the diced pepper, tomato paste and spices and fry for another 2 minutes.', 'Pour in the stock and simmer covered for 25 minutes until the sauce thickens.', 'Season with marjoram, salt and pepper. Serve with buckwheat, potatoes or bread.'],
    ],
    tip: ['Koźlarze ciemnieją po ugotowaniu – to normalne i nie wpływa na smak.', 'Scaber stalks darken when cooked – this is normal and does not affect the taste.'],
  },
  {
    id: 'maslaki',
    title: ['Maślaki duszone z cebulą', 'Slippery jacks stewed with onion'],
    time: 35, serves: 3,
    species: ['Suillus luteus', 'Suillus granulatus', 'Suillus grevillei', 'Suillus bovinus', 'Suillus variegatus', 'Suillus viscidus'],
    ingredients: [
      ['600 g młodych maślaków', '2 cebule', '2 łyżki masła', '100 ml śmietany 18% (opcjonalnie)', 'koperek', 'sól, pieprz'],
      ['600 g young slippery jacks', '2 onions', '2 tbsp butter', '100 ml sour cream (optional)', 'dill', 'salt, pepper'],
    ],
    steps: [
      ['Zdejmij z kapeluszy śliską skórkę – najłatwiej nożykiem od brzegu, na sucho.', 'Grzyby pokrój i gotuj 5 minut w osolonej wodzie, odcedź (pozbędziesz się śluzu).', 'Na maśle zeszklij cebulę pokrojoną w półplasterki.', 'Dodaj grzyby i duś pod przykryciem 15 minut, mieszając od czasu do czasu.', 'Odkryj, odparuj nadmiar płynu, dopraw solą i pieprzem; jeśli chcesz, dodaj śmietanę.', 'Posyp koperkiem. Podawaj z młodymi ziemniakami.'],
      ['Peel the slimy skin off the caps – easiest with a small knife from the edge, while dry.', 'Slice the mushrooms and boil for 5 minutes in salted water, then drain (this removes the slime).', 'Soften the onions, sliced into half-rings, in butter.', 'Add the mushrooms and stew covered for 15 minutes, stirring now and then.', 'Uncover, reduce the excess liquid, season with salt and pepper; add the cream if you like.', 'Sprinkle with dill. Serve with new potatoes.'],
    ],
    tip: ['Zbieraj tylko młode maślaki z jędrnymi rurkami – stare szybko się psują.', 'Pick only young slippery jacks with firm tubes – old ones spoil quickly.'],
  },
  {
    id: 'pieczarki',
    title: ['Pieczarki faszerowane', 'Stuffed mushrooms'],
    time: 40, serves: 4,
    species: ['Agaricus bisporus', 'Agaricus campestris', 'Agaricus arvensis', 'Agaricus augustus'],
    ingredients: [
      ['12 dużych pieczarek', '1 cebula', '1 ząbek czosnku', '100 g żółtego sera', '2 łyżki bułki tartej', '1 łyżka masła', 'natka pietruszki', 'sól, pieprz'],
      ['12 large mushrooms', '1 onion', '1 garlic clove', '100 g hard cheese', '2 tbsp breadcrumbs', '1 tbsp butter', 'parsley', 'salt, pepper'],
    ],
    steps: [
      ['Wykręć trzony z kapeluszy i drobno je posiekaj.', 'Na maśle zeszklij posiekaną cebulę i czosnek, dodaj trzony i smaż 5 minut.', 'Zdejmij z ognia, dodaj bułkę tartą, połowę sera i natkę, dopraw solą i pieprzem.', 'Nałóż farsz do kapeluszy i posyp resztą sera.', 'Piecz w 190°C przez 20 minut, aż ser się zrumieni.', 'Podawaj na ciepło jako przystawkę lub z sałatą.'],
      ['Twist the stems out of the caps and chop them finely.', 'Soften the chopped onion and garlic in butter, add the stems and fry for 5 minutes.', 'Take off the heat, add the breadcrumbs, half the cheese and the parsley, season with salt and pepper.', 'Fill the caps and sprinkle with the rest of the cheese.', 'Bake at 190°C for 20 minutes until the cheese is golden.', 'Serve warm as a starter or with salad.'],
    ],
    tip: ['Dzikie pieczarki zbieraj tylko z różowymi lub brązowymi blaszkami i bez pochwy u nasady – młode muchomory mają blaszki białe.', 'Pick wild field mushrooms only with pink or brown gills and no sac at the base – young death caps have white gills.'],
  },
  {
    id: 'makaron-kurki',
    title: ['Makaron z kurkami i boczkiem', 'Pasta with chanterelles and bacon'],
    time: 25, serves: 3,
    species: ['Cantharellus cibarius', 'Cantharellus amethysteus', 'Cantharellus pallens', 'Craterellus tubaeformis'],
    ingredients: [
      ['300 g makaronu tagliatelle', '300 g kurek', '100 g boczku', '1 szalotka', '1 ząbek czosnku', '150 ml śmietany 30%', '30 g parmezanu', 'tymianek, sól, pieprz'],
      ['300 g tagliatelle', '300 g chanterelles', '100 g bacon', '1 shallot', '1 garlic clove', '150 ml double cream', '30 g parmesan', 'thyme, salt, pepper'],
    ],
    steps: [
      ['Kurki oczyść pędzelkiem; większe przekrój.', 'Ugotuj makaron al dente w osolonej wodzie, zachowaj szklankę wody z gotowania.', 'Na suchej patelni wytop pokrojony boczek, dodaj szalotkę i czosnek.', 'Dodaj kurki i smaż na dużym ogniu 8–10 minut, aż odparuje woda.', 'Wlej śmietanę, dodaj tymianek, gotuj 2 minuty; w razie potrzeby rozrzedź wodą z makaronu.', 'Wymieszaj z makaronem i parmezanem, dopraw pieprzem i podawaj od razu.'],
      ['Clean the chanterelles with a brush; halve larger ones.', 'Cook the pasta al dente in salted water and keep a cup of the cooking water.', 'Render the diced bacon in a dry pan, add the shallot and garlic.', 'Add the chanterelles and fry over high heat for 8–10 minutes until the liquid has evaporated.', 'Pour in the cream, add the thyme and simmer for 2 minutes; thin with pasta water if needed.', 'Toss with the pasta and parmesan, season with pepper and serve at once.'],
    ],
    tip: ['Kurki nie lubią moczenia – nasiąkają wodą i tracą chrupkość.', 'Chanterelles dislike soaking – they absorb water and lose their bite.'],
  },
  {
    id: 'opienki',
    title: ['Opieńki marynowane', 'Pickled honey fungus'],
    time: 60, serves: 6,
    species: ['Armillaria mellea', 'Armillaria ostoyae', 'Armillaria gallica'],
    ingredients: [
      ['1 kg młodych kapeluszy opieniek', 'Zalewa: 500 ml wody, 200 ml octu 10%', '1 łyżka cukru, 1 łyżka soli', '1 cebula', '2 liście laurowe, 5 ziaren ziela angielskiego, 10 ziaren pieprzu', '1 łyżeczka gorczycy'],
      ['1 kg young honey fungus caps', 'Brine: 500 ml water, 200 ml 10% vinegar', '1 tbsp sugar, 1 tbsp salt', '1 onion', '2 bay leaves, 5 allspice berries, 10 peppercorns', '1 tsp mustard seeds'],
    ],
    steps: [
      ['Używaj tylko kapeluszy młodych opieniek; twarde trzony wyrzuć.', 'Gotuj grzyby 5 minut, odlej wodę. Zalej świeżą, osoloną wodą i gotuj kolejne 20 minut – opieńki zawsze gotuj co najmniej 20 minut łącznie.', 'Odcedź i przełóż do wyparzonych słoików razem z plasterkami cebuli i przyprawami.', 'Zagotuj wodę z octem, cukrem i solą.', 'Zalej grzyby gorącą zalewą, zakręć słoiki i pasteryzuj 15 minut.', 'Odstaw na co najmniej tydzień przed jedzeniem.'],
      ['Use only the caps of young honey fungus; discard the tough stems.', 'Boil the mushrooms for 5 minutes and discard the water. Cover with fresh salted water and boil for another 20 minutes – always cook honey fungus for at least 20 minutes in total.', 'Drain and pack into sterilised jars with the onion slices and spices.', 'Bring the water, vinegar, sugar and salt to the boil.', 'Pour the hot brine over the mushrooms, close the jars and pasteurise for 15 minutes.', 'Leave for at least a week before eating.'],
    ],
    tip: ['Surowe lub niedogotowane opieńki wywołują silne zatrucia pokarmowe. Nie myl ich z trującą maślanką wiązkową (zielonożółte blaszki, gorzki smak).', 'Raw or undercooked honey fungus causes severe food poisoning. Do not confuse it with the poisonous Sulphur Tuft (green-yellow gills, bitter taste).'],
  },
  {
    id: 'suszenie',
    title: ['Jak suszyć grzyby', 'How to dry mushrooms'],
    time: 20, serves: 1,
    species: ['Boletus edulis', 'Boletus pinophilus', 'Boletus reticulatus', 'Imleria badia', 'Leccinum scabrum', 'Craterellus cornucopioides', 'Marasmius oreades'],
    ingredients: [
      ['Świeże, młode, zdrowe grzyby (bez robaków)', 'nóż i deska', 'suszarka do grzybów, piekarnik z termoobiegiem albo nici i igła', 'szczelne słoiki do przechowywania'],
      ['Fresh, young, healthy mushrooms (no maggots)', 'knife and board', 'a food dehydrator, a fan oven, or needle and thread', 'airtight jars for storage'],
    ],
    steps: [
      ['Grzyby oczyść na sucho nożykiem i pędzelkiem – nie myj ich, bo nasiąkną wodą.', 'Pokrój w plasterki grubości 3–5 mm. Małe kurki trąbkowe i twardzioszki susz w całości.', 'Suszarka: 45–50°C przez 6–10 godzin. Piekarnik: 50°C z uchylonymi drzwiczkami (np. zatknięta łyżka drewniana), 6–8 godzin.', 'Tradycyjnie: nawlecz plasterki na nitkę i zawieś w przewiewnym, ciepłym miejscu na kilka dni.', 'Grzyby są gotowe, gdy łamią się z trzaskiem, a nie wyginają.', 'Ostudź i przechowuj w szczelnych słoikach w ciemnym, suchym miejscu do roku.'],
      ['Clean the mushrooms dry with a knife and brush – do not wash them, or they will soak up water.', 'Slice them 3–5 mm thick. Dry small trumpets and fairy ring mushrooms whole.', 'Dehydrator: 45–50°C for 6–10 hours. Oven: 50°C with the door ajar (e.g. propped with a wooden spoon), 6–8 hours.', 'Traditionally: thread the slices on a string and hang them in a warm, airy place for a few days.', 'They are ready when they snap rather than bend.', 'Cool and store in airtight jars in a dark, dry place for up to a year.'],
    ],
    tip: ['Najlepiej suszą się borowiki, podgrzybki i lejkowce. Nie susz grzybów blaszkowych, których nie jesteś pewien – po wysuszeniu trudno je rozpoznać.', 'Boletes, bay boletes and horn of plenty dry best. Do not dry gilled mushrooms you are unsure of – once dried they are hard to identify.'],
  },
  {
    id: 'shiitake',
    title: ['Makaron smażony z shiitake i boczniakami', 'Stir-fried noodles with shiitake and oyster mushrooms'],
    time: 25, serves: 2,
    species: ['Lentinula edodes', 'Pleurotus ostreatus', 'Pleurotus pulmonarius'],
    ingredients: [
      ['200 g makaronu pszennego lub ryżowego', '150 g shiitake', '150 g boczniaków', '1 papryka', '2 dymki', '2 ząbki czosnku', '1 łyżka startego imbiru', '3 łyżki sosu sojowego', '1 łyżka oleju sezamowego', '2 łyżki oleju'],
      ['200 g wheat or rice noodles', '150 g shiitake', '150 g oyster mushrooms', '1 pepper', '2 spring onions', '2 garlic cloves', '1 tbsp grated ginger', '3 tbsp soy sauce', '1 tbsp sesame oil', '2 tbsp oil'],
    ],
    steps: [
      ['Ugotuj makaron według przepisu na opakowaniu, odcedź i przelej zimną wodą.', 'Shiitake odetnij twarde trzony (nadają się do bulionu), kapelusze pokrój w paski; boczniaki porwij.', 'Na mocno rozgrzanym oleju smaż grzyby 6–8 minut, aż się zrumienią i będą całkiem miękkie.', 'Dodaj czosnek, imbir i pokrojoną paprykę, smaż 2 minuty.', 'Dodaj makaron i sos sojowy, mieszaj na ogniu 2 minuty.', 'Skrop olejem sezamowym, posyp dymką i podawaj.'],
      ['Cook the noodles according to the packet, drain and rinse with cold water.', 'Cut the tough stems off the shiitake (use them for stock) and slice the caps; tear the oyster mushrooms.', 'Fry the mushrooms in very hot oil for 6–8 minutes until browned and completely soft.', 'Add the garlic, ginger and sliced pepper and fry for 2 minutes.', 'Add the noodles and soy sauce and toss over the heat for 2 minutes.', 'Drizzle with sesame oil, sprinkle with spring onion and serve.'],
    ],
    tip: ['Shiitake zawsze dokładnie usmaż – surowe mogą wywołać swędzącą wysypkę.', 'Always cook shiitake thoroughly – raw ones can cause an itchy rash.'],
  },
  {
    id: 'purchawki',
    title: ['Purchawki smażone jak kotlety', 'Puffball steaks'],
    time: 20, serves: 2,
    species: ['Calvatia gigantea', 'Lycoperdon perlatum', 'Lycoperdon pyriforme', 'Bovista plumbea'],
    ingredients: [
      ['1 młoda czasznica olbrzymia albo 300 g młodych purchawek', '1 jajko', '4 łyżki bułki tartej', '2 łyżki masła', 'sól, pieprz, majeranek'],
      ['1 young giant puffball or 300 g young puffballs', '1 egg', '4 tbsp breadcrumbs', '2 tbsp butter', 'salt, pepper, marjoram'],
    ],
    steps: [
      ['Każdy owocnik przekrój wzdłuż na pół. Wnętrze musi być jednolicie białe i jędrne jak ser – bez zarysu kapelusza, blaszek i trzonu (to byłby młody muchomor) i bez żółknięcia.', 'Obierz skórkę i pokrój w plastry grubości 1 cm; małe purchawki przekrój na pół.', 'Dopraw solą, pieprzem i majerankiem.', 'Obtocz w roztrzepanym jajku i bułce tartej.', 'Smaż na maśle po 3 minuty z każdej strony na złoty kolor.', 'Podawaj od razu, z sałatką lub jako dodatek do zupy.'],
      ['Cut every fruitbody in half lengthwise. The inside must be uniformly white and firm like cheese – with no outline of a cap, gills and stem (that would be a young Amanita) and no yellowing.', 'Peel off the skin and cut into 1 cm slices; halve small puffballs.', 'Season with salt, pepper and marjoram.', 'Coat in beaten egg and breadcrumbs.', 'Fry in butter for 3 minutes on each side until golden.', 'Serve at once, with salad or alongside soup.'],
    ],
    tip: ['Tęgoskóry (twarda, ciemna skórka i czarne wnętrze) są trujące – nie myl ich z purchawkami.', 'Earthballs (thick, dark skin and black interior) are poisonous – do not confuse them with puffballs.'],
  },
  {
    id: 'zolciak',
    title: ['Żółciak w panierce („leśny kurczak”)', 'Breaded chicken of the woods'],
    time: 35, serves: 3,
    species: ['Laetiporus sulphureus'],
    ingredients: [
      ['500 g młodych, miękkich brzegów żółciaka siarkowego', '2 jajka', '4 łyżki mąki', '6 łyżek bułki tartej', 'olej do smażenia', 'sól, pieprz, czosnek granulowany'],
      ['500 g young, soft edges of chicken of the woods', '2 eggs', '4 tbsp flour', '6 tbsp breadcrumbs', 'oil for frying', 'salt, pepper, garlic powder'],
    ],
    steps: [
      ['Używaj tylko młodych, soczystych brzegów owocnika, z których po naciśnięciu wypływa żółtawy sok. Twarde i kredowe części wyrzuć.', 'Pokrój w plastry grubości 1 cm i gotuj 15 minut w osolonej wodzie, odcedź i osusz.', 'Dopraw solą, pieprzem i czosnkiem.', 'Obtaczaj w mące, jajku i bułce tartej.', 'Smaż na rozgrzanym oleju po 4 minuty z każdej strony.', 'Podawaj z ziemniakami i surówką.'],
      ['Use only the young, juicy edges of the fruitbody that ooze yellowish juice when pressed. Discard tough, chalky parts.', 'Cut into 1 cm slices and boil for 15 minutes in salted water, drain and dry.', 'Season with salt, pepper and garlic.', 'Coat in flour, egg and breadcrumbs.', 'Fry in hot oil for 4 minutes on each side.', 'Serve with potatoes and salad.'],
    ],
    tip: ['Nie zbieraj żółciaka z cisów, robinii ani drzew iglastych. Pierwszy raz zjedz małą porcję – u części osób wywołuje dolegliwości żołądkowe.', 'Do not pick it from yew, black locust or conifers. Eat a small portion the first time – it upsets some people\'s stomachs.'],
  },
  {
    id: 'kotlety',
    title: ['Kotlety z grzybów', 'Mushroom patties'],
    time: 40, serves: 4,
    species: ['Boletus edulis', 'Imleria badia', 'Leccinum scabrum', 'Leccinum versipelle', 'Pleurotus ostreatus', 'Agaricus bisporus'],
    ingredients: [
      ['600 g grzybów', '1 cebula', '2 ząbki czosnku', '2 jajka', '4 łyżki bułki tartej + do obtoczenia', '1 czerstwa bułka namoczona w mleku', 'natka pietruszki', 'olej, sól, pieprz'],
      ['600 g mushrooms', '1 onion', '2 garlic cloves', '2 eggs', '4 tbsp breadcrumbs + more for coating', '1 stale bread roll soaked in milk', 'parsley', 'oil, salt, pepper'],
    ],
    steps: [
      ['Grzyby oczyść i drobno posiekaj.', 'Na oleju zeszklij cebulę i czosnek, dodaj grzyby i smaż 15 minut, aż odparuje cała woda. Ostudź.', 'Bułkę odciśnij i wymieszaj z grzybami, jajkami, bułką tartą i natką; dopraw.', 'Uformuj płaskie kotlety i obtocz je w bułce tartej.', 'Smaż na średnim ogniu po 4 minuty z każdej strony.', 'Podawaj z sosem czosnkowym, ziemniakami lub w bułce jak burgera.'],
      ['Clean the mushrooms and chop finely.', 'Soften the onion and garlic in oil, add the mushrooms and fry for 15 minutes until all the liquid has evaporated. Cool.', 'Squeeze the bread roll and mix it with the mushrooms, eggs, breadcrumbs and parsley; season.', 'Shape flat patties and coat them in breadcrumbs.', 'Fry over medium heat for 4 minutes on each side.', 'Serve with garlic sauce, potatoes, or in a bun like a burger.'],
    ],
    tip: ['Masa musi być sucha – jeśli się rozpada, dodaj łyżkę bułki tartej.', 'The mixture must be dry – if it falls apart, add a spoonful of breadcrumbs.'],
  },
];

export const RECIPE_BY_ID = new Map(RECIPES.map((r) => [r.id, r]));
export const recipesFor = (latin: string) => RECIPES.filter((r) => r.species.includes(latin));
