import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const SpendingAlert = ({ 
  rollingAverage, 
  threshold = 5000, 
  totalSavings, 
  onDismiss 
}) => {
  const shortfall = threshold - rollingAverage;
  const percentageToLose = Math.round((rollingAverage / threshold) * 100);

  // Only show if user is below threshold
  if (rollingAverage >= threshold) return null;

  return (
    <View style={styles.container}>
      {/* Alert Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="warning" size={28} color={colors.warning} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Club Status Alert</Text>
          <Text style={styles.subtitle}>Your membership is at risk</Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Icon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Spending Info */}
      <View style={styles.spendingSection}>
        <View style={styles.spendingRow}>
          <Text style={styles.label}>3-Month Average</Text>
          <Text style={styles.value}>₹{rollingAverage.toLocaleString()}/month</Text>
        </View>
        <View style={styles.spendingRow}>
          <Text style={styles.label}>Required for Club</Text>
          <Text style={styles.valueHighlight}>₹{threshold.toLocaleString()}/month</Text>
        </View>
        <View style={[styles.spendingRow, styles.shortfallRow]}>
          <Text style={styles.labelBold}>Need This Month</Text>
          <Text style={styles.shortfallValue}>₹{shortfall.toLocaleString()}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentageToLose}%` }]} />
        </View>
        <Text style={styles.progressText}>{percentageToLose}% of required spending</Text>
      </View>

      {/* What You'll Lose */}
      <View style={styles.lossSection}>
        <Text style={styles.lossSectionTitle}>If you lose Drink Black Club:</Text>
        <View style={styles.lossItem}>
          <Icon name="close-circle" size={18} color={colors.error} />
          <Text style={styles.lossText}>Lose 5% discount on all orders</Text>
        </View>
        <View style={styles.lossItem}>
          <Icon name="close-circle" size={18} color={colors.error} />
          <Text style={styles.lossText}>
            You've saved ₹{totalSavings.toLocaleString()} in last 3 months
          </Text>
        </View>
        <View style={styles.lossItem}>
          <Icon name="close-circle" size={18} color={colors.error} />
          <Text style={styles.lossText}>
            Need to spend ₹{shortfall.toLocaleString()} more to keep saving
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
        <Icon name="cart" size={20} color={colors.textLight} />
        <Text style={styles.actionButtonText}>Order Now to Maintain Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0', // Light orange background for warning
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 2,
    borderColor: colors.warning,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  spendingSection: {
    backgroundColor: colors.textLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  shortfallRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  label: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  labelBold: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.textPrimary,
  },
  value: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.textPrimary,
  },
  valueHighlight: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.success,
  },
  shortfallValue: {
    ...typography.h4,
    color: colors.warning,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.warning,
  },
  progressText: {
    ...typography.caption,
    textAlign: 'center',
  },
  lossSection: {
    backgroundColor: colors.textLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  lossSectionTitle: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.sm,
  },
  lossItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  lossText: {
    ...typography.body2,
    flex: 1,
    marginLeft: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
});

export default SpendingAlert;
