import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const TextOwn = ({ children, ellipsis, style, color, ...rest }) => {
  return (
    <Text
      {...rest}
      {...(ellipsis && { numberOfLines: 1, ellipsizeMode: 'tail' })}
      style={[style, ellipsis && styles.ellipsis, color && { color }]}
    >
      {children}
    </Text>
  );
};

const styles = () =>
  StyleSheet.create({
    ellipsis: {
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  });

TextOwn.propTypes = {
  children: PropTypes.node,
  ellipsis: PropTypes.bool,
  style: PropTypes.object,
};

export default TextOwn;
