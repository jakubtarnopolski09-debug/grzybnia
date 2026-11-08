import { Platform } from 'react-native';
import { type Status } from '@/data/mushrooms';

// Motyw: kolory dla jasnego i ciemnego trybu, czcionki

// ===================== MOTYW: las za dnia i las nocą =====================
export type ThemeMode = 'system' | 'light' | 'dark';
export type Theme = {
  dark: boolean;
  bg: string; card: string; card2: string; ink: string; muted: string; line: string;
  forest: string; hill1: string; hill2: string; fern: string; amber: string; onAmber: string; cream: string;
  status: Record<Status, string>;
};

export const LIGHT: Theme = {
  dark: false,
  bg: '#F1EBDD', card: '#FBF8F0', card2: '#E6DECB', ink: '#1B231C', muted: '#6E6C5F', line: '#DCD2BE',
  forest: '#1F3B2D', hill1: '#2C5240', hill2: '#3F6B4A', fern: '#4F7F49', amber: '#D9922B', onAmber: '#1B231C', cream: '#F4EAD5',
  status: { e: '#3D8B57', c: '#C98E14', i: '#8B897C', t: '#D2612A', d: '#C0282E' },
};
export const DARK: Theme = {
  dark: true,
  bg: '#0D1511', card: '#15211A', card2: '#1D2C23', ink: '#EAE4D3', muted: '#8F9C8C', line: '#24352A',
  forest: '#13261B', hill1: '#1C3627', hill2: '#2A4A35', fern: '#86B779', amber: '#E8A645', onAmber: '#13190F', cream: '#F4EAD5',
  status: { e: '#5DB57A', c: '#E6B03E', i: '#A19F93', t: '#EE8550', d: '#F0525A' },
};

export const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });
export const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
export const alpha = (hex: string, a: string) => hex + a; // '#RRGGBB' + 'AA'
