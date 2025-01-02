import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const TextOwn = ({ children, ellipsis, style, ...rest }) => {
  return (
    <Text
      {...rest}
      {...(ellipsis && { numberOfLines: 1, ellipsizeMode: 'tail' })}
      style={[style, ellipsis && styles.ellipsis]}
    >
      {children}
    </Text>
  );
};

const styles = () =>
  StyleSheet.create({
    ellipsis: {
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
