import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const TierStatusCard = ({ tier, savings, isPremium, onUpgrade }) => {
  // Tier configurations
  const tierConfig = {
    regular: {
      icon: 'person-outline',
      title: 'Regular Member',
      subtitle: 'Start saving with Drink Black Club',
      color: colors.textSecondary,
      bgColor: colors.surface,
    },
    club: {
      icon: 'trophy',
      title: 'Drink Black Club',
      subtitle: '5% Off Active',
      color: colors.textPrimary,
      bgColor: colors.accentCream,
    },
    premium: {
      icon: 'diamond',
      title: 'Premium Subscription',
      subtitle: 'Drink Black Club Member • 10% Off Active',
      color: colors.textPrimary,
      bgColor: colors.textPrimary,
      textColor: colors.textLight,
    },
  };

  const config = tierConfig[tier] || tierConfig.regular;

  return (
    <View style={[styles.card, { backgroundColor: config.bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon 
            name={config.icon} 
            size={32} 
            color={tier === 'premium' ? colors.textLight : config.color} 
          />
        </View>
        <View style={styles.headerText}>
          <Text 
            style={[
              styles.title, 
              { color: tier === 'premium' ? colors.textLight : colors.textPrimary }
            ]}
          >
            {config.title}
          </Text>
          <Text 
            style={[
              styles.subtitle, 
              { color: tier === 'premium' ? colors.textLight : colors.textSecondary }
            ]}
          >
            {config.subtitle}
          </Text>
        </View>
      </View>

      {/* Savings Display */}
      {(tier === 'club' || tier === 'premium') && (
        <View style={styles.savingsContainer}>
          <View style={styles.savingsRow}>
            <Icon 
              name="wallet-outline" 
              size={20} 
              color={tier === 'premium' ? colors.textLight : colors.success} 
            />
            <Text 
              style={[
                styles.savingsLabel, 
                { color: tier === 'premium' ? colors.textLight : colors.textSecondary }
              ]}
            >
              This Month Saved
            </Text>
          </View>
          <Text 
            style={[
              styles.savingsAmount, 
              { color: tier === 'premium' ? colors.textLight : colors.textPrimary }
            ]}
          >
            ₹{savings.toLocaleString()}
          </Text>
        </View>
      )}

      {/* Benefits List */}
      {tier === 'premium' && (
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitRow}>
            <Icon name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.benefitText}>10% Off on All Orders</Text>
          </View>
          <View style={styles.benefitRow}>
            <Icon name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.benefitText}>3 Free Coffees Daily</Text>
          </View>
          <View style={styles.benefitRow}>
            <Icon name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.benefitText}>Priority Notifications</Text>
          </View>
        </View>
      )}

      {/* Upgrade Button (for regular and club members) */}
      {tier !== 'premium' && (
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Icon name="arrow-up-circle-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.upgradeButtonText}>
            {tier === 'regular' ? 'Join Drink Black Club' : 'Upgrade to Premium'}
          </Text>
          <Icon name="chevron-forward" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    fontSize: 13,
  },
  savingsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  savingsLabel: {
    ...typography.body2,
    marginLeft: spacing.xs,
  },
  savingsAmount: {
    ...typography.h2,
    fontFamily: 'Montserrat-Bold',
  },
  benefitsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitText: {
    ...typography.body2,
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  upgradeButtonText: {
    ...typography.button,
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
  },
});

export default TierStatusCard;
