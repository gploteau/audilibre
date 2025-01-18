import { useCacheContext } from '@/contexts/cache';
// import ExpoControlNotification from '@/modules/expo-control-notification';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
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
import { Platform } from 'react-native';
import { validate as isValidUUID } from 'uuid';

const PlayerContext = createContext(null);

const PlayerBehaviourProvider = ({ children }) => {
  const [trackCache, setTrackCache] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackProgressByUser, setTrackProgressByUser] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [volumeByUser, setVolumeByUser] = useState(0.5);
  const [tracks, setTracks] = useState([]);
  const [sound, setSound] = useState();
  const [isLoop, setIsLoop] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [initialized, setInitialized] = useState(false);

  const audioRef = useRef(null);

  const { cache, getCache, updateCache, hardUpdateCache } = useCacheContext();

  const [isPlaying, setIsPlaying] = useState(false);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);

  const params = useGlobalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

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

  const isWeb = useMemo(() => Platform.OS === 'web', [Platform]);

  const loadCurrentTrack = useCallback(async () => {
    const shouldPlay = !!sound && isPlaying;

    if (shouldPlay) {
      await sound.unloadAsync();
    }

    setIsLoading(true);
    setIsPlaying(false);

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
      { uri: _.get(currentTrack, 'url') },
      initialStatus
    );

    navigation.navigate('[uuid]', { uuid: _.get(currentTrack, 'uuid') });

    setSound(newSound);

    /*     await ExpoControlNotification.showAudioNotification(
      _.get(currentTrack, 'title'),
      _.get(currentTrack, 'url'),
      _.get(currentTrack, 'artwork')
    ); */

    newSound.setOnPlaybackStatusUpdate(_setOnPlaybackStatusUpdate);

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

    const update = async () => {
      const { isLoaded: isStatusLoaded } = await sound.getStatusAsync();
      setIsLoading(!isStatusLoaded);
    };

    sound && update();

    return sound
      ? () => {
          setIsLoaded(false);
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const canChange = async () => {
      const { isLoaded: isStatusLoaded } = await sound.getStatusAsync();
      isStatusLoaded && sound.setStatusAsync({ shouldPlay: isPlaying });
    };

    sound && canChange();
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
      const url = getCache('db_url');
      if (!url) {
        navigation.navigate('settings', { db_url: _.get(params, 'db_url', '') });
        return;
      }
      const res = await fetch(url);
      const data = await res.json();

      const tracks = _.map(data, (track) => {
        return {
          id: _.get(track, 'id'),
          uuid: _.get(track, 'uuid'),
          url: _.get(track, 'file'),
          title: _.get(track, 'title'),
          artist: _.get(track, 'author'),
          artwork: _.get(track, 'cover'),
          duration: _.get(track, 'duration'),
        };
      });

      setTracks(tracks);
    } catch (e) {
      console.error(e);
    }
  }, [getCache]);

  useEffect(() => {
    const unallowedRoutes = ['privacy-policy'];
    const currentRoute = navigation.getState().routes.at(-1)?.name;
    if (unallowedRoutes.includes(currentRoute)) {
      return;
    }
    loadTracks();
  }, [_.get(cache, 'db_url')]);

  useEffect(() => {
    setIsLoaded(false);
    currentTrack && loadCurrentTrack();
  }, [currentTrack]);

  const selectTrack = useCallback(async () => {
    if (!currentTrack) {
      const id = await getCache('lastId', null);
      setCurrentTrack(id ? _.find(tracks, { id }) : _.head(tracks));
    }
  }, [currentTrack, tracks, cache, getCache]);

  useEffect(() => {
    const regexMD5Exp = /^[a-f0-9]{32}$/gi;
    const uuid = _.get(params, 'uuid');
    if (uuid && regexMD5Exp.test(uuid)) {
      // legacy
      setCurrentTrack(_.find(tracks, { id: uuid }));
    } else if (uuid && isValidUUID(uuid)) {
      setCurrentTrack(_.find(tracks, { uuid }));
    } else {
      selectTrack();
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
    (uuid) => {
      setCurrentTrack(_.find(tracks, { uuid }));
    },
    [tracks]
  );

  const getPreviousTrack = useCallback(() => {
    const prev = _.findIndex(tracks, { id: _.get(currentTrack, 'id') }) - 1;
    if (prev < 0) return _.last(tracks);
    return _.nth(tracks, prev);
  }, [currentTrack, tracks]);

  const getNextTrack = useCallback(() => {
    const next = _.findIndex(tracks, { id: _.get(currentTrack, 'id') }) + 1;
    if (next >= _.size(tracks)) return _.head(tracks);

    return _.nth(tracks, next);
  }, [currentTrack, tracks]);

  const changeTrackByWay = useCallback(
    (way = 1) => {
      const track = way === 1 ? getNextTrack() : getPreviousTrack();
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
    setVolume,
    volume,
    trackCache,
    isLoaded,
    isLoop,
    setIsLoop,
    leftDrawerOpen,
    setLeftDrawerOpen,
    isLoading,
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
