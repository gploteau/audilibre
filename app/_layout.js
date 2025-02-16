import RootStacks from '@/components/layout/Stacks';
import WebSplashScreen from '@/components/own/SplashScreen';
import { CacheProvider } from '@/contexts/cache';
import { RootProvider } from '@/contexts/root';
import { getData } from '@/tools/Tools';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_300Light,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' && appIsReady) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 1500);
    }
  }, [appIsReady]);

  useEffect(() => {
    if (loaded) {
      const preload = async () => {
        const data = await getData('audilibre');
        const url = _.get(data, 'db_url');
        if (url) {
          await fetch(url, { method: 'HEAD' });
        }
        setAppIsReady(true);
      };
      preload();
    }
  }, [loaded]);

  if (!appIsReady) {
    return Platform.OS !== 'web' ? null : <WebSplashScreen />;
  }

  return (
    <RootProvider>
      <CacheProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <RootStacks />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </CacheProvider>
    </RootProvider>
  );
}
