import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Image,
  ImageBackground,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows, typography } from '../../config/theme';
import { STORES } from '../../data/storeMenus';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth?.user);
  const selectedStore = useSelector((state) => state.location?.selectedStore);
  const userLocation = useSelector((state) => state.location?.currentLocation);
  const [imageError, setImageError] = useState({});
  const [showTabs, setShowTabs] = useState(false);
  const [nearestStore, setNearestStore] = useState(null);
  const [storeDistance, setStoreDistance] = useState(null);
  const buttonFloat = useRef(new Animated.Value(0)).current;

  // Floating button animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonFloat, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonFloat, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Find nearest store and calculate distance
  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      const storesWithDistance = STORES.map((store) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        );
        return { ...store, distance };
      });

      // Sort by distance
      storesWithDistance.sort((a, b) => a.distance - b.distance);
      const nearest = storesWithDistance[0];

      setNearestStore(nearest);
      setStoreDistance(nearest.distance);
    } else if (selectedStore) {
      // No user location, just use selected store
      setNearestStore(selectedStore);
      setStoreDistance(null);
    }
  }, [userLocation, selectedStore]);

  // Convert distance to time (average city speed: 30 km/h)
  const convertDistanceToTime = (distanceKm) => {
    const avgSpeedKmh = 30; // Average city speed
    const timeHours = distanceKm / avgSpeedKmh;
    const timeMins = Math.round(timeHours * 60);
    
    if (timeMins < 60) {
      return `${timeMins} mins away`;
    } else {
      const hours = Math.floor(timeMins / 60);
      const mins = timeMins % 60;
      if (mins === 0) {
        return `${hours} hr away`;
      }
      return `${hours} hr ${mins} mins away`;
    }
  };

  // Get store display text with time
  const getStoreDisplayText = () => {
    if (!nearestStore) return 'TRUE BLACK';

    if (storeDistance !== null) {
      // Show: "Modern Beige - Jubilee Hills 5 mins away"
      const timeAway = convertDistanceToTime(storeDistance);
      return `${nearestStore.spaceName} - ${nearestStore.area} ${timeAway}`;
    } else {
      // No distance available
      return `${nearestStore.spaceName} - ${nearestStore.area}`;
    }
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    // Show tabs when scrolled past hero (about 80% of screen height)
    if (scrollY > height * 0.2) {
      if (!showTabs) {
        setShowTabs(true);
        if (global.setTabsVisible) {
          global.setTabsVisible(true);
        }
      }
    } else {
      if (showTabs) {
        setShowTabs(false);
        if (global.setTabsVisible) {
          global.setTabsVisible(false);
        }
      }
    }
  };

  const orderAgainItems = [
    { id: 1, name: 'Latte Hot', price: 250 },
    { id: 2, name: 'Red Pepper Hummus Toast', price: 250 },
    { id: 3, name: 'Cappuccino', price: 250 },
    { id: 4, name: 'OG Coffee', price: 250 },
  ];

  const marketplaceItems = [
    { id: 1, name: 'Roasted Coffee 250g', price: 550 },
    { id: 2, name: 'Drip Coffee Kit', price: 850 },
  ];

  // Image getters with error handling
  const getLogo = () => {
    try {
      return require('../../assets/images/logo.png');
    } catch (e) {
      return null;
    }
  };

  const getHeroImage = () => {
    try {
      return require('../../assets/images/hero1.jpg');
    } catch (e) {
      return null;
    }
  };

  const getTiramisuImage = () => {
    try {
      return require('../../assets/images/tiramisu.jpg');
    } catch (e) {
      return null;
    }
  };

  const getItemImage = () => {
    try {
      return require('../../assets/images/item-default.jpg');
    } catch (e) {
      return null;
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section with Background Image */}
        <View style={styles.heroSection}>
          {getHeroImage() && !imageError.hero ? (
            <ImageBackground
              source={getHeroImage()}
              style={styles.heroBackground}
              resizeMode="cover"
              onError={() => setImageError({ ...imageError, hero: true })}
            >
              {/* Overlay for better text visibility */}
              <View style={styles.heroOverlay} />
              
              {/* Logo on top of hero */}
              <View style={styles.logoContainer}>
                {getLogo() && !imageError.logo ? (
                  <Image
                    source={getLogo()}
                    style={styles.logoImage}
                    resizeMode="contain"
                    onError={() => setImageError({ ...imageError, logo: true })}
                  />
                ) : (
                  <View style={styles.logoTextContainer}>
                    <Text style={styles.logoMain}>TRUE BLACK</Text>
                    <Text style={styles.logoSub}>SPECIALITY COFFEE</Text>
                  </View>
                )}
              </View>

              {/* Store Name with Distance - REPOSITIONED */}
              <TouchableOpacity
                style={styles.storeNameContainer}
                onPress={() => navigation.navigate('StoreSelector')}
                activeOpacity={0.7}
              >
                <Icon name="location" size={16} color={colors.textLight} />
                <Text style={styles.storeName}>{getStoreDisplayText()}</Text>
                <Icon name="chevron-down" size={16} color={colors.textLight} />
              </TouchableOpacity>

              {/* Start Order Button */}
              <Animated.View
                style={[
                  styles.startButtonContainer,
                  { transform: [{ translateY: buttonFloat }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => {
                    // Show tabs before navigating
                    if (global.setTabsVisible) {
                      global.setTabsVisible(true);
                    }
                    navigation.navigate('Menu');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startButtonText}>START YOUR ORDER</Text>
                </TouchableOpacity>
              </Animated.View>
            </ImageBackground>
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderText}>☕</Text>
              <View style={styles.logoContainer}>
                <Text style={styles.logoMain}>TRUE BLACK</Text>
                <Text style={styles.logoSub}>SPECIALITY COFFEE</Text>
              </View>
            </View>
          )}
        </View>

        {/* Tiramisu Promotional Banner */}
        <TouchableOpacity style={styles.promoSectionFull} activeOpacity={0.9}>
          {getTiramisuImage() && !imageError.tiramisu ? (
            <Image
              source={getTiramisuImage()}
              style={styles.promoImage}
              resizeMode="cover"
              onError={() => setImageError({ ...imageError, tiramisu: true })}
            />
          ) : (
            <View style={{ backgroundColor: colors.accentBeige, flex: 1 }} />
          )}
          <View style={styles.promoOverlay} />
          <View style={styles.promoContent}>
            <Text style={[styles.promoTitle, { color: colors.textLight }]}>
              TIRAMISU
            </Text>
            <Text style={[styles.promoSubtitle, { color: colors.textLight }]}>
              LIMITED BATCH—WEEKENDS ONLY
            </Text>
          </View>
        </TouchableOpacity>

        {/* Order Again Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORDER AGAIN</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {orderAgainItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemButton}
                onPress={() => navigation.navigate('ItemDetail', { item })}
                activeOpacity={0.9}
              >
                <View style={styles.itemImageContainer}>
                  {getItemImage() && !imageError.itemDefault ? (
                    <Image
                      source={getItemImage()}
                      style={styles.itemImage}
                      resizeMode="cover"
                      onError={() =>
                        setImageError({ ...imageError, itemDefault: true })
                      }
                    />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Text style={styles.itemImageText}>
                        {item.name.includes('Latte') ? '☕' : '🍞'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Marketplace Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARKETPLACE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {marketplaceItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemButton}
                onPress={() => navigation.navigate('ItemDetail', { item })}
                activeOpacity={0.9}
              >
                <View style={styles.itemImageContainer}>
                  {getItemImage() && !imageError.itemDefault ? (
                    <Image
                      source={getItemImage()}
                      style={styles.itemImage}
                      resizeMode="cover"
                      onError={() =>
                        setImageError({ ...imageError, itemDefault: true })
                      }
                    />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Text style={styles.itemImageText}>
                        {item.name.includes('Coffee') ? '🫘' : '☕'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
  heroSection: {
    width: width,
    height: height,
    position: 'relative',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.accentCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderText: {
    fontSize: 120,
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl * 2,
    zIndex: 10,
  },
  logoImage: {
    width: 220,
    height: 70,
    tintColor: colors.textLight,
  },
  logoTextContainer: {
    alignItems: 'center',
  },
  logoMain: {
    fontSize: 36,
    fontFamily: 'System',
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 3,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoSub: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '400',
    color: colors.textLight,
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  storeNameContainer: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  storeName: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.textLight,
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  startButtonContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl * 3,
    zIndex: 10,
  },
  startButton: {
    paddingHorizontal: spacing.xxxl * 1.5,
    paddingVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.textLight,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  startButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 16,
  },
  promoSectionFull: {
    width: width,
    height: 400,
    marginTop: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  promoContent: {
    position: 'absolute',
    left: spacing.xl,
    top: spacing.xl,
    zIndex: 10,
  },
  promoTitle: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  promoSubtitle: {
    ...typography.caption,
    letterSpacing: 1,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  section: {
    marginTop: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h4,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    letterSpacing: 1,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  itemButton: {
    width: width * 0.45,
    overflow: 'hidden',
  },
  itemImageContainer: {
    width: '90%',
    height: width * 0.52,
    backgroundColor: colors.accentCream,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageText: {
    fontSize: 60,
  },
  itemInfo: {
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  itemName: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
    minHeight: 44,
  },
  itemPrice: {
    ...typography.price,
  },
  bottomSpacing: {
    height: spacing.xxxxl * 2,
  },
});

export default HomeScreen;
