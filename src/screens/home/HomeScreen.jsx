import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows, typography } from '../../config/theme';
import { stores } from '../../data/storeData';
import { getPopularItems } from '../../data/menuData';

const HomeScreen = ({ navigation }) => {
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const popularItems = getPopularItems();

  const quickActions = [
    { id: 1, icon: 'cafe-outline', label: 'Browse Menu', action: () => navigation.navigate('Menu') },
    { id: 2, icon: 'gift-outline', label: 'Offers', action: () => {} },
    { id: 3, icon: 'time-outline', label: 'Recent Orders', action: () => navigation.navigate('My Orders') },
    { id: 4, icon: 'heart-outline', label: 'Favorites', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning ☀️</Text>
            <Text style={styles.userName}>Welcome back!</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Location Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Icon name="location" size={24} color={colors.primary} />
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>Delivering to</Text>
                <Text style={styles.locationName}>{selectedStore.location}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Icon name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={action.action}
                >
                  <View style={styles.quickActionIcon}>
                    <Icon name={action.icon} size={28} color={colors.primary} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>☕ First Order?</Text>
              <Text style={styles.bannerSubtitle}>Get 20% off on your first order!</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Order Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Popular Items */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Items</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularItemsScroll}
            >
              {popularItems.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.popularItemCard}
                  onPress={() => navigation.navigate('Menu')}
                >
                  <View style={[styles.popularItemImage, { backgroundColor: getCardColor(index) }]}>
                    <Text style={styles.popularItemEmoji}>{getCategoryEmoji(item.category)}</Text>
                  </View>
                  <Text style={styles.popularItemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.popularItemPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Our Stores */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Stores</Text>
            {stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                onPress={() => setSelectedStore(store)}
              >
                <View style={styles.storeIcon}>
                  <Icon name="storefront-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeAddress}>{store.address}</Text>
                  <View style={styles.storeDetails}>
                    <Icon name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.storeDistance}>{store.distance}</Text>
                  </View>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getCardColor = (index) => {
  const colors_arr = [
    colors.orange,
    colors.pink,
    colors.lightBlue,
    colors.lightGreen,
    colors.orange,
  ];
  return colors_arr[index % colors_arr.length];
};

const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Toasts': '🍞',
    'Sandwiches': '🥪',
    'Bowls': '🥗',
    'Burgers': '🍔',
    'Beverages': '☕',
    'Desserts': '🍰',
  };
  return emojiMap[category] || '🍽️';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  locationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: spacing.md,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  bannerContent: {
    alignItems: 'flex-start',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  bannerButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  bannerButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  popularItemsScroll: {
    gap: spacing.md,
  },
  popularItemCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  popularItemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularItemEmoji: {
    fontSize: 40,
  },
  popularItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: spacing.sm,
    height: 40,
  },
  popularItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeDistance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

export default HomeScreen;
