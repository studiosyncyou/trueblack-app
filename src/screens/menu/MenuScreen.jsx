import React, { useState, useRef, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows, typography } from '../../config/theme';

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
  const [selectedCategory, setSelectedCategory] = useState('espresso_hot');
  const [vegFilter, setVegFilter] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get cart items count
  const cartItems = useSelector((state) => state.cart?.totalItems || 0);
  
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
          scrollViewRef.current.scrollTo({ y: y - 100, animated: true });
        }
      );
    }
  };

  const handleAddToCart = (item) => {
    navigation.navigate('ItemDetail', { item });
  };

  const filteredItems = Object.keys(MENU_ITEMS).reduce((acc, key) => {
    acc[key] = vegFilter
      ? MENU_ITEMS[key].filter((item) => item.isVeg)
      : MENU_ITEMS[key];
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.locationSection}>
            <Icon name="location" size={20} color={colors.textPrimary} />
            <Text style={styles.locationText}>Kompally</Text>
            <Icon name="chevron-down" size={20} color={colors.textPrimary} />
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Icon name="search" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Icon name="options" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            {/* CART BUTTON */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Icon name="cart-outline" size={24} color={colors.textPrimary} />
              {cartItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sticky Category Tabs */}
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
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {items.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemImageContainer}>
                    {getItemImage() && !imageError ? (
                      <Image
                        source={getItemImage()}
                        style={styles.menuItemImage}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <View style={styles.menuItemImagePlaceholder}>
                        <Text style={styles.menuItemImageText}>☕</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.menuItemDetails}>
                    <View style={styles.menuItemHeader}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      {item.isVeg && (
                        <View style={styles.vegBadge}>
                          <View style={styles.vegDot} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.menuItemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuModalVisible(true)}
      >
        <Icon name="menu" size={24} color={colors.textLight} />
      </TouchableOpacity>

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

      {/* Menu Sidebar Modal */}
      <Portal>
        <Modal
          visible={menuModalVisible}
          onDismiss={() => setMenuModalVisible(false)}
          contentContainerStyle={styles.menuModal}
        >
          <Text style={styles.menuModalTitle}>Categories</Text>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.menuModalItem}
              onPress={() => {
                handleCategoryPress(category.key);
                setMenuModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.menuModalItemText,
                  selectedCategory === category.key && styles.menuModalItemTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </Modal>
      </Portal>
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
    fontFamily: 'Montserrat-Medium',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    padding: spacing.sm,
  },
  // CART BUTTON STYLES
  cartButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  cartBadgeText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  categoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  categoryTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.textPrimary,
  },
  categoryTabText: {
    ...typography.body2,
    fontFamily: 'Montserrat-Medium',
    color: colors.textSecondary,
  },
  categoryTabTextActive: {
    color: colors.textPrimary,
    fontFamily: 'Montserrat-SemiBold',
  },
  container: {
    flex: 1,
  },
  categorySection: {
    paddingVertical: spacing.xl,
  },
  categoryTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
    backgroundColor: colors.accentCream,
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  menuItemImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemImageText: {
    fontSize: 32,
  },
  menuItemDetails: {
    flex: 1,
    marginRight: spacing.md,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  menuItemName: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
  },
  vegBadge: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#2D7A3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D7A3E',
  },
  menuItemDescription: {
    ...typography.body2,
    marginBottom: spacing.sm,
  },
  menuItemPrice: {
    ...typography.price,
    fontFamily: 'Montserrat-Medium',
  },
  addButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.button,
  },
  menuButton: {
    position: 'absolute',
    bottom: spacing.xxxl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  filterModal: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xxxl,
    borderRadius: borderRadius.lg,
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
  menuModal: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xxxl,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  menuModalTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  menuModalItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuModalItemText: {
    ...typography.body1,
  },
  menuModalItemTextActive: {
    fontFamily: 'Montserrat-SemiBold',
    color: colors.textPrimary,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default MenuScreen;
