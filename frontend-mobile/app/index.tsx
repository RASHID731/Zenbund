import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

/**
 * Root index - checks authentication and redirects accordingly.
 *
 * Flow:
 * 1. AuthContext checks for JWT token in SecureStore
 * 2. While checking: Show loading spinner
 * 3. If authenticated: Redirect to /(tabs)
 * 4. If not authenticated: Redirect to /login
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on authentication status
  // Authenticated: Go to main app
  // Not authenticated: Go to login
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
