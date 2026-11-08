import { Platform, StyleSheet } from 'react-native';
import { alpha, DARK, LIGHT, MONO, SERIF, type Theme } from '@/constants/palette';

// STYLE

export function makeStyles(c: Theme) {
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
export type Styles = ReturnType<typeof makeStyles>;
export const STYLES_LIGHT = makeStyles(LIGHT);
export const STYLES_DARK = makeStyles(DARK);
