import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Drawer } from 'react-native-drawer-layout';
import ContentListLayoutPlayerPage from './content/Content';

const LeftDrawerScreen = ({ children }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const { leftDrawerOpen, setLeftDrawerOpen } = usePlayerBehaviourContext();

  return (
    <Drawer
      open={leftDrawerOpen}
      onOpen={() => setLeftDrawerOpen(true)}
      onClose={() => setLeftDrawerOpen(false)}
      renderDrawerContent={(props) => <ContentListLayoutPlayerPage {...props} />}
      drawerStyle={{
        backgroundColor,
        width: '100%',
      }}
    >
      {children}
    </Drawer>
  );
};

export default LeftDrawerScreen;
