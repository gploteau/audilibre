import ViewOwn from '@/components/own/View';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import TextOwn from '@/components/own/Text';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useCacheContext } from '@/contexts/cache';
import { useRootContext } from '@/contexts/root';
import { storeData } from '@/tools/Tools';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, HelperText, Icon, RadioButton, TextInput, useTheme } from 'react-native-paper';

const SettingsPage = ({ route }) => {
  const { from } = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentTrack } = usePlayerBehaviourContext();
  const insets = useSafeAreaInsets();

  const [hasErrors, setHasErrors] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { getCache, cache, hardUpdateCache } = useCacheContext();

  const { changeColorScheme } = useRootContext();

  const theme = useTheme();

  useEffect(() => {
    if (!from) return;
    navigation.setOptions({ headerShown: true, title: 'Settings' });
  }, [navigation, from]);

  const saveParams = useCallback(async () => {
    if (url) {
      try {
        setHasErrors('');
        setLoading(true);
        const dist = url.startsWith('http') ? url : `https://${url}`;
        const res = await fetch(dist);
        const data = await res.json();
        if (_.isArray(data)) {
          const diff = _.chain(data)
            .map((value) =>
              _.isEmpty(
                _.difference(_.keys(value), [
                  'id',
                  'uuid',
                  'duration',
                  'file',
                  'title',
                  'author',
                  'cover',
                ])
              )
            )
            .value();
          if (_.size(diff) === _.size(data)) {
            await hardUpdateCache('db_url', dist);
            navigation.navigate('index');
            return;
          }
        }

        setHasErrors('This file is unvalid');
      } catch (e) {
        setHasErrors(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  }, [url, storeData]);

  useEffect(() => {
    setHasErrors('');
  }, [url]);

  const currentThemeLight = useMemo(() => {
    return getCache('theme');
  }, [cache]);

  const handleChangeThemeLight = useCallback(
    (value) => {
      hardUpdateCache('theme', value);
      changeColorScheme(value);
    },
    [hardUpdateCache]
  );

  return (
    <SafeAreaView
      emulateUnlessSupported={true}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <ViewOwn fullHeight column>
        <ViewOwn
          column
          surface
          elevation={1}
          style={{
            padding: 15,
            marginBottom: 15,
          }}
        >
          <RadioButton.Group
            onValueChange={handleChangeThemeLight}
            value={currentThemeLight || 'auto'}
          >
            <RadioButton.Item
              value="auto"
              label={
                <ViewOwn vcenter style={{ backgroundColor: 'transparent' }}>
                  <Icon size={26} source="contrast-circle" />
                  <TextOwn style={{ marginLeft: 10 }}>Automatic</TextOwn>
                </ViewOwn>
              }
            />
            <RadioButton.Item
              value="light"
              label={
                <ViewOwn vcenter style={{ backgroundColor: 'transparent' }}>
                  <Icon size={26} source="weather-sunny" />
                  <TextOwn style={{ marginLeft: 10 }}>Light</TextOwn>
                </ViewOwn>
              }
            />
            <RadioButton.Item
              value="dark"
              label={
                <ViewOwn vcenter style={{ backgroundColor: 'transparent' }}>
                  <Icon size={26} source="moon-waning-crescent" />
                  <TextOwn style={{ marginLeft: 10 }}>Dark</TextOwn>
                </ViewOwn>
              }
            />
          </RadioButton.Group>
        </ViewOwn>
        <ViewOwn
          column
          surface
          style={{
            padding: 15,
          }}
        >
          <ViewOwn style={{ backgroundColor: 'transparent' }} column>
            <TextInput
              mode="outlined"
              label="Database url"
              value={url}
              onChangeText={(text) => setUrl(text)}
              style={{ width: '100%' }}
            />
            <HelperText type="error" visible={true} style={{ width: '100%' }}>
              {hasErrors}
            </HelperText>
          </ViewOwn>
          <ViewOwn style={{ justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
            <Button
              mode="contained-tonal"
              icon="content-save-check-outline"
              onPress={saveParams}
              disabled={loading}
              loading={loading}
            >
              Save
            </Button>
          </ViewOwn>
        </ViewOwn>
      </ViewOwn>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.select({
      android: 8,
      web: 16,
      ios: 10,
    }),
    height: '100%',
    overflow: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    userSelect: 'none',
  },
  surface: {},
});

export default SettingsPage;
