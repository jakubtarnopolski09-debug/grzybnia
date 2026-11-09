import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import Svg, { Ellipse, Line, Path } from 'react-native-svg';
import { useApp } from '@/context/app-context';
import { type GType, RARITY, type Rarity, TYPES } from '@/game/data';
import { BASKETS, type Basket } from '@/game/logic';

// Drobne elementy interfejsu gry.

export function BasketIcon({ kind = 'b1', size = 28 }: { kind?: Basket; size?: number }) {
  const b = BASKETS[kind];
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M9,17 Q20,-2 31,17" stroke={b.rim} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M5,17 L35,17 L31,35 Q20,38 9,35 Z" fill={b.color} />
      <Ellipse cx={20} cy={17} rx={15} ry={3.2} fill={b.rim} />
      {[11, 16, 21, 26, 30].map((x) => <Line key={x} x1={x} y1={20} x2={x - 0.8} y2={34} stroke={b.rim} strokeWidth={1.1} opacity={0.6} />)}
      <Line x1={7} y1={25} x2={33} y2={25} stroke={b.rim} strokeWidth={1.1} opacity={0.6} />
      <Line x1={8} y1={30} x2={32} y2={30} stroke={b.rim} strokeWidth={1.1} opacity={0.6} />
    </Svg>
  );
}

export function TypeBadge({ type, small }: { type: GType; small?: boolean }) {
  const { lang } = useApp();
  const t = TYPES[type];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: t.color, borderRadius: 99, paddingHorizontal: small ? 7 : 10, paddingVertical: small ? 2 : 4 }}>
      <Ionicons name={t.icon as any} size={small ? 10 : 12} color="#fff" />
      <Text style={{ color: '#fff', fontSize: small ? 10.5 : 12, fontWeight: '700' }}>{t[lang]}</Text>
    </View>
  );
}

export function RarityBadge({ r, small }: { r: Rarity; small?: boolean }) {
  const { lang } = useApp();
  const x = RARITY[r];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderWidth: 1.2, borderColor: x.color, borderRadius: 99, paddingHorizontal: small ? 6 : 9, paddingVertical: small ? 1 : 3 }}>
      {Array.from({ length: r }, (_, i) => <Ionicons key={i} name="star" size={small ? 8 : 10} color={x.color} />)}
      {!small && <Text style={{ color: x.color, fontSize: 12, fontWeight: '700', marginLeft: 3 }}>{x[lang]}</Text>}
    </View>
  );
}

export function Bar({ value, max, color, height = 8, track }: { value: number; max: number; color: string; height?: number; track?: string }) {
  const { c } = useApp();
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track ?? c.card2, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value / Math.max(1, max))) * 100}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}
