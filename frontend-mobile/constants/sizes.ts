// Size constants for consistent spacing and dimensions
export const Sizes = {
  xs: 4,
  sm: 8,
  smd: 10, // Between sm and md
  md: 12,
  mdlg: 16, // Between md and lg
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  xxxxl: 40,
  image: 300, // Standard image height
} as const;

export const FontSizes = {
  xs: 12,
  xsm: 13, // Between xs and sm
  sm: 14,
  smd: 15, // Between sm and md
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 22, // For line heights
  xxxl: 26, // For large headings
  xxxxl: 36, // For prominent text (price)
  emoji: 120, // For large emoji displays
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20, // For avatars
  full: 9999,
} as const;
