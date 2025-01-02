import SplashScreen from '@/components/own/SplashScreen';
import { DarkThemeColors } from '@/constants/theme-dark';
import { LightThemeColors } from '@/constants/theme-light';
import { PlayerBehaviourProvider } from '@/contexts/behaviour';
import { CacheProvider } from '@/contexts/cache';
import { RootProvider } from '@/contexts/root';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getData } from '@/tools/Tools';
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
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import { configureFonts, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const [currentColorScheme, setCurrentColorScheme] = useState('auto');

  const [loaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_300Light,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const getScheme = async () => {
      const data = await getData('audilibre');
      setCurrentColorScheme(_.get(data, 'theme', 'auto'));
    };
    getScheme();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' && appIsReady) {
      setTimeout(() => {
        LottieSplashScreen && LottieSplashScreen.hide();
      }, 1500);
    }
  }, [appIsReady]);

  useEffect(() => {
    if (loaded) {
      const preload = async () => {
        // await fetch(process.env.EXPO_PUBLIC_TRACKS_DB_URL, { method: 'HEAD' });
        const data = await getData('audilibre');
        const url =
          Platform.OS !== 'web' ? _.get(data, 'db_url') : process.env.EXPO_PUBLIC_TRACKS_DB_URL;
        if (url) {
          await fetch(url, { method: 'HEAD' });
        }
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

  const defaultTheme = currentColorScheme === 'dark' ? DarkThemeColors : LightThemeColors;

  const theme = {
    ...defaultTheme,
    roundness: 6,
    fonts,
  };

  const changeColorScheme = useCallback(
    async (scheme) => {
      setCurrentColorScheme(scheme || 'auto');
    },
    [setCurrentColorScheme]
  );

  if (!appIsReady) {
    return Platform.OS !== 'web' ? null : <SplashScreen />;
  }

  return (
    <RootProvider changeColorScheme={changeColorScheme}>
      <CacheProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <PaperProvider theme={theme}>
                <PlayerBehaviourProvider>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      headerStyle: {
                        backgroundColor: defaultTheme.colors.surface,
                      },
                      headerTintColor: defaultTheme.colors.onSurface,
                      headerTitleStyle: {
                        fontWeight: 'bold',
                        color: defaultTheme.colors.onSurface,
                      },
                    }}
                  >
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </PlayerBehaviourProvider>
              </PaperProvider>
            </ThemeProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </CacheProvider>
    </RootProvider>
  );
}
