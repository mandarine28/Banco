import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { Linking, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameButton } from '@/components/GameButton';
import { HomeBackground } from '@/components/HomeBackground';
import { Logo } from '@/components/Logo';
import { RoundIconButton } from '@/components/RoundIconButton';
import { socialLinks } from '@/config/links';
import { colors, fonts } from '@/theme';

// Largeur maximale du rendu : au-delà (tablette, navigateur), l'écran reste au format téléphone.
const MAX_WIDTH = 500;

export default function HomeScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);

  // Proportions relevées sur la maquette (fractions de la hauteur d'écran).
  const curveEdge = height * 0.435;
  const curveBottom = height * 0.535;
  const logoHeight = Math.min((width * 0.4 * 600) / 380, height * 0.29);
  const logoWidth = (logoHeight * 380) / 600;
  const buttonHeight = Math.min(width * 0.145, height * 0.068);
  const buttonGap = height * 0.097 - buttonHeight;
  const socialSize = Math.min(width * 0.1, 44);

  const go = (href: Href) => () => router.push(href);

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        <HomeBackground
          width={width}
          height={height}
          curveEdge={curveEdge}
          curveBottom={curveBottom}
          burstY={height * 0.68}
        />

        <View style={[styles.settings, { top: insets.top + height * 0.06, right: width * 0.05 }]}>
          <RoundIconButton
            tone="purple"
            size={width * 0.13}
            accessibilityLabel="Paramètres"
            onPress={go('/reglages')}
            icon={<MaterialCommunityIcons name="tune-variant" size={width * 0.075} color={colors.white} />}
          />
        </View>

        <View style={[styles.centered, { top: height * 0.135 }]}>
          <Logo width={logoWidth} />
        </View>

        <Text
          style={[
            styles.letsGo,
            { top: curveBottom - height * 0.085, fontSize: width * 0.085, lineHeight: width * 0.1 },
          ]}
        >
          LET’S GO!
        </Text>

        <View
          style={[
            styles.buttons,
            { top: height * 0.63 - buttonHeight / 2, width: width * 0.66, left: width * 0.17, gap: buttonGap },
          ]}
        >
          <GameButton
            variant="pink"
            label="JOUER"
            height={buttonHeight}
            onPress={go('/parametres')}
            icon={<FontAwesome6 name="play" solid size={buttonHeight * 0.5} color={colors.white} />}
          />
          <GameButton
            variant="teal"
            label="BOUTIQUE"
            height={buttonHeight}
            onPress={go('/boutique')}
            icon={<FontAwesome6 name="cart-shopping" solid size={buttonHeight * 0.42} color={colors.white} />}
          />
          <GameButton
            variant="yellow"
            label="RÈGLES"
            height={buttonHeight}
            onPress={go('/regles')}
            icon={<MaterialCommunityIcons name="script-text" size={buttonHeight * 0.5} color={colors.white} />}
          />
        </View>

        <View style={[styles.socials, { bottom: insets.bottom + height * 0.035, gap: width * 0.055 }]}>
          <RoundIconButton
            size={socialSize}
            accessibilityLabel="Informations"
            onPress={go('/infos')}
            icon={<FontAwesome6 name="info" solid size={socialSize * 0.5} color={colors.purple} />}
          />
          <RoundIconButton
            size={socialSize}
            accessibilityLabel="Discord"
            onPress={() => Linking.openURL(socialLinks.discord)}
            icon={<FontAwesome6 name="discord" brand size={socialSize * 0.5} color={colors.purple} />}
          />
          <RoundIconButton
            size={socialSize}
            accessibilityLabel="Instagram"
            onPress={() => Linking.openURL(socialLinks.instagram)}
            icon={<FontAwesome6 name="instagram" brand size={socialSize * 0.55} color={colors.purple} />}
          />
          <RoundIconButton
            size={socialSize}
            accessibilityLabel="Facebook"
            onPress={() => Linking.openURL(socialLinks.facebook)}
            icon={<FontAwesome6 name="facebook-f" brand size={socialSize * 0.55} color={colors.purple} />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.purpleDeep,
  },
  screen: {
    overflow: 'hidden',
  },
  settings: {
    position: 'absolute',
  },
  centered: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  letsGo: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.pink,
    fontFamily: fonts.display,
    letterSpacing: 1,
  },
  buttons: {
    position: 'absolute',
  },
  socials: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
