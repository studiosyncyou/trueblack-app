import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const SavingsSummary = ({ monthly, yearly, lifetime }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="trending-up" size={24} color={colors.success} />
        <Text style={styles.headerTitle}>Your Savings</Text>
      </View>

      <View style={styles.savingsGrid}>
        {/* Monthly Savings */}
        <View style={styles.savingsCard}>
          <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.savingsLabel}>This Month</Text>
          <Text style={styles.savingsAmount}>₹{monthly.toLocaleString()}</Text>
        </View>

        {/* Yearly Savings */}
        <View style={styles.savingsCard}>
          <Icon name="calendar" size={20} color={colors.textSecondary} />
          <Text style={styles.savingsLabel}>This Year</Text>
          <Text style={styles.savingsAmount}>₹{yearly.toLocaleString()}</Text>
        </View>

        {/* Lifetime Savings */}
        <View style={[styles.savingsCard, styles.lifetimeCard]}>
          <Icon name="star" size={20} color={colors.warning} />
          <Text style={styles.savingsLabel}>Lifetime</Text>
          <Text style={[styles.savingsAmount, styles.lifetimeAmount]}>
            ₹{lifetime.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Icon name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          Savings calculated from membership discounts and free rewards
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
  savingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  savingsCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  lifetimeCard: {
    width: '100%',
    backgroundColor: colors.accentCream,
  },
  savingsLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  savingsAmount: {
    ...typography.h3,
    fontFamily: 'Montserrat-Bold',
    color: colors.success,
  },
  lifetimeAmount: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default SavingsSummary;
