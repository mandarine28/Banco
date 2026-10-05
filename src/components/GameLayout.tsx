import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { colors } from '@/theme';

const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

type Props = {
  /** Conservé pour compatibilité — non rendu dans le nouveau layout, chaque phase gère son propre bandeau. */
  banner?: { label: string; color: string };
  onHome: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Désactive le ScrollView externe — utiliser quand l'enfant gère son propre scroll (ex. PlayPhase). */
  scrollDisabled?: boolean;
  /** Rendu au niveau écran, par-dessus tout le contenu. Utiliser pour les overlays non-bloquants (ex. PauseModal). */
  overlay?: ReactNode;
};

export function GameLayout({ onHome, children, footer, scrollDisabled = false, overlay }: Props) {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const iconSize = Math.min(width * 0.09, 36);
  const settingsSize = Math.min(width * 0.08, 32);
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        <CreamPatternSvg width={width} height={height} opacity={0.04} fill="#ffffff" />

        {/* En-tête : retour (onHome) + paramètres */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 14, paddingHorizontal: width * 0.06 },
          ]}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          <Pressable
            onPress={() => { Keyboard.dismiss(); onHome(); }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <View pointerEvents="none">
              <Svg width={iconSize} height={(iconSize * 19) / 32} viewBox="0 0 32 19">
                <Path d={ARROW_PATH} fill={colors.cream} />
              </Svg>
            </View>
          </Pressable>
          <Pressable
            onPress={() => router.push('/reglages')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Paramètres"
          >
            <View pointerEvents="none">
              <Svg width={settingsSize} height={settingsSize} viewBox="0 0 24 24">
                <Path d={SETTING_PATH} fill={colors.cream} />
              </Svg>
            </View>
          </Pressable>
        </View>

        {/* Zone principale : KAV pour le contenu + footer fixe EN DEHORS du KAV */}
        <View style={styles.keyboardArea}>
          <KeyboardAvoidingView
            style={styles.kavContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={headerHeight}
          >
            {scrollDisabled ? (
              <View style={[styles.scrollArea, styles.scrollContent]}>
                {children}
              </View>
            ) : (
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            )}
          </KeyboardAvoidingView>

          {footer ? (
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
              {footer}
            </View>
          ) : null}
        </View>

        {/* Overlay au-dessus de tout le contenu — dernier enfant = z-order max */}
        {overlay ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {overlay}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.purple,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.purple,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  keyboardArea: {
    flex: 1,
  },
  kavContent: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    alignItems: 'stretch',
  },
});
