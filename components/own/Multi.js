import { Children, cloneElement } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import TextOwn from './Text';
import ViewOwn from './View';

const MultiOwn = ({ children, containerStyle, ...rest }) => {
  const theme = useTheme();

  const extendedChildren = Children.map(children, (child, index) =>
    cloneElement(child, {
      rowStyle: [child.rowStyle, index === children.length - 1 && { borderBottomWidth: 0 }],
    })
  );

  return (
    <ViewOwn surface column style={[styles(theme).container, containerStyle]} {...rest}>
      {extendedChildren}
    </ViewOwn>
  );
};

MultiOwn.Row = ({ children, rowStyle, ...rest }) => {
  const theme = useTheme();

  return (
    <ViewOwn style={[styles(theme).row, rowStyle]} {...rest}>
      {children}
    </ViewOwn>
  );
};

MultiOwn.Cell = ({ children, cellStyle, right, ...rest }) => {
  return (
    <ViewOwn
      style={[styles().cell, cellStyle, { justifyContent: right ? 'flex-end' : 'flex-start' }]}
      {...rest}
    >
      <TextOwn>{children}</TextOwn>
    </ViewOwn>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: { marginTop: 15, marginBottom: 15, borderRadius: theme?.roundness },
    row: {
      paddingHorizontal: 15,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme?.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    cell: { flex: 1 },
  });

export default MultiOwn;
