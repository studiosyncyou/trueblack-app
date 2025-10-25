import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { login } from '../../store/slices/authSlice';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    
    // Simulate login - Replace with real authentication later
    setTimeout(() => {
      dispatch(login({
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+91 98765 43210',
        },
        token: 'dummy-token-12345',
      }));
      setIsLoading(false);
    }, 500);
  };

  const features = [
    {
      icon: 'cafe-outline',
      title: 'Fresh Coffee',
      description: 'Premium quality coffee brewed fresh',
    },
    {
      icon: 'flash-outline',
      title: 'Quick Delivery',
      description: 'Get your order in 15-20 minutes',
    },
    {
      icon: 'card-outline',
      title: 'Easy Payment',
      description: 'Multiple payment options available',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>☕</Text>
          </View>
          <Text style={styles.brandName}>True Black</Text>
          <Text style={styles.tagline}>Your favorite coffee, delivered</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={28} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.continueButtonText}>Loading...</Text>
            ) : (
              <>
                <Text style={styles.continueButtonText}>Get Started</Text>
                <Icon name="arrow-forward" size={20} color={colors.white} />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl * 2,
    paddingBottom: spacing.xxxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  logoEmoji: {
    fontSize: 60,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  featuresSection: {
    flex: 1,
    justifyContent: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bottomSection: {
    paddingBottom: spacing.xl,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    ...shadows.medium,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
});

export default LoginScreen;
