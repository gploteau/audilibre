import { SvgList } from '@/components/icons/List';
import { SvgLoop } from '@/components/icons/Loop';
import { SvgShuffle } from '@/components/icons/Shuffle';
import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

const OthersFooterLayoutPlayerPage = () => {
  const navigation = useNavigation();
  const fill = useThemeColor({}, 'text');
  const { isLoop, setIsLoop, isShuffle, setIsShuffle, setLeftDrawerOpen } =
    usePlayerBehaviourContext();

  return (
    <ViewOwn style={styles.container}>
      <Pressable onPress={() => setLeftDrawerOpen(true)} accessibilityRole="button">
        <View style={styles.buttons}>
          <SvgList height={15} style={{ fill, opacity: 1 }} />
        </View>
      </Pressable>
      <Pressable onPress={() => setIsLoop(!isLoop)} accessibilityRole="button">
        <View style={styles.buttons}>
          <SvgLoop height={15} style={{ fill, opacity: isLoop ? 1 : 0.6 }} />
        </View>
      </Pressable>
      <Pressable onPress={() => setIsShuffle(!isShuffle)} accessibilityRole="button">
        <View style={styles.buttons}>
          <SvgShuffle height={15} style={{ fill, opacity: isShuffle ? 1 : 0.6 }} />
        </View>
      </Pressable>
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    border: 'none',
    padding: 12,
    width: 50,
    height: 40,
  },
});

export default OthersFooterLayoutPlayerPage;
