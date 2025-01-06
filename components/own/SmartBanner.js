import { useCacheContext } from '@/contexts/cache';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { Image } from 'react-native-web';
import TextOwn from './Text';
import ViewOwn from './View';

const SmartBanner = () => {
  const theme = useTheme();
  const { updateCache, hardGetCache } = useCacheContext();
  const [canDisplayBanner, setCanDisplayBanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const canDisplay = async () => {
      const hide = await hardGetCache('hideSmartBanner', false);
      setCanDisplayBanner(!hide);
    };
    canDisplay();
  }, []);

  const handleCloseBanner = useCallback(() => {
    updateCache('hideSmartBanner', true);
    setCanDisplayBanner(false);
  }, [updateCache, setCanDisplayBanner]);

  const handleInstall = useCallback(() => {
    const url = Linking.createURL(process.env.EXPO_PUBLIC_PLAY_STORE_URL, {
      queryParams: { id: 'com.gploteau.audilibre' },
    });
    Linking.openURL(url);
  }, []);

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
