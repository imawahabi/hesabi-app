import { router } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  useEffect(() => {
    // التحويل الفوري إلى صفحة Splash
    router.replace('/splash');
  }, []);

  // إرجاع null لأن الصفحة ستكون مخفية
  return null;
}
