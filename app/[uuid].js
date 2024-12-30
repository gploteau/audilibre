import LayoutPlayerPage from '@/components/ui';
import LeftDrawerScreen from '@/components/ui/list/List';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

export default function Route() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();

  useFocusEffect(() => {
    setHasHydrated(true);
  });

  if (!hasHydrated) {
    return null;
  }

  return (
    <LeftDrawerScreen>
      <LayoutPlayerPage />
    </LeftDrawerScreen>
  );
}
