import { Text, YStack, XStack, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    // TODO: Add real authentication logic here
    // For now, just navigate to the main app
    router.replace('/(tabs)');
  }

  function handleSkip() {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <YStack flex={1} backgroundColor={colors.background} paddingHorizontal={20} justifyContent="center" gap={32}>

          {/* Logo/Branding Section */}
          <YStack alignItems="center" gap={12}>
            <Text fontSize={36} fontWeight="700" color={colors.text} fontFamily="$body">
              Zenbund
            </Text>
            <Text fontSize={15} color={colors.textSecondary} textAlign="center" fontFamily="$body">
              Welcome back! Sign in to continue
            </Text>
          </YStack>

          {/* Form Section */}
          <YStack gap={16}>
            {/* Email Input */}
            <YStack gap={8}>
              <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                Email
              </Text>
              <XStack
                backgroundColor={colors.backgroundSecondary}
                borderRadius={20}
                paddingHorizontal={16}
                alignItems="center"
                borderColor={colors.border}
                borderWidth={1}
                gap={8}
              >
                <Mail size={20} color={colors.icon} strokeWidth={2.5} />
                <Input
                  flex={1}
                  placeholder="your.email@university.edu"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  borderWidth={0}
                  backgroundColor="transparent"
                  paddingHorizontal={0}
                  paddingVertical={0}
                  fontSize={16}
                  fontFamily="$body"
                  color={colors.text}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </XStack>
            </YStack>

            {/* Password Input */}
            <YStack gap={8}>
              <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                Password
              </Text>
              <XStack
                backgroundColor={colors.backgroundSecondary}
                borderRadius={20}
                paddingHorizontal={16}
                alignItems="center"
                borderColor={colors.border}
                borderWidth={1}
                gap={8}
              >
                <Lock size={20} color={colors.icon} strokeWidth={2.5} />
                <Input
                  flex={1}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  borderWidth={0}
                  backgroundColor="transparent"
                  paddingHorizontal={0}
                  paddingVertical={0}
                  fontSize={16}
                  fontFamily="$body"
                  color={colors.text}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </XStack>
            </YStack>

            {/* Forgot Password */}
            <XStack justifyContent="flex-end">
              <Text
                fontSize={14}
                color={colors.primary}
                fontWeight="600"
                fontFamily="$body"
                pressStyle={{ opacity: 0.7 }}
                cursor="pointer"
              >
                Forgot Password?
              </Text>
            </XStack>
          </YStack>

          {/* Login Button */}
          <YStack gap={12}>
            <XStack
              backgroundColor={colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={handleLogin}
            >
              <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                Login
              </Text>
            </XStack>

            {/* Skip Button - Dev Only */}
            <XStack
              justifyContent="center"
              paddingVertical={8}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
              onPress={handleSkip}
            >
              <Text fontSize={14} color={colors.textSecondary} fontFamily="$body">
                Skip for now
              </Text>
            </XStack>
          </YStack>

          {/* Register Link */}
          <XStack justifyContent="center" gap={4}>
            <Text fontSize={15} color={colors.textSecondary} fontFamily="$body">
              Don't have an account?
            </Text>
            <Text
              fontSize={15}
              color={colors.primary}
              fontWeight="600"
              fontFamily="$body"
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
              onPress={() => router.push('/register')}
            >
              Register
            </Text>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
