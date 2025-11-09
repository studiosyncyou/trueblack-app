// TRUE BLACK - Single Color Theme with Montserrat
// Matches Figma's minimal, monochromatic design

export const colors = {
  // Primary single-color palette (Black & Cream)
  background: '#FAFAF8',      // Soft cream background
  surface: '#FFFFFF',          // Pure white for cards
  primary: '#1A1A1A',          // Deep black for text/buttons
  
  // Text colors (single color hierarchy)
  textPrimary: '#1A1A1A',      // Main text - black
  textSecondary: '#666666',    // Secondary text - gray
  textTertiary: '#999999',     // Tertiary text - light gray
  textLight: '#FFFFFF',        // White text on dark backgrounds
  
  // Borders & dividers (subtle)
  border: '#E8E8E8',           // Very light gray borders
  divider: '#F0F0F0',          // Subtle dividers
  
  // Functional colors (minimal use)
  success: '#2D7A3E',          // Green for success
  error: '#C4302B',            // Red for errors
  warning: '#F59E0B',          // Amber for warnings
  info: '#2563EB',             // Blue for info
  
  // Special surfaces
  cardBackground: '#FFFFFF',   // White cards
  modalBackground: '#FFFFFF',  // White modals
  overlayBackground: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  
  // Cream/Beige accent (like Figma)
  accentCream: '#F5F0E8',      // Cream for hero backgrounds
  accentBeige: '#EDE4D8',      // Beige for promo cards
};

export const spacing = {
  s:0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const typography = {
  // Font families - Montserrat everywhere except logo
  primary: 'Montserrat',
  logo: 'System', // Can be changed to custom serif font
  
  // Typography scale with Montserrat
  h1: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 40,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 32,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 28,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  h4: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  body1: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  body2: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 16,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    lineHeight: 20,
    letterSpacing: 1,
    color: colors.textLight,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
    color: colors.textPrimary,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'System', // Or custom serif
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.textPrimary,
  },
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
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
  heroRotation: 5000, // 5 seconds
};

// Image paths helper
export const images = {
  logo: require('../assets/images/logo.png'), // TRUE BLACK logo
  hero: require('../assets/images/hero1.jpg'), // Single hero image
  tiramisu: require('../assets/images/tiramisu.jpg'), // Promo banner
  itemDefault: require('../assets/images/item-default.jpg'), // All menu items
};

// Export default theme object
export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  animations,
  images,
};
