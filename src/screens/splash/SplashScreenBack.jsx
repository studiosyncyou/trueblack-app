import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, animations } from '../../config/theme';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animations.fadeIn,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoMain: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  logoSub: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
    letterSpacing: 4,
  },
});

export default SplashScreen;
