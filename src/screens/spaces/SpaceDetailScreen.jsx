import React from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const { width } = Dimensions.get('window');

const MENU_HIGHLIGHTS = [
  { id: 1, name: 'Espresso', emoji: '☕' },
  { id: 2, name: 'Latte', emoji: '☕' },
  { id: 3, name: 'Cappuccino', emoji: '☕' },
  { id: 4, name: 'Croissant', emoji: '🥐' },
  { id: 5, name: 'Avocado Toast', emoji: '🥑' },
  { id: 6, name: 'Tiramisu', emoji: '🍰' },
];

const SpaceDetailScreen = ({ route, navigation }) => {
  const { space } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{space.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Space Images */}
        <View style={styles.imageSection}>
          <View style={styles.mainImage}>
            <Icon name="cafe" size={80} color={colors.textSecondary} />
          </View>
        </View>

        {/* Space Info */}
        <View style={styles.infoSection}>
          <View style={styles.locationRow}>
            <Icon name="location" size={20} color={colors.textPrimary} />
            <Text style={styles.locationText}>{space.location}</Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{space.distance}</Text>
            </View>
          </View>

          <Text style={styles.description}>{space.description}</Text>

          {/* Hours */}
          <View style={styles.hoursSection}>
            <Text style={styles.sectionTitle}>Hours</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursLabel}>Mon - Fri</Text>
              <Text style={styles.hoursValue}>7:00 AM - 10:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursLabel}>Sat - Sun</Text>
              <Text style={styles.hoursValue}>8:00 AM - 11:00 PM</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              <View style={styles.amenityItem}>
                <Icon name="wifi" size={20} color={colors.textPrimary} />
                <Text style={styles.amenityText}>Free WiFi</Text>
              </View>
              <View style={styles.amenityItem}>
                <Icon name="car" size={20} color={colors.textPrimary} />
                <Text style={styles.amenityText}>Parking</Text>
              </View>
              <View style={styles.amenityItem}>
                <Icon name="power" size={20} color={colors.textPrimary} />
                <Text style={styles.amenityText}>Power Outlets</Text>
              </View>
              <View style={styles.amenityItem}>
                <Icon name="people" size={20} color={colors.textPrimary} />
                <Text style={styles.amenityText}>Outdoor Seating</Text>
              </View>
            </View>
          </View>

          {/* Menu Highlights */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Menu Highlights</Text>
            <Text style={styles.menuNote}>
              View only - To order, please visit this location
            </Text>
            <View style={styles.menuGrid}>
              {MENU_HIGHLIGHTS.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemImage}>
                    <Text style={styles.menuItemEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Directions Button */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => {
              // In real app, open maps
              alert('Opening directions...');
            }}
          >
            <Icon name="navigate" size={24} color={colors.textLight} />
            <Text style={styles.directionsText}>GET DIRECTIONS</Text>
          </TouchableOpacity>
        </View>

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
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#E8E0D5',
    height: width * 0.6,
  },
  mainImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  locationText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  hoursSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  hoursLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  hoursValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amenitiesSection: {
    marginBottom: spacing.xl,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '45%',
  },
  amenityText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  menuNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  menuItem: {
    width: (width - spacing.xl * 2 - spacing.md * 2) / 3,
    alignItems: 'center',
  },
  menuItemImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  menuItemEmoji: {
    fontSize: 32,
  },
  menuItemName: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: spacing.xl,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  directionsText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default SpaceDetailScreen;
