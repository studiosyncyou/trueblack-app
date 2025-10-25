import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { menuItems, categories, getItemsByCategory, getItemsByType, searchItems, getPopularItems } from '../../data/menuData';
import { stores } from '../../data/storeData';
import { colors, spacing, typography, borderRadius, shadows } from '../../config/theme';

const { width } = Dimensions.get('window');

const MenuScreen = ({ navigation }) => {
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [orderType, setOrderType] = useState('takeaway');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);
  
  const cartTotal = useSelector((state) => state.cart.totalQuantity);
  const bestSellers = getPopularItems();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (userLocation) {
      findNearestStore();
    }
  }, [userLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find nearby stores.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
        setUserLocation({
          latitude: 17.4239,
          longitude: 78.4738,
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const findNearestStore = () => {
    if (!userLocation) return;

    let nearest = stores[0];
    let minDistance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      stores[0].coordinates.latitude,
      stores[0].coordinates.longitude
    );

    stores.forEach(store => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        store.coordinates.latitude,
        store.coordinates.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = store;
      }
    });

    setNearestStore({
      ...nearest,
      distance: minDistance.toFixed(2) + ' KM AWAY'
    });
    setSelectedStore(nearest);
  };

  let filteredItems = menuItems;
  
  if (searchQuery) {
    filteredItems = searchItems(searchQuery);
  } else {
    if (selectedCategory !== 'all') {
      filteredItems = getItemsByCategory(selectedCategory);
    }
    if (selectedType !== 'all') {
      filteredItems = filteredItems.filter(item => item.type === selectedType);
    }
  }

  const handleItemPress = (item) => {
    navigation.navigate('ItemDetail', { item });
  };

  const TypeIndicator = ({ type, small = false }) => {
    const size = small ? 12 : 16;
    const indicatorSize = small ? 6 : 8;
    
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

  const displayStore = nearestStore || selectedStore;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header with Location */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>🏪</Text>
            <View>
              <TouchableOpacity style={styles.locationSelector}>
                <Text style={styles.locationText}>
                  {displayStore.location.toUpperCase()}
                </Text>
                <Text style={styles.locationArrow}>▼</Text>
              </TouchableOpacity>
              <Text style={styles.distanceText}>
                {nearestStore ? nearestStore.distance : displayStore.distance}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={getLocation}>
              <Text style={styles.icon}>📍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Type Toggle */}
        <View style={styles.orderTypeContainer}>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              orderType === 'takeaway' && styles.orderTypeButtonActive,
            ]}
            onPress={() => setOrderType('takeaway')}
          >
            <Text style={styles.orderTypeIcon}>🥡</Text>
            <Text
              style={[
                styles.orderTypeText,
                orderType === 'takeaway' && styles.orderTypeTextActive,
              ]}
            >
              Takeaway
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              orderType === 'dine-in' && styles.orderTypeButtonActive,
            ]}
            onPress={() => setOrderType('dine-in')}
          >
            <Text style={styles.orderTypeIcon}>🍽️</Text>
            <Text
              style={[
                styles.orderTypeText,
                orderType === 'dine-in' && styles.orderTypeTextActive,
              ]}
            >
              Dine-in
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search "${selectedCategory === 'all' ? 'Menu' : selectedCategory}"`}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Type Filters */}
        <View style={styles.typeFiltersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeFiltersContent}
          >
            <TouchableOpacity
              style={[
                styles.typeFilterChip,
                selectedType === 'veg' && styles.typeFilterChipActive,
              ]}
              onPress={() => setSelectedType(selectedType === 'veg' ? 'all' : 'veg')}
            >
              <TypeIndicator type="veg" small />
              <Text style={[
                styles.typeFilterText,
                selectedType === 'veg' && styles.typeFilterTextActive,
              ]}>
                Veg
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeFilterChip,
                selectedType === 'non-veg' && styles.typeFilterChipActive,
              ]}
              onPress={() => setSelectedType(selectedType === 'non-veg' ? 'all' : 'non-veg')}
            >
              <TypeIndicator type="non-veg" small />
              <Text style={[
                styles.typeFilterText,
                selectedType === 'non-veg' && styles.typeFilterTextActive,
              ]}>
                Non-veg
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeFilterChip,
                selectedType === 'egg' && styles.typeFilterChipActive,
              ]}
              onPress={() => setSelectedType(selectedType === 'egg' ? 'all' : 'egg')}
            >
              <TypeIndicator type="egg" small />
              <Text style={[
                styles.typeFilterText,
                selectedType === 'egg' && styles.typeFilterTextActive,
              ]}>
                Egg
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.typeFilterChip}>
              <Text style={styles.typeFilterIcon}>🎁</Text>
              <Text style={styles.typeFilterText}>Combo Deals</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* BEST SELLERS SECTION */}
        {!searchQuery && (
          <View style={styles.bestSellersSection}>
            <View style={styles.bestSellersHeader}>
              <Text style={styles.bestSellersTitle}>⭐ Best Sellers</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bestSellersContent}
            >
              {bestSellers.slice(0, 6).map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.bestSellerCard}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={[
                    styles.bestSellerImage,
                    { backgroundColor: getCardColor(index) }
                  ]}>
                    <TypeIndicator type={item.type} />
                    <Text style={styles.bestSellerEmoji}>
                      {getCategoryEmoji(item.category)}
                    </Text>
                  </View>
                  <View style={styles.bestSellerInfo}>
                    <Text style={styles.bestSellerName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.bestSellerPrice}>₹{item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* FIXED: Category Header with View Toggle - NOW STATIC */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>
            {selectedCategory === 'all' ? 'All Items' : selectedCategory}
          </Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'list' && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode('list')}
            >
              <Text style={styles.viewToggleIcon}>☰</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'grid' && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Text style={styles.viewToggleIcon}>⊞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FIXED: Category Tabs - NOW STATIC */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabsContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category.id && styles.categoryTabTextActive,
                ]}
              >
                {category.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FIXED: Only Items Scroll */}
        <ScrollView style={styles.itemsScrollView}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>😔</Text>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubtext}>Try a different search or filter</Text>
            </View>
          ) : (
            <View style={[
              viewMode === 'grid' ? styles.itemsContainerGrid : styles.itemsContainerList
            ]}>
              {filteredItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    viewMode === 'grid' ? styles.itemCardGrid : styles.itemCardList
                  ]}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={[
                    viewMode === 'grid' ? styles.itemImageContainerGrid : styles.itemImageContainerList,
                    { backgroundColor: getCardColor(index) },
                  ]}>
                    <View style={styles.itemBadges}>
                      <TypeIndicator type={item.type} />
                      {item.new && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                      )}
                    </View>
                    <Text style={viewMode === 'grid' ? styles.placeholderEmoji : styles.placeholderEmojiList}>
                      {getCategoryEmoji(item.category)}
                    </Text>
                  </View>

                  <View style={viewMode === 'grid' ? styles.itemDetailsGrid : styles.itemDetailsList}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    {item.calories && (
                      <Text style={styles.itemCalories}>{item.calories} kcal</Text>
                    )}
                    <Text style={styles.itemDescription} numberOfLines={viewMode === 'grid' ? 2 : 3}>
                      {item.description}
                    </Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Cart Button */}
        {cartTotal > 0 && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartButtonText}>
              View Cart ({cartTotal} items)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const getCardColor = (index) => {
  const cardColors = [
    colors.orange,
    colors.pink,
    colors.lightBlue,
    colors.lightGreen,
  ];
  return cardColors[index % cardColors.length];
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  locationArrow: {
    fontSize: 10,
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  distanceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  orderTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  orderTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  orderTypeIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  orderTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  orderTypeTextActive: {
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.textTertiary,
    padding: spacing.sm,
  },
  typeFiltersWrapper: {
    marginBottom: spacing.md,
  },
  typeFiltersContent: {
    paddingHorizontal: spacing.lg,
  },
  typeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    height: 32,
  },
  typeFilterChipActive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  typeIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.xs - 2,
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
  typeFilterIcon: {
    fontSize: 14,
    marginRight: spacing.xs - 2,
  },
  typeFilterText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  typeFilterTextActive: {
    fontWeight: '600',
    color: colors.primary,
  },
  bestSellersSection: {
    marginBottom: spacing.lg,
  },
  bestSellersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  bestSellersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  bestSellersContent: {
    paddingHorizontal: spacing.lg,
  },
  bestSellerCard: {
    width: 140,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  bestSellerImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bestSellerEmoji: {
    fontSize: 40,
  },
  bestSellerInfo: {
    padding: spacing.sm,
  },
  bestSellerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    height: 32,
  },
  bestSellerPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  // FIXED: Category header is now static
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 2,
  },
  viewToggleButton: {
    padding: spacing.sm,
  },
  viewToggleButtonActive: {
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.sm,
  },
  viewToggleIcon: {
    fontSize: 18,
  },
  // FIXED: Category tabs are now static
  categoryTabsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    maxHeight: 50,
  },
  categoryTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
  },
  categoryTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  categoryTabTextActive: {
    color: colors.primary,
  },
  // FIXED: Only items scroll now
  itemsScrollView: {
    flex: 1,
  },
  itemsContainerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Space for cart button
  },
  itemCardGrid: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    marginHorizontal: spacing.xs,
    ...shadows.small,
  },
  itemImageContainerGrid: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemDetailsGrid: {
    padding: spacing.md,
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  itemsContainerList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for cart button
  },
  itemCardList: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.small,
    overflow: 'hidden',
  },
  itemImageContainerList: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemDetailsList: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  placeholderEmojiList: {
    fontSize: 40,
  },
  itemBadges: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newBadge: {
    backgroundColor: colors.newBadge,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemCalories: {
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  cartButton: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MenuScreen;
