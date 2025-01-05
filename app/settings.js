import ViewOwn from '@/components/own/View';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MultiOwn from '@/components/own/Multi';
import TextOwn from '@/components/own/Text';
import { useCacheContext } from '@/contexts/cache';
import { useRootContext } from '@/contexts/root';
import { useYupValidationResolver } from '@/tools/Tools';
import Constants from 'expo-constants';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { Button, HelperText, Icon, RadioButton, TextInput, useTheme } from 'react-native-paper';
import * as yup from 'yup';

const SettingsPage = ({ route }) => {
  const { from, db_url: db_url_param } = useLocalSearchParams();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const { getCache, cache, hardUpdateCache, hardGetCache } = useCacheContext();

  const { changeColorScheme, currentColorScheme } = useRootContext();

  const theme = useTheme();

  const validationSchema = yup.object({
    db_url: yup.string().required('Required'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    control,
    setError,
    setValue,
    formState: { errors, isDirty, isValid, defaultValues },
  } = useForm({
    resolver,
    defaultValues: async () => {
      return {
        db_url: await hardGetCache('db_url', ''),
      };
    },
  });

  const version = useMemo(() => Constants.expoConfig.version);

  useEffect(() => {
    db_url_param && setValue('db_url', db_url_param, { shouldDirty: true, shouldValidate: true });
  }, [db_url_param, defaultValues]);

  useEffect(() => {
    if (from !== 'others') {
      navigation.setOptions({
        headerLeft: null,
        headerBackButtonMenuEnabled: false,
        headerBackVisible: false,
      });
    }
  }, [navigation, from]);

  const onSubmit = useCallback(
    async ({ data }) => {
      const { db_url } = data;
      if (db_url) {
        try {
          setLoading(true);
          const dist = db_url.startsWith('http') ? db_url : `https://${db_url}`;
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

          setError('db_url', { type: 'custom', message: 'This file is unvalid' });
        } catch (e) {
          setError('db_url', { type: 'custom', message: e.message });
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    },
    [hardUpdateCache]
  );

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
      <TextOwn variant="bold" style={{ paddingLeft: 10, marginBottom: 15, marginTop: 15 }}>
        Theme
      </TextOwn>
      <ViewOwn fullHeight column>
        <ViewOwn
          column
          surface
          style={{
            marginBottom: 15,
            borderRadius: theme.roundness,
          }}
        >
          <RadioButton.Group
            onValueChange={handleChangeThemeLight}
            value={currentThemeLight || 'auto'}
          >
            <View
              style={{
                position: 'relative',
                borderBottomWidth: 1,
                borderBottomColor: theme?.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                paddingVertical: 5,
              }}
            >
              <View style={{ position: 'absolute', top: 18, left: 15 }}>
                <Icon size={26} source="contrast-circle" />
              </View>
              <RadioButton.Item value="auto" label="Automatic" labelStyle={{ paddingLeft: 35 }} />
            </View>
            <View
              style={{
                position: 'relative',
                borderBottomWidth: 1,
                borderBottomColor: theme?.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                paddingVertical: 5,
              }}
            >
              <View style={{ position: 'absolute', top: 18, left: 15 }}>
                <Icon
                  size={26}
                  source="weather-sunny"
                  style={{ position: 'absolute', top: 12, left: 10 }}
                />
              </View>
              <RadioButton.Item value="light" label="Light" labelStyle={{ paddingLeft: 35 }} />
            </View>
            <View
              style={{
                position: 'relative',
                paddingVertical: 5,
              }}
            >
              <View style={{ position: 'absolute', top: 18, left: 15 }}>
                <Icon
                  size={26}
                  source="moon-waning-crescent"
                  style={{ position: 'absolute', top: 12, left: 10 }}
                />
              </View>
              <RadioButton.Item value="dark" label="Dark" labelStyle={{ paddingLeft: 35 }} />
            </View>
          </RadioButton.Group>
        </ViewOwn>
        <TextOwn variant="bold" style={{ paddingLeft: 10, marginBottom: 15, marginTop: 15 }}>
          Playlist
        </TextOwn>
        <ViewOwn
          column
          surface
          style={{
            padding: 15,
            marginBottom: 15,
          }}
        >
          <Form
            control={control}
            onSubmit={onSubmit}
            render={({ submit }) => {
              return (
                <>
                  <ViewOwn style={{ backgroundColor: 'transparent' }} column>
                    <Controller
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, ...rest } }) => (
                        <TextInput
                          mode="outlined"
                          label="Database url"
                          style={{ width: '100%' }}
                          onChangeText={onChange}
                          {...rest}
                        />
                      )}
                      name="db_url"
                    />

                    <HelperText type="error" visible={true} style={{ width: '100%' }}>
                      {errors.db_url?.message}
                    </HelperText>
                  </ViewOwn>
                  <ViewOwn style={{ justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
                    <Button
                      mode="contained-tonal"
                      icon="content-save-check-outline"
                      onPress={submit}
                      disabled={loading || !isDirty || !isValid}
                      loading={loading}
                    >
                      Save
                    </Button>
                  </ViewOwn>
                </>
              );
            }}
          ></Form>
        </ViewOwn>
        <TextOwn variant="bold" style={{ paddingLeft: 10, marginTop: 15 }}>
          App Info
        </TextOwn>
        <MultiOwn>
          <MultiOwn.Row key={0}>
            <MultiOwn.Cell>Client version</MultiOwn.Cell>
            <MultiOwn.Cell right>{version}</MultiOwn.Cell>
          </MultiOwn.Row>
          <MultiOwn.Row key={1}>
            <MultiOwn.Cell>Privacy Policy</MultiOwn.Cell>
            <MultiOwn.Cell right>
              <Link href="/privacy-policy">
                <ViewOwn vcenter style={{ gap: 10 }}>
                  <Icon source="link" size={25} />
                  <TextOwn>Read</TextOwn>
                </ViewOwn>
              </Link>
            </MultiOwn.Cell>
          </MultiOwn.Row>
        </MultiOwn>
      </ViewOwn>
      <StatusBar style={currentColorScheme === 'dark' ? 'light' : 'dark'} />
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
