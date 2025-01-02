import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { Drawer } from 'react-native-drawer-layout';
import { useTheme } from 'react-native-paper';
import ContentListLayoutPlayerPage from './content/Content';

const LeftDrawerScreen = ({ children }) => {
  const theme = useTheme();
  const { leftDrawerOpen, setLeftDrawerOpen } = usePlayerBehaviourContext();

  return (
    <Drawer
      open={leftDrawerOpen}
      onOpen={() => setLeftDrawerOpen(true)}
      onClose={() => setLeftDrawerOpen(false)}
      renderDrawerContent={(props) => <ContentListLayoutPlayerPage {...props} />}
      drawerStyle={{
        width: '100%',
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </Drawer>
  );
};

export default LeftDrawerScreen;
