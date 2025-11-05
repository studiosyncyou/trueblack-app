import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../store/slices/authSlice';
import { colors, spacing, borderRadius } from '../../config/theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <Text style={styles.title}>PROFILE</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="person" size={48} color={colors.textPrimary} />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color={colors.textLight} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userPhone: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  logoutText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default ProfileScreen;
