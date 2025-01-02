import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { Image } from 'expo-image';
import _ from 'lodash';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

const CoverLayoutPlayerPage = (props) => {
  const theme = useTheme();
  const { currentTrack, isLoading } = usePlayerBehaviourContext();

  return (
    <ViewOwn center mt={25} style={{ position: 'relative' }}>
      {isLoading && (
        <ActivityIndicator size={200} style={{ position: 'absolute', zIndex: 2, opacity: 0.5 }} />
      )}
      <Image
        style={styles.cover}
        source={_.get(currentTrack, 'cover', null)}
        contentFit="cover"
        transition={1000}
      />
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  cover: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#333',
  },
});

export default CoverLayoutPlayerPage;
