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
  Alert,
  TextInput,
} from 'react-native';
import { Text, Modal, Portal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart, updateQuantity } from '../../store/slices/cartSlice';
import { setSelectedStore } from '../../store/slices/locationSlice';
import ItemDetailModal from '../../components/menu/ItemDetailModal';
import QuantityCounter from '../../components/common/QuantityCounter';
import { colors, spacing, typography } from '../../config/theme';
import { getMenuForStore, getAllCategories, STORES } from '../../data/storeMenus';

const { width } = Dimensions.get('window');

const MenuScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selectedStore = useSelector((state) => state.location?.selectedStore);
  const userLocation = useSelector((state) => state.location?.currentLocation);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartTotal = useSelector((state) => state.cart?.totalItems || 0);

  const [selectedCategory, setSelectedCategory] = useState('espresso_hot');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [vegFilter, setVegFilter] = useState(false);
  const [menuItems, setMenuItems] = useState({});
  const [imageError, setImageError] = useState(false);
  const [nearestStore, setNearestStore] = useState(null);
  const [storeDistance, setStoreDistance] = useState(null);
  const [hasSetNearestStore, setHasSetNearestStore] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const scrollViewRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const categoryRefs = useRef({});
  const categoryPositions = useRef({});
  const categoryTabRefs = useRef({});
  const isScrollingProgrammatically = useRef(false);
  const searchInputRef = useRef(null);

  const CATEGORIES = getAllCategories();

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Find and SET nearest store on mount
  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude && !hasSetNearestStore) {
      const storesWithDistance = STORES.map((store) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        );
        return { ...store, distance };
      });

      storesWithDistance.sort((a, b) => a.distance - b.distance);
      const nearest = storesWithDistance[0];

      setNearestStore(nearest);
      setStoreDistance(nearest.distance);
      dispatch(setSelectedStore(nearest));
      setHasSetNearestStore(true);
    } else if (selectedStore && !nearestStore) {
      setNearestStore(selectedStore);
      setStoreDistance(null);
    }
  }, [userLocation, hasSetNearestStore]);

  // Load menu when store changes
  useEffect(() => {
    const storeToUse = selectedStore || nearestStore || STORES[0];
    const storeMenu = getMenuForStore(storeToUse.id);
    setMenuItems(storeMenu);
  }, [selectedStore, nearestStore]);

  // Get store display text with distance
  const getStoreDisplayText = () => {
    const store = selectedStore || nearestStore;
    if (!store) return 'Select Store';

    if (userLocation?.latitude && userLocation?.longitude) {
      const distanceToSelected = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        store.latitude,
        store.longitude
      );
      return `${store.spaceName} - ${store.area} ${distanceToSelected.toFixed(1)}km away`;
    } else {
      return `${store.spaceName} - ${store.area}`;
    }
  };

  // Handle store selection with farther store warning
  const handleLocationPress = () => {
    navigation.navigate('StoreSelector', {
      onStoreSelect: (store) => {
        if (nearestStore && userLocation && store.id !== nearestStore.id) {
          const distanceToSelected = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            store.latitude,
            store.longitude
          );
          const distanceToNearest = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            nearestStore.latitude,
            nearestStore.longitude
          );

          if (distanceToSelected > distanceToNearest) {
            Alert.alert(
              'Farther Location',
              `You are selecting ${store.spaceName} (${distanceToSelected.toFixed(1)}km away) instead of the nearest store ${nearestStore.spaceName} (${distanceToNearest.toFixed(1)}km away).\n\nDo you want to continue?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Continue',
                  onPress: () => dispatch(setSelectedStore(store)),
                },
              ]
            );
          } else {
            dispatch(setSelectedStore(store));
          }
        } else {
          dispatch(setSelectedStore(store));
        }
      },
    });
  };

  const handleCategoryPress = (categoryKey) => {
    isScrollingProgrammatically.current = true;
    setSelectedCategory(categoryKey);
    scrollCategoryTabIntoView(categoryKey);
    
    const position = categoryPositions.current[categoryKey];
    
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ 
        y: position - 120, 
        animated: true 
      });
      
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
    } else {
      isScrollingProgrammatically.current = false;
    }
  };

  const handleScroll = (event) => {
    if (isScrollingProgrammatically.current) return;

    const scrollY = event.nativeEvent.contentOffset.y;
    const offset = 150;

    let currentCategory = selectedCategory;
    
    CATEGORIES.forEach((category) => {
      const position = categoryPositions.current[category.key];
      if (position !== undefined && scrollY + offset >= position) {
        currentCategory = category.key;
      }
    });

    if (currentCategory !== selectedCategory) {
      setSelectedCategory(currentCategory);
      scrollCategoryTabIntoView(currentCategory);
    }
  };

  const scrollCategoryTabIntoView = (categoryKey) => {
    const tabRef = categoryTabRefs.current[categoryKey];
    if (tabRef && categoryScrollRef.current) {
      tabRef.measureLayout(
        categoryScrollRef.current,
        (x, y, width, height) => {
          const scrollViewWidth = Dimensions.get('window').width;
          const scrollToX = x - (scrollViewWidth / 2) + (width / 2);
          
          categoryScrollRef.current.scrollTo({
            x: Math.max(0, scrollToX),
            animated: true,
          });
        },
        () => {}
      );
    }
  };

  const onCategoryLayout = (categoryKey, event) => {
    const { y } = event.nativeEvent.layout;
    categoryPositions.current[categoryKey] = y;
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setItemModalVisible(true);
  };

  const getCartQuantity = (itemId) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        ...item,
        storeId: selectedStore?.id || nearestStore?.id || 1,
        storeName: selectedStore?.name || nearestStore?.name || 'True Black',
      })
    );
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

  // Filter items based on search query
  const getFilteredItems = () => {
    let filtered = Object.keys(menuItems).reduce((acc, key) => {
      const items = menuItems[key] || [];
      acc[key] = vegFilter ? items.filter((item) => item.isVeg) : items;
      return acc;
    }, {});

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const items = filtered[key] || [];
        const matchedItems = items.filter((item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
        if (matchedItems.length > 0) {
          acc[key] = matchedItems;
        }
        return acc;
      }, {});
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

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
            <Icon name="location" size={18} color={colors.textPrimary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {getStoreDisplayText()}
            </Text>
            <Icon name="chevron-down" size={18} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerIcons}>
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

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search menu items..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Icon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Tabs - Only show if not searching */}
        {searchQuery.trim() === '' && (
          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabs}
            contentContainerStyle={styles.categoryTabsContent}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                ref={(ref) => (categoryTabRefs.current[category.key] = ref)}
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
        )}

        {/* Search Results Count */}
        {searchQuery.trim() !== '' && (
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsText}>
              {Object.values(filteredItems).flat().length} result{Object.values(filteredItems).flat().length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {Object.keys(filteredItems).length === 0 ? (
          <View style={styles.noResults}>
            <Icon name="search-outline" size={60} color={colors.textTertiary} />
            <Text style={styles.noResultsTitle}>No items found</Text>
            <Text style={styles.noResultsSubtitle}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          CATEGORIES.map((category) => {
            const items = filteredItems[category.key] || [];
            if (items.length === 0) return null;

            return (
              <View
                key={category.id}
                ref={(ref) => (categoryRefs.current[category.key] = ref)}
                onLayout={(event) => onCategoryLayout(category.key, event)}
                style={styles.categorySection}
              >
                {/* Category Title - Only show if not searching */}
                {searchQuery.trim() === '' && (
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryHeaderText}>{category.name}</Text>
                  </View>
                )}

                {items.map((item) => {
                  const quantity = getCartQuantity(item.id);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleItemPress(item)}
                      activeOpacity={0.9}
                    >
                      {/* Image Section */}
                      <View style={styles.imageSection}>
                        <View style={styles.imageContainer}>
                          {item.image ? (
                            <Image
                              source={item.image}
                              style={styles.itemImage}
                              resizeMode="cover"
                              onError={() => setImageError(true)}
                            />
                          ) : (
                            <View style={styles.imagePlaceholder}>
                              <Text style={styles.imagePlaceholderText}>
                                {category.key.includes('coffee') || category.key.includes('espresso') || category.key.includes('brew') ? '☕' : '🍽️'}
                              </Text>
                            </View>
                          )}
                          
                          {/* Button Overlay */}
                          <View style={styles.buttonOverlay}>
                            {quantity > 0 ? (
                              <View style={styles.quantityOverlay}>
                                <QuantityCounter
                                  quantity={quantity}
                                  onIncrement={() => handleUpdateQuantity(item.id, quantity + 1)}
                                  onDecrement={() => handleUpdateQuantity(item.id, quantity - 1)}
                                  size="small"
                                />
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => handleAddToCart(item)}
                                activeOpacity={0.8}
                              >
                                <Text style={styles.addButtonText}>ADD</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>

                      {/* Details Section */}
                      <View style={styles.detailsSection}>
                        <View style={styles.firstLine}>
                          <View style={styles.nameContainer}>
                            {item.isVeg !== undefined && (
                              <View style={styles.vegBadge}>
                                <View 
                                  style={[
                                    styles.vegDot, 
                                    !item.isVeg && { backgroundColor: colors.error }
                                  ]} 
                                />
                              </View>
                            )}
                            <Text style={styles.itemName} numberOfLines={2}>
                              {item.name}
                            </Text>
                          </View>
                          <Text style={styles.itemPrice}>₹{item.price}</Text>
                        </View>
                        <Text style={styles.itemDescription} numberOfLines={3}>
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* View Cart Button */}
      {cartTotal > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={handleProceedToCart}
            activeOpacity={0.9}
          >
            <Text style={styles.itemsCount}>{cartTotal} item{cartTotal !== 1 ? 's' : ''}</Text>
            <View style={styles.viewCartRight}>
              <Text style={styles.viewCartText}>VIEW CART</Text>
              <Icon name="arrow-forward" size={20} color={colors.textLight} />
            </View>
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
          <Text style={styles.filterModalTitle}>FILTERS</Text>
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
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.md,
  },
  locationText: {
    ...typography.body2,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    flex: 1,
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
  searchBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Montserrat-Regular',
  },
  searchResultsHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  searchResultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Montserrat-SemiBold',
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
  categoryHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  categoryHeaderText: {
    ...typography.h3,
    fontSize: 16,
    letterSpacing: 1,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: spacing.xxxxl * 2,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
    fontFamily: 'Montserrat-Bold',
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
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
    height: 150,
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
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  viewCartButton: {
    backgroundColor: colors.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  itemsCount: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 16,
  },
  viewCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  viewCartText: {
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
