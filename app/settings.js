import ViewOwn from '@/components/own/View';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useCacheContext } from '@/contexts/cache';
import { useRootContext } from '@/contexts/root';
import { useYupValidationResolver } from '@/tools/Tools';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { Button, HelperText, Icon, RadioButton, TextInput, useTheme } from 'react-native-paper';
import * as yup from 'yup';

const SettingsPage = ({ route }) => {
  const { from, db_url: db_url_param } = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentTrack } = usePlayerBehaviourContext();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const { getCache, cache, hardUpdateCache, hardGetCache } = useCacheContext();

  const { changeColorScheme } = useRootContext();

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
