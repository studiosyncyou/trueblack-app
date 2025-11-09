import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {
  setUserLocation,
  setSelectedStore,
  setLoadingLocation,
  setLocationError,
  selectAvailableStores,
  selectSelectedStore,
  selectUserLocation,
} from '../../store/slices/locationSlice';
import { colors, spacing, typography, shadows } from '../../config/theme';

const StoreSelectionModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const stores = useSelector(selectAvailableStores);
  const selectedStore = useSelector(selectSelectedStore);
  const userLocation = useSelector(selectUserLocation);

  // Get user's location on mount
  useEffect(() => {
    if (visible && !userLocation) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = () => {
    dispatch(setLoadingLocation(true));
    
    Geolocation.getCurrentPosition(
      (position) => {
        dispatch(setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }));
        dispatch(setLoadingLocation(false));
      },
      (error) => {
        console.log('Location error:', error);
        dispatch(setLocationError(error.message));
        dispatch(setLoadingLocation(false));
        
        Alert.alert(
          'Location Access',
          'Unable to get your location. Please enable location services.',
          [{ text: 'OK' }]
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getStoreDistance = (store) => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      store.latitude,
      store.longitude
    );
  };

  const handleSelectStore = (storeId) => {
    dispatch(setSelectedStore(storeId));
    onClose();
  };

  // Sort stores by distance if location available
  const sortedStores = userLocation
    ? [...stores].sort((a, b) => {
        const distA = getStoreDistance(a);
        const distB = getStoreDistance(b);
        return distA - distB;
      })
    : stores;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Store</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Location Status */}
          {userLocation && (
            <View style={styles.locationStatus}>
              <Icon name="location" size={16} color={colors.success} />
              <Text style={styles.locationStatusText}>
                Showing nearest stores
              </Text>
            </View>
          )}

          {/* Store List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {sortedStores.map((store) => {
              const distance = getStoreDistance(store);
              const isSelected = selectedStore?.id === store.id;
              const isNearby = distance && distance <= store.radius;

              return (
                <TouchableOpacity
                  key={store.id}
                  style={[
                    styles.storeCard,
                    isSelected && styles.storeCardSelected,
                  ]}
                  onPress={() => handleSelectStore(store.id)}
                  activeOpacity={0.7}
                >
                  {/* Store Icon & Name */}
                  <View style={styles.storeHeader}>
                    <View style={styles.storeIconContainer}>
                      <Icon
                        name="storefront"
                        size={24}
                        color={isSelected ? colors.textLight : colors.textPrimary}
                      />
                    </View>
                    <View style={styles.storeInfo}>
                      <View style={styles.storeTitleRow}>
                        <Text style={[
                          styles.storeName,
                          isSelected && styles.storeNameSelected,
                        ]}>
                          {store.name}
                        </Text>
                        {isNearby && (
                          <View style={styles.nearbyBadge}>
                            <Text style={styles.nearbyBadgeText}>Nearby</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.storeAddress,
                        isSelected && styles.storeAddressSelected,
                      ]}>
                        {store.address}
                      </Text>
                    </View>
                  </View>

                  {/* Distance & Details */}
                  <View style={styles.storeDetails}>
                    {distance !== null && (
                      <View style={styles.detailRow}>
                        <Icon
                          name="navigate"
                          size={14}
                          color={isSelected ? colors.textLight : colors.textSecondary}
                        />
                        <Text style={[
                          styles.detailText,
                          isSelected && styles.detailTextSelected,
                        ]}>
                          {distance < 1
                            ? `${(distance * 1000).toFixed(0)}m away`
                            : `${distance.toFixed(1)}km away`}
                        </Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Icon
                        name="time"
                        size={14}
                        color={isSelected ? colors.textLight : colors.textSecondary}
                      />
                      <Text style={[
                        styles.detailText,
                        isSelected && styles.detailTextSelected,
                      ]}>
                        {store.hours}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon
                        name="call"
                        size={14}
                        color={isSelected ? colors.textLight : colors.textSecondary}
                      />
                      <Text style={[
                        styles.detailText,
                        isSelected && styles.detailTextSelected,
                      ]}>
                        {store.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Icon name="checkmark-circle" size={24} color={colors.success} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Refresh Location Button */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={getCurrentLocation}
            activeOpacity={0.8}
          >
            <Icon name="refresh" size={20} color={colors.textPrimary} />
            <Text style={styles.refreshButtonText}>Refresh Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h3,
  },
  closeButton: {
    padding: spacing.xs,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.accentCream,
    gap: spacing.sm,
  },
  locationStatusText: {
    ...typography.caption,
    color: colors.success,
  },
  scrollView: {
    padding: spacing.lg,
  },
  storeCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  storeCardSelected: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  storeHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  storeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentCream,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  storeInfo: {
    flex: 1,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  storeName: {
    ...typography.h4,
  },
  storeNameSelected: {
    color: colors.textLight,
  },
  nearbyBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nearbyBadgeText: {
    ...typography.caption,
    color: colors.textLight,
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
  },
  storeAddress: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  storeAddressSelected: {
    color: colors.textLight,
    opacity: 0.8,
  },
  storeDetails: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.caption,
  },
  detailTextSelected: {
    color: colors.textLight,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  refreshButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});

export default StoreSelectionModal;
