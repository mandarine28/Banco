import { useEffect, useState } from 'react';

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
import { LangProvider } from '@/lib/LangContext';
import { preloadSounds } from '@/lib/sounds';
import { AuthProvider } from '@/state/auth';
import { GameSettingsProvider } from '@/state/gameSettings';
import { PurchasesProvider } from '@/state/purchases';
import { colors } from '@/theme';

export default function RootLayout() {
  // Sons chargés au démarrage : le premier déclenchement en partie est immédiat
  useEffect(() => {
    preloadSounds();
  }, []);

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
        <AuthProvider>
          <PurchasesProvider>
            <LangProvider>
              <GameSettingsProvider>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                  {/* Pas de swipe retour en partie : on quitte uniquement via la croix */}
                  <Stack.Screen name="partie" options={{ gestureEnabled: false }} />
                </Stack>
              </GameSettingsProvider>
            </LangProvider>
          </PurchasesProvider>
        </AuthProvider>
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.purple }} />
      )}
      {!splashDone && (
        <SplashScreenAnimator onFinish={() => setSplashDone(true)} />
      )}
    </View>
  );
}
