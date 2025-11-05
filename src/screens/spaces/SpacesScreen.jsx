import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const { width } = Dimensions.get('window');

const SPACES = [
  {
    id: 1,
    name: 'SPACE 1 - SOFT SAND',
    location: 'Kompally',
    distance: '4KM',
    description: 'Minimalist space with soft beige tones and natural lighting',
  },
  {
    id: 2,
    name: 'SPACE 2 - MODERN BEIGE',
    location: 'Road no.45, Jubilee Hills',
    distance: '4KM',
    description: 'Modern workspace with warm wooden accents',
  },
];

const SpacesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SPACES</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {SPACES.map((space) => (
          <TouchableOpacity
            key={space.id}
            style={styles.spaceCard}
            onPress={() => navigation.navigate('SpaceDetail', { space })}
            activeOpacity={0.9}
          >
            {/* Space Image Placeholder */}
            <View style={styles.spaceImage}>
              <View style={styles.spaceImagePlaceholder}>
                <Icon name="cafe-outline" size={60} color={colors.textSecondary} />
              </View>
            </View>

            {/* Space Info */}
            <View style={styles.spaceInfo}>
              <View style={styles.spaceHeader}>
                <View style={styles.spaceHeaderLeft}>
                  <Text style={styles.spaceName}>{space.name}</Text>
                  <Text style={styles.spaceLocation}>{space.location}</Text>
                </View>
                <View style={styles.distanceBadge}>
                  <Icon name="location-outline" size={16} color={colors.textPrimary} />
                  <Text style={styles.distanceText}>{space.distance}</Text>
                </View>
              </View>
            </View>
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  spaceCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  spaceImage: {
    width: '100%',
    height: width * 0.6,
    backgroundColor: '#E8E0D5',
  },
  spaceImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceInfo: {
    padding: spacing.lg,
  },
  spaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  spaceHeaderLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  spaceName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  spaceLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default SpacesScreen;
