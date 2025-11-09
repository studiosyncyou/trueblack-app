import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const SubscriptionManager = ({
  subscriptionEndDate,
  nextBillingDate,
  autoRenewal,
  onToggleAutoRenewal,
  onCancelSubscription,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Premium subscription? You will lose all Premium benefits at the end of your billing period.',
      [
        {
          text: 'Keep Subscription',
          style: 'cancel',
        },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            await onCancelSubscription();
            setIsCancelling(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="card" size={24} color={colors.textPrimary} />
        <Text style={styles.headerTitle}>Subscription Details</Text>
      </View>

      {/* Subscription Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="calendar-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Subscription Ends</Text>
          </View>
          <Text style={styles.infoValue}>{formatDate(subscriptionEndDate)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="refresh-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Next Billing Date</Text>
          </View>
          <Text style={styles.infoValue}>{formatDate(nextBillingDate)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="cash-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Monthly Fee</Text>
          </View>
          <Text style={styles.infoValue}>₹10,000</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Icon name="card-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Payment Method</Text>
          </View>
          <View style={styles.paymentMethod}>
            <Text style={styles.infoValue}>PhonePe UPI</Text>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Auto-Renewal Toggle */}
      <View style={styles.toggleSection}>
        <View style={styles.toggleLabel}>
          <Icon name="repeat" size={20} color={colors.textPrimary} />
          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleTitle}>Auto-Renewal</Text>
            <Text style={styles.toggleSubtitle}>
              {autoRenewal
                ? 'Your subscription will renew automatically'
                : 'Manual renewal required each month'}
            </Text>
          </View>
        </View>
        <Switch
          value={autoRenewal}
          onValueChange={onToggleAutoRenewal}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor={autoRenewal ? colors.textLight : colors.textSecondary}
        />
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelPress}
        disabled={isCancelling}
        activeOpacity={0.8}
      >
        <Icon name="close-circle-outline" size={20} color={colors.error} />
        <Text style={styles.cancelButtonText}>
          {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
        </Text>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoBox}>
        <Icon name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          If you cancel, you'll retain Premium benefits until {formatDate(subscriptionEndDate)}.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h4,
    marginLeft: spacing.sm,
  },
  infoSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelText: {
    ...typography.body2,
    marginLeft: spacing.sm,
  },
  infoValue: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  changeButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontFamily: 'Montserrat-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  toggleTitle: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  toggleSubtitle: {
    ...typography.caption,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
  infoText: {
    ...typography.caption,
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default SubscriptionManager;
