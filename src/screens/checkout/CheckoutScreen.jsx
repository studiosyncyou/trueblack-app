import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import { clearCart } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

const STORES = [
  {
    id: 1,
    name: 'TRUE BLACK - Kompally',
    address: 'Plot No. 123, Kompally, Hyderabad',
    latitude: 17.5435,
    longitude: 78.4972,
  },
  {
    id: 2,
    name: 'TRUE BLACK - Banjara Hills',
    address: 'Road No. 12, Banjara Hills, Hyderabad',
    latitude: 17.4239,
    longitude: 78.4738,
  },
  {
    id: 3,
    name: 'TRUE BLACK - Jubilee Hills',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    latitude: 17.4326,
    longitude: 78.4071,
  },
];

const PAYMENT_METHODS = [
  { id: 1, name: 'Cash on Pickup', icon: 'cash-outline' },
  { id: 2, name: 'Card', icon: 'card-outline' },
  { id: 3, name: 'UPI', icon: 'phone-portrait-outline' },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(1);
};

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  
  const [orderType, setOrderType] = useState('pickup');
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [tableNumber, setTableNumber] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [userLocation, setUserLocation] = useState(null);
  const [storesWithDistance, setStoresWithDistance] = useState(STORES);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const tax = Math.round(totalPrice * 0.05);
  const total = totalPrice + tax;

  useEffect(() => {
    if (orderType === 'pickup' && !userLocation && !locationError) {
      getUserLocation();
    }
  }, [orderType]);

  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    console.log('Getting user location...');
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location success:', latitude, longitude);
        setUserLocation({ latitude, longitude });
        
        const storesWithDist = STORES.map(store => ({
          ...store,
          distance: calculateDistance(latitude, longitude, store.latitude, store.longitude),
        })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        
        setStoresWithDistance(storesWithDist);
        setSelectedStore(storesWithDist[0]);
        setLocationLoading(false);
      },
      (error) => {
        console.log('Location error:', error.code, error.message);
        setLocationLoading(false);
        
        let errorMessage = '';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location permission denied';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location unavailable';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Location error';
        }
        
        setLocationError(errorMessage);
        setStoresWithDistance(STORES);
        setSelectedStore(STORES[0]);
      },
      { 
        enableHighAccuracy: false, // Use network location (faster)
        timeout: 30000,             // 30 seconds timeout
        maximumAge: 60000,          // Accept cached location up to 1 minute old
        distanceFilter: 100,        // Update if moved 100m
      }
    );
  };

  const handleScanQR = () => {
    navigation.navigate('QRScanner', {
      onScan: (data) => {
        setTableNumber(data);
        Alert.alert('Table Scanned', `Table ${data} selected`);
      },
    });
  };

  const handlePlaceOrder = () => {
    if (orderType === 'dine-in' && !tableNumber) {
      Alert.alert('Error', 'Please scan table QR code');
      return;
    }

    if (orderType === 'pickup' && !selectedStore) {
      Alert.alert('Error', 'Please select a store');
      return;
    }

    const order = {
      id: Date.now(),
      items: items,
      total: total,
      orderType: orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : null,
      store: orderType === 'pickup' ? selectedStore : null,
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    dispatch(clearCart());
    navigation.navigate('OrderConfirmation', { order });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, orderType === 'dine-in' && styles.tabActive]}
            onPress={() => {
              setOrderType('dine-in');
              setTableNumber(null);
            }}
          >
            <Icon
              name="restaurant"
              size={24}
              color={orderType === 'dine-in' ? colors.textLight : colors.textSecondary}
            />
            <Text style={[styles.tabText, orderType === 'dine-in' && styles.tabTextActive]}>
              Dine In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, orderType === 'pickup' && styles.tabActive]}
            onPress={() => {
              setOrderType('pickup');
              setTableNumber(null);
            }}
          >
            <Icon
              name="walk"
              size={24}
              color={orderType === 'pickup' ? colors.textLight : colors.textSecondary}
            />
            <Text style={[styles.tabText, orderType === 'pickup' && styles.tabTextActive]}>
              Pick Up
            </Text>
          </TouchableOpacity>
        </View>

        {orderType === 'dine-in' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scan Table QR Code</Text>
            
            {tableNumber ? (
              <View style={styles.tableSelected}>
                <Icon name="checkmark-circle" size={48} color={colors.success} />
                <Text style={styles.tableSelectedText}>Table {tableNumber}</Text>
                <TouchableOpacity style={styles.rescanButton} onPress={handleScanQR}>
                  <Text style={styles.rescanButtonText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
                <Icon name="qr-code-outline" size={64} color={colors.textPrimary} />
                <Text style={styles.scanButtonText}>Tap to Scan QR Code</Text>
                <Text style={styles.scanButtonSubtext}>
                  Scan the QR code on your table
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.infoBox}>
              <Icon name="information-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Your order will be delivered to your table
              </Text>
            </View>
          </View>
        )}

        {orderType === 'pickup' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Select Store</Text>
              {locationLoading && (
                <View style={styles.locationLoadingBadge}>
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                  <Text style={styles.locationLoadingText}>Finding...</Text>
                </View>
              )}
              {locationError && !locationLoading && (
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={getUserLocation}
                >
                  <Icon name="refresh" size={16} color={colors.textPrimary} />
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>

            {locationError && (
              <View style={styles.errorBox}>
                <Icon name="alert-circle-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>
                  {locationError}. Showing all stores.
                </Text>
              </View>
            )}
            
            {storesWithDistance.map((store, index) => {
              const isNearest = index === 0 && userLocation;
              return (
                <TouchableOpacity
                  key={store.id}
                  style={[
                    styles.storeCard,
                    selectedStore?.id === store.id && styles.storeCardActive,
                    isNearest && styles.storeCardNearest,
                  ]}
                  onPress={() => setSelectedStore(store)}
                >
                  <View style={styles.storeCardLeft}>
                    <Icon
                      name="location"
                      size={24}
                      color={selectedStore?.id === store.id ? colors.textPrimary : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.storeCardContent}>
                    <View style={styles.storeNameRow}>
                      <Text style={styles.storeName}>{store.name}</Text>
                      {isNearest && (
                        <View style={styles.nearestBadge}>
                          <Icon name="star" size={12} color={colors.warning} />
                          <Text style={styles.nearestBadgeText}>NEAREST</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.storeAddress}>{store.address}</Text>
                    {store.distance && (
                      <Text style={styles.storeDistance}>
                        📍 {store.distance} km away
                      </Text>
                    )}
                  </View>
                  {selectedStore?.id === store.id && (
                    <Icon name="checkmark-circle" size={24} color={colors.success} />
                  )}
                </TouchableOpacity>
              );
            })}

            <View style={styles.infoBox}>
              <Icon name="information-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                You'll be notified when your order is ready for pickup
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {items.map((item) => (
            <View key={item.cartId} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Taxes & Fees</Text>
            <Text style={styles.totalValue}>₹{tax}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold}>Total</Text>
            <Text style={styles.totalValueBold}>₹{total}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                paymentMethod?.id === method.id && styles.paymentCardActive,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Icon name={method.icon} size={24} color={paymentMethod?.id === method.id ? colors.textPrimary : colors.textSecondary} />
              <Text style={styles.paymentMethodText}>{method.name}</Text>
              {paymentMethod?.id === method.id && (
                <Icon name="checkmark-circle" size={24} color={colors.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order • ₹{total}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
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
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...typography.h3 },
  container: { flex: 1 },
  tabContainer: { flexDirection: 'row', padding: spacing.lg, gap: spacing.md },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  tabActive: { borderColor: colors.textPrimary, backgroundColor: colors.textPrimary },
  tabText: { ...typography.button, color: colors.textSecondary },
  tabTextActive: { color: colors.textLight },
  section: { padding: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: { ...typography.h4 },
  locationLoadingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  locationLoadingText: { ...typography.caption, color: colors.textPrimary },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryButtonText: { ...typography.caption, color: colors.textPrimary },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { ...typography.caption, color: colors.error, flex: 1 },
  scanButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  scanButtonText: { ...typography.h4, marginTop: spacing.lg },
  scanButtonSubtext: { ...typography.body2, marginTop: spacing.sm },
  tableSelected: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.success,
  },
  tableSelectedText: { ...typography.h3, marginTop: spacing.md, marginBottom: spacing.lg },
  rescanButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: borderRadius.md,
  },
  rescanButtonText: { ...typography.button },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoText: { ...typography.caption, flex: 1 },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  storeCardActive: { borderColor: colors.textPrimary },
  storeCardNearest: { borderColor: colors.warning, borderWidth: 2 },
  storeCardLeft: { marginRight: spacing.md },
  storeCardContent: { flex: 1 },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  storeName: { ...typography.body1, fontFamily: 'Montserrat-SemiBold' },
  nearestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentCream,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  nearestBadgeText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    color: colors.warning,
  },
  storeAddress: { ...typography.body2, marginBottom: spacing.xs },
  storeDistance: { ...typography.caption, color: colors.success, fontFamily: 'Montserrat-SemiBold' },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  orderItemName: { ...typography.body2 },
  orderItemPrice: { ...typography.body2, fontFamily: 'Montserrat-SemiBold' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  totalLabel: { ...typography.body2, color: colors.textSecondary },
  totalValue: { ...typography.body2, color: colors.textSecondary },
  totalLabelBold: { ...typography.h4 },
  totalValueBold: { ...typography.h4 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.md,
  },
  paymentCardActive: { borderColor: colors.textPrimary },
  paymentMethodText: { ...typography.body1, flex: 1 },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.xl,
  },
  placeOrderButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.round,
    alignItems: 'center',
  },
  placeOrderButtonText: { ...typography.button, color: colors.textLight, fontSize: 18 },
});

export default CheckoutScreen;
