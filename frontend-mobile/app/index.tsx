import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to login screen
  // Later, you can add auth checking logic here:
  // const isAuthenticated = checkAuth();
  // return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;

  return <Redirect href="/login" />;
}
