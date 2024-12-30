import { getData, storeData } from '@/tools/Tools';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CacheContext = createContext(null);

const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});

  const loadCache = useCallback(async () => {
    const data = await getData('sharing');
    setCache(data);
  }, [getData, setCache]);

  const hardUpdateCache = useCallback(
    async (key, value) => {
      const hardCache = await getData('sharing');
      const newCache = { ...hardCache, [key]: value };
      await storeData('sharing', newCache);
    },
    [getData, storeData]
  );

  const updateCache = useCallback(
    (key, value) => {
      const newCache = { ...cache, [key]: value };
      setCache(newCache);
      storeData('sharing', newCache);
    },
    [cache, storeData, setCache]
  );

  const getCache = useCallback(
    (key, defaultValue) => {
      return _.get(cache, key, defaultValue);
    },
    [cache]
  );

  useEffect(() => {
    loadCache();
  }, []);

  const value = {
    getCache,
    updateCache,
    hardUpdateCache,
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};

CacheProvider.propTypes = {
  children: PropTypes.node,
};

const useCacheContext = () => {
  const context = useContext(CacheContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context) {
      throw new Error('useCacheContext must be wrapped in a <CacheProvider />');
    }
  }

  return context;
};

export { CacheProvider, useCacheContext };
