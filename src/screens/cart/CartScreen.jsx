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
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  const handleQuantityChange = (itemId, change) => {
    const item = items.find((i) => i.id === itemId);
    const newQuantity = item.quantity + change;

    if (newQuantity === 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const subtotal = totalAmount;
  const tax = totalAmount * 0.05; // 5% tax
  const deliveryFee = 40;
  const total = subtotal + tax + deliveryFee;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="cart-outline" size={80} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add items from the menu to get started
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('MenuMain')}
            >
              <Text style={styles.browseButtonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Cart</Text>
            <Text style={styles.headerSubtitle}>{totalQuantity} items</Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Icon name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Cart Items */}
          <View style={styles.itemsSection}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                {/* Item Image */}
                <View style={[styles.itemImage, { backgroundColor: colors.lightBlue }]}>
                  <Text style={styles.itemEmoji}>
                    {getCategoryEmoji(item.category)}
                  </Text>
                  {/* Type Indicator */}
                  <View style={styles.typeIndicatorBadge}>
                    <TypeIndicator type={item.type} />
                  </View>
                </View>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>

                  {/* Quantity Controls */}
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, -1)}
                    >
                      <Icon name="remove" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, 1)}
                    >
                      <Icon name="add" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remove Button */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Icon name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add More Items */}
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => navigation.navigate('MenuMain')}
          >
            <Icon name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addMoreText}>Add more items</Text>
          </TouchableOpacity>

          {/* Bill Details */}
          <View style={styles.billSection}>
            <Text style={styles.billTitle}>Bill Details</Text>
            
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes (5%)</Text>
              <Text style={styles.billValue}>₹{tax.toFixed(2)}</Text>
            </View>

            <View style={styles.billDivider} />

            <View style={styles.billRow}>
              <Text style={styles.billTotalLabel}>Total</Text>
              <Text style={styles.billTotalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>Delivery Instructions</Text>
            <TouchableOpacity style={styles.instructionsInput}>
              <Icon name="document-text-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.instructionsPlaceholder}>
                Add instructions (Optional)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Checkout Button */}
        <View style={styles.checkoutContainer}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutLabel}>Total Amount</Text>
            <Text style={styles.checkoutAmount}>₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Icon name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const TypeIndicator = ({ type }) => {
  const size = 12;
  const indicatorSize = 6;
  
  if (type === 'veg') {
    return (
      <View style={[styles.typeIndicatorContainer, { width: size, height: size }]}>
        <View style={[styles.typeIndicator, styles.vegIndicator, { width: indicatorSize, height: indicatorSize }]} />
      </View>
    );
  }
  if (type === 'non-veg') {
    return (
      <View style={[styles.typeIndicatorContainer, { width: size, height: size }]}>
        <View style={[styles.typeIndicator, styles.nonVegIndicator, { width: indicatorSize, height: indicatorSize }]} />
      </View>
    );
  }
  if (type === 'egg') {
    return (
      <View style={[styles.typeIndicatorContainer, { width: size, height: size }]}>
        <View style={[styles.typeIndicator, styles.eggIndicator, { width: indicatorSize, height: indicatorSize }]} />
      </View>
    );
  }
  return null;
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clearButton: {
    padding: spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  itemsSection: {
    marginBottom: spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemEmoji: {
    fontSize: 32,
  },
  typeIndicatorBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  typeIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  typeIndicator: {},
  vegIndicator: {
    backgroundColor: colors.veg,
    borderRadius: 3,
  },
  nonVegIndicator: {
    backgroundColor: colors.nonVeg,
  },
  eggIndicator: {
    backgroundColor: colors.egg,
    borderRadius: 3,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: spacing.sm,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    minWidth: 40,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.xs,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  billSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  billLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  instructionsSection: {
    marginBottom: spacing.xxxl,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  instructionsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsPlaceholder: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  checkoutContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.medium,
  },
  checkoutInfo: {
    marginBottom: spacing.md,
  },
  checkoutLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  checkoutAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
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

export default CartScreen;
