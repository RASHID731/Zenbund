import { Text, YStack, XStack, ScrollView, Switch } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
  X,
  User,
  Mail,
  Key,
  ShieldCheck,
  Bell,
  Moon,
  Globe,
  Heart,
  Package,
  MessageCircle as MessageCircleIcon,
  Lock,
  Trash2,
  HelpCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Instagram,
  LogOut
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';

interface SettingsItemProps {
  icon: any;
  iconColor: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingsItem({
  icon: Icon,
  iconColor,
  label,
  subtitle,
  onPress,
  showChevron = true,
  rightElement,
  destructive = false
}: SettingsItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  return (
    <XStack
      backgroundColor={colors.backgroundSecondary}
      borderRadius={16}
      paddingHorizontal={16}
      paddingVertical={14}
      alignItems="center"
      gap={12}
      pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.98 }}
      cursor="pointer"
      onPress={onPress}
    >
      <YStack
        width={36}
        height={36}
        borderRadius={10}
        backgroundColor={`${iconColor}15`}
        justifyContent="center"
        alignItems="center"
      >
        <Icon size={20} color={iconColor} strokeWidth={2.5} />
      </YStack>

      <YStack flex={1} gap={2}>
        <Text
          fontSize={15}
          fontWeight="600"
          color={destructive ? '#ef4444' : colors.text}
          fontFamily="$body"
        >
          {label}
        </Text>
        {subtitle && (
          <Text fontSize={13} color={colors.textTertiary} fontFamily="$body">
            {subtitle}
          </Text>
        )}
      </YStack>

      {rightElement || (showChevron && (
        <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2.5} />
      ))}
    </XStack>
  );
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  return (
    <YStack gap={12}>
      <Text fontSize={14} fontWeight="700" color={colors.textSecondary} fontFamily="$body" paddingLeft={4}>
        {title.toUpperCase()}
      </Text>
      {children}
    </YStack>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { logout, deleteAccount } = useAuth();
  const { showAlert } = useAlert();

  // Toggle states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  function handleLogout() {
    showAlert({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              showAlert({ title: 'Error', message: 'Failed to log out. Please try again.' });
            }
          },
        },
      ],
    });
  }

  function handleDeleteAccount() {
    showAlert({
      title: 'Delete Account',
      message: 'This action cannot be undone. All your data will be permanently deleted.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            showAlert({
              title: 'Confirm Password',
              message: 'Please enter your password to confirm account deletion:',
              input: {
                placeholder: 'Password',
                secureTextEntry: true,
                onSubmit: async (password: string) => {
                  if (!password) {
                    showAlert({ title: 'Error', message: 'Password is required to delete your account.' });
                    return;
                  }
                  try {
                    const result = await deleteAccount(password);
                    if (result.success) {
                      router.replace('/login');
                    } else {
                      showAlert({ title: 'Error', message: result.message || 'Failed to delete account' });
                    }
                  } catch (error) {
                    showAlert({ title: 'Error', message: 'Failed to delete account. Please try again.' });
                  }
                },
              },
              buttons: [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete Account', style: 'destructive' },
              ],
            });
          },
        },
      ],
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={20}
          paddingVertical={16}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <XStack
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor={colors.backgroundSecondary}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.95 }}
            onPress={() => router.back()}
            cursor="pointer"
          >
            <X size={20} color={colors.text} strokeWidth={2.5} />
          </XStack>

          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Settings
          </Text>

          <XStack width={40} />
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={20} paddingBottom={32} gap={28} backgroundColor={colors.background}>

            {/* Account Section */}
            <SettingsSection title="Account">
              <YStack gap={8}>
                <SettingsItem
                  icon={User}
                  iconColor={colorScheme === 'light' ? '#3B82F6' : '#60A5FA'}
                  label="Edit Profile"
                  subtitle="Update your profile information"
                  onPress={() => router.push('/edit-profile')}
                />
                <SettingsItem
                  icon={Mail}
                  iconColor={colorScheme === 'light' ? '#10B981' : '#34D399'}
                  label="Account Information"
                  subtitle="View and edit your email"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={Key}
                  iconColor={colorScheme === 'light' ? '#F59E0B' : '#FBBF24'}
                  label="Change Password"
                  subtitle="Update your password"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={ShieldCheck}
                  iconColor={colorScheme === 'light' ? '#8B5CF6' : '#A78BFA'}
                  label="Verification"
                  subtitle="Get verified badge"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={Instagram}
                  iconColor="#E4405F"
                  label="Instagram Connection"
                  subtitle="Link your Instagram account"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
              </YStack>
            </SettingsSection>

            {/* Notifications Section */}
            <SettingsSection title="Notifications">
              <YStack gap={8}>
                <SettingsItem
                  icon={Bell}
                  iconColor={colorScheme === 'light' ? '#EC4899' : '#F472B6'}
                  label="Push Notifications"
                  subtitle="Receive notifications on your device"
                  showChevron={false}
                  rightElement={
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      size="$3"
                    />
                  }
                  onPress={() => setPushNotifications(!pushNotifications)}
                />
                <SettingsItem
                  icon={Mail}
                  iconColor={colorScheme === 'light' ? '#06B6D4' : '#22D3EE'}
                  label="Email Notifications"
                  subtitle="Get updates via email"
                  showChevron={false}
                  rightElement={
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      size="$3"
                    />
                  }
                  onPress={() => setEmailNotifications(!emailNotifications)}
                />
                <SettingsItem
                  icon={MessageCircleIcon}
                  iconColor={colorScheme === 'light' ? '#14B8A6' : '#2DD4BF'}
                  label="Chat Notifications"
                  subtitle="Notify me of new messages"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
              </YStack>
            </SettingsSection>

            {/* Preferences Section */}
            <SettingsSection title="Preferences">
              <YStack gap={8}>
                <SettingsItem
                  icon={Moon}
                  iconColor={colorScheme === 'light' ? '#6366F1' : '#818CF8'}
                  label="Dark Mode"
                  subtitle="Switch between light and dark theme"
                  showChevron={false}
                  rightElement={
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      size="$3"
                    />
                  }
                  onPress={() => setDarkMode(!darkMode)}
                />
                <SettingsItem
                  icon={Globe}
                  iconColor={colorScheme === 'light' ? '#F97316' : '#FB923C'}
                  label="Language"
                  subtitle="English"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
              </YStack>
            </SettingsSection>

            {/* Content & Activity Section */}
            <SettingsSection title="Content & Activity">
              <YStack gap={8}>
                <SettingsItem
                  icon={Package}
                  iconColor={colorScheme === 'light' ? '#0EA5E9' : '#38BDF8'}
                  label="My Listings"
                  subtitle="View all your active listings"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={Heart}
                  iconColor={colorScheme === 'light' ? '#EF4444' : '#F87171'}
                  label="Wishlist"
                  subtitle="View your saved items"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
              </YStack>
            </SettingsSection>

            {/* Privacy & Security Section */}
            <SettingsSection title="Privacy & Security">
              <YStack gap={8}>
                <SettingsItem
                  icon={Lock}
                  iconColor={colorScheme === 'light' ? '#64748B' : '#94A3B8'}
                  label="Privacy Settings"
                  subtitle="Control who can see your profile"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={AlertCircle}
                  iconColor={colorScheme === 'light' ? '#DC2626' : '#EF4444'}
                  label="Blocked Users"
                  subtitle="Manage blocked accounts"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
              </YStack>
            </SettingsSection>

            {/* Support Section */}
            <SettingsSection title="Support">
              <YStack gap={8}>
                <SettingsItem
                  icon={HelpCircle}
                  iconColor={colorScheme === 'light' ? '#059669' : '#10B981'}
                  label="Help Center"
                  subtitle="Get help and support"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={AlertCircle}
                  iconColor={colorScheme === 'light' ? '#DC2626' : '#EF4444'}
                  label="Report a Problem"
                  subtitle="Let us know about issues"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
                <SettingsItem
                  icon={Info}
                  iconColor={colorScheme === 'light' ? '#6B7280' : '#9CA3AF'}
                  label="About Zenbund"
                  subtitle="Version 1.0.0"
                  onPress={() => showAlert({ title: 'Coming Soon', message: 'This feature is under development.' })}
                />
              </YStack>
            </SettingsSection>

            {/* Danger Zone */}
            <SettingsSection title="Danger Zone">
              <YStack gap={8}>
                <SettingsItem
                  icon={Trash2}
                  iconColor="#EF4444"
                  label="Delete Account"
                  subtitle="Permanently delete your account"
                  destructive
                  onPress={handleDeleteAccount}
                />
              </YStack>
            </SettingsSection>

            {/* Log Out Button */}
            <XStack
              backgroundColor={colors.backgroundSecondary}
              borderRadius={16}
              paddingVertical={14}
              justifyContent="center"
              alignItems="center"
              gap={8}
              marginTop={8}
              pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.98 }}
              cursor="pointer"
              onPress={handleLogout}
            >
              <LogOut size={20} color="#EF4444" strokeWidth={2.5} />
              <Text fontSize={16} fontWeight="600" color="#EF4444" fontFamily="$body">
                Log Out
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
