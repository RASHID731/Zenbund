import { Text, YStack, XStack, ScrollView, Image as TamaguiImage, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navbar } from '@/components/navbar';
import { Edit3, GraduationCap, BookOpen, Instagram, User as UserIcon, Check, X as XIcon, Pencil, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Image, Linking, Alert } from 'react-native';
import { Offer } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user, updateProfile } = useAuth();

  const [userListings, setUserListings] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [instagramInput, setInstagramInput] = useState('');

  // Fetch user's listings from API
  useEffect(() => {
    async function fetchUserListings() {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await apiClient.get<Offer[]>(`/offers/user/${user.userId}`);

        if (response.success && response.data) {
          setUserListings(response.data);
        }
      } catch (error) {
        console.error('Error fetching user listings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserListings();
  }, [user]);

  // Sample listings data (fallback)
  const myListings = [
    { emoji: '📚', name: 'Calculus Textbook', category: 'Books', price: '$25', description: 'Used calculus textbook in good condition. All chapters included, minimal highlighting.', location: 'Campus Library', status: 'Available' },
    { emoji: '💻', name: 'MacBook Pro 2019', category: 'Electronics', price: '$800', description: '13-inch MacBook Pro with 256GB storage. Battery health at 85%. Includes charger.', location: 'Dorm Building A', status: 'Available' },
    { emoji: '🪑', name: 'Study Desk Chair', category: 'Furniture', price: '$40', description: 'Ergonomic office chair perfect for studying. Adjustable height and back support.', location: 'Off-Campus Apartment', status: 'Available' },
    { emoji: '👕', name: 'University Hoodie', category: 'Clothing', price: '$20', description: 'Official university hoodie, size M. Worn only a few times, like new condition.', location: 'Student Union', status: 'Sold' },
    { emoji: '📱', name: 'iPhone 12', category: 'Electronics', price: '$450', description: '128GB iPhone 12 in black. Excellent condition with original box and accessories.', location: 'Tech Hub', status: 'Available' },
    { emoji: '🎮', name: 'Nintendo Switch', category: 'Gaming', price: '$220', description: 'Nintendo Switch with 3 games included. Barely used, perfect condition.', location: 'Recreation Center', status: 'Available' },
    { emoji: '📖', name: 'Programming Book Set', category: 'Books', price: '$60', description: 'Set of 3 programming books: Python, JavaScript, and Algorithms. Great for CS students.', location: 'CS Building', status: 'Available' },
    { emoji: '🎧', name: 'Sony Headphones', category: 'Electronics', price: '$85', description: 'Wireless noise-canceling headphones. Great sound quality for studying or music.', location: 'Music Department', status: 'Available' },
    { emoji: '⚡', name: 'Power Bank', category: 'Electronics', price: '$15', description: '10000mAh portable charger. Fast charging compatible with all devices.', location: 'Engineering Building', status: 'Available' },
  ];

  const openSellerListingDetail = (listing: any) => {
    // For placeholder listings (with emoji)
    if (listing.emoji) {
      router.push({
        pathname: '/seller-listing-detail',
        params: {
          name: listing.name,
          category: listing.category,
          price: listing.price,
          emoji: listing.emoji,
          description: listing.description,
          seller: 'You',
          location: listing.location,
          status: listing.status,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
      });
    } else {
      // For real listings from API
      router.push({
        pathname: '/seller-listing-detail',
        params: {
          id: listing.id,
          name: listing.title,
          price: `€${listing.price}`,
          description: listing.description,
          seller: 'You',
          location: listing.pickupLocation,
          status: listing.status,
          createdAt: listing.createdAt,
          imageUrl: listing.imageUrls?.[0] || '',
        }
      });
    }
  };

  // Determine which listings to display
  const displayListings = userListings.length > 0 ? userListings : myListings;

  // Handle Instagram link save
  async function handleSaveInstagram() {
    if (!instagramInput.trim()) {
      Alert.alert('Error', 'Please enter an Instagram username or link');
      return;
    }

    try {
      const response = await apiClient.put('/users/profile', {
        instagramLink: instagramInput.trim(),
      });

      if (response.success && response.data) {
        await updateProfile(response.data as any);
        setIsEditingInstagram(false);
        setInstagramInput('');
      } else {
        Alert.alert('Error', 'Failed to update Instagram link');
      }
    } catch (error) {
      console.error('Error updating Instagram:', error);
      Alert.alert('Error', 'Failed to update Instagram link');
    }
  }

  // Handle cancel editing Instagram
  function handleCancelInstagram() {
    setIsEditingInstagram(false);
    setInstagramInput('');
  }

  // Handle delete Instagram link
  async function handleDeleteInstagram() {
    Alert.alert(
      'Remove Instagram Link',
      'Are you sure you want to remove your Instagram link?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiClient.put('/users/profile', {
                instagramLink: '',
              });

              if (response.success && response.data) {
                await updateProfile(response.data as any);
                setIsEditingInstagram(false);
                setInstagramInput('');
              } else {
                Alert.alert('Error', 'Failed to remove Instagram link');
              }
            } catch (error) {
              console.error('Error removing Instagram:', error);
              Alert.alert('Error', 'Failed to remove Instagram link');
            }
          },
        },
      ]
    );
  }

  // Handle start editing Instagram
  function handleStartEditInstagram() {
    if (user?.instagramLink) {
      setInstagramInput(user.instagramLink);
    }
    setIsEditingInstagram(true);
  }

  // Render a single listing item
  const renderListingItem = (listing: any, index: number) => (
    <YStack
      key={index}
      flex={1}
      backgroundColor={colors.backgroundSecondary}
      borderWidth={1}
      borderColor={colors.border}
      borderRadius={16}
      aspectRatio={1}
      justifyContent="center"
      alignItems="center"
      pressStyle={{ opacity: 0.8, scale: 0.97 }}
      cursor="pointer"
      onPress={() => openSellerListingDetail(listing)}
      overflow="hidden"
    >
      {listing.emoji ? (
        <Text fontSize={48}>{listing.emoji}</Text>
      ) : listing.imageUrls && listing.imageUrls.length > 0 ? (
        <Image
          source={{ uri: listing.imageUrls[0] }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : (
        <Text fontSize={48}>📦</Text>
      )}
    </YStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        <Navbar currentPage="profile" />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={32} gap={20} backgroundColor={colors.background}>

            {/* Profile Header */}
            <XStack gap={16} alignItems="center">
              {/* Profile Picture */}
              <YStack
                width={90}
                height={90}
                backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                borderRadius={99}
                justifyContent="center"
                alignItems="center"
                borderWidth={3}
                borderColor={colors.primary}
                overflow="hidden"
              >
                {user?.profilePicture ? (
                  <TamaguiImage
                    source={{ uri: user.profilePicture }}
                    width={84}
                    height={84}
                    borderRadius={84}
                  />
                ) : (
                  <UserIcon size={40} color={colors.primary} strokeWidth={2} />
                )}
              </YStack>

              <YStack flex={1} paddingTop={12}>
                {/* Name */}
                <YStack flex={1} paddingLeft={8}>
                  <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                    {user?.name || 'User'}
                  </Text>
                </YStack>
                {/* Stats Grid - Structured */}
                <XStack paddingLeft={8}>
                  <YStack
                    flex={1}
                    paddingVertical={14}
                    gap={4}
                  >
                    <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                      {userListings.length}
                    </Text>
                    <Text fontSize={11} color={colors.textSecondary} fontWeight="600" fontFamily="$body">
                      Listings
                    </Text>
                  </YStack>

                  <YStack
                    flex={1}
                    paddingVertical={14}
                    gap={4}
                  >
                    <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                      89
                    </Text>
                    <Text fontSize={11} color={colors.textSecondary} fontWeight="600" fontFamily="$body">
                      Followers
                    </Text>
                  </YStack>

                  <YStack
                    flex={1}
                    paddingVertical={14}
                    gap={4}
                  >
                    <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                      156
                    </Text>
                    <Text fontSize={11} color={colors.textSecondary} fontWeight="600" fontFamily="$body">
                      Following
                    </Text>
                  </YStack>
                </XStack>
              </YStack>
            </XStack>

            {/* About/Info Section - Minimal */}
            <YStack
              borderRadius={16}
              paddingHorizontal={6}
            >
              <YStack gap={12}>
                {user?.university && (
                  <XStack alignItems="center" gap={12}>
                    <YStack
                      justifyContent="center"
                      alignItems="center"
                    >
                      <GraduationCap size={20} color={colorScheme === 'light' ? '#1976D2' : '#64B5F6'} strokeWidth={2.5} />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} color={colors.textTertiary} fontWeight="600" fontFamily="$body">
                        {user.university}
                      </Text>
                    </YStack>
                  </XStack>
                )}

                {user?.major && (
                  <XStack alignItems="center" gap={12}>
                    <YStack
                      justifyContent="center"
                      alignItems="center"
                    >
                      <BookOpen size={20} color={colorScheme === 'light' ? '#F57C00' : '#FFB74D'} strokeWidth={2.5} />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} color={colors.textTertiary} fontWeight="600" fontFamily="$body">
                        {user.major}{user?.year ? ` • ${user.year}` : ''}
                      </Text>
                    </YStack>
                  </XStack>
                )}

                {/* Instagram Link */}
                {isEditingInstagram ? (
                  <XStack alignItems="center" gap={12}>
                    <YStack
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Instagram size={20} color="#E4405F" strokeWidth={2.5} />
                    </YStack>
                    <Input
                      flex={1}
                      placeholder="@username or profile link"
                      placeholderTextColor={colors.textTertiary}
                      value={instagramInput}
                      onChangeText={setInstagramInput}
                      backgroundColor={colors.backgroundSecondary}
                      borderWidth={1}
                      borderColor={colors.border}
                      borderRadius={12}
                      paddingHorizontal={12}
                      paddingVertical={8}
                      fontSize={15}
                      fontFamily="$body"
                      color={colors.text}
                      autoFocus
                    />
                    <XStack gap={8}>
                      <YStack
                        width={32}
                        height={32}
                        backgroundColor={colors.primary}
                        borderRadius={16}
                        justifyContent="center"
                        alignItems="center"
                        pressStyle={{ opacity: 0.7, scale: 0.95 }}
                        cursor="pointer"
                        onPress={handleSaveInstagram}
                      >
                        <Check size={16} color="white" strokeWidth={3} />
                      </YStack>
                      {user?.instagramLink && (
                        <YStack
                          width={32}
                          height={32}
                          backgroundColor="#fee2e2"
                          borderRadius={16}
                          justifyContent="center"
                          alignItems="center"
                          pressStyle={{ opacity: 0.7, scale: 0.95 }}
                          cursor="pointer"
                          onPress={handleDeleteInstagram}
                        >
                          <Trash2 size={16} color="#dc2626" strokeWidth={2.5} />
                        </YStack>
                      )}
                      <YStack
                        width={32}
                        height={32}
                        backgroundColor={colors.backgroundSecondary}
                        borderRadius={16}
                        justifyContent="center"
                        alignItems="center"
                        pressStyle={{ opacity: 0.7, scale: 0.95 }}
                        cursor="pointer"
                        onPress={handleCancelInstagram}
                      >
                        <XIcon size={16} color={colors.textSecondary} strokeWidth={3} />
                      </YStack>
                    </XStack>
                  </XStack>
                ) : (
                  <XStack alignItems="center" gap={12}>
                    <YStack
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Instagram size={20} color="#E4405F" strokeWidth={2.5} />
                    </YStack>
                    {user?.instagramLink ? (
                      <XStack alignItems="center" gap={8}>
                        <YStack
                          pressStyle={{ opacity: 0.7 }}
                          cursor="pointer"
                          onPress={() => {
                            const instagram = user?.instagramLink;
                            if (!instagram) return;
                            
                            const url = instagram.startsWith('http')
                              ? instagram
                              : `https://instagram.com/${instagram.replace('@', '')}`;
                            Linking.openURL(url);
                          }}
                        >
                          <Text
                            fontSize={15}
                            color="#E4405F"
                            fontWeight="600"
                            fontFamily="$body"
                          >
                            {user.instagramLink}
                          </Text>
                        </YStack>
                        <YStack
                          width={28}
                          height={28}
                          backgroundColor={colors.backgroundSecondary}
                          borderRadius={14}
                          justifyContent="center"
                          alignItems="center"
                          pressStyle={{ opacity: 0.7, scale: 0.95 }}
                          cursor="pointer"
                          onPress={handleStartEditInstagram}
                        >
                          <Pencil size={14} color={colors.textSecondary} strokeWidth={2.5} />
                        </YStack>
                      </XStack>
                    ) : (
                      <YStack
                        flex={1}
                        pressStyle={{ opacity: 0.7 }}
                        cursor="pointer"
                        onPress={() => setIsEditingInstagram(true)}
                      >
                        <Text
                          fontSize={15}
                          color={colors.textTertiary}
                          fontWeight="600"
                          fontFamily="$body"
                        >
                          Add an Instagram link
                        </Text>
                      </YStack>
                    )}
                  </XStack>
                )}

                {/* Bio Section */}
                {user?.bio && (
                  <YStack paddingTop={4}>
                    <Text fontSize={15} color={colors.text} fontFamily="$body" lineHeight={22}>
                      {user.bio}
                    </Text>
                  </YStack>
                )}
              </YStack>
            </YStack>

            {/* Edit Profile Button - Subtle */}
            <XStack
              backgroundColor={colors.background}
              borderWidth={1}
              borderColor={colors.border}
              borderRadius={16}
              paddingVertical={10}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={{ opacity: 0.7, scale: 0.98, backgroundColor: colors.backgroundSecondary }}
              cursor="pointer"
              onPress={() => router.push('/edit-profile')}
            >
              <Edit3 size={16} color={colors.textSecondary} strokeWidth={2.5} />
              <Text fontSize={15} fontWeight="600" color={colors.textSecondary} fontFamily="$body">
                Edit Profile
              </Text>
            </XStack>

            {/* Listings Section */}
            <YStack gap={14}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                  My Listings
                </Text>
                <Text fontSize={14} fontWeight="600" color={colors.primary} fontFamily="$body">
                  View All
                </Text>
              </XStack>

              {/* Grid of Listings - Dynamic */}
              <YStack gap={12}>
                {displayListings.length === 0 ? (
                  <Text fontSize={15} color={colors.textSecondary} textAlign="center" paddingVertical={20} fontFamily="$body">
                    No listings yet
                  </Text>
                ) : (
                  // Group listings into rows of 3
                  Array.from({ length: Math.ceil(displayListings.length / 3) }, (_, rowIndex) => (
                    <XStack key={rowIndex} gap={12}>
                      {displayListings.slice(rowIndex * 3, rowIndex * 3 + 3).map((listing, colIndex) =>
                        renderListingItem(listing, rowIndex * 3 + colIndex)
                      )}
                      {/* Add empty placeholders to fill the row */}
                      {Array.from({ length: 3 - displayListings.slice(rowIndex * 3, rowIndex * 3 + 3).length }).map((_, i) => (
                        <YStack key={`empty-${i}`} flex={1} />
                      ))}
                    </XStack>
                  ))
                )}
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
