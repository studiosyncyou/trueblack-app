// Theme matching the Travertine coffee app design

export const colors = {
  // Primary Colors (from screenshots)
  background: '#F5F0E8',        // Cream/beige background
  surface: '#FFFFFF',            // White cards
  surfaceVariant: '#FBF8F4',    // Light variant
  
  // Text Colors
  textPrimary: '#1A1A1A',       // Almost black
  textSecondary: '#6B6B6B',     // Gray
  textTertiary: '#9E9E9E',      // Light gray
  
  // Brand Colors
  primary: '#2C3E50',           // Dark navy (buttons, accents)
  secondary: '#8B7355',         // Brown accent
  accent: '#D4AF37',            // Gold
  
  // Category/Product Colors
  orange: '#FF8C42',            // Orange (for product cards)
  pink: '#FFB5C5',              // Pink (for product cards)
  lightBlue: '#A8D8EA',         // Light blue
  lightGreen: '#C7EFCF',        // Light green
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Indicator Colors
  veg: '#4CAF50',               // Green circle for veg
  nonVeg: '#DC3545',            // Red triangle for non-veg
  egg: '#FFC107',               // Yellow for egg
  
  // Badge Colors
  newBadge: '#DC3545',          // Red for NEW badge
  popularBadge: '#FFD700',      // Gold for popular
  
  // UI Elements
  border: '#E0E0E0',
  divider: '#F0F0F0',
  disabled: '#BDBDBD',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // White/Black
  white: '#FFFFFF',
  black: '#000000',
  
  // Legacy colors (kept for compatibility)
  beige: '#F5F0E8',
  warmBeige: '#FBF8F4',
  lightBeige: '#FAF6F0',
  darkBeige: '#E8DCC4',
  coffeeBrown: '#6F4E37',
  gold: '#D4AF37',
  
  // Neutral Scale
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // Small Text
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textTransform: 'none',
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    success: colors.success,
    text: colors.textPrimary,
    textSecondary: colors.textSecondary,
    border: colors.border,
  },
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  theme,
};
