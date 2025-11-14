import { Text, XStack } from 'tamagui';
import { MessageCircle, Plus, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface NavbarProps {
  currentPage?: 'home' | 'profile' | 'search' | 'community';
}

export function Navbar({ currentPage = 'home' }: NavbarProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const isProfilePage = currentPage === 'profile';

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal={20}
      paddingTop={12}
      paddingBottom={12}
      backgroundColor={colors.background}
    >
      {/* Left side - Sell Button */}
      <XStack>
        <XStack
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={colors.backgroundSecondary}
          justifyContent="center"
          alignItems="center"
          pressStyle={{
            backgroundColor: colors.backgroundTertiary,
            scale: 0.95,
          }}
          onPress={() => {
            router.push('/sell-modal');
          }}
          cursor="pointer"
        >
          <Plus size={24} color={colors.text} strokeWidth={2.5} />
        </XStack>
      </XStack>

      {/* Center - Zenbund */}
      <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
        Zenbund
      </Text>

      {/* Right side - Chat or Settings Button */}
      <XStack>
        <XStack
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={colors.backgroundSecondary}
          justifyContent="center"
          alignItems="center"
          pressStyle={{
            backgroundColor: colors.backgroundTertiary,
            scale: 0.95,
          }}
          onPress={() => {
            router.push(isProfilePage ? '/settings' : '/chat');
          }}
          cursor="pointer"
        >
          {isProfilePage ? (
            <Settings size={20} color={colors.text} strokeWidth={2.5} />
          ) : (
            <MessageCircle size={20} color={colors.text} strokeWidth={2.5} />
          )}
        </XStack>
      </XStack>
    </XStack>
  );
}
