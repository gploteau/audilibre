import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useTracksListBehaviourContext } from '@/contexts/tracks-list';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import _ from 'lodash';
import { useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FooterContentListLayoutPlayerPage from '../footer/Footer';

const ItemsContentListLayoutPlayerPage = (props) => {
  const fill = useThemeColor({}, 'text');

  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const router = useRouter();

  const { filteredTracks } = useTracksListBehaviourContext();
  const { tracks, currentTrack, setLeftDrawerOpen } = usePlayerBehaviourContext();

  const changeTrack = useCallback(
    (track) => {
      router.navigate(`/${_.get(track, 'uuid')}`);
      setLeftDrawerOpen(false);
    },
    [router, setLeftDrawerOpen]
  );

  return (
    <SafeAreaView
      emulateUnlessSupported={true}
      style={[styles.container, { paddingTop: Math.max(top, 20) }]}
    >
      <DrawerContentScrollView
        {...props}
        style={{
          overflowY: 'auto',
          padding: 0,
          margin: 0,
          maxHeight: height - 178 + top,
          overflowX: 'hidden',
        }}
        contentContainerStyle={{
          paddingTop: 5,
        }}
        showsVerticalScrollIndicator={false}
      >
        {_.chain(tracks)
          .filter((track) => _.includes(filteredTracks, _.get(track, 'id')))
          .map((track, key) => {
            const focused = _.get(currentTrack, 'id') === _.get(track, 'id');
            return (
              <DrawerItem
                key={key}
                activeTintColor={fill}
                focused={focused}
                label={_.get(track, 'title')}
                onPress={() => changeTrack(track)}
                labelStyle={{
                  fontFamily: focused ? 'Montserrat_700Bold' : 'Montserrat_400Regular',
                  fontSize: 17,
                }}
              />
            );
          })
          .value()}
      </DrawerContentScrollView>
      <FooterContentListLayoutPlayerPage {...props} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    userSelect: 'none',
  },
});

export default ItemsContentListLayoutPlayerPage;
