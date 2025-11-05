import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius } from '../../config/theme';

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderId, total } = route.params;

  const handleGoHome = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const handleViewOrders = () => {
    navigation.navigate('OrdersHistory');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="checkmark" size={60} color={colors.success} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>Your order has been received</Text>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>₹{total.toFixed(0)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Delivery</Text>
            <Text style={styles.detailValue}>30-40 minutes</Text>
          </View>
        </View>

        {/* Info Message */}
        <View style={styles.infoBox}>
          <Icon name="information-circle-outline" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            You'll receive a confirmation SMS with tracking details shortly
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoHome}
          >
            <Text style={styles.primaryButtonText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewOrders}
          >
            <Text style={styles.secondaryButtonText}>VIEW ORDERS</Text>
          </TouchableOpacity>
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
    paddingTop: spacing.xxxxl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xxxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.success,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xxxl,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.info,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default OrderConfirmationScreen;
