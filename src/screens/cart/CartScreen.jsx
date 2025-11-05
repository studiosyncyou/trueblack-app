import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);

  const handleRemoveItem = (cartId) => {
    dispatch(removeFromCart(cartId));
  };

  const handleIncrement = (cartId) => {
    dispatch(incrementQuantity(cartId));
  };

  const handleDecrement = (cartId) => {
    dispatch(decrementQuantity(cartId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
            <View style={styles.backButton} />
          </View>

          {/* Empty Cart */}
          <View style={styles.emptyContainer}>
            <Icon name="cart-outline" size={100} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add items from the menu to get started
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart ({totalItems})</Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <View key={item.cartId} style={styles.cartItem}>
              {/* Item Image */}
              <View style={styles.itemImageContainer}>
                <View style={styles.itemImagePlaceholder}>
                  <Text style={styles.itemImagePlaceholderText}>☕</Text>
                </View>
              </View>

              {/* Item Details */}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSize}>{item.size}</Text>
                
                {/* Customizations */}
                {item.customizations && (
                  <View style={styles.customizations}>
                    <Text style={styles.customizationText}>
                      {item.customizations.milk}
                    </Text>
                    <Text style={styles.customizationDot}> • </Text>
                    <Text style={styles.customizationText}>
                      {item.customizations.sugar}
                    </Text>
                    <Text style={styles.customizationDot}> • </Text>
                    <Text style={styles.customizationText}>
                      {item.customizations.temperature}
                    </Text>
                  </View>
                )}

                {/* Price and Quantity */}
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecrement(item.cartId)}
                    >
                      <Icon name="remove" size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncrement(item.cartId)}
                    >
                      <Icon name="add" size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Remove Button */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.cartId)}
              >
                <Icon name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add spacing at bottom */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer with Total and Checkout */}
        <View style={styles.footer}>
          {/* Bill Details */}
          <View style={styles.billDetails}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₹{totalPrice}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & Fees</Text>
              <Text style={styles.billValue}>₹{Math.round(totalPrice * 0.05)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.billRow}>
              <Text style={styles.billLabelBold}>Total</Text>
              <Text style={styles.billValueBold}>
                ₹{totalPrice + Math.round(totalPrice * 0.05)}
              </Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout
            </Text>
            <Icon name="arrow-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearButtonText: {
    ...typography.button,
    color: colors.error,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemImageContainer: {
    marginRight: spacing.md,
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.accentCream,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImagePlaceholderText: {
    fontSize: 40,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    ...typography.h4,
    marginBottom: spacing.xs,
  },
  itemSize: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  customizations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  customizationText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  customizationDot: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    ...typography.h4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    marginHorizontal: spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  browseButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.round,
  },
  browseButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  billDetails: {
    marginBottom: spacing.lg,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  billLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  billValue: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  billLabelBold: {
    ...typography.h4,
  },
  billValueBold: {
    ...typography.h4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  checkoutButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
});

export default CartScreen;
