import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nManager, View } from 'react-native';
import BottomNav from './components/BottomNav';

import './global.css';

// Suppress useInsertionEffect warning from react-native-screens
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(' ');
  if (message.includes('useInsertionEffect') ||
      message.includes('must not schedule updates') ||
      message.includes('ScreenContentWrapper') ||
      message.includes('RNSScreenStack')) {
    return;
  }
  originalWarn(...args);
};

// Suppress error warnings from react-native-screens
const originalError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('useInsertionEffect') ||
      message.includes('must not schedule updates') ||
      message.includes('ScreenContentWrapper') ||
      message.includes('RNSScreenStack')) {
    return;
  }
  originalError(...args);
};

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-SemiBold': Cairo_600SemiBold,
    'Cairo-Bold': Cairo_700Bold,
  });

  const pathname = usePathname();
  const isMainRoute = ['/dashboard', '/commitments', '/analytics', '/settings'].includes(pathname);
  const currentRouteLabel =
    pathname === '/dashboard'
      ? 'الرئيسية'
      : pathname === '/commitments'
      ? 'الالتزامات'
      : pathname === '/analytics'
      ? 'التحليلات'
      : pathname === '/settings'
      ? 'الاعدادات'
      : undefined;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
            title: '',
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: false,
            title: '',
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="commitments"
          options={{
            headerShown: false,
            title: '',
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="analytics"
          options={{
            headerShown: false,
            title: '',
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            title: '',
            animation: 'none',
          }}
        />
      </Stack>

      {isMainRoute && (
        <BottomNav
          currentRoute={currentRouteLabel}
          onAddCommitment={() => router.push('/commitments?add=true')}
        />
      )}
    </View>
  );
}
