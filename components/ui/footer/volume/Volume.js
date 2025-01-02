import { SvgSpeakerOff, SvgSpeakerOn } from '@/components/icons/Speaker';
import TextOwn from '@/components/own/Text';
import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import numeral from 'numeral';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';

const VolumeFooterLayoutPlayerPage = () => {
  const theme = useTheme();

  const fill = useMemo(() => theme.colors.onSurface, [theme]);

  const { setVolumeByUser, setVolume, volume, volumeByUser } = usePlayerBehaviourContext();
  const [thumbPressed, setThumbPressed] = useState(false);

  const progress = useSharedValue(volume);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  useEffect(() => {
    progress.value = volume;
  }, [volume]);

  const mute = useCallback(() => {
    setVolumeByUser(0);
    setVolume(0);
  }, [setVolumeByUser, setVolume]);

  return (
    <ViewOwn>
      <Pressable style={styles.button} onPress={mute}>
        {volumeByUser === 0 ? (
          <SvgSpeakerOff height={25} style={{ fill }} />
        ) : (
          <SvgSpeakerOn height={25} style={{ fill }} />
        )}
      </Pressable>
      <View style={{ flex: 1, paddingLeft: 15, paddingRight: 20 }}>
        <Slider
          theme={{
            maximumTrackTintColor: theme.colors.elevation.level5,
            minimumTrackTintColor: theme.colors.onBackground,
          }}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          bubble={(value) => {
            return value.toFixed();
          }}
          style={styles.slider}
          containerStyle={styles.barSlider}
          onValueChange={(value) => setVolumeByUser(value)}
          onSlidingComplete={(value) => setVolume(value)}
          renderBubble={() => {}}
          renderThumb={() => {
            return (
              <Pressable
                borderless
                style={[
                  styles.thumb,
                  {
                    borderColor: theme.colors.onBackground,
                    backgroundColor: theme.colors.onBackground,
                  },
                ]}
              >
                <ViewOwn></ViewOwn>
              </Pressable>
            );
          }}
        />
      </View>
      <ViewOwn center mr={10} vcenter style={{ width: 30 }}>
        <TextOwn variant="bold">{numeral(volumeByUser).multiply(100).format('###')}</TextOwn>
      </ViewOwn>
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  slider: {
    height: 50,
  },
  barSlider: {
    height: 2,
  },
  button: {
    justifyContent: 'center',
    borderRadius: 50,
    marginLeft: 15,
    height: 50,
    width: 20,
  },
  thumb: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 3,
  },
});

export default VolumeFooterLayoutPlayerPage;
