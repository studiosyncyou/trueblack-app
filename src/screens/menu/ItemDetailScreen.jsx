import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const { width } = Dimensions.get('window');

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [isFavorite, setIsFavorite] = useState(false);

  const sizes = [
    { id: 'small', label: 'Small', price: item.price - 50 },
    { id: 'regular', label: 'Regular', price: item.price },
    { id: 'large', label: 'Large', price: item.price + 50 },
  ];

  const addons = [
    { id: 'extra-cheese', label: 'Extra Cheese', price: 30 },
    { id: 'extra-sauce', label: 'Extra Sauce', price: 20 },
    { id: 'extra-toppings', label: 'Extra Toppings', price: 40 },
  ];

  const [selectedAddons, setSelectedAddons] = useState([]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const getCurrentPrice = () => {
    const sizePrice = sizes.find((s) => s.id === selectedSize)?.price || item.price;
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return (sizePrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        quantity,
        size: selectedSize,
        addons: selectedAddons,
        customPrice: getCurrentPrice(),
      })
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? colors.error : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Image */}
          <View style={[styles.itemImage, { backgroundColor: colors.lightBlue }]}>
            <Text style={styles.itemEmoji}>{getCategoryEmoji(item.category)}</Text>
            {/* Type Indicator */}
            <View style={styles.typeIndicatorBadge}>
              <TypeIndicator type={item.type} />
            </View>
            {/* New Badge */}
            {item.new && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>

          {/* Item Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Icon name="star" size={16} color={colors.warning} />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>

            <Text style={styles.itemDescription}>{item.description}</Text>

            {/* Nutrition Info */}
            <View style={styles.nutritionSection}>
              <View style={styles.nutritionItem}>
                <Icon name="flame-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.nutritionText}>{item.calories} kcal</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Icon name="time-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.nutritionText}>15-20 mins</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Icon name="leaf-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.nutritionText}>Fresh</Text>
              </View>
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Size</Text>
            <View style={styles.sizeOptions}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.sizeOption,
                    selectedSize === size.id && styles.sizeOptionActive,
                  ]}
                  onPress={() => setSelectedSize(size.id)}
                >
                  <Text
                    style={[
                      styles.sizeLabel,
                      selectedSize === size.id && styles.sizeLabelActive,
                    ]}
                  >
                    {size.label}
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === size.id && styles.sizePriceActive,
                    ]}
                  >
                    ₹{size.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add-ons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add-ons (Optional)</Text>
            {addons.map((addon) => (
              <TouchableOpacity
                key={addon.id}
                style={styles.addonOption}
                onPress={() => toggleAddon(addon.id)}
              >
                <View style={styles.addonLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedAddons.includes(addon.id) && styles.checkboxActive,
                    ]}
                  >
                    {selectedAddons.includes(addon.id) && (
                      <Icon name="checkmark" size={16} color={colors.white} />
                    )}
                  </View>
                  <Text style={styles.addonLabel}>{addon.label}</Text>
                </View>
                <Text style={styles.addonPrice}>+₹{addon.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <TouchableOpacity style={styles.instructionsInput}>
              <Icon name="chatbox-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.instructionsPlaceholder}>
                Add any special requests (Optional)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
            >
              <Icon name="remove" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Icon name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
            <Text style={styles.addButtonPrice}>₹{getCurrentPrice()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const TypeIndicator = ({ type }) => {
  const size = 16;
  const indicatorSize = 8;
  
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  content: {
    flex: 1,
  },
  itemImage: {
    width: width,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemEmoji: {
    fontSize: 100,
  },
  typeIndicatorBadge: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
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
  newBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.newBadge,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  infoSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  nutritionSection: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nutritionText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sizeOption: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  sizeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sizeLabelActive: {
    color: colors.primary,
  },
  sizePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sizePriceActive: {
    color: colors.primary,
  },
  addonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addonLabel: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  instructionsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsPlaceholder: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
    ...shadows.medium,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    minWidth: 50,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  addButtonPrice: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ItemDetailScreen;
