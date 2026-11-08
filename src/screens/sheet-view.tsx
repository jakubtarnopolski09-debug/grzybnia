import { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar } from 'react-native';
import { type Sheet, useApp } from '@/context/app-context';
import { SpeciesSheet } from '@/screens/species-sheet';
import { RecipeSheet } from '@/screens/recipes';
import { PhotoSheet } from '@/screens/album';
import { ForestListSheet, ForestSheet } from '@/screens/forest-sheets';

// ARKUSZE (karta grzyba, przepis, zdjęcie)

export function SheetView({ sheet }: { sheet: Sheet }) {
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
export const sheetKey = (sh: Sheet) =>
  sh.kind === 'species' ? sh.m.latin : sh.kind === 'recipe' ? sh.r.id : sh.kind === 'photo' ? sh.id : sh.kind === 'forest' ? sh.f.id : 'forests';
