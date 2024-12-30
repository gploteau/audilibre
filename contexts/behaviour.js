import { useCacheContext } from '@/contexts/cache';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { validate as isValidUUID } from 'uuid';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const PlayerContext = createContext(null);

const PlayerBehaviourProvider = ({ children }) => {
  const [trackCache, setTrackCache] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackProgressByUser, setTrackProgressByUser] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(1);
  const [volumeByUser, setVolumeByUser] = useState(0.5);
  const [tracks, setTracks] = useState([]);
  const [sound, setSound] = useState();
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioRef = useRef(null);

  const { getCache, updateCache, hardUpdateCache } = useCacheContext();

  const [isPlaying, setIsPlaying] = useState(false);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);

  const params = useGlobalSearchParams();
  const router = useRouter();

  const _setOnPlaybackStatusUpdate = ({
    positionMillis,
    didJustFinish,
    isPlaying,
    isLoaded,
    shouldPlay,
    durationMillis,
    playableDurationMillis,
    ...rest
  }) => {
    setTrackCache(playableDurationMillis || 0);

    setIsLoaded(isLoaded);

    const updatePosition = async () => {
      const lastPositions = await getCache('positions', {});
      await hardUpdateCache('positions', {
        ...lastPositions,
        [_.get(currentTrack, 'id')]: positionMillis,
      });
    };

    if (isPlaying) {
      setTrackProgress(positionMillis || 0);
      updatePosition();
    }

    if (didJustFinish) {
      setTrackProgress(0);
      changeTrackByWay(1);
    }
  };

  const loadCurrentTrack = useCallback(async () => {
    const shouldPlay = !!sound;

    if (shouldPlay) {
      await sound.unloadAsync();
    }

    const lastPositions = await getCache('positions', {});

    const initialStatus = {
      volume: volumeByUser,
      positionMillis: _.get(lastPositions, _.get(currentTrack, 'id'), 0),
      isLooping: isLoop,
    };

    setIsLoaded(false);
    setTrackProgress(initialStatus.positionMillis);
    setTrackProgressByUser(initialStatus.positionMillis);
    setTrackCache(0);
    updateCache('lastId', _.get(currentTrack, 'id'));

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: _.get(currentTrack, 'file') },
      initialStatus
    );

    router.replace(`/${_.get(currentTrack, 'uuid')}`);

    newSound.setOnPlaybackStatusUpdate(_setOnPlaybackStatusUpdate);
    setSound(newSound);

    shouldPlay && setIsPlaying(true);
  }, [sound, currentTrack, volumeByUser, setTrackProgress, setIsPlaying, getCache, router]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    sound && isLoaded && sound.setStatusAsync({ shouldPlay: isPlaying });
  }, [isPlaying, isLoaded]);

  useEffect(() => {
    sound &&
      isLoaded &&
      sound.setStatusAsync({ positionMillis: trackProgressByUser }) &&
      setTrackProgress(trackProgressByUser);
  }, [trackProgressByUser]);

  useEffect(() => {
    sound && isLoaded && sound.setStatusAsync({ volume: volumeByUser });
  }, [volumeByUser]);

  useEffect(() => {
    sound && isLoaded && sound.setStatusAsync({ isLooping: isLoop });
  }, [isLoop]);

  const favorites = useMemo(() => {
    return getCache('favorites', []);
  }, [getCache]);

  const loadTracks = useCallback(async () => {
    try {
      const res = await fetch(process.env.EXPO_PUBLIC_TRACKS_DB_URL);
      const data = await res.json();

      setTracks(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadTracks();
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    setIsPlaying(false);
    currentTrack && loadCurrentTrack();
  }, [currentTrack]);

  useEffect(() => {
    const update = async () => {
      if (!currentTrack) {
        const id = await getCache('lastId', null);
        setCurrentTrack(id ? _.find(tracks, { id }) : _.head(tracks));
      }
    };

    const regexMD5Exp = /^[a-f0-9]{32}$/gi;
    const uuid = _.get(params, 'uuid');
    if (uuid && regexMD5Exp.test(uuid)) {
      // legacy
      setCurrentTrack(_.find(tracks, { id: uuid }));
    } else if (uuid && isValidUUID(uuid)) {
      setCurrentTrack(_.find(tracks, { uuid }));
    } else {
      update();
    }
  }, [tracks, _.get(params, 'uuid')]);

  const inFavorites = useMemo(() => {
    return _.includes(favorites, _.get(currentTrack, 'id'));
  }, [favorites, currentTrack]);

  const setCurrentTrackFavorite = useCallback(() => {
    updateCache(
      'favorites',
      !inFavorites
        ? [...favorites, _.get(currentTrack, 'id')]
        : _.filter(favorites, _.get(currentTrack, 'id'))
    );
  }, [favorites, inFavorites, updateCache, currentTrack]);

  const setCurrentTrackById = useCallback(
    (id) => {
      setCurrentTrack(_.find(tracks, { id }));
    },
    [tracks]
  );

  const getPreviousTrack = useCallback(() => {
    const prev = _.findIndex(tracks, { id: _.get(currentTrack, 'id') }) - 1;
    if (prev < 0) return _.last(tracks);
    return _.nth(tracks, prev);
  }, [currentTrack, tracks]);

  const getNextTrack = useCallback(() => {
    if (isShuffle) {
      return _.chain(tracks)
        .reject({ id: _.get(currentTrack, 'id') })
        .shuffle()
        .head()
        .value();
    }

    const next = _.findIndex(tracks, { id: _.get(currentTrack, 'id') }) + 1;
    if (next >= _.size(tracks)) return _.head(tracks);

    return _.nth(tracks, next);
  }, [currentTrack, tracks, isShuffle]);

  const changeTrackByWay = useCallback(
    (way = 1) => {
      const track = way === 1 ? getNextTrack() : getPreviousTrack();
      setIsPlaying(false);
      setCurrentTrack(track);
    },
    [getNextTrack, getPreviousTrack, setCurrentTrack, setTrackProgress, setIsPlaying]
  );

  const behaviours = {
    audioRef,
    favorites,
    currentTrack,
    setCurrentTrackById,
    tracks,
    inFavorites,
    setCurrentTrackFavorite,
    changeTrackByWay,
    setIsPlaying,
    isPlaying,
    trackProgress,
    setTrackProgressByUser,
    setVolumeByUser,
    volumeByUser,
    volume,
    trackCache,
    isLoaded,
    isLoop,
    setIsLoop,
    isShuffle,
    setIsShuffle,
    leftDrawerOpen,
    setLeftDrawerOpen,
  };

  return <PlayerContext.Provider value={behaviours}>{children}</PlayerContext.Provider>;
};

PlayerBehaviourProvider.propTypes = {
  children: PropTypes.node,
};

const usePlayerBehaviourContext = () => {
  const context = useContext(PlayerContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context) {
      throw new Error('usePlayerBehaviourContext must be wrapped in a <PlayerBehaviourProvider />');
    }
  }

  return context;
};

export { PlayerBehaviourProvider, usePlayerBehaviourContext };
