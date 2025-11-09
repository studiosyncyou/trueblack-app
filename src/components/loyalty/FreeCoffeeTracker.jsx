import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const FreeCoffeeTracker = ({ coffeesUsed, maxCoffees, nextAvailableTime, onRedeem }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [canRedeem, setCanRedeem] = useState(true);

  useEffect(() => {
    if (!nextAvailableTime) {
      setCanRedeem(true);
      setTimeRemaining('');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const nextTime = new Date(nextAvailableTime);
      const diff = nextTime - now;

      if (diff <= 0) {
        setCanRedeem(true);
        setTimeRemaining('');
      } else {
        setCanRedeem(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextAvailableTime]);

  const coffeeSlots = Array.from({ length: maxCoffees }, (_, i) => i);
  const allUsed = coffeesUsed >= maxCoffees;
  const isAvailable = canRedeem && !allUsed;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="cafe" size={24} color={colors.textPrimary} />
        <Text style={styles.headerTitle}>Free Coffees Today</Text>
      </View>

      {/* Coffee Slots */}
      <View style={styles.slotsContainer}>
        {coffeeSlots.map((index) => (
          <View
            key={index}
            style={[
              styles.coffeeSlot,
              index < coffeesUsed && styles.coffeeSlotUsed,
            ]}
          >
            <Icon
              name={index < coffeesUsed ? 'checkmark' : 'cafe-outline'}
              size={32}
              color={index < coffeesUsed ? colors.textLight : colors.textSecondary}
            />
          </View>
        ))}
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {coffeesUsed} of {maxCoffees} used today
        </Text>
        {!canRedeem && timeRemaining && (
          <View style={styles.timerContainer}>
            <Icon name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.timerText}>Next available in {timeRemaining}</Text>
          </View>
        )}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Icon name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          {allUsed
            ? 'All free coffees used today. Resets at midnight.'
            : !canRedeem
            ? 'You can redeem one coffee every 3 hours'
            : 'Add a coffee to cart (up to ₹200) and it will show ₹0'}
        </Text>
      </View>

      {/* Redeem Button */}
      <TouchableOpacity
        style={[
          styles.redeemButton,
          !isAvailable && styles.redeemButtonDisabled,
        ]}
        onPress={onRedeem}
        disabled={!isAvailable}
        activeOpacity={0.8}
      >
        <Icon
          name={isAvailable ? 'add-circle' : 'lock-closed'}
          size={20}
          color={isAvailable ? colors.textLight : colors.textSecondary}
        />
        <Text
          style={[
            styles.redeemButtonText,
            !isAvailable && styles.redeemButtonTextDisabled,
          ]}
        >
          {allUsed
            ? 'Daily Limit Reached'
            : !canRedeem
            ? `Available in ${timeRemaining}`
            : 'Redeem Free Coffee'}
        </Text>
      </TouchableOpacity>
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
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  coffeeSlot: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  coffeeSlotUsed: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  timerText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  infoText: {
    ...typography.caption,
    flex: 1,
    marginLeft: spacing.sm,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.border,
  },
  redeemButtonText: {
    ...typography.button,
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  redeemButtonTextDisabled: {
    color: colors.textSecondary,
  },
});

export default FreeCoffeeTracker;
