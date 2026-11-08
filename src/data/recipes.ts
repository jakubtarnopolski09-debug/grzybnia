
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
];

export const RECIPE_BY_ID = new Map(RECIPES.map((r) => [r.id, r]));
export const recipesFor = (latin: string) => RECIPES.filter((r) => r.species.includes(latin));
