import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

export const durationWithPadding = (ms) => {
  const duration = moment.duration(ms);
  return (
    Math.floor(duration.as('h')).toString().padStart(2, '0') +
    moment.utc(duration.as('ms')).format(':mm:ss')
  );
};
