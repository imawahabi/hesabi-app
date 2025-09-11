import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nManager } from 'react-native';

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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
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
        }}
      />
    </Stack>
  );
}
