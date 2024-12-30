import LayoutPlayerPage from '@/components/ui';
import LeftDrawerScreen from '@/components/ui/list/List';
import { usePlayerBehaviourContext } from '@/contexts/behaviour';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { validate as isValidUUID } from 'uuid';

export default function Route() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { currentTrack } = usePlayerBehaviourContext();

  useEffect(() => {
    const regexMD5Exp = /^[a-f0-9]{32}$/gi;

    if (regexMD5Exp.test(params.uuid) || isValidUUID(params.uuid)) {
      return;
    }

    if (hasHydrated && currentTrack) {
      router.replace(`/${_.get(currentTrack, 'uuid')}`);
    }
  }, [hasHydrated, currentTrack]);

  useFocusEffect(() => {
    setHasHydrated(true);
  });

  if (!currentTrack || !hasHydrated) {
    return null;
  }

  return (
    <LeftDrawerScreen>
      <LayoutPlayerPage />
    </LeftDrawerScreen>
  );
}
