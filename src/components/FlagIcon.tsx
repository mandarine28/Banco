import Svg, { ClipPath, Defs, G, Mask, Path, Rect, SvgXml } from 'react-native-svg';

import { FLAG_PORTUGAL_XML } from '@/components/flagPortugalXml';
import type { Lang } from '@/lib/i18n';

function FlagFR({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Defs>
        <ClipPath id="clip-fr-a">
          <Rect width="128" height="128" rx="64" />
        </ClipPath>
        <ClipPath id="clip-fr-b">
          <Rect x="-32" width="192" height="128" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-fr-a)">
        <Rect width="128" height="128" rx="64" fill="white" />
        <G clipPath="url(#clip-fr-b)">
          <Path d="M-32 0H160V128H-32" fill="#CE1126" />
          <Path d="M-32 0H96V128H-32" fill="white" />
          <Path d="M-32 0H32V128H-32" fill="#002654" />
        </G>
      </G>
    </Svg>
  );
}

function FlagEN({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Defs>
        <ClipPath id="clip-en-a">
          <Rect width="128" height="128" rx="64" />
        </ClipPath>
        <ClipPath id="clip-en-b">
          <Rect x="-64" width="256" height="128" />
        </ClipPath>
        <Mask id="mask-en-1" x="-64" y="0" width="256" height="128">
          <Path
            d="M64 64H192V128L64 64ZM64 64V128H-64L64 64ZM64 64H-64V0L64 64ZM64 64V0H192L64 64Z"
            fill="white"
          />
        </Mask>
      </Defs>
      <G clipPath="url(#clip-en-a)">
        <Rect width="128" height="128" rx="64" fill="white" />
        <G clipPath="url(#clip-en-b)">
          <Path d="M-64 0V128H192V0H-64Z" fill="#012169" />
          <Path d="M-64 0L192 128M192 0L-64 128" stroke="white" strokeWidth={25.6} />
          <G mask="url(#mask-en-1)">
            <Path d="M-64 0L192 128M192 0L-64 128" stroke="#C8102E" strokeWidth={17.1} />
          </G>
          <Path d="M64 0V128" stroke="white" strokeWidth={42.7} />
          <Path d="M-64 64H192" stroke="white" strokeWidth={42.7} />
          <Path d="M64 0V128" stroke="#C8102E" strokeWidth={25.6} />
          <Path d="M-64 64H192" stroke="#C8102E" strokeWidth={25.6} />
        </G>
      </G>
    </Svg>
  );
}

function FlagDE({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Defs>
        <ClipPath id="clip-de-a">
          <Rect width="128" height="128" rx="64" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-de-a)">
        <Rect x="-43" width="214" height="128" fill="black" />
        <Rect x="-43" y="42.7" width="214" height="85.3" fill="#DD0000" />
        <Rect x="-43" y="85.3" width="214" height="42.7" fill="#FFCE00" />
      </G>
    </Svg>
  );
}

function FlagES({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Defs>
        <ClipPath id="clip-es-a">
          <Rect width="128" height="128" rx="64" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-es-a)">
        <Rect width="128" height="128" fill="#AD1519" />
        <Rect y="32" width="128" height="64" fill="#FABD00" />
      </G>
    </Svg>
  );
}

function FlagIT({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Defs>
        <ClipPath id="clip-it-a">
          <Rect width="128" height="128" rx="64" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-it-a)">
        <Rect width="128" height="128" fill="white" />
        <Rect width="42.7" height="128" fill="#009246" />
        <Rect x="85.3" width="42.7" height="128" fill="#CE2B37" />
      </G>
    </Svg>
  );
}

function FlagPT({ size }: { size: number }) {
  return <SvgXml xml={FLAG_PORTUGAL_XML} width={size} height={size} />;
}

export function FlagIcon({ lang, size = 34 }: { lang: Lang; size?: number }) {
  switch (lang) {
    case 'fr': return <FlagFR size={size} />;
    case 'en': return <FlagEN size={size} />;
    case 'de': return <FlagDE size={size} />;
    case 'es': return <FlagES size={size} />;
    case 'it': return <FlagIT size={size} />;
    case 'pt': return <FlagPT size={size} />;
  }
}
