import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Home, Search, Users, User } from 'lucide-react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 2
        },
        tabBarLabelStyle: {
          fontFamily: 'DMSans_600SemiBold',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.tabIconSelected, alignItems: 'center', justifyContent: 'center' }}>
                <Home size={20} color={colors.background} strokeWidth={2.5} />
              </View>
            ) : (
              <Home size={24} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.tabIconSelected, alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} color={colors.background} strokeWidth={2.5} />
              </View>
            ) : (
              <Search size={24} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.tabIconSelected, alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color={colors.background} strokeWidth={2.5} />
              </View>
            ) : (
              <Users size={24} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.tabIconSelected, alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color={colors.background} strokeWidth={2.5} />
              </View>
            ) : (
              <User size={24} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
    </Tabs>
  );
}
