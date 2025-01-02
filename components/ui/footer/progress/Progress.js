import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useThemeColor } from '@/hooks/useThemeColor';
import { durationWithPadding } from '@/tools/Tools';
import _ from 'lodash';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';

const ProgressFooterLayoutPlayerPage = () => {
  const theme = useTheme();

  const minSliderTint = useThemeColor({}, 'minSlider');
  const maxSliderTint = useThemeColor({}, 'maxSlider');

  const {
    currentTrack,
    isPlaying,
    inFavorites,
    setCurrentTrackFavorite,
    trackProgress,
    setTrackProgressByUser,
    trackCache,
  } = usePlayerBehaviourContext();
  const [thumbPressed, setThumbPressed] = useState(false);

  const progress = useSharedValue(0);
  const cache = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(numeral(_.get(currentTrack, 'duration', 0)).multiply(1000).value());

  useEffect(() => {
    progress.value = trackProgress;
  }, [trackProgress]);

  useEffect(() => {
    max.value = numeral(_.get(currentTrack, 'duration', 0)).multiply(1000).value();
  }, [currentTrack]);

  useEffect(() => {
    cache.value = trackCache;
  }, [trackCache]);

  return (
    <View style={styles.container}>
      <Slider
        theme={{
          disableMinTrackTintColor: '#fff',
          maximumTrackTintColor: theme.colors.elevation.level1,
          minimumTrackTintColor: theme.colors.onBackground,
          bubbleBackgroundColor: theme.colors.backdrop,
          thumbBackgroundColor: '#fff',
          cacheTrackTintColor: '#555',
          heartbeatColor: theme.colors.elevation.level3,
        }}
        heartbeat={isPlaying}
        progress={progress}
        cache={cache}
        minimumValue={min}
        maximumValue={max}
        disableTrackFollow
        bubble={(value) => {
          return durationWithPadding(value);
        }}
        style={styles.slider}
        containerStyle={styles.videoSlider}
        bubbleTextStyle={styles.bubble}
        onSlidingComplete={(value) => {
          setTrackProgressByUser(value);
        }}
        renderThumb={() => {
          return (
            <TouchableRipple
              borderless
              style={[
                styles.thumb,
                {
                  borderColor: theme.colors.onBackground,
                  backgroundColor: theme.colors.onBackground,
                },
              ]}
              rippleColor="#333"
            >
              <ViewOwn></ViewOwn>
            </TouchableRipple>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 42,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
  },
  slider: {
    height: 50,
  },
  videoSlider: {
    height: 5,
  },
  bubble: {
    fontFamily: 'Montserrat_400Regular',
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 3,
  },
});

export default ProgressFooterLayoutPlayerPage;
