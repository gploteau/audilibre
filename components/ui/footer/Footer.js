import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { StyleSheet } from 'react-native';
import ControlsFooterLayoutPlayerPage from './controls/Controls';
import OthersFooterLayoutPlayerPage from './others/Others';
import ProgressFooterLayoutPlayerPage from './progress/Progress';
import VolumeFooterLayoutPlayerPage from './volume/Volume';

const FooterLayoutPlayerPage = (props) => {
  const { currentTrack, inFavorites, setCurrentTrackFavorite } = usePlayerBehaviourContext();

  return (
    <ViewOwn style={styles.bottomCtr} column>
      <ProgressFooterLayoutPlayerPage />
      <ControlsFooterLayoutPlayerPage />
      <VolumeFooterLayoutPlayerPage />
      <OthersFooterLayoutPlayerPage />
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  bottomCtr: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default FooterLayoutPlayerPage;
