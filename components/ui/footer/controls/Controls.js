import { SvgNext, SvgPause, SvgPlay, SvgPrevious } from '@/components/icons/Controls';
import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

const ControlsFooterLayoutPlayerPage = () => {
  const fill = useThemeColor({}, 'text');
  const { changeTrackByWay, isPlaying, setIsPlaying, isLoaded } = usePlayerBehaviourContext();

  return (
    <ViewOwn mb={32} vcenter evenly>
      <TouchableRipple
        borderless
        style={styles.buttons}
        onPress={() => changeTrackByWay(-1)}
        rippleColor="rgba(52, 68, 73, 0.32)"
      >
        <SvgPrevious height={34} style={{ fill }} />
      </TouchableRipple>
      <TouchableRipple
        borderless
        style={[styles.buttons, styles.playPause]}
        onPress={() => setIsPlaying(!isPlaying)}
        rippleColor="rgba(52, 68, 73, 0.32)"
        disabled={!isLoaded}
      >
        {isPlaying ? (
          <SvgPause height={40} style={{ fill, opacity: !isLoaded ? 0.5 : 1 }} />
        ) : (
          <SvgPlay height={40} style={{ fill, opacity: !isLoaded ? 0.5 : 1 }} />
        )}
      </TouchableRipple>
      <TouchableRipple
        borderless
        style={styles.buttons}
        onPress={() => changeTrackByWay(1)}
        rippleColor="rgba(52, 68, 73, 0.32)"
      >
        <SvgNext height={34} style={{ fill }} />
      </TouchableRipple>
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  buttons: {
    border: 0,
    width: 56,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 50,
    boxShadow: '0 0 10px rgba(0,0,0,.2)',
    padding: 12,
  },
  playPause: {
    width: 74,
    height: 74,
    padding: 18,
  },
});

export default ControlsFooterLayoutPlayerPage;
