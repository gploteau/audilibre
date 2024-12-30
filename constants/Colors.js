/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2e2e2e';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#444',
    background: '#f0f8ff',
    tint: tintColorLight,
    minSlider: '#2e2e2e',
    maxSlider: '#aaa',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    minSlider: '#f0f8ff',
    maxSlider: '#2e2e2e',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
