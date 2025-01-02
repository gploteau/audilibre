import ViewOwn from '@/components/own/View';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useCacheContext } from '@/contexts/cache';
import { useRootContext } from '@/contexts/root';
import { storeData } from '@/tools/Tools';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, HelperText, Icon, RadioButton, TextInput, useTheme } from 'react-native-paper';

const SettingsPage = ({ route }) => {
  const { from, db_url } = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentTrack } = usePlayerBehaviourContext();
  const insets = useSafeAreaInsets();

  const [hasErrors, setHasErrors] = useState('');
  const [url, setUrl] = useState(db_url || '');
  const [loading, setLoading] = useState(false);

  const { getCache, cache, hardUpdateCache } = useCacheContext();

  const { changeColorScheme } = useRootContext();

  const theme = useTheme();

  useEffect(() => {
    if (!from) {
      navigation.setOptions({ headerBackVisible: false });
    }
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

  const currentUrl = useMemo(() => {
    return getCache('db_url');
  }, [cache]);

  const handleChangeThemeLight = useCallback(
    (value) => {
      hardUpdateCache('theme', value);
      changeColorScheme(value);
    },
    [hardUpdateCache]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
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
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', top: 12, left: 10 }}>
                <Icon size={26} source="contrast-circle" />
              </View>
              <RadioButton.Item value="auto" label="Automatic" labelStyle={{ paddingLeft: 30 }} />
            </View>
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', top: 12, left: 10 }}>
                <Icon
                  size={26}
                  source="weather-sunny"
                  style={{ position: 'absolute', top: 12, left: 10 }}
                />
              </View>
              <RadioButton.Item value="light" label="Light" labelStyle={{ paddingLeft: 30 }} />
            </View>
            <View style={{ position: 'relative' }}>
              <View style={{ position: 'absolute', top: 12, left: 10 }}>
                <Icon
                  size={26}
                  source="moon-waning-crescent"
                  style={{ position: 'absolute', top: 12, left: 10 }}
                />
              </View>
              <RadioButton.Item value="dark" label="Dark" labelStyle={{ paddingLeft: 30 }} />
            </View>
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
              value={url ?? currentUrl ?? ''}
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
      <StatusBar style="auto" />
    </View>
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
