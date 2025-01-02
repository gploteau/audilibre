import '../../gesture-handler';
// import react-native-gesture-handler on native platforms
import ViewOwn from '@/components/own/View';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useTheme } from 'react-native-paper';
import CoverLayoutPlayerPage from './cover/Cover';
import FooterLayoutPlayerPage from './footer/Footer';
import HeaderLayoutPlayerPage from './header/Header';

const LayoutPlayerPage = ({ route }) => {
  const theme = useTheme();
  const { currentTrack } = usePlayerBehaviourContext();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      emulateUnlessSupported={true}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <ViewOwn column style={{ height: '100%' }}>
        <HeaderLayoutPlayerPage />
        <CoverLayoutPlayerPage />
        <FooterLayoutPlayerPage />
      </ViewOwn>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.select({
      android: 8,
      web: 16,
      ios: 10,
    }),
    height: '100%',
    overflow: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    userSelect: 'none',
  },
});

export default LayoutPlayerPage;
