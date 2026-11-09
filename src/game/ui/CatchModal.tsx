import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/app-context';
import { MushroomArt } from '@/game/art';
import { byKey, RARITY } from '@/game/data';
import { type Basket, BASKETS, catchChance, cp, fleeChance, ringCycleMs, type Spawn, type ThrowQ, throwQuality } from '@/game/logic';
import { catchSuccess, type CatchReward, markGone, markSeen, spendBasket, useGame } from '@/game/state';
import { GT } from '@/game/strings';
import { BasketIcon, RarityBadge, TypeBadge } from '@/game/ui/parts';

type Phase = 'aim' | 'fly' | 'shake' | 'caught' | 'broke' | 'fled';
const BASKET_KINDS: Basket[] = ['b1', 'b2', 'b3'];

export function CatchModal({ spawn, onClose }: { spawn: Pick<Spawn, 'id' | 'key' | 'lvl' | 'iv'> | null; onClose: () => void }) {
  return (
    <Modal visible={!!spawn} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {spawn && <CatchScene key={spawn.id} spawn={spawn} onClose={onClose} />}
    </Modal>
  );
}

function CatchScene({ spawn, onClose }: { spawn: Pick<Spawn, 'id' | 'key' | 'lvl' | 'iv'>; onClose: () => void }) {
  const { c, lang } = useApp();
  const gt = GT[lang];
  const g = useGame();
  const insets = useSafeAreaInsets();
  const s = byKey(spawn.key);
  const [basket, setBasket] = useState<Basket>('b1');
  const [phase, setPhase] = useState<Phase>('aim');
  const [quality, setQuality] = useState<ThrowQ | null>(null);
  const [reward, setReward] = useState<CatchReward | null>(null);
  const [msg, setMsg] = useState('');

  const [ring] = useState(() => new Animated.Value(1));
  const ringNow = useRef(1);
  const [sway] = useState(() => new Animated.Value(0));
  const [fly] = useState(() => new Animated.Value(0));
  const [shake] = useState(() => new Animated.Value(0));
  const [pop] = useState(() => new Animated.Value(0));

  useEffect(() => { markSeen(spawn.key); }, [spawn.key]);

  // kurczący się krąg – im rzadszy grzyb, tym szybciej
  useEffect(() => {
    const id = ring.addListener(({ value }) => { ringNow.current = value; });
    const loop = Animated.loop(Animated.timing(ring, { toValue: 0.25, duration: ringCycleMs(s.rarity), easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    const swayLoop = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 900 + s.rarity * 80, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: -1, duration: 1800 + s.rarity * 160, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 900 + s.rarity * 80, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    swayLoop.start();
    return () => { ring.removeListener(id); loop.stop(); swayLoop.stop(); };
  }, [ring, sway, s.rarity]);

  const chance = catchChance(spawn.key, spawn.lvl, basket, 'ok');
  const ringColor = chance > 0.5 ? '#5DB57A' : chance > 0.25 ? '#E6B03E' : '#F0525A';

  const throwBasket = () => {
    if (phase !== 'aim') return;
    if (!spendBasket(basket)) { setMsg(gt.noBaskets); return; }
    const q = throwQuality(ringNow.current);
    setQuality(q);
    setMsg('');
    setPhase('fly');
    fly.setValue(0);
    Animated.timing(fly, { toValue: 1, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => {
      setPhase('shake');
      const p = catchChance(spawn.key, spawn.lvl, basket, q);
      const ok = Math.random() < p;
      // jak w prawdziwym grzybobraniu: koszyk chwieje się 1–3 razy, zanim się okaże
      const shakes = ok ? 3 : 1 + Math.floor(Math.random() * 3);
      const seq: Animated.CompositeAnimation[] = [];
      for (let i = 0; i < shakes; i++) {
        seq.push(Animated.timing(shake, { toValue: 1, duration: 140, useNativeDriver: true }));
        seq.push(Animated.timing(shake, { toValue: -1, duration: 220, useNativeDriver: true }));
        seq.push(Animated.timing(shake, { toValue: 0, duration: 140, useNativeDriver: true }));
        seq.push(Animated.delay(260));
      }
      Animated.sequence(seq).start(() => {
        if (ok) {
          setReward(catchSuccess(spawn, q));
          setPhase('caught');
          pop.setValue(0);
          Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
        } else if (Math.random() < fleeChance(spawn.key)) {
          markGone(spawn.id);
          setPhase('fled');
          setTimeout(onClose, 1600);
        } else {
          setPhase('broke');
          setTimeout(() => { setPhase('aim'); setQuality(null); }, 1000);
        }
      });
    });
  };

  const showShroom = phase === 'aim' || phase === 'fly' || phase === 'broke';
  const qText = quality === 'nice' ? gt.nice : quality === 'great' ? gt.great : quality === 'perfect' ? gt.perfect : '';
  const center = phase === 'caught' ? gt.caught : phase === 'broke' ? gt.broke : phase === 'fled' ? gt.fled : qText;

  return (
    <View style={{ flex: 1, backgroundColor: c.forest }}>
      <StatusBar barStyle="light-content" />
      {/* tło: las i ściółka */}
      <View style={{ position: 'absolute', left: -60, right: -60, bottom: 0, height: '48%', backgroundColor: c.hill1, borderTopLeftRadius: 400, borderTopRightRadius: 400 }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', backgroundColor: c.hill2 }} />

      {/* nagłówek */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ color: c.cream, fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>CP {cp(spawn.key, spawn.lvl, spawn.iv)}</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>{s[lang]}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}><TypeBadge type={s.type} /><RarityBadge r={s.rarity} /></View>
        </View>
        <Pressable onPress={onClose} hitSlop={12} style={{ padding: 6 }}>
          <Ionicons name="close" size={28} color={c.cream} />
        </Pressable>
      </View>

      {/* grzyb + krąg */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 240, height: 240, alignItems: 'center', justifyContent: 'center' }}>
          {phase === 'aim' && (
            <Animated.View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: ringColor, transform: [{ scale: ring }] }} />
          )}
          {showShroom && (
            <Animated.View style={{ transform: [{ rotate: sway.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] }) }] }}>
              <MushroomArt art={s.art} stage={s.stage} size={220} glow={s.rarity >= 4 ? RARITY[s.rarity].color : undefined} />
            </Animated.View>
          )}
          {(phase === 'shake' || phase === 'caught' || phase === 'fled') && (
            <Animated.View style={{ transform: [{ rotate: shake.interpolate({ inputRange: [-1, 1], outputRange: ['-18deg', '18deg'] }) }, { scale: phase === 'caught' ? pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) : 1 }], opacity: phase === 'fled' ? 0.4 : 1 }}>
              <BasketIcon kind={basket} size={120} />
            </Animated.View>
          )}
        </View>
        {!!center && <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 8, textShadowColor: '#0008', textShadowRadius: 6 }}>{center}</Text>}
        {phase === 'caught' && reward && (
          <View style={{ alignItems: 'center', gap: 4, marginTop: 6 }}>
            {reward.isNew && <Text style={{ color: '#F7D774', fontWeight: '800', fontSize: 15 }}>{gt.newDex}</Text>}
            <Text style={{ color: c.cream, fontSize: 14 }}>{gt.reward(reward.xp, reward.seeds, reward.spores)}</Text>
          </View>
        )}
      </View>

      {/* koszyk do rzucenia + wybór rodzaju */}
      <View style={{ paddingBottom: Math.max(insets.bottom, 16) + 8, alignItems: 'center', gap: 12 }}>
        {phase === 'caught' ? (
          <Pressable onPress={onClose} style={{ backgroundColor: c.amber, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 40 }}>
            <Text style={{ color: c.onAmber, fontWeight: '800', fontSize: 16 }}>OK</Text>
          </Pressable>
        ) : (
          <>
            <Text style={{ color: c.cream, fontSize: 13 }}>{msg || gt.throwHint}</Text>
            <Pressable onPress={throwBasket} disabled={phase !== 'aim'} hitSlop={20}>
              <Animated.View style={{
                opacity: phase === 'aim' ? 1 : phase === 'fly' ? fly.interpolate({ inputRange: [0, 0.9, 1], outputRange: [1, 1, 0] }) : 0,
                transform: [
                  { translateY: fly.interpolate({ inputRange: [0, 1], outputRange: [0, -300] }) },
                  { scale: fly.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] }) },
                  { rotate: fly.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] }) },
                ],
              }}>
                <BasketIcon kind={basket} size={78} />
              </Animated.View>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {BASKET_KINDS.map((b) => (
                <Pressable key={b} onPress={() => phase === 'aim' && setBasket(b)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: basket === b ? c.cream : '#00000040', opacity: g[b] > 0 ? 1 : 0.45 }}>
                  <BasketIcon kind={b} size={22} />
                  <Text style={{ color: basket === b ? '#1B231C' : '#fff', fontWeight: '700' }}>{g[b]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={{ color: c.cream, fontSize: 12, opacity: 0.8 }}>{BASKETS[basket][lang]} · {gt.chance} ~{Math.round(chance * 100)}%</Text>
          </>
        )}
      </View>
    </View>
  );
}
