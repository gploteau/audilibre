import { ActivityIndicator } from 'react-native-paper';
import ViewOwn from './View';

const SplashScreen = () => {
  return (
    <ViewOwn fullHeight vcenter center>
      <ActivityIndicator size="large" />
    </ViewOwn>
  );
};

export default SplashScreen;
