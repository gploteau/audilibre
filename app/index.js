import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import _ from 'lodash';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentTrack } = usePlayerBehaviourContext();

  useEffect(() => {
    currentTrack && router.replace(`/${_.get(currentTrack, 'uuid')}`);
  }, [currentTrack]);

  return null;
}
