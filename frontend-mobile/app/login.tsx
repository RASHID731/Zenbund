import { Text, YStack, XStack, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { validateLoginForm } from '@/lib/validation';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handle login button press.
   * Validates form, calls API, navigates to app on success.
   */
  async function handleLogin() {
    // Clear previous error
    setErrorMessage('');

    // Validate form inputs
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please check your inputs');
      return;
    }

    setIsLoading(true);

    try {
      // Call login function from AuthContext
      // This calls the backend API and saves JWT token
      const result = await login(email, password);

      if (result.success) {
        // Login successful! Navigate to main app
        router.replace('/(tabs)');
      } else {
        // Login failed - show error message
        setErrorMessage(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Quick login - for development only
   */
  async function handleQuickLogin(testEmail: string, testPassword: string, userName: string) {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(testEmail, testPassword);

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(`Quick login failed for ${userName}`);
      }
    } catch (error) {
      console.error('Quick login error:', error);
      setErrorMessage('Quick login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSkip() {
    // Dev only - bypass auth for testing
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

          {/* Error Message */}
          {errorMessage ? (
            <XStack
              backgroundColor="#fee2e2"
              borderRadius={12}
              paddingHorizontal={16}
              paddingVertical={12}
              borderWidth={1}
              borderColor="#ef4444"
            >
              <Text fontSize={14} color="#dc2626" fontFamily="$body">
                {errorMessage}
              </Text>
            </XStack>
          ) : null}

          {/* Login Button */}
          <YStack gap={12}>
            <XStack
              backgroundColor={isLoading ? colors.textTertiary : colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              pressStyle={isLoading ? {} : { opacity: 0.8, scale: 0.98 }}
              cursor={isLoading ? 'not-allowed' : 'pointer'}
              onPress={isLoading ? undefined : handleLogin}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                  Login
                </Text>
              )}
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

            {/* Quick Login Buttons - Dev Only */}
            <YStack gap={8} marginTop={8}>
              <Text fontSize={13} color={colors.textTertiary} textAlign="center" fontFamily="$body">
                Quick Login (Dev Only)
              </Text>
              <XStack gap={8} flexWrap="wrap" justifyContent="center">
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderWidth={1}
                  borderColor={colors.border}
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                  cursor="pointer"
                  onPress={() => handleQuickLogin('alice@test.com', 'password123', 'Alice')}
                >
                  <Text fontSize={12} color={colors.text} fontFamily="$body">
                    Alice
                  </Text>
                </XStack>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderWidth={1}
                  borderColor={colors.border}
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                  cursor="pointer"
                  onPress={() => handleQuickLogin('bob@test.com', 'password123', 'Bob')}
                >
                  <Text fontSize={12} color={colors.text} fontFamily="$body">
                    Bob
                  </Text>
                </XStack>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderWidth={1}
                  borderColor={colors.border}
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                  cursor="pointer"
                  onPress={() => handleQuickLogin('charlie@test.com', 'password123', 'Charlie')}
                >
                  <Text fontSize={12} color={colors.text} fontFamily="$body">
                    Charlie
                  </Text>
                </XStack>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderWidth={1}
                  borderColor={colors.border}
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                  cursor="pointer"
                  onPress={() => handleQuickLogin('diana@test.com', 'password123', 'Diana')}
                >
                  <Text fontSize={12} color={colors.text} fontFamily="$body">
                    Diana
                  </Text>
                </XStack>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={8}
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderWidth={1}
                  borderColor={colors.border}
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                  cursor="pointer"
                  onPress={() => handleQuickLogin('eve@test.com', 'password123', 'Eve')}
                >
                  <Text fontSize={12} color={colors.text} fontFamily="$body">
                    Eve
                  </Text>
                </XStack>
              </XStack>
            </YStack>
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
