import { getData, storeData } from '@/tools/Tools';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CacheContext = createContext(null);

const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState(null);

  const reloadCache = useCallback(async () => {
    const data = await getData('audilibre');
    setCache(data || {});
  }, [getData, setCache]);

  const hardUpdateCache = useCallback(
    async (key, value) => {
      const hardCache = await getData('audilibre');
      const newCache = { ...hardCache, [key]: value };
      await storeData('audilibre', newCache);
      setCache(newCache);
    },
    [getData, storeData, setCache]
  );

  const hardGetCache = useCallback(
    async (key, defaultValue) => {
      const hardCache = await getData('audilibre');
      return _.get(hardCache, key, defaultValue);
    },
    [getData]
  );

  const updateCache = useCallback(
    (key, value) => {
      const newCache = { ...cache, [key]: value };
      setCache(newCache);
      storeData('audilibre', newCache);
    },
    [cache, storeData, setCache]
  );

  const getCache = useCallback(
    (key, defaultValue) => {
      return _.get(cache, key, defaultValue || null);
    },
    [cache]
  );

  useEffect(() => {
    reloadCache();
  }, []);

  const value = {
    cache,
    reloadCache,
    getCache,
    updateCache,
    hardUpdateCache,
    hardGetCache,
  };

  if (cache === null) return null;

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
