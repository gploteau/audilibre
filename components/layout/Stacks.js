import { PlayerBehaviourProvider } from '@/contexts/behaviour';
import { useRootContext } from '@/contexts/root';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootStacks() {
  const { theme, currentColorScheme, defaultTheme } = useRootContext();

  let deferredPrompt;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      console.log(deferredPrompt);
    });
  }, []);

  return (
    <ThemeProvider value={currentColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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

            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings',
                headerBackVisible: true,
                headerShown: true,
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="[uuid]"
              options={{
                animationEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="privacy-policy"
              options={{
                title: 'Règles de Confidentialité',
                animationEnabled: false,
                headerShown: true,
              }}
            />
          </Stack>
          <StatusBar style={currentColorScheme === 'dark' ? 'light' : 'dark'} />
        </PlayerBehaviourProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
