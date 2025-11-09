import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { setSelectedStore } from '../../store/slices/locationSlice';
import { colors, spacing, typography } from '../../config/theme';
import { STORES } from '../../data/storeMenus';

const StoreSelectorScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selectedStore = useSelector((state) => state.location?.selectedStore);
  const onStoreSelect = route?.params?.onStoreSelect;

  const handleStoreSelect = (store) => {
    if (onStoreSelect) {
      // If callback provided (from MenuScreen), use it
      onStoreSelect(store);
    } else {
      // Otherwise, just dispatch and go back
      dispatch(setSelectedStore(store));
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT STORE</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Store List */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>TRUE BLACK LOCATIONS</Text>
        
        {STORES.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={[
              styles.storeCard,
              selectedStore?.id === store.id && styles.storeCardActive,
            ]}
            onPress={() => handleStoreSelect(store)}
            activeOpacity={0.7}
          >
            {/* Store Image */}
            <View style={styles.storeImageContainer}>
              <Image
                source={store.image}
                style={styles.storeImage}
                resizeMode="cover"
              />
              {selectedStore?.id === store.id && (
                <View style={styles.selectedBadge}>
                  <Icon name="checkmark-circle" size={32} color={colors.success} />
                </View>
              )}
            </View>

            {/* Store Info */}
            <View style={styles.storeInfo}>
              <View style={styles.storeHeader}>
                <Text style={styles.storeName}>{store.name}</Text>
                {selectedStore?.id === store.id && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>CURRENT</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.spaceNameLabel}>SPACE</Text>
              <Text style={styles.spaceName}>{store.spaceName}</Text>
              
              <View style={styles.storeDetails}>
                <View style={styles.detailRow}>
                  <Icon name="location" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{store.area}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="time" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{store.hours}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="call" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{store.phone}</Text>
                </View>
              </View>

              <View style={styles.addressContainer}>
                <Icon name="navigate" size={14} color={colors.textSecondary} />
                <Text style={styles.address}>{store.address}</Text>
              </View>
            </View>

            {/* Selection Indicator */}
            {selectedStore?.id === store.id ? (
              <View style={styles.selectedIndicator}>
                <Icon name="checkmark-circle" size={24} color={colors.success} />
              </View>
            ) : (
              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>SELECT</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 18,
    letterSpacing: 1,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  storeCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeCardActive: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  storeImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 4,
  },
  storeInfo: {
    padding: spacing.lg,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  storeName: {
    ...typography.h2,
    fontSize: 20,
  },
  currentBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  currentBadgeText: {
    ...typography.caption,
    color: colors.textLight,
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  spaceNameLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  spaceName: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginBottom: spacing.md,
    color: colors.primary,
  },
  storeDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  address: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  selectButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  selectButtonText: {
    ...typography.button,
    color: colors.textLight,
    fontSize: 12,
    letterSpacing: 1,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default StoreSelectorScreen;
