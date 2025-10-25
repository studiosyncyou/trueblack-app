import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, shadows } from '../../config/theme';

const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', action: () => {} },
        { icon: 'location-outline', label: 'Saved Addresses', action: () => {} },
        { icon: 'card-outline', label: 'Payment Methods', action: () => {} },
      ],
    },
    {
      section: 'Preferences',
      items: [
        { icon: 'notifications-outline', label: 'Notifications', action: () => {} },
        { icon: 'language-outline', label: 'Language', action: () => {}, value: 'English' },
        { icon: 'moon-outline', label: 'Dark Mode', action: () => {}, toggle: false },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help & Support', action: () => {} },
        { icon: 'document-text-outline', label: 'Terms & Conditions', action: () => {} },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy', action: () => {} },
        { icon: 'information-circle-outline', label: 'About', action: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="person" size={40} color={colors.primary} />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Icon name="camera" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@email.com</Text>
              <Text style={styles.profilePhone}>+91 98765 43210</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Icon name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹2,450</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>250</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          {/* Menu Sections */}
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.menuItem,
                      itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                    ]}
                    onPress={item.action}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuItemIcon}>
                        <Icon name={item.icon} size={22} color={colors.primary} />
                      </View>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.value && (
                        <Text style={styles.menuItemValue}>{item.value}</Text>
                      )}
                      {item.toggle !== undefined ? (
                        <View style={[
                          styles.toggle,
                          item.toggle && styles.toggleActive,
                        ]}>
                          <View style={[
                            styles.toggleThumb,
                            item.toggle && styles.toggleThumbActive,
                          ]} />
                        </View>
                      ) : (
                        <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <Icon name="log-out-outline" size={22} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray300,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    ...shadows.small,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: spacing.sm,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: spacing.xl,
  },
});

export default ProfileScreen;
