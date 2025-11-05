import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Text } from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../../config/theme';

const ItemDetailModal = ({ route, navigation }) => {
  const { item } = route.params || {};
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState('Regular');
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState({
    milk: 'Regular Milk',
    sugar: 'Normal Sugar',
    temperature: 'Hot',
  });

  // Size options with prices
  const sizeOptions = [
    { id: 1, name: 'Small', price: item?.price - 50 || 200 },
    { id: 2, name: 'Regular', price: item?.price || 250 },
    { id: 3, name: 'Large', price: item?.price + 50 || 300 },
  ];

  // Customization options
  const milkOptions = ['Regular Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk'];
  const sugarOptions = ['No Sugar', 'Less Sugar', 'Normal Sugar', 'Extra Sugar'];
  const temperatureOptions = ['Hot', 'Iced'];

  const handleAddToCart = () => {
    const selectedSizeObj = sizeOptions.find((s) => s.name === selectedSize);
    
    const cartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: selectedSizeObj?.price || item.price,
      size: selectedSize,
      customizations: selectedCustomizations,
      quantity: quantity,
      image: item.image || null,
    };

    dispatch(addToCart(cartItem));
    
    // Show success feedback
    navigation.goBack();
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const getItemImage = () => {
    try {
      return require('../../assets/images/item-default.jpg');
    } catch (e) {
      return null;
    }
  };

  if (!item) {
    return null;
  }

  const selectedSizePrice = sizeOptions.find((s) => s.name === selectedSize)?.price || item.price;

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={() => navigation.goBack()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Item Image */}
            <View style={styles.imageContainer}>
              {getItemImage() ? (
                <Image
                  source={getItemImage()}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>☕</Text>
                </View>
              )}
            </View>

            {/* Item Info */}
            <View style={styles.content}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>

              {/* Size Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Size</Text>
                <View style={styles.optionsRow}>
                  {sizeOptions.map((size) => (
                    <TouchableOpacity
                      key={size.id}
                      style={[
                        styles.optionButton,
                        selectedSize === size.name && styles.optionButtonActive,
                      ]}
                      onPress={() => setSelectedSize(size.name)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedSize === size.name && styles.optionTextActive,
                        ]}
                      >
                        {size.name}
                      </Text>
                      <Text
                        style={[
                          styles.optionPrice,
                          selectedSize === size.name && styles.optionPriceActive,
                        ]}
                      >
                        ₹{size.price}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Milk Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Milk</Text>
                <View style={styles.optionsColumn}>
                  {milkOptions.map((milk) => (
                    <TouchableOpacity
                      key={milk}
                      style={[
                        styles.optionRow,
                        selectedCustomizations.milk === milk && styles.optionRowActive,
                      ]}
                      onPress={() =>
                        setSelectedCustomizations({ ...selectedCustomizations, milk })
                      }
                    >
                      <Text
                        style={[
                          styles.optionRowText,
                          selectedCustomizations.milk === milk && styles.optionRowTextActive,
                        ]}
                      >
                        {milk}
                      </Text>
                      {selectedCustomizations.milk === milk && (
                        <Icon name="checkmark" size={20} color={colors.textPrimary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sugar Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sugar</Text>
                <View style={styles.optionsColumn}>
                  {sugarOptions.map((sugar) => (
                    <TouchableOpacity
                      key={sugar}
                      style={[
                        styles.optionRow,
                        selectedCustomizations.sugar === sugar && styles.optionRowActive,
                      ]}
                      onPress={() =>
                        setSelectedCustomizations({ ...selectedCustomizations, sugar })
                      }
                    >
                      <Text
                        style={[
                          styles.optionRowText,
                          selectedCustomizations.sugar === sugar && styles.optionRowTextActive,
                        ]}
                      >
                        {sugar}
                      </Text>
                      {selectedCustomizations.sugar === sugar && (
                        <Icon name="checkmark" size={20} color={colors.textPrimary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Temperature Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Temperature</Text>
                <View style={styles.optionsRow}>
                  {temperatureOptions.map((temp) => (
                    <TouchableOpacity
                      key={temp}
                      style={[
                        styles.optionButton,
                        selectedCustomizations.temperature === temp && styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setSelectedCustomizations({ ...selectedCustomizations, temperature: temp })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedCustomizations.temperature === temp && styles.optionTextActive,
                        ]}
                      >
                        {temp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Quantity Selector */}
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Icon name="remove" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Icon name="add" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartText}>
                Add to Cart • ₹{selectedSizePrice * quantity}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 250,
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
    fontSize: 100,
  },
  content: {
    padding: spacing.xl,
  },
  itemName: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  itemDescription: {
    ...typography.body2,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  optionsColumn: {
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  optionButtonActive: {
    borderColor: colors.textPrimary,
    backgroundColor: colors.textPrimary,
  },
  optionText: {
    ...typography.body2,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  optionTextActive: {
    color: colors.textLight,
  },
  optionPrice: {
    ...typography.caption,
  },
  optionPriceActive: {
    color: colors.textLight,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionRowActive: {
    borderColor: colors.textPrimary,
    backgroundColor: colors.background,
  },
  optionRowText: {
    ...typography.body2,
  },
  optionRowTextActive: {
    fontFamily: 'Montserrat-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...typography.h4,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.round,
    alignItems: 'center',
  },
  addToCartText: {
    ...typography.button,
    color: colors.textLight,
  },
});

export default ItemDetailModal;
