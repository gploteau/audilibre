import TextOwn from '@/components/own/Text';
import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { durationWithPadding } from '@/tools/Tools';
import _ from 'lodash';
import numeral from 'numeral';
import { useCallback } from 'react';
import { Share } from 'react-native';
import { IconButton, MD3Colors, Tooltip, useTheme } from 'react-native-paper';

const HeaderLayoutPlayerPage = (props) => {
  const theme = useTheme();
  const { audioRef, isPlaying, currentTrack, inFavorites, setCurrentTrackFavorite, trackProgress } =
    usePlayerBehaviourContext();

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        title: _.get(currentTrack, 'title'),
        message: `Voici un titre qui pourrait t'intéresser : ${_.get(
          currentTrack,
          'title'
        )}\nhttps://sharing.vendorbox.fr/${_.get(currentTrack, 'uuid')}`,
        url: `https://sharing.vendorbox.fr/${_.get(currentTrack, 'uuid')}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (e) {
      console.error(e.message);
    }
  }, [currentTrack]);

  return (
    <ViewOwn column>
      <ViewOwn between vcenter>
        <ViewOwn>
          <TextOwn variant="bodySmall" style={{ letterSpacing: 2, marginRight: 15, width: 70 }}>
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </TextOwn>
          <TextOwn variant="boldSmall" style={{ letterSpacing: 2, minWidth: 72 }}>
            {durationWithPadding(trackProgress)}
          </TextOwn>
          <TextOwn>/</TextOwn>
          <TextOwn variant="boldSmall" style={{ letterSpacing: 2, marginLeft: 6 }}>
            {durationWithPadding(numeral(_.get(currentTrack, 'duration')).multiply(1000).value())}
          </TextOwn>
        </ViewOwn>
        <ViewOwn>
          <IconButton
            icon={inFavorites ? 'heart' : 'heart-outline'}
            iconColor={MD3Colors.error50}
            size={30}
            onPress={setCurrentTrackFavorite}
            style={{ margin: 0 }}
          />
          <IconButton
            icon={'share-variant-outline'}
            iconColor={theme.colors.onBackground}
            size={30}
            onPress={onShare}
            style={{ margin: 0 }}
          />
        </ViewOwn>
      </ViewOwn>
      <ViewOwn column style={{ width: 'min-content' }}>
        <Tooltip title={_.get(currentTrack, 'title')} leaveTouchDelay={500} enterTouchDelay={100}>
          <TextOwn variant="titleLarge" ellipsis>
            {_.get(currentTrack, 'title')}
          </TextOwn>
        </Tooltip>
      </ViewOwn>
      <ViewOwn>
        <TextOwn variant="bodySmall">{_.get(currentTrack, 'author')}</TextOwn>
      </ViewOwn>
    </ViewOwn>
  );
};

export default HeaderLayoutPlayerPage;
