import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

const ViewOwn = ({
  children,
  column,
  between,
  evenly,
  vcenter,
  center,
  m,
  mt,
  mb,
  ml,
  mr,
  style,
  lightColor,
  darkColor,
  fullHeight,
  surface,
  ...rest
}) => {
  const margin = {
    marginBottom: m || mb || 0,
    marginTop: m || mt || 0,
    marginLeft: m || ml || 0,
    marginRight: m || mr || 0,
  };

  const justifyContent =
    (between && 'space-between') ||
    (evenly && 'space-evenly') ||
    (center && 'center') ||
    'flex-start';

  const Component = surface ? Surface : View;

  return (
    <Component
      style={[
        styles({ column, justifyContent, vcenter }).container,
        margin,
        fullHeight && { flex: 1 },
        style,
      ]}
      {...rest}
    >
      {children}
    </Component>
  );
};

const styles = ({ column, justifyContent, vcenter }) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      flexDirection: column ? 'column' : 'row',
      justifyContent,
      alignItems: vcenter ? 'center' : 'stretch',
    },
  });

ViewOwn.propTypes = {
  children: PropTypes.node,
  column: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ViewOwn;
