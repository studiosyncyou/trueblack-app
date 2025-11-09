import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

const { width, height } = Dimensions.get('window');

const ItemDetailModal = ({ visible, item, onClose }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedTemp, setSelectedTemp] = useState('Hot');

  if (!item) return null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        quantity,
        selectedSize,
        selectedTemp,
      })
    );
    onClose();
    setQuantity(1);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const totalPrice = item.price * quantity;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Item Image */}
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image
                source={item.image}
                style={styles.itemImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>☕</Text>
              </View>
            )}
          </View>

          {/* Item Details */}
          <View style={styles.detailsContainer}>
            {/* Title and Badge */}
            <View style={styles.titleRow}>
              {item.isVeg !== undefined && (
                <View style={styles.vegBadge}>
                  <View
                    style={[
                      styles.vegDot,
                      !item.isVeg && { backgroundColor: colors.error },
                    ]}
                  />
                </View>
              )}
              <Text style={styles.itemName}>{item.name}</Text>
            </View>

            {/* Price */}
            <Text style={styles.itemPrice}>₹{item.price}</Text>

            {/* Description */}
            {item.description && (
              <Text style={styles.itemDescription}>{item.description}</Text>
            )}

            {/* Size Options (if applicable) */}
            {item.category?.includes('espresso') && (
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Size</Text>
                <View style={styles.optionButtons}>
                  {['Regular', 'Large'].map((size) => (
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
                          styles.optionButtonText,
                          selectedSize === size && styles.optionButtonTextActive,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Temperature Options (if applicable) */}
            {item.category?.includes('espresso') && (
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Temperature</Text>
                <View style={styles.optionButtons}>
                  {['Hot', 'Iced'].map((temp) => (
                    <TouchableOpacity
                      key={temp}
                      style={[
                        styles.optionButton,
                        selectedTemp === temp && styles.optionButtonActive,
                      ]}
                      onPress={() => setSelectedTemp(temp)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedTemp === temp && styles.optionButtonTextActive,
                        ]}
                      >
                        {temp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.optionTitle}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decreaseQuantity}
                  activeOpacity={0.7}
                >
                  <Icon name="remove" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={increaseQuantity}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            activeOpacity={0.9}
          >
            <View style={styles.addToCartContent}>
              <View>
                <Text style={styles.addToCartText}>ADD TO CART</Text>
                <Text style={styles.addToCartSubtext}>
                  {quantity} item{quantity !== 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={styles.addToCartPrice}>₹{totalPrice}</Text>
            </View>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  closeButton: {
    padding: spacing.sm,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
    backgroundColor: colors.accentCream,
  },
  itemImage: {
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
    fontSize: 80,
  },
  detailsContainer: {
    padding: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  vegBadge: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  itemName: {
    ...typography.h2,
    fontSize: 24,
    flex: 1,
  },
  itemPrice: {
    ...typography.h3,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  itemDescription: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  optionSection: {
    marginBottom: spacing.xl,
  },
  optionTitle: {
    ...typography.h4,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  optionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  optionButtonText: {
    ...typography.button,
    color: colors.textPrimary,
    fontSize: 14,
  },
  optionButtonTextActive: {
    color: colors.textLight,
  },
  quantitySection: {
    marginBottom: spacing.xl,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...typography.h3,
    fontSize: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addToCartButton: {
    backgroundColor: colors.textPrimary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  addToCartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartText: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 16,
  },
  addToCartSubtext: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.8,
    marginTop: 2,
  },
  addToCartPrice: {
    ...typography.h3,
    color: colors.textLight,
    fontSize: 20,
  },
});

export default ItemDetailModal;
