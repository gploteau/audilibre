import { PlayerBehaviourProvider } from '@/contexts/behaviour';
import { useRootContext } from '@/contexts/root';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootStacks() {
  const { theme, currentColorScheme, defaultTheme } = useRootContext();

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
