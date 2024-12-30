import Svg, { Path } from 'react-native-svg';
export const SvgPrevious = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 70.7 70.7" {...props}>
    <Path d="M3.2 20.5h8.9v29.7H3.2zm56.2 33.8L23 35.3l36.4-19z" />
  </Svg>
);

export const SvgPlay = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 80 80" {...props}>
    <Path d="m17.5 70.8 59-30.8-59-30.8z" />
  </Svg>
);

export const SvgPause = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 80 80" {...props}>
    <Path d="M15.7 9.2h19.2v61.7H15.7zm29.5 0h19.2v61.7H45.2z" />
  </Svg>
);

export const SvgNext = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 70.7 70.7" {...props}>
    <Path d="M58.5 20.5h8.9v29.7h-8.9zM11.3 54.3l36.4-19-36.4-19z" />
  </Svg>
);
