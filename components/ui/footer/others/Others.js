import { SvgList } from '@/components/icons/List';
import { SvgLoop } from '@/components/icons/Loop';
import ViewOwn from '@/components/own/View';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useNavigation } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

const OthersFooterLayoutPlayerPage = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const fill = useMemo(() => theme.colors.onSurface, [theme]);

  const { isLoop, setIsLoop, setLeftDrawerOpen } = usePlayerBehaviourContext();

  return (
    <ViewOwn style={styles.container}>
      <Pressable onPress={() => setLeftDrawerOpen(true)} accessibilityRole="button">
        <View style={styles.buttons}>
          <SvgList height={26} width={26} style={{ fill, opacity: 1 }} />
        </View>
      </Pressable>
      <Pressable onPress={() => setIsLoop(!isLoop)} accessibilityRole="button">
        <View style={styles.buttons}>
          <SvgLoop height={26} width={26} style={{ fill, opacity: isLoop ? 1 : 0.6 }} />
        </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('settings', { from: 'others' })}
        accessibilityRole="button"
      >
        <View style={styles.buttons}>
          <Icon source="cog" size={26} color={fill} />
        </View>
      </Pressable>
    </ViewOwn>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    width: 50,
    height: 40,
  },
});

export default OthersFooterLayoutPlayerPage;
