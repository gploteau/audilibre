import PropTypes from 'prop-types';
import { createContext, useContext } from 'react';

const RootContext = createContext(null);

const RootProvider = ({ children, changeColorScheme }) => {
  const value = {
    changeColorScheme,
  };

  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
};

RootProvider.propTypes = {
  children: PropTypes.node,
};

const useRootContext = () => {
  const context = useContext(RootContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context) {
      throw new Error('useRootContext must be wrapped in a <RootProvider />');
    }
  }

  return context;
};

export { RootProvider, useRootContext };
