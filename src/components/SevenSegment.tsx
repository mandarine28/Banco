import Svg, { Polygon } from 'react-native-svg';

// Segments allumés pour chaque chiffre : a (haut), b, c, d (bas), e, f, g (milieu).
const DIGITS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
};

type Props = {
  value: string;
  height: number;
  color: string;
};

/** Affichage façon chrono digital, segments tracés en contour. */
export function SevenSegment({ value, height, color }: Props) {
  const w = 11;
  const h = 22;
  const t = 1.8;
  const gap = 4;
  const total = value.length * w + (value.length - 1) * gap;

  const horizontal = (x: number, y: number) =>
    `${x + t / 2},${y} ${x + t},${y - t / 2} ${x + w - t},${y - t / 2} ${x + w - t / 2},${y} ${x + w - t},${y + t / 2} ${x + t},${y + t / 2}`;
  const vertical = (x: number, y: number) =>
    `${x},${y + t / 2} ${x + t / 2},${y + t} ${x + t / 2},${y + h / 2 - t} ${x},${y + h / 2 - t / 2} ${x - t / 2},${y + h / 2 - t} ${x - t / 2},${y + t}`;

  return (
    <Svg width={(height * (total + t)) / (h + t)} height={height} viewBox={`${-t / 2} ${-t / 2} ${total + t} ${h + t}`}>
      {[...value].map((char, i) => {
        const x = i * (w + gap);
        const on = DIGITS[char] ?? '';
        const segments: Record<string, string> = {
          a: horizontal(x, 0),
          g: horizontal(x, h / 2),
          d: horizontal(x, h),
          f: vertical(x, 0),
          b: vertical(x + w, 0),
          e: vertical(x, h / 2),
          c: vertical(x + w, h / 2),
        };
        return [...on].map((s) => (
          <Polygon key={`${i}${s}`} points={segments[s]} fill="none" stroke={color} strokeWidth={0.8} strokeLinejoin="round" />
        ));
      })}
    </Svg>
  );
}
