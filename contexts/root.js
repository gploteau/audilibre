import { DarkThemeColors } from '@/constants/theme-dark';
import { LightThemeColors } from '@/constants/theme-light';
import { getData } from '@/tools/Tools';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { configureFonts } from 'react-native-paper';

const RootContext = createContext(null);

const RootProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [currentColorScheme, setCurrentColorScheme] = useState('auto');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const getScheme = async () => {
      const data = await getData('audilibre');
      const userScheme = _.get(data, 'theme', 'auto');
      setCurrentColorScheme(userScheme === 'auto' ? colorScheme : userScheme);
    };
    getScheme();
  }, []);

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
    dark: currentColorScheme === 'dark',
    roundness: 6,
    fonts,
  };

  const changeColorScheme = useCallback(
    async (scheme) => {
      setCurrentColorScheme(scheme === 'auto' ? colorScheme : scheme);
    },
    [setCurrentColorScheme, colorScheme]
  );

  const value = {
    defaultTheme,
    currentColorScheme,
    theme,
    changeColorScheme,
    setDeferredPrompt,
    deferredPrompt,
  };

  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};

RootProvider.propTypes = {
  children: PropTypes.node,
};

const useRootContext = () => {
  const context = useContext(RootContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context) {
      throw new Error('useRootContext must be wrapped in a <RootProvider />');
    }
  }

  return context;
};

export { RootProvider, useRootContext };
