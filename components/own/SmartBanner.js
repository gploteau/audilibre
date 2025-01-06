import { useCacheContext } from '@/contexts/cache';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { Image } from 'react-native-web';
import TextOwn from './Text';
import ViewOwn from './View';

const SmartBanner = () => {
  const theme = useTheme();
  const { updateCache, hardGetCache } = useCacheContext();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canDisplayBanner, setCanDisplayBanner] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log(e);
    });
  }, []);

  useEffect(() => {
    if (deferredPrompt) {
      const canDisplay = async () => {
        const hide = await hardGetCache('hideSmartBanner', false);
        setCanDisplayBanner(!hide);
      };
      canDisplay();
    }
  }, [deferredPrompt]);

  const handleCloseBanner = useCallback(() => {
    updateCache('hideSmartBanner', true);
    setCanDisplayBanner(false);
  }, [updateCache, setCanDisplayBanner]);

  const handleInstall = useCallback(() => {
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  }, [deferredPrompt]);

  if (!canDisplayBanner) return null;

  return (
    <ViewOwn style={styles(theme).container} between>
      <ViewOwn vcenter>
        <IconButton icon="close" onPress={handleCloseBanner} />
        <Image source={require('../../assets/images/favicon.png')} />
        <ViewOwn column ml={15}>
          <TextOwn variant="bold">Audilibre</TextOwn>
          <TextOwn>Free - On the Play Store</TextOwn>
        </ViewOwn>
      </ViewOwn>
      <ViewOwn vcenter>
        <Button onPress={handleInstall}>
          <TextOwn color={theme.colors.primary}>Install</TextOwn>
        </Button>
      </ViewOwn>
    </ViewOwn>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      marginTop: 5,
      marginBottom: 15,
      padding: 15,
      paddingLeft: 0,
      borderRadius: theme?.roundness,
      backgroundColor: theme?.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
  });

export default SmartBanner;
