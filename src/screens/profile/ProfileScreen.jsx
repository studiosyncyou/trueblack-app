import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

// Import loyalty components
import TierStatusCard from '../../components/loyalty/TierStatusCard';
import SavingsSummary from '../../components/loyalty/SavingsSummary';
import FreeCoffeeTracker from '../../components/loyalty/FreeCoffeeTracker';
import SubscriptionManager from '../../components/loyalty/SubscriptionManager';
import SpendingAlert from '../../components/loyalty/SpendingAlert';

// Import loyalty actions and API
import {
  setTier,
  setSavings,
  setSpendingHistory,
  activateSubscription,
  cancelSubscription,
  toggleAutoRenewal,
  redeemFreeCoffee,
  checkCoffeeAvailability,
  setBirthday,
  checkBirthdayWeek,
  togglePriorityNotifications,
  setLoading,
} from '../../store/slices/loyaltySlice';
import { logout } from '../../store/slices/authSlice';
import LoyaltyAPI from '../../services/LoyaltyAPI';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const location = useSelector((state) => state.location?.currentLocation);
  const loyalty = useSelector((state) => state.loyalty);

  const [refreshing, setRefreshing] = useState(false);

  // Load loyalty data on mount
  useEffect(() => {
    loadLoyaltyData();
    checkBirthdayStatus();
    
    // Check coffee availability every minute for Premium members
    if (loyalty.isSubscribed) {
      const interval = setInterval(() => {
        dispatch(checkCoffeeAvailability());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, []);

  const loadLoyaltyData = async () => {
    try {
      dispatch(setLoading(true));

      // Load tier status
      const tierResponse = await LoyaltyAPI.checkTier();
      if (tierResponse.success) {
        dispatch(setTier(tierResponse.data.tier));
      
      if (tierResponse.data.tier === 'premium' && tierResponse.data.isSubscribed) {
        dispatch(activateSubscription({
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenewal: true,
        }));
      }
    }
      // Load savings
      const savingsResponse = await LoyaltyAPI.getSavings();
      if (savingsResponse.success) {
        dispatch(setSavings(savingsResponse.data));
      }

      // Load spending history
      const spendingResponse = await LoyaltyAPI.getSpendingHistory();
      if (spendingResponse.success) {
        dispatch(setSpendingHistory(spendingResponse.data.last3Months));
      }

      // Load coffee status for Premium
      if (loyalty.isSubscribed) {
        const coffeeResponse = await LoyaltyAPI.getCoffeeStatus();
        if (coffeeResponse.success) {
          // Update coffee state
        }
      }

      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error loading loyalty data:', error);
      dispatch(setLoading(false));
    }
  };

  const checkBirthdayStatus = () => {
    // Set birthday if not set (would come from user profile)
    if (!loyalty.userBirthday) {
      dispatch(setBirthday('1990-05-15')); // Example - should come from user data
    }
    dispatch(checkBirthdayWeek());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLoyaltyData();
    setRefreshing(false);
  };

  const handleUpgrade = () => {
    if (loyalty.currentTier === 'regular') {
      // Show info about joining club
      Alert.alert(
        'Join Drink Black Club',
        'Spend ₹5,000 in a month to automatically become a Club member and get 5% off all orders!',
        [{ text: 'Got it!', style: 'default' }]
      );
    } else if (loyalty.currentTier === 'club') {
      // Navigate to Premium subscription flow
      navigation.navigate('PremiumSubscription');
    }
  };

  const handleRedeemCoffee = () => {
    // Navigate to menu with free coffee redemption active
    navigation.navigate('Menu', { redeemFreeCoffee: true });
  };

  const handleToggleAutoRenewal = async () => {
    try {
      dispatch(toggleAutoRenewal());
      await LoyaltyAPI.updateAutoRenewal(user?.id, !loyalty.autoRenewal);
    } catch (error) {
      console.error('Error toggling auto-renewal:', error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await LoyaltyAPI.cancelSubscription(user?.id);
      if (response.success) {
        dispatch(cancelSubscription());
        Alert.alert('Subscription Cancelled', 'Your Premium benefits will remain active until the end of your billing period.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <Icon name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Tier Status Card */}
        <TierStatusCard
          tier={loyalty.currentTier}
          savings={loyalty.currentMonthSavings}
          isPremium={loyalty.isSubscribed}
          onUpgrade={handleUpgrade}
        />

        {/* Spending Alert (only if at risk) */}
        {loyalty.rollingAverage < 5000 && loyalty.currentTier === 'club' && (
          <SpendingAlert
            rollingAverage={loyalty.rollingAverage}
            threshold={5000}
            totalSavings={loyalty.yearlyTotalSavings}
          />
        )}

        {/* Savings Summary */}
        <SavingsSummary
          monthly={loyalty.currentMonthSavings}
          yearly={loyalty.yearlyTotalSavings}
          lifetime={loyalty.lifetimeSavings}
        />

        {/* Free Coffee Tracker (Premium only) */}
        {loyalty.isSubscribed && (
          <FreeCoffeeTracker
            coffeesUsed={loyalty.freeCoffeesUsedToday}
            maxCoffees={loyalty.maxFreeCoffeesPerDay}
            nextAvailableTime={loyalty.nextCoffeeAvailableTime}
            onRedeem={handleRedeemCoffee}
          />
        )}

        {/* Subscription Manager (Premium only) */}
        {loyalty.isSubscribed && (
          <SubscriptionManager
            subscriptionEndDate={loyalty.subscriptionEndDate}
            nextBillingDate={loyalty.nextBillingDate}
            autoRenewal={loyalty.autoRenewal}
            onToggleAutoRenewal={handleToggleAutoRenewal}
            onCancelSubscription={handleCancelSubscription}
          />
        )}

        {/* Birthday Info */}
        {loyalty.birthdayWeekActive && (
          <View style={styles.birthdayCard}>
            <View style={styles.birthdayHeader}>
              <Icon name="gift" size={32} color={colors.warning} />
              <View style={styles.birthdayText}>
                <Text style={styles.birthdayTitle}>🎂 Birthday Week!</Text>
                <Text style={styles.birthdaySubtitle}>
                  Get any free drink on us
                </Text>
              </View>
            </View>
            {!loyalty.birthdayDrinkUsed ? (
              <TouchableOpacity style={styles.birthdayButton}>
                <Text style={styles.birthdayButtonText}>Claim Your Free Drink</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.birthdayUsed}>Birthday drink claimed! 🎉</Text>
            )}
          </View>
        )}

        {/* Notification Settings */}
        {loyalty.isSubscribed && (
          <View style={styles.settingsCard}>
            <View style={styles.settingsRow}>
              <View style={styles.settingsLabel}>
                <Icon name="notifications" size={24} color={colors.textPrimary} />
                <View style={styles.settingsTextContainer}>
                  <Text style={styles.settingsTitle}>Priority Notifications</Text>
                  <Text style={styles.settingsSubtitle}>
                    Limited editions, events, early access
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => dispatch(togglePriorityNotifications())}
              >
                <Icon
                  name={loyalty.priorityNotificationsEnabled ? 'toggle' : 'toggle-outline'}
                  size={32}
                  color={loyalty.priorityNotificationsEnabled ? colors.success : colors.border}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('OrdersHistory')}
          >
            <Icon name="receipt-outline" size={24} color={colors.textPrimary} />
            <Text style={styles.actionText}>Order History</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Icon name="location-outline" size={24} color={colors.textPrimary} />
            <Text style={styles.actionText}>
              {location?.area || 'Set Location'}
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Icon name="help-circle-outline" size={24} color={colors.textPrimary} />
            <Text style={styles.actionText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleLogout}>
            <Icon name="log-out-outline" size={24} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Logout</Text>
            <Icon name="chevron-forward" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  birthdayCard: {
    backgroundColor: colors.accentCream,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.small,
  },
  birthdayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  birthdayText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  birthdayTitle: {
    ...typography.h4,
    marginBottom: spacing.xs,
  },
  birthdaySubtitle: {
    ...typography.body2,
  },
  birthdayButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  birthdayButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  birthdayUsed: {
    ...typography.body1,
    textAlign: 'center',
    color: colors.success,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadows.small,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingsTitle: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  settingsSubtitle: {
    ...typography.caption,
  },
  actionsSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  actionText: {
    ...typography.body1,
    flex: 1,
    marginLeft: spacing.md,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default ProfileScreen;
