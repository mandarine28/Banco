import Svg, { Path } from 'react-native-svg';

type Props = {
  /** true : flèches vers l'intérieur (réduire) ; false : vers l'extérieur (agrandir). */
  collapse: boolean;
  color: string;
  size?: number;
};

/** Flèches diagonales agrandir / réduire, partagées par la liste des réponses en jeu et le calendrier des défis. */
export function ExpandIcon({ collapse, color, size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={
          collapse
            ? 'M4 4 L9 9 M9 9 L5 9 M9 9 L9 5 M20 20 L15 15 M15 15 L19 15 M15 15 L15 19'
            : 'M4 4 L20 20 M4 4 L10 4 M4 4 L4 10 M20 20 L14 20 M20 20 L20 14'
        }
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
