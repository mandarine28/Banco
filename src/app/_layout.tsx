import { useState } from 'react';

import {
  MPLUSRounded1c_400Regular,
  MPLUSRounded1c_500Medium,
  MPLUSRounded1c_700Bold,
  MPLUSRounded1c_800ExtraBold,
} from '@expo-google-fonts/m-plus-rounded-1c';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { SplashScreenAnimator } from '@/components/SplashScreenAnimator';
import { GameSettingsProvider } from '@/state/gameSettings';
import { colors } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MPLUSRounded1c_400Regular,
    MPLUSRounded1c_500Medium,
    MPLUSRounded1c_700Bold,
    MPLUSRounded1c_800ExtraBold,
  });
  const [splashDone, setSplashDone] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {fontsLoaded ? (
        <GameSettingsProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        </GameSettingsProvider>
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.purple }} />
      )}
      {!splashDone && (
        <SplashScreenAnimator onFinish={() => setSplashDone(true)} />
      )}
    </View>
  );
}
