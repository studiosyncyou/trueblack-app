import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const OrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' or 'history'

  const ongoingOrders = [
    {
      id: '1',
      orderNumber: '#ORD-2024-001',
      store: 'Travertine - Film Nagar',
      items: ['Avocado Toast', 'OG Cold Coffee'],
      total: 530,
      status: 'preparing',
      time: '15 mins',
      date: 'Today, 10:30 AM',
    },
  ];

  const orderHistory = [
    {
      id: '2',
      orderNumber: '#ORD-2024-002',
      store: 'Burnt Earth - Kokapet',
      items: ['Black Hummus Toast', 'Matcha Latte'],
      total: 520,
      status: 'completed',
      date: 'Oct 24, 2025',
    },
    {
      id: '3',
      orderNumber: '#ORD-2024-003',
      store: 'Travertine - Film Nagar',
      items: ['Chicken Burger', 'Hazelnut Creme'],
      total: 620,
      status: 'completed',
      date: 'Oct 23, 2025',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return colors.warning;
      case 'ready':
        return colors.success;
      case 'completed':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return 'time-outline';
      case 'ready':
        return 'checkmark-circle-outline';
      case 'completed':
        return 'checkmark-done-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Icon name="help-circle-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'ongoing' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('ongoing')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ongoing' && styles.tabTextActive,
              ]}
            >
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'history' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.tabTextActive,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'ongoing' ? (
            ongoingOrders.length > 0 ? (
              ongoingOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                >
                  {/* Order Header */}
                  <View style={styles.orderHeader}>
                    <View style={styles.orderHeaderLeft}>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(order.status) + '20' },
                      ]}>
                        <Icon
                          name={getStatusIcon(order.status)}
                          size={14}
                          color={getStatusColor(order.status)}
                        />
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(order.status) },
                        ]}>
                          {order.status === 'preparing' ? 'Preparing' : 'Ready'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.orderTime}>{order.time}</Text>
                  </View>

                  {/* Store Info */}
                  <View style={styles.storeInfo}>
                    <Icon name="storefront-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.storeName}>{order.store}</Text>
                  </View>

                  {/* Items */}
                  <View style={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <Text key={index} style={styles.itemText}>
                        • {item}
                      </Text>
                    ))}
                  </View>

                  {/* Footer */}
                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.totalLabel}>Total Amount</Text>
                      <Text style={styles.totalAmount}>₹{order.total}</Text>
                    </View>
                    <TouchableOpacity style={styles.trackButton}>
                      <Text style={styles.trackButtonText}>Track Order</Text>
                      <Icon name="arrow-forward" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Icon name="receipt-outline" size={64} color={colors.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>No Ongoing Orders</Text>
                <Text style={styles.emptySubtitle}>
                  Your current orders will appear here
                </Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => navigation.navigate('Menu')}
                >
                  <Text style={styles.browseButtonText}>Browse Menu</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            orderHistory.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
              >
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) + '20' },
                  ]}>
                    <Icon
                      name={getStatusIcon(order.status)}
                      size={14}
                      color={getStatusColor(order.status)}
                    />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) },
                    ]}>
                      Completed
                    </Text>
                  </View>
                </View>

                {/* Store Info */}
                <View style={styles.storeInfo}>
                  <Icon name="storefront-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.storeName}>{order.store}</Text>
                </View>

                {/* Date */}
                <Text style={styles.orderDate}>{order.date}</Text>

                {/* Items */}
                <View style={styles.itemsList}>
                  {order.items.map((item, index) => (
                    <Text key={index} style={styles.itemText}>
                      • {item}
                    </Text>
                  ))}
                </View>

                {/* Footer */}
                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>₹{order.total}</Text>
                  </View>
                  <TouchableOpacity style={styles.reorderButton}>
                    <Icon name="reload-outline" size={16} color={colors.primary} />
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  helpButton: {
    padding: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  storeName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  itemsList: {
    marginBottom: spacing.md,
  },
  itemText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  trackButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  reorderButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  browseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrdersScreen;
