/**
 * Zenbund Color System
 * Primary: Purple (#736CED)
 */

import { Platform } from 'react-native';

// Primary purple colors (derived from #736CED)
const purple50 = '#F5F4FE';
const purple100 = '#ECEAFD';
const purple200 = '#DDD9FC';
const purple300 = '#C4BEFA';
const purple400 = '#A79DF6';
const purple500 = '#736CED'; // Main brand color
const purple600 = '#5F55E4';
const purple700 = '#4F44C9';
const purple800 = '#423AA3';
const purple900 = '#38347F';

// Neutrals
const gray50 = '#F9FAFB';
const gray100 = '#F3F4F6';
const gray200 = '#E5E7EB';
const gray300 = '#D1D5DB';
const gray400 = '#9CA3AF';
const gray500 = '#6B7280';
const gray600 = '#4B5563';
const gray700 = '#374151';
const gray800 = '#1F2937';
const gray900 = '#111827';

export const Colors = {
  light: {
    // Text
    text: gray900,
    textSecondary: gray600,
    textTertiary: gray500,

    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: gray50,
    backgroundTertiary: gray100,

    // Brand colors
    primary: purple500,
    primaryLight: purple400,
    primaryDark: purple600,
    accent: purple600,
    accentLight: purple500,

    // UI Elements
    border: gray200,
    borderLight: gray100,
    card: '#FFFFFF',
    cardHover: gray50,

    // Icons & Tabs
    icon: gray500,
    iconActive: purple500,
    tabIconDefault: gray400,
    tabIconSelected: purple500,

    // Semantic
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  dark: {
    // Text
    text: '#FFFFFF',
    textSecondary: gray300,
    textTertiary: gray400,

    // Backgrounds
    background: '#000000',
    backgroundSecondary: gray900,
    backgroundTertiary: gray800,

    // Brand colors
    primary: purple400,
    primaryLight: purple300,
    primaryDark: purple500,
    accent: purple400,
    accentLight: purple300,

    // UI Elements
    border: gray700,
    borderLight: gray800,
    card: gray900,
    cardHover: gray800,

    // Icons & Tabs
    icon: gray400,
    iconActive: purple400,
    tabIconDefault: gray500,
    tabIconSelected: purple400,

    // Semantic
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
