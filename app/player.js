import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Page({ route }) {
  console.log(route);

  const router = useRouter();
  const { colors } = useTheme();
  const { currentTrack, setCurrentTrackById } = usePlayerBehaviourContext();
  const [trackId, setTrackId] = useState(route.params?.trackId);

  useEffect(() => {
    route.params?.trackId && setCurrentTrackById(route.params?.trackId);
  }, [route]);

  return null;
}
