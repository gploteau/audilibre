import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import ControlsFooterLayoutPlayerPage from './controls/Controls';
import OthersFooterLayoutPlayerPage from './others/Others';
import ProgressFooterLayoutPlayerPage from './progress/Progress';
import VolumeFooterLayoutPlayerPage from './volume/Volume';

const FooterLayoutPlayerPage = (props) => {
  const theme = useTheme();
  const { currentTrack, inFavorites, setCurrentTrackFavorite } = usePlayerBehaviourContext();

  return (
    <ViewOwn style={styles(theme).bottomCtr} column>
      <ProgressFooterLayoutPlayerPage />
      <ControlsFooterLayoutPlayerPage />
      <VolumeFooterLayoutPlayerPage />
      <OthersFooterLayoutPlayerPage />
    </ViewOwn>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    bottomCtr: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

export default FooterLayoutPlayerPage;
