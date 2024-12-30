import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { Image } from 'expo-image';
import _ from 'lodash';
import { StyleSheet } from 'react-native';

const CoverLayoutPlayerPage = (props) => {
  const { currentTrack } = usePlayerBehaviourContext();

  return (
    <ViewOwn center mt={25}>
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
