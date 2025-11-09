import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { Text, Modal, Portal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart, updateQuantity } from '../../store/slices/cartSlice';
import ItemDetailModal from '../../components/menu/ItemDetailModal';
import QuantityCounter from '../../components/common/QuantityCounter';
import { colors, spacing, typography } from '../../config/theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 1, name: 'ESPRESSO HOT', key: 'espresso_hot' },
  { id: 2, name: 'ESPRESSO COLD', key: 'espresso_cold' },
  { id: 3, name: 'COLD BREW', key: 'cold_brew' },
  { id: 4, name: 'SOURDOUGH TOAST', key: 'sourdough_toast' },
  { id: 5, name: 'DESSERTS', key: 'desserts' },
];

const MENU_ITEMS = {
  espresso_hot: [
    { id: 1, name: 'Espresso', description: 'Classic Italian espresso', price: 250, isVeg: true },
    { id: 2, name: 'Latte Hot', description: 'Smooth espresso with steamed milk', price: 250, isVeg: true },
    { id: 3, name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and foam', price: 250, isVeg: true },
    { id: 4, name: 'Spanish Latte', description: 'Sweet and creamy with condensed milk', price: 250, isVeg: true },
  ],
  espresso_cold: [
    { id: 5, name: 'Iced Latte', description: 'Cold espresso with milk', price: 300, isVeg: true },
    { id: 6, name: 'Iced Mocha', description: 'Espresso with chocolate and cold milk', price: 350, isVeg: true },
  ],
  cold_brew: [
    { id: 7, name: 'Cold Brew', description: 'Smooth, cold-steeped coffee', price: 300, isVeg: true },
    { id: 8, name: 'Cold Brew Latte', description: 'Cold brew with creamy milk', price: 350, isVeg: true },
  ],
  sourdough_toast: [
    { id: 9, name: 'Avocado Toast', description: 'Fresh avocado on sourdough', price: 350, isVeg: true },
    { id: 10, name: 'Red Pepper Hummus Toast', description: 'Homemade hummus with peppers', price: 250, isVeg: true },
  ],
  desserts: [
    { id: 11, name: 'Tiramisu', description: 'Classic Italian dessert', price: 350, isVeg: true },
    { id: 12, name: 'Croissant', description: 'Buttery, flaky pastry', price: 150, isVeg: true },
  ],
};

const MenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('espresso_hot');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [vegFilter, setVegFilter] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get cart data
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartTotal = useSelector((state) => state.cart?.totalItems || 0);
  const location = useSelector((state) => state.location?.currentLocation);
  
  const scrollViewRef = useRef(null);
  const categoryRefs = useRef({});

  const getItemImage = () => {
    try {
      return require('../../assets/images/item-default.jpg');
    } catch (e) {
      return null;
    }
  };

  const handleCategoryPress = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const categoryRef = categoryRefs.current[categoryKey];
    if (categoryRef && scrollViewRef.current) {
      categoryRef.measureLayout(
        scrollViewRef.current.getInnerViewNode(),
        (x, y) => {
          scrollViewRef.current.scrollTo({ y: y - 120, animated: true });
        }
      );
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setItemModalVisible(true);
  };

  const handleAddToCart = (item) => {
    const itemToAdd = {
      ...item,
      size: 'Regular',
      customizations: {},
      cartId: Date.now() + Math.random(),
      quantity: 1,
    };
    dispatch(addToCart(itemToAdd));
  };

  const getCartQuantity = (itemId) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      dispatch(updateQuantity({ cartId: item.cartId, quantity: newQuantity }));
    }
  };

  const handleProceedToCart = () => {
    navigation.navigate('Cart');
  };

  const handleLocationPress = () => {
    navigation.navigate('LocationLogin');
  };

  const filteredItems = Object.keys(MENU_ITEMS).reduce((acc, key) => {
    acc[key] = vegFilter
      ? MENU_ITEMS[key].filter((item) => item.isVeg)
      : MENU_ITEMS[key];
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        {/* Top Row: Location + Icons */}
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.locationSection}
            onPress={handleLocationPress}
            activeOpacity={0.7}
          >
            <Icon name="location" size={20} color={colors.textPrimary} />
            <Text style={styles.locationText}>
              {location?.area || 'Kokapet'}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.7}
            >
              <Icon name="search" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFilterModalVisible(true)}
              activeOpacity={0.7}
            >
              <Icon name="options" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.7}
            >
              <Icon name="cart-outline" size={24} color={colors.textPrimary} />
              {cartTotal > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartTotal}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.key && styles.categoryTabActive,
              ]}
              onPress={() => handleCategoryPress(category.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category.key && styles.categoryTabTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORIES.map((category) => {
          const items = filteredItems[category.key];
          if (!items || items.length === 0) return null;

          return (
            <View
              key={category.id}
              ref={(ref) => (categoryRefs.current[category.key] = ref)}
              style={styles.categorySection}
            >
              {items.map((item) => {
                const quantity = getCartQuantity(item.id);
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.8}
                  >
                    {/* Left: Image with ADD Button Overlay */}
                    <View style={styles.imageSection}>
                      <View style={styles.imageContainer}>
                        {getItemImage() && !imageError ? (
                          <Image
                            source={getItemImage()}
                            style={styles.itemImage}
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>☕</Text>
                          </View>
                        )}
                        
                        {/* ADD Button or Quantity Counter - Overlaid on Image */}
                        <View style={styles.buttonOverlay}>
                          {quantity === 0 ? (
                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.addButtonText}>ADD</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.quantityOverlay}>
                              <QuantityCounter
                                quantity={quantity}
                                onIncrement={(e) => {
                                  if (e) e.stopPropagation();
                                  handleUpdateQuantity(item.id, quantity + 1);
                                }}
                                onDecrement={(e) => {
                                  if (e) e.stopPropagation();
                                  handleUpdateQuantity(item.id, quantity - 1);
                                }}
                                small
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Right: Item Details */}
                    <View style={styles.detailsSection}>
                      {/* First Line: Name, Veg Badge, Price */}
                      <View style={styles.firstLine}>
                        <View style={styles.nameContainer}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          {item.isVeg && (
                            <View style={styles.vegBadge}>
                              <View style={styles.vegDot} />
                            </View>
                          )}
                        </View>
                        <Text style={styles.itemPrice}>₹{item.price}</Text>
                      </View>
                      
                      {/* Description */}
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Proceed to Cart Button */}
      {cartTotal > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedToCart}
            activeOpacity={0.8}
          >
            <View style={styles.proceedCartBadge}>
              <Text style={styles.proceedCartBadgeText}>{cartTotal}</Text>
            </View>
            <Text style={styles.proceedButtonText}>Proceed to Cart</Text>
            <Icon name="arrow-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          contentContainerStyle={styles.filterModal}
        >
          <Text style={styles.filterModalTitle}>Filter</Text>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => {
              setVegFilter(!vegFilter);
              setFilterModalVisible(false);
            }}
            activeOpacity={0.7}
          >
            <Icon
              name={vegFilter ? 'checkbox' : 'square-outline'}
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.filterOptionText}>Vegetarian Only</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

      {/* Item Detail Modal */}
      <ItemDetailModal
        visible={itemModalVisible}
        item={selectedItem}
        onClose={() => setItemModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationText: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
  },
  cartButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.textLight,
    fontSize: 11,
    fontFamily: 'Montserrat-Bold',
  },
  categoryTabs: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryTab: {
    paddingVertical: spacing.sm,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.textPrimary,
  },
  categoryTabText: {
    ...typography.body2,
    fontFamily: 'Montserrat-Medium',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  categoryTabTextActive: {
    color: colors.textPrimary,
    fontFamily: 'Montserrat-SemiBold',
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  categorySection: {
    backgroundColor: colors.surface,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  imageSection: {
    marginRight: spacing.lg,
  },
  imageContainer: {
    width: 140,
    height: 180,
    backgroundColor: colors.accentCream,
    position: 'relative',
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
    fontSize: 48,
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  addButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 12,
    letterSpacing: 1,
  },
  quantityOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  detailsSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: spacing.md,
  },
  firstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  itemName: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
  vegBadge: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  itemPrice: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    marginLeft: spacing.sm,
  },
  itemDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
    fontSize: 13,
  },
  bottomSpacing: {
    height: 120,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  proceedButton: {
    backgroundColor: colors.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  proceedCartBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  proceedCartBadgeText: {
    color: colors.textLight,
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
  },
  proceedButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 16,
  },
  filterModal: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xxxl,
    borderRadius: 8,
    padding: spacing.xl,
  },
  filterModalTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  filterOptionText: {
    ...typography.body1,
  },
});

export default MenuScreen;
