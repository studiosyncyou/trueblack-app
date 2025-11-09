import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart, updateQuantity } from '../../store/slices/cartSlice';
import QuantityCounter from '../common/QuantityCounter';
import { colors, spacing, typography, shadows } from '../../config/theme';

const { height } = Dimensions.get('window');

const ItemDetailModal = ({ visible, item, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [customizations, setCustomizations] = useState({
    milk: 'Regular Milk',
    sugar: 'Regular Sugar',
    ice: 'Regular Ice',
  });

  // Check if item is in cart
  const cartItem = cartItems.find(
    (cartItem) => 
      cartItem.id === item?.id &&
      cartItem.size === selectedSize
  );

  const [imageError, setImageError] = useState(false);

  const getItemImage = () => {
    try {
      return require('../../assets/images/item-default.jpg');
    } catch (e) {
      return null;
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    const itemToAdd = {
      ...item,
      size: selectedSize,
      customizations: customizations,
      cartId: Date.now() + Math.random(),
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (cartItem) {
      if (newQuantity === 0) {
        dispatch(updateQuantity({ cartId: cartItem.cartId, quantity: 0 }));
      } else {
        dispatch(updateQuantity({ cartId: cartItem.cartId, quantity: newQuantity }));
      }
    }
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Back Button - Transparent Background */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Icon name="chevron-back" size={32} color={colors.textPrimary} />
        </TouchableOpacity>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Item Image */}
          <View style={styles.imageContainer}>
            {getItemImage() && !imageError ? (
              <Image
                source={getItemImage()}
                style={styles.image}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>☕</Text>
              </View>
            )}
          </View>

          {/* Item Details */}
          <View style={styles.content}>
            {/* Item Name & Veg Badge */}
            <View style={styles.header}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.isVeg && (
                <View style={styles.vegBadge}>
                  <View style={styles.vegDot} />
                </View>
              )}
            </View>

            {/* Description */}
            <Text style={styles.description}>{item.description}</Text>

            {/* Price */}
            <Text style={styles.price}>₹{item.price}</Text>

            {/* Size Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SIZE</Text>
              <View style={styles.optionsRow}>
                {['Small', 'Regular', 'Large'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.optionButtonActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSize === size && styles.optionTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Milk Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MILK</Text>
              <View style={styles.optionsRow}>
                {['Regular Milk', 'Oat Milk', 'Almond Milk'].map((milk) => (
                  <TouchableOpacity
                    key={milk}
                    style={[
                      styles.optionButton,
                      customizations.milk === milk && styles.optionButtonActive,
                    ]}
                    onPress={() => setCustomizations({ ...customizations, milk })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        customizations.milk === milk && styles.optionTextActive,
                      ]}
                    >
                      {milk}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sugar Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SUGAR</Text>
              <View style={styles.optionsRow}>
                {['No Sugar', 'Less Sugar', 'Regular Sugar'].map((sugar) => (
                  <TouchableOpacity
                    key={sugar}
                    style={[
                      styles.optionButton,
                      customizations.sugar === sugar && styles.optionButtonActive,
                    ]}
                    onPress={() => setCustomizations({ ...customizations, sugar })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        customizations.sugar === sugar && styles.optionTextActive,
                      ]}
                    >
                      {sugar}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          {cartItem ? (
            <View style={styles.bottomBarContent}>
              <QuantityCounter
                quantity={cartItem.quantity}
                onIncrement={() => handleUpdateQuantity(cartItem.quantity + 1)}
                onDecrement={() => handleUpdateQuantity(cartItem.quantity - 1)}
              />
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.addToCartButtonText}>
                  View Cart • ₹{cartItem.price * cartItem.quantity}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.addToCartButtonText}>
                Add to Cart • ₹{item.price}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    width: 44,
    height: 44,
    backgroundColor: 'transparent', // Transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.5,
    backgroundColor: colors.accentCream,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 120,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  itemName: {
    ...typography.h2,
    flex: 1,
  },
  vegBadge: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  price: {
    ...typography.h3,
    fontFamily: 'Montserrat-Bold',
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.body2,
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  optionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionButtonActive: {
    borderColor: colors.textPrimary,
    backgroundColor: colors.textPrimary,
  },
  optionText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  optionTextActive: {
    color: colors.textLight,
  },
  bottomSpacing: {
    height: 120,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 16,
  },
});

export default ItemDetailModal;
