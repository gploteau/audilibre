import { useFocusEffect, useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();

  useFocusEffect(() => {
    // router.replace(`/initialize`);
  });

  return null;
}
