import SplashScreen from '@/components/own/SplashScreen';
import { PlayerBehaviourProvider } from '@/contexts/behaviour';
import { CacheProvider } from '@/contexts/cache';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureFonts, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_300Light,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === 'android' && appIsReady) {
      // LottieSplashScreen && LottieSplashScreen.hide();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (loaded) {
      const preload = async () => {
        await fetch(process.env.EXPO_PUBLIC_TRACKS_DB_URL, { method: 'HEAD' });
        setAppIsReady(true);
      };
      preload();
    }
  }, [loaded]);

  const baseFont = {
    fontFamily: 'Montserrat_400Regular',
  };

  const baseVariants = configureFonts({ config: baseFont });

  const customVariants = {
    titleLarge: {
      ...baseVariants.titleLarge,
      fontSize: 26,
      height: 30,
      letterSpacing: 1,
      fontFamily: 'Montserrat_700Bold',
    },
    boldSmall: {
      ...baseVariants.bodySmall,
      fontSize: 12,
      letterSpacing: 2,
      fontFamily: 'Montserrat_700Bold',
    },
    bold: {
      ...baseVariants.bodyMedium,
      fontFamily: 'Montserrat_700Bold',
    },
    thin: {
      ...baseVariants.bodyMedium,
      fontFamily: 'Montserrat_300Light',
    },
  };

  const fonts = configureFonts({
    config: {
      ...baseVariants,
      ...customVariants,
    },
  });

  const defaultTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const theme = {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      onSurface: '#333',
    },
    fonts,
  };

  if (!appIsReady) {
    if (Platform.OS !== 'web') return null;

    return <SplashScreen />;
  }

  return (
    <CacheProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <PaperProvider theme={theme}>
              <PlayerBehaviourProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </PlayerBehaviourProvider>
            </PaperProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </CacheProvider>
  );
}
