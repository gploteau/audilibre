import _ from 'lodash';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePlayerBehaviourContext } from './behaviour';

const TracksListContext = createContext(null);

const TracksListBehaviourProvider = ({ children }) => {
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredTracks, setFilteredTracks] = useState([]);

  const { favorites, tracks } = usePlayerBehaviourContext();

  const addFavoriteFilter = useCallback(
    (filtered) => {
      return _.chain(filtered)
        .filter((track) => (onlyFavorites ? _.includes(favorites, _.get(track, 'id')) : true))
        .value();
    },
    [onlyFavorites, favorites]
  );

  useEffect(() => {
    setFilteredTracks(_.map(tracks, 'id'));
  }, [tracks]);

  useEffect(() => {
    const newFiltered = addFavoriteFilter(
      _.filter(tracks, (track) =>
        filterText ? _.toLower(_.get(track, 'title')).includes(_.toLower(filterText)) : true
      )
    );
    setFilteredTracks(_.map(newFiltered, 'id'));
  }, [tracks, setFilteredTracks, filterText, onlyFavorites, favorites]);

  const behaviours = {
    filterText,
    setFilterText,
    setOnlyFavorites,
    onlyFavorites,
    filteredTracks,
  };

  return <TracksListContext.Provider value={behaviours}>{children}</TracksListContext.Provider>;
};

TracksListBehaviourProvider.propTypes = {
  children: PropTypes.node,
};

const useTracksListBehaviourContext = () => {
  const context = useContext(TracksListContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context) {
      throw new Error(
        'useTracksListBehaviourContext must be wrapped in a <TracksListBehaviourProvider />'
      );
    }
  }

  return context;
};

export { TracksListBehaviourProvider, useTracksListBehaviourContext };
