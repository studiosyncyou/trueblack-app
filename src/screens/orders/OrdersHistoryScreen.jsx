import React from 'react';
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

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'TB1729500123',
    date: '2025-10-28',
    time: '2:30 PM',
    status: 'delivered',
    items: ['Latte Hot', 'Croissant'],
    total: 500,
  },
  {
    id: 'TB1729400456',
    date: '2025-10-25',
    time: '11:15 AM',
    status: 'delivered',
    items: ['Espresso', 'Avocado Toast'],
    total: 450,
  },
  {
    id: 'TB1729300789',
    date: '2025-10-22',
    time: '4:45 PM',
    status: 'cancelled',
    items: ['Spanish Latte'],
    total: 250,
  },
];

const OrdersHistoryScreen = ({ navigation }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return { name: 'checkmark-circle', color: colors.success };
      case 'pending':
        return { name: 'time', color: colors.warning };
      case 'cancelled':
        return { name: 'close-circle', color: colors.error };
      default:
        return { name: 'ellipse', color: colors.textSecondary };
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ORDERS.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="receipt-outline" size={80} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Start ordering from the menu
            </Text>
          </View>
        ) : (
          MOCK_ORDERS.map((order) => {
            const statusIcon = getStatusIcon(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => {
                  // Navigate to order details if needed
                  alert(`Order details for ${order.id}`);
                }}
                activeOpacity={0.9}
              >
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>
                      {order.date} • {order.time}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Icon
                      name={statusIcon.name}
                      size={16}
                      color={statusIcon.color}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusIcon.color },
                      ]}
                    >
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View style={styles.orderItems}>
                  <Text style={styles.itemsLabel}>Items:</Text>
                  <Text style={styles.itemsText}>
                    {order.items.join(', ')}
                  </Text>
                </View>

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₹{order.total}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  orderDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: spacing.md,
  },
  itemsLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  itemsText: {
    fontSize: 14,
    color: colors.textPrimary,
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
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default OrdersHistoryScreen;
