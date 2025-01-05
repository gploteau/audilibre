import SvgBack from '@/components/icons/Back';
import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useTracksListBehaviourContext } from '@/contexts/tracks-list';
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, MD3Colors, useTheme } from 'react-native-paper';
import SearchFooterContentListLayoutPlayerPage from './search/Search';

const FooterContentListLayoutPlayerPage = (props) => {
  const theme = useTheme();
  const { onlyFavorites, setOnlyFavorites } = useTracksListBehaviourContext();
  const { setLeftDrawerOpen } = usePlayerBehaviourContext();

  return (
    <ViewOwn style={[styles.container, { backgroundColor: theme.colors.background }]} column>
      <SearchFooterContentListLayoutPlayerPage />
      <ViewOwn style={styles.view}>
        <Pressable onPress={() => setLeftDrawerOpen(false)} accessibilityRole="button">
          <View style={styles.buttons}>
            <SvgBack height={16} style={{ fill: theme.colors.onBackground }} />
          </View>
        </Pressable>
        <IconButton
          icon={onlyFavorites ? 'heart' : 'heart-outline'}
          iconColor={MD3Colors.error50}
          size={30}
          onPress={() => setOnlyFavorites(!onlyFavorites)}
          style={{ margin: 0 }}
        />
      </ViewOwn>
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 145,
    paddingHorizontal: 28,
    left: 0,
    right: 0,
    boxShadow: 'rgba(51, 51, 51, 0.15) -1px -12px 17px 0px',
  },
  view: {
    marginTop: 20,
    marginBottom: 6,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    border: 'none',
    paddingTop: 12,
    width: 50,
    height: 40,
  },
});

export default FooterContentListLayoutPlayerPage;
