import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import TextOwn from '@/components/own/Text';
import ViewOwn from '@/components/own/View';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ViewOwn column vcenter center fullHeight>
        <TextOwn type="title">This page doesn't exist.</TextOwn>
        <Link href="/" style={styles.link}>
          <TextOwn type="link" style={{ textDecoration: 'underline' }}>
            Go to home screen
          </TextOwn>
        </Link>
      </ViewOwn>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
