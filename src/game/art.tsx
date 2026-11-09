import { type ReactElement, useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { type Art } from '@/game/data';

// Grafiki grzybów rysowane z parametrów (kształt, kolory, blaszki/rurki, kropki, pierścień, pochwa…).
// Pole widzenia 100×100, ziemia na wysokości ~90. Stadium ewolucji zmienia skalę.

type Ctx = { col: (c?: string) => string; uid: string; sil: boolean; capFill: string };

const SPOTS: [number, number, number][] = [
  [-0.28, 0.55, 1.1], [0.05, 0.78, 1], [0.3, 0.52, 1.2], [-0.06, 0.42, 0.9], [-0.4, 0.26, 0.8],
  [0.4, 0.24, 0.9], [0.16, 0.3, 0.7], [-0.18, 0.2, 0.8], [0.22, 0.66, 0.7], [-0.36, 0.72, 0.6],
];

function agaric(a: Art, cx: number, gy: number, k: number, c: Ctx, key: string): ReactElement[] {
  const els: ReactElement[] = [];
  const shape = a.shape ?? 'convex';
  const st = a.stemShape ?? 'stout';
  const stemW = (st === 'stout' ? 15 : st === 'slim' ? 6.5 : 8.5) * k;
  const stemH = (st === 'tall' ? 44 : st === 'slim' ? 30 : 26) * k * (shape === 'funnel' ? 0.85 : 1);
  const topY = gy - stemH;
  const bw = stemW * (st === 'stout' ? 1.3 : 1.12);
  const stemCol = c.col(a.stem);

  // trzon
  els.push(<Path key={key + 'st'} d={`M${cx - stemW / 2},${topY} L${cx - bw / 2},${gy - 2} Q${cx},${gy + 2} ${cx + bw / 2},${gy - 2} L${cx + stemW / 2},${topY} Z`} fill={stemCol} />);
  els.push(<Path key={key + 'sts'} d={`M${cx + stemW * 0.1},${topY} L${cx + bw * 0.12},${gy - 1} Q${cx + bw * 0.35},${gy} ${cx + bw / 2},${gy - 2} L${cx + stemW / 2},${topY} Z`} fill="#000" opacity={c.sil ? 0 : 0.1} />);
  if (a.net && !c.sil) {
    for (let i = 0; i < 4; i++) {
      const y = topY + 3 * k + i * 4 * k;
      els.push(<Path key={key + 'n' + i} d={`M${cx - stemW * 0.42},${y} l${stemW * 0.28},${3 * k} l${stemW * 0.28},${-3 * k} l${stemW * 0.28},${3 * k}`} stroke={c.col(a.cap2)} strokeWidth={0.5} fill="none" opacity={0.25} />);
    }
  }
  if (a.scabers && !c.sil) {
    for (let i = 0; i < 9; i++) {
      const y = topY + 4 * k + (i * (stemH - 8 * k)) / 9;
      const x = cx + ((i % 3) - 1) * stemW * 0.28;
      els.push(<Circle key={key + 'sc' + i} cx={x} cy={y} r={0.9 * k} fill={a.scabers} />);
    }
  }
  if (a.cortina && !c.sil) {
    els.push(<Path key={key + 'co'} d={`M${cx - stemW / 2},${topY + 7 * k} q${stemW / 2},${3 * k} ${stemW},0`} stroke="#9A4A1A" strokeWidth={1.2} fill="none" opacity={0.7} />);
  }
  if (a.bulb) {
    els.push(<Ellipse key={key + 'bu'} cx={cx} cy={gy - 3 * k} rx={bw * 0.72} ry={5 * k} fill={stemCol} />);
    if (a.spots && !c.sil) {
      els.push(<Path key={key + 'bur'} d={`M${cx - bw * 0.6},${gy - 5 * k} q${bw * 0.6},${3 * k} ${bw * 1.2},0`} stroke={a.spots} strokeWidth={1.4} fill="none" strokeDasharray="1.6 1.4" />);
    }
  }
  if (a.volva) {
    els.push(<Path key={key + 'vo'} d={`M${cx - bw * 0.95},${gy - 9 * k} Q${cx - bw * 1.05},${gy} ${cx},${gy} Q${cx + bw * 1.05},${gy} ${cx + bw * 0.95},${gy - 9 * k} Q${cx + bw * 0.4},${gy - 5 * k} ${cx},${gy - 6 * k} Q${cx - bw * 0.4},${gy - 5 * k} ${cx - bw * 0.95},${gy - 9 * k} Z`} fill={c.col(a.volva)} stroke={c.sil ? 'none' : '#00000022'} strokeWidth={0.8} />);
  }
  if (a.ring) {
    const rc = typeof a.ring === 'string' ? a.ring : a.stem;
    const ry = topY + 7 * k;
    els.push(<Path key={key + 'ri'} d={`M${cx - stemW * 0.95},${ry} Q${cx},${ry - 2.5 * k} ${cx + stemW * 0.95},${ry} L${cx + stemW * 0.8},${ry + 4 * k} Q${cx},${ry + 6 * k} ${cx - stemW * 0.8},${ry + 4 * k} Z`} fill={c.col(rc)} stroke={c.sil ? 'none' : '#00000026'} strokeWidth={0.6} />);
  }

  // kapelusz
  const y0 = topY + 2 * k;
  if (shape === 'funnel') {
    const W = 50 * k;
    const yTop = topY - W * 0.3;
    const x0 = cx - W / 2;
    const x1 = cx + W / 2;
    els.push(<Path key={key + 'fb'} d={`M${x0},${yTop} Q${cx - W * 0.2},${yTop + W * 0.18} ${cx - stemW / 2},${topY + 3 * k} L${cx + stemW / 2},${topY + 3 * k} Q${cx + W * 0.2},${yTop + W * 0.18} ${x1},${yTop} Z`} fill={c.col(a.under)} />);
    if (!c.sil) {
      for (let i = 0; i < 7; i++) {
        const fx = -0.42 + i * 0.14;
        els.push(<Line key={key + 'fg' + i} x1={cx + fx * W} y1={yTop + 1.5 * k} x2={cx + fx * stemW * 0.8} y2={topY + 2 * k} stroke={a.cap2} strokeWidth={0.6} opacity={0.5} />);
      }
    }
    els.push(<Ellipse key={key + 'ft'} cx={cx} cy={yTop} rx={W / 2} ry={W * 0.13} fill={c.capFill} />);
    els.push(<Ellipse key={key + 'fi'} cx={cx} cy={yTop + 0.6 * k} rx={W * 0.3} ry={W * 0.07} fill={c.col(a.cap2)} opacity={c.sil ? 1 : 0.55} />);
    if (a.zones && !c.sil) {
      els.push(<Ellipse key={key + 'z1'} cx={cx} cy={yTop} rx={W * 0.4} ry={W * 0.1} stroke={a.zones} strokeWidth={1} fill="none" opacity={0.7} />);
      els.push(<Ellipse key={key + 'z2'} cx={cx} cy={yTop} rx={W * 0.22} ry={W * 0.055} stroke={a.zones} strokeWidth={0.9} fill="none" opacity={0.7} />);
    }
    return els;
  }

  let W = 46 * k;
  let H = W * 0.42;
  if (shape === 'flat') { W *= 1.18; H = W * 0.26; }
  if (shape === 'bell') { W *= 0.72; H = W * 0.72; }
  if (shape === 'umbrella') { W *= 1.4; H = W * 0.2; }
  if (shape === 'shaggy') { W *= 0.58; H = W * 1.55; }
  const x0 = cx - W / 2;
  const x1 = cx + W / 2;

  // spód (rurki / blaszki / kolce) wystający spod brzegu
  if (shape !== 'shaggy') {
    els.push(<Ellipse key={key + 'un'} cx={cx} cy={y0 + H * 0.04} rx={W / 2 * 0.95} ry={Math.max(2.2 * k, H * 0.16)} fill={c.col(a.under)} />);
    if (!c.sil) {
      if (a.spines) {
        for (let i = 0; i < 9; i++) {
          const x = x0 + W * 0.1 + (i * W * 0.8) / 8;
          els.push(<Path key={key + 'sp' + i} d={`M${x - 1.2 * k},${y0 + 1 * k} L${x},${y0 + 4.5 * k} L${x + 1.2 * k},${y0 + 1 * k} Z`} fill={a.under} />);
        }
      } else if (a.pores) {
        for (let i = 0; i < 8; i++) {
          const x = x0 + W * 0.14 + (i * W * 0.72) / 7;
          els.push(<Circle key={key + 'po' + i} cx={x} cy={y0 + H * 0.06 + ((i % 2) - 0.5) * 0.8 * k} r={0.55 * k} fill="#00000030" />);
        }
      } else {
        for (let i = 0; i < 9; i++) {
          const fx = -0.44 + i * 0.11;
          els.push(<Line key={key + 'gi' + i} x1={cx + fx * W} y1={y0 + H * 0.04} x2={cx + fx * stemW * 0.5} y2={y0 + H * 0.12} stroke="#00000033" strokeWidth={0.5} />);
        }
      }
    }
  }

  let d: string;
  if (shape === 'umbrella') {
    d = `M${x0},${y0} Q${cx - W * 0.25},${y0 - H * 1.3} ${cx - W * 0.07},${y0 - H * 1.45} Q${cx},${y0 - H * 2} ${cx + W * 0.07},${y0 - H * 1.45} Q${cx + W * 0.25},${y0 - H * 1.3} ${x1},${y0} Q${cx},${y0 - H * 0.2} ${x0},${y0} Z`;
  } else if (shape === 'shaggy') {
    d = `M${x0},${y0} C${x0},${y0 - H * 0.9} ${cx - W * 0.36},${y0 - H} ${cx},${y0 - H} C${cx + W * 0.36},${y0 - H} ${x1},${y0 - H * 0.9} ${x1},${y0} Q${cx},${y0 + 2 * k} ${x0},${y0} Z`;
  } else {
    d = `M${x0},${y0} C${x0},${y0 - H * 1.3} ${x1},${y0 - H * 1.3} ${x1},${y0} Q${cx},${y0 - H * 0.08} ${x0},${y0} Z`;
  }
  els.push(<Path key={key + 'cap'} d={d} fill={c.capFill} />);

  if (!c.sil) {
    if (a.spots) {
      for (let i = 0; i < SPOTS.length; i++) {
        const [fx, fy, fr] = SPOTS[i];
        els.push(<Circle key={key + 'dot' + i} cx={cx + fx * W * 0.92} cy={y0 - fy * H * 0.95} r={1.9 * k * fr} fill={a.spots} />);
      }
    }
    if (a.scales) {
      const n = shape === 'shaggy' ? 14 : SPOTS.length;
      for (let i = 0; i < n; i++) {
        const [fx, fy] = shape === 'shaggy' ? [((i % 3) - 1) * 0.28, 0.12 + Math.floor(i / 3) * 0.17] : SPOTS[i];
        const x = cx + fx * W * 0.9;
        const y = y0 - fy * H * 0.95;
        els.push(<Path key={key + 'sca' + i} d={`M${x - 1.6 * k},${y - 0.6 * k} L${x},${y + 1.4 * k} L${x + 1.6 * k},${y - 0.6 * k}`} stroke={a.scales} strokeWidth={0.9 * k} fill="none" strokeLinecap="round" />);
      }
      if (shape === 'umbrella') els.push(<Ellipse key={key + 'umb'} cx={cx} cy={y0 - H * 1.55} rx={W * 0.07} ry={H * 0.3} fill={a.scales} />);
    }
    els.push(<Ellipse key={key + 'hl'} cx={cx - W * 0.18} cy={y0 - H * 0.72} rx={W * 0.15} ry={Math.max(1.2, H * 0.16)} fill="#fff" opacity={0.22} />);
  }
  return els;
}

function body(a: Art, k: number, c: Ctx): ReactElement[] {
  const gy = 90;
  const els: ReactElement[] = [];

  switch (a.kind) {
    case 'cap':
      return agaric(a, 50, gy, k, c, 'a');

    case 'cluster': {
      const n = a.n ?? 3;
      const layout: [number, number, number][] = n <= 2
        ? [[38, 0.8, -1], [60, 0.95, 1]]
        : n === 3 ? [[30, 0.72, -2], [68, 0.78, 2], [49, 0.95, 0]]
        : n === 4 ? [[24, 0.66, -2], [74, 0.7, 2], [38, 0.85, -1], [60, 0.92, 1]]
        : [[18, 0.58, -3], [82, 0.6, 3], [30, 0.74, -2], [70, 0.78, 2], [50, 0.95, 0]];
      layout.slice(0, n).forEach(([x, s, dy], i) => { els.push(...agaric(a, x, gy - Math.abs(dy) * 0.6, k * s * 0.9, c, 'c' + i)); });
      return els;
    }

    case 'ball': {
      if (a.truffle) {
        els.push(<Ellipse key="tm" cx={50} cy={86} rx={40 * k} ry={9 * k} fill={c.col('#6B4E36')} />);
        els.push(<Circle key="tb" cx={50} cy={70} r={20 * k} fill={c.capFill} />);
        if (!c.sil) {
          for (let i = 0; i < 18; i++) {
            const ang = (i / 18) * Math.PI * 2;
            const r = (i % 2 ? 9 : 15) * k;
            const x = 50 + Math.cos(ang) * r;
            const y = 70 + Math.sin(ang) * r;
            els.push(<Path key={'tw' + i} d={`M${x - 2 * k},${y + 1.5 * k} L${x},${y - 2 * k} L${x + 2 * k},${y + 1.5 * k} Z`} fill="#4A3A30" opacity={0.8} />);
          }
        }
        els.push(<Path key="tf" d={`M${50 - 40 * k},86 Q50,${92} ${50 + 40 * k},86 L${50 + 40 * k},92 L${50 - 40 * k},92 Z`} fill={c.col('#5A3E28')} />);
        return els;
      }
      const big = !a.warts;
      const r = (big ? 30 : 21) * k;
      const cy = gy - r * (big ? 0.85 : 1.15);
      if (!big) els.push(<Path key="bp" d={`M${50 - r * 0.55},${cy + r * 0.6} Q50,${gy + 2} ${50 + r * 0.55},${cy + r * 0.6} Z`} fill={c.col(a.cap2)} />);
      els.push(<Ellipse key="bb" cx={50} cy={cy} rx={r} ry={r * (big ? 0.82 : 0.95)} fill={c.capFill} />);
      if (!c.sil) {
        if (a.warts) {
          for (let i = 0; i < 16; i++) {
            const ang = (i * 2.4) % (Math.PI * 2);
            const rr = r * (0.25 + ((i * 37) % 60) / 100);
            els.push(<Circle key={'bw' + i} cx={50 + Math.cos(ang) * rr} cy={cy + Math.sin(ang) * rr * 0.9} r={1.1 * k} fill="#B8AA88" />);
          }
        }
        els.push(<Ellipse key="bh" cx={50 - r * 0.32} cy={cy - r * 0.35} rx={r * 0.3} ry={r * 0.2} fill="#fff" opacity={0.45} />);
      }
      return els;
    }

    case 'shelf': {
      const n = a.n ?? 1;
      els.push(<Rect key="tr" x={8} y={6} width={26} height={86} rx={4} fill={c.col('#6B4E36')} />);
      if (!c.sil) for (let i = 0; i < 5; i++) els.push(<Line key={'bk' + i} x1={12 + i * 4.5} y1={10} x2={13 + i * 4.5} y2={88} stroke="#4A3424" strokeWidth={1} opacity={0.6} />);
      const ys = n === 1 ? [52] : n === 2 ? [40, 64] : [30, 52, 72];
      ys.forEach((y, i) => {
        const L = (a.shelf === 'hoof' ? 34 : 44) * k * (1 - i * 0.06);
        const x = 32;
        if (a.shelf === 'hoof') {
          els.push(<Path key={'h' + i} d={`M${x},${y - 12 * k} C${x + L * 0.7},${y - 14 * k} ${x + L},${y - 4 * k} ${x + L},${y + 4 * k} L${x},${y + 8 * k} Z`} fill={c.capFill} />);
          if (!c.sil) {
            for (let b = 1; b < 4; b++) els.push(<Path key={'hb' + i + b} d={`M${x},${y - 12 * k + b * 4.5 * k} C${x + L * 0.7},${y - 13 * k + b * 4.5 * k} ${x + L * (0.95 - b * 0.04)},${y - 4 * k + b * 3 * k} ${x + L * (0.98 - b * 0.03)},${y + 2 * k + b}`} stroke="#00000030" strokeWidth={1} fill="none" />);
          }
          els.push(<Path key={'hu' + i} d={`M${x},${y + 8 * k} L${x + L},${y + 4 * k} L${x + L * 0.9},${y + 7 * k} L${x},${y + 10 * k} Z`} fill={c.col(a.under)} />);
        } else if (a.shelf === 'tongue') {
          els.push(<Path key={'t' + i} d={`M${x},${y - 6 * k} C${x + L * 0.6},${y - 14 * k} ${x + L * 1.05},${y - 6 * k} ${x + L},${y + 4 * k} C${x + L * 0.8},${y + 12 * k} ${x + L * 0.3},${y + 10 * k} ${x},${y + 8 * k} Z`} fill={c.capFill} />);
          els.push(<Path key={'tu' + i} d={`M${x},${y + 5 * k} C${x + L * 0.4},${y + 9 * k} ${x + L * 0.8},${y + 8 * k} ${x + L * 0.97},${y + 5 * k} C${x + L * 0.8},${y + 11 * k} ${x + L * 0.3},${y + 10 * k} ${x},${y + 8 * k} Z`} fill={c.col(a.under)} />);
          if (!c.sil) els.push(<Ellipse key={'th' + i} cx={x + L * 0.45} cy={y - 5 * k} rx={L * 0.2} ry={2.5 * k} fill="#fff" opacity={0.25} />);
        } else {
          // boczniak i żółciak: wachlarze
          els.push(<Path key={'o' + i} d={`M${x},${y} C${x + L * 0.4},${y - 14 * k} ${x + L * 0.95},${y - 10 * k} ${x + L},${y + 1 * k} C${x + L * 0.85},${y + 9 * k} ${x + L * 0.4},${y + 10 * k} ${x},${y + 6 * k} Z`} fill={c.capFill} stroke={a.shelf === 'tiers' ? c.col(a.cap2) : 'none'} strokeWidth={a.shelf === 'tiers' ? 2.4 : 0} />);
          if (a.shelf === 'oyster') {
            els.push(<Path key={'ou' + i} d={`M${x},${y + 4 * k} C${x + L * 0.4},${y + 8 * k} ${x + L * 0.85},${y + 7 * k} ${x + L * 0.98},${y + 2 * k} C${x + L * 0.85},${y + 9 * k} ${x + L * 0.4},${y + 10 * k} ${x},${y + 6 * k} Z`} fill={c.col(a.under)} />);
          }
          if (!c.sil) els.push(<Ellipse key={'oh' + i} cx={x + L * 0.5} cy={y - 5 * k} rx={L * 0.22} ry={2.4 * k} fill="#fff" opacity={0.25} />);
        }
      });
      return els;
    }

    case 'morel': {
      els.push(<Rect key="ms" x={50 - 9 * k} y={gy - 30 * k} width={18 * k} height={30 * k} rx={6 * k} fill={c.col(a.stem)} />);
      if (a.brain) {
        const lobes: [number, number, number][] = [[-10, -40, 13], [9, -42, 14], [0, -54, 13], [-14, -52, 9], [14, -55, 9]];
        lobes.forEach(([dx, dy, r], i) => els.push(<Circle key={'bl' + i} cx={50 + dx * k} cy={gy + dy * k} r={r * k} fill={c.capFill} />));
        if (!c.sil) {
          for (let i = 0; i < 3; i++) {
            const y = gy - (38 + i * 8) * k;
            const s = 3.5 * k;
            els.push(<Path key={'bw' + i} d={`M${50 - 14 * k},${y} q${s},${-s} ${2 * s},0 q${s},${s} ${2 * s},0 q${s},${-s} ${2 * s},0 q${s},${s} ${2 * s},0`} stroke="#2A100A" strokeWidth={1.1} fill="none" opacity={0.55} />);
          }
        }
        return els;
      }
      els.push(<Path key="mc" d={`M${50 - 17 * k},${gy - 28 * k} C${50 - 19 * k},${gy - 50 * k} ${50 - 6 * k},${gy - 72 * k} 50,${gy - 74 * k} C${50 + 6 * k},${gy - 72 * k} ${50 + 19 * k},${gy - 50 * k} ${50 + 17 * k},${gy - 28 * k} Z`} fill={c.capFill} />);
      if (!c.sil) {
        for (let r = 0; r < 5; r++) {
          const y = gy - (33 + r * 8.5) * k;
          const w = (15 - r * 2.4) * k;
          const cnt = 4 - Math.floor(r / 2);
          for (let i = 0; i < cnt; i++) {
            const x = 50 - w + ((i + 0.5) * (2 * w)) / cnt + (r % 2 ? 1.5 * k : 0);
            els.push(<Ellipse key={'pit' + r + i} cx={x} cy={y} rx={2.6 * k} ry={3.4 * k} fill={a.cap2} opacity={0.75} />);
          }
        }
      }
      return els;
    }

    case 'cup': {
      const n = a.n ?? 1;
      els.push(<Path key="tw" d="M10,84 Q50,78 92,86" stroke={c.col('#6B4E36')} strokeWidth={5} fill="none" strokeLinecap="round" />);
      const cups: [number, number, number][] = n === 1 ? [[50, 72, 1]] : [[36, 74, 0.8], [62, 70, 1]];
      cups.forEach(([x, y, s], i) => {
        const w = 22 * k * s;
        els.push(<Path key={'co' + i} d={`M${x - w},${y - 4 * k * s} Q${x - w * 0.9},${y + 12 * k * s} ${x},${y + 13 * k * s} Q${x + w * 0.9},${y + 12 * k * s} ${x + w},${y - 4 * k * s} Z`} fill={c.col(a.cap2)} />);
        els.push(<Ellipse key={'ci' + i} cx={x} cy={y - 4 * k * s} rx={w} ry={7 * k * s} fill={c.capFill} />);
        if (!c.sil) els.push(<Ellipse key={'cd' + i} cx={x + w * 0.1} cy={y - 3 * k * s} rx={w * 0.6} ry={4 * k * s} fill="#00000025" />);
      });
      return els;
    }

    case 'ear': {
      els.push(<Path key="br" d="M6,70 L94,62" stroke={c.col('#5A4030')} strokeWidth={7} strokeLinecap="round" />);
      const ears: [number, number, number][] = (a.n ?? 1) === 1 ? [[52, 66, 1]] : [[38, 67, 0.85], [66, 64, 1]];
      ears.forEach(([x, y, s], i) => {
        const w = 18 * k * s;
        els.push(<Path key={'e' + i} d={`M${x - 4 * k},${y} C${x - w * 1.3},${y + 4 * k} ${x - w * 1.1},${y + 26 * k * s} ${x},${y + 24 * k * s} C${x + w * 1.2},${y + 22 * k * s} ${x + w * 1.1},${y + 2 * k} ${x + 4 * k},${y} Z`} fill={c.capFill} opacity={c.sil ? 1 : 0.95} />);
        if (!c.sil) {
          els.push(<Path key={'ev' + i} d={`M${x},${y + 3 * k} q${-6 * k * s},${8 * k * s} ${-2 * k * s},${16 * k * s} M${x},${y + 3 * k} q${6 * k * s},${8 * k * s} ${3 * k * s},${17 * k * s}`} stroke="#ffffff" strokeWidth={0.8} fill="none" opacity={0.25} />);
        }
      });
      return els;
    }

    case 'coral': {
      const lobes: [number, number, number][] = [
        [50, 66, 22], [34, 70, 13], [66, 70, 13], [42, 52, 12], [58, 52, 12], [50, 44, 11], [30, 58, 9], [70, 58, 9], [50, 78, 14],
      ];
      lobes.forEach(([x, y, r], i) => els.push(<Circle key={'l' + i} cx={50 + (x - 50) * k} cy={gy - (gy - y) * k} r={r * k} fill={c.capFill} />));
      if (!c.sil) {
        lobes.forEach(([x, y, r], i) => els.push(<Path key={'lw' + i} d={`M${50 + (x - 50) * k - r * k * 0.7},${gy - (gy - y) * k} q${r * k * 0.35},${-r * k * 0.5} ${r * k * 0.7},0 q${r * k * 0.35},${r * k * 0.5} ${r * k * 0.7},0`} stroke={a.cap2} strokeWidth={1.1} fill="none" />));
      }
      return els;
    }

    case 'spines': {
      els.push(<Rect key="tr" x={6} y={4} width={22} height={88} rx={4} fill={c.col('#6B4E36')} />);
      const blobs = (a.n ?? 1) === 1 ? [[56, 46, 1]] : [[50, 34, 0.8], [62, 60, 1]];
      blobs.forEach(([x, y, s], i) => {
        const w = 24 * k * s;
        els.push(<Ellipse key={'sb' + i} cx={x} cy={y} rx={w} ry={9 * k * s} fill={c.capFill} />);
        for (let j = 0; j < 12; j++) {
          const sx = x - w * 0.9 + (j * w * 1.8) / 11;
          const len = (12 + ((j * 7) % 9)) * k * s;
          els.push(<Line key={'sl' + i + j} x1={sx} y1={y + 4 * k} x2={sx + 0.5} y2={y + 4 * k + len} stroke={c.col(j % 2 ? a.cap : a.cap2)} strokeWidth={2.2 * k} strokeLinecap="round" />);
        }
      });
      return els;
    }

    case 'club': {
      const n = a.n ?? 3;
      const xs = [36, 52, 66, 44].slice(0, n);
      xs.forEach((x, i) => {
        const h = (38 + ((i * 11) % 14)) * k;
        const w = (7 + (i % 2) * 1.5) * k;
        els.push(<Path key={'cl' + i} d={`M${x - w * 0.5},${gy} C${x - w * 0.6},${gy - h * 0.5} ${x - w},${gy - h * 0.9} ${x},${gy - h} C${x + w},${gy - h * 0.9} ${x + w * 0.6},${gy - h * 0.5} ${x + w * 0.5},${gy} Z`} fill={c.capFill} />);
        if (!c.sil) els.push(<Ellipse key={'ch' + i} cx={x - w * 0.25} cy={gy - h * 0.75} rx={w * 0.2} ry={h * 0.15} fill="#fff" opacity={0.18} />);
      });
      return els;
    }

    case 'jelly': {
      els.push(<Path key="br" d="M4,80 L96,74" stroke={c.col('#5A4030')} strokeWidth={7} strokeLinecap="round" />);
      const lobes: [number, number, number, number][] = [[42, 62, 15, 12], [60, 60, 14, 13], [50, 50, 13, 11], [34, 52, 9, 8], [66, 48, 9, 9]];
      lobes.forEach(([x, y, rx, ry], i) => els.push(<Ellipse key={'j' + i} cx={50 + (x - 50) * k} cy={78 - (78 - y) * k} rx={rx * k} ry={ry * k} fill={c.capFill} />));
      if (!c.sil) {
        lobes.forEach(([x, y, rx], i) => els.push(<Path key={'jf' + i} d={`M${50 + (x - 50) * k - rx * k * 0.6},${78 - (78 - y) * k} q${rx * k * 0.3},${-4 * k} ${rx * k * 0.6},0 q${rx * k * 0.3},${4 * k} ${rx * k * 0.6},0`} stroke={a.cap2} strokeWidth={1} fill="none" />));
        els.push(<Ellipse key="jh" cx={44} cy={52} rx={5 * k} ry={2.5 * k} fill="#fff" opacity={0.5} />);
      }
      return els;
    }

    case 'star': {
      const rays = 7;
      for (let i = 0; i < rays; i++) {
        const ang = (i / rays) * Math.PI * 2 - Math.PI / 2;
        const tipX = 50 + Math.cos(ang) * 36 * k;
        const tipY = 78 + Math.sin(ang) * 13 * k;
        const lx = 50 + Math.cos(ang - 0.35) * 12 * k;
        const ly = 78 + Math.sin(ang - 0.35) * 5 * k;
        const rx = 50 + Math.cos(ang + 0.35) * 12 * k;
        const ry = 78 + Math.sin(ang + 0.35) * 5 * k;
        els.push(<Path key={'r' + i} d={`M${lx},${ly} L${tipX},${tipY} L${rx},${ry} Z`} fill={c.col(i % 2 ? a.cap : a.cap2)} />);
      }
      els.push(<Ellipse key="col" cx={50} cy={74} rx={15 * k} ry={6 * k} fill={c.col(a.cap2)} />);
      els.push(<Circle key="ball" cx={50} cy={66 - 2 * k} r={12 * k} fill={c.capFill} />);
      if (!c.sil) els.push(<Path key="os" d={`M50,${54 - 4 * k} l-2,4 l4,0 Z`} fill="#5A3E28" />);
      return els;
    }

    case 'cage': {
      els.push(<Ellipse key="egg" cx={50} cy={86} rx={14 * k} ry={6 * k} fill={c.col('#F2EEE4')} />);
      for (let i = 0; i < 5; i++) {
        const ang = Math.PI + (i * Math.PI) / 4;
        const ex = 50 + Math.cos(ang) * 38 * k;
        const ey = 84 + Math.sin(ang) * 40 * k;
        const mx = 50 + Math.cos(ang) * 22 * k;
        const my = 84 + Math.sin(ang) * 30 * k - 6 * k;
        els.push(<Path key={'arm' + i} d={`M50,84 Q${mx},${my} ${ex},${ey}`} stroke={c.capFill} strokeWidth={6.5 * k} fill="none" strokeLinecap="round" />);
        if (!c.sil) els.push(<Circle key={'as' + i} cx={(50 + mx * 2 + ex) / 4 + 2} cy={(84 + my * 2 + ey) / 4} r={1.6 * k} fill={a.cap2} />);
      }
      return els;
    }

    case 'trumpet': {
      const n = a.n ?? 1;
      const items: [number, number][] = n === 1 ? [[50, 1]] : [[32, 0.75], [68, 0.8], [50, 1]];
      items.forEach(([x, s], i) => {
        const h = 52 * k * s;
        const w = 18 * k * s;
        els.push(<Path key={'tb' + i} d={`M${x - w},${gy - h} C${x - w * 0.5},${gy - h * 0.6} ${x - w * 0.25},${gy - h * 0.3} ${x - w * 0.25},${gy} L${x + w * 0.25},${gy} C${x + w * 0.25},${gy - h * 0.3} ${x + w * 0.5},${gy - h * 0.6} ${x + w},${gy - h} Z`} fill={c.col(a.under)} />);
        els.push(<Ellipse key={'tt' + i} cx={x} cy={gy - h} rx={w} ry={4.5 * k * s} fill={c.capFill} />);
        if (!c.sil) els.push(<Path key={'tw' + i} d={`M${x - w * 0.6},${gy - h * 0.7} q${w * 0.3},${h * 0.2} ${w * 0.45},${h * 0.55}`} stroke="#00000040" strokeWidth={0.8} fill="none" />);
      });
      return els;
    }
  }
  return els;
}

const BOOST: Partial<Record<Art['kind'], number>> = {
  cap: 1.32, cluster: 1.3, ball: 1.2, shelf: 1.12, morel: 1.1, spines: 1.08, trumpet: 1.25, club: 1.3, coral: 1.15, cup: 1.15, ear: 1.15, jelly: 1.2, star: 1.15, cage: 1.05,
};

export function MushroomArt({ art, stage = 2, size = 96, silhouette, glow }: {
  art: Art; stage?: 1 | 2 | 3; size?: number; silhouette?: boolean; glow?: string;
}) {
  const uid = 'g' + useId().replace(/[^a-zA-Z0-9]/g, '');
  // skala: stadium ewolucji × powiększenie zależne od kształtu (żeby każdy grzyb wypełniał kadr)
  const k = (stage === 1 ? 0.8 : stage === 2 ? 0.92 : 1.04) * (BOOST[art.kind] ?? 1.2);
  const c: Ctx = {
    col: (x?: string) => (silhouette ? '#2E352F' : x ?? '#CFC6B2'),
    uid,
    sil: !!silhouette,
    capFill: silhouette ? '#2E352F' : `url(#${uid}cap)`,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={`${uid}cap`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={art.cap} />
          <Stop offset="1" stopColor={art.cap2} />
        </LinearGradient>
        <RadialGradient id={`${uid}glow`} cx="50%" cy="55%" r="50%">
          <Stop offset="0" stopColor={glow ?? '#fff'} stopOpacity={0.55} />
          <Stop offset="1" stopColor={glow ?? '#fff'} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {!!glow && !silhouette && <Circle cx={50} cy={56} r={48} fill={`url(#${uid}glow)`} />}
      <Ellipse cx={50} cy={91} rx={32} ry={4.5} fill="#000" opacity={0.18} />
      <G>{body(art, k, c)}</G>
    </Svg>
  );
}
