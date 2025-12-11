import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PortalProvider, TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import config from '../tamagui.config';
import { AuthProvider } from '@/contexts/AuthContext';

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

// No longer need to set initialRouteName, using index.tsx redirect instead

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TamaguiProvider config={config} defaultTheme={colorScheme || 'light'}>
          <PortalProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="wishlist" options={{ headerShown: false, animation: 'slide_from_left' }} />
                <Stack.Screen name="listing-detail" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="seller-listing-detail" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="chat" options={{ headerShown: false }} />
                <Stack.Screen name="threads" options={{ headerShown: false }} />
                <Stack.Screen name="[category]" options={{ headerShown: false }} />
                <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="thread-settings" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="add-comment-modal" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="comment-replies" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </PortalProvider>
        </TamaguiProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
