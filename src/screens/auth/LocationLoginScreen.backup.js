import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Text } from 'react-native';
import { useDispatch } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  setLoadingLocation,
  setUserLocation,
  setLocationError,
  setLocationPermission,
} from '../../store/slices/locationSlice';
import { login } from '../../store/slices/authSlice';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

const LocationLoginScreen = () => {
  const dispatch = useDispatch();
  const [isDetecting, setIsDetecting] = useState(true);
  const [location, setLocation] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [error, setError] = useState(null);
  const pulseAnim = new Animated.Value(1);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
    startPulseAnimation();
  }, []);

  // Auto-login after location is detected (2 seconds delay to show location)
  useEffect(() => {
    if (location && !error) {
      const timer = setTimeout(() => {
        handleLogin();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TrueBlackApp/1.0',
          },
        }
      );

      const data = await response.json();
      console.log('Reverse geocode data:', data);

      if (data && data.address) {
        // Extract area/colony name
        const area = 
          data.address.neighbourhood ||
          data.address.suburb ||
          data.address.quarter ||
          data.address.village ||
          data.address.town ||
          data.address.city_district ||
          data.address.locality ||
          'Unknown Area';

        const city = data.address.city || data.address.state_district || 'Hyderabad';
        
        return {
          area: area,
          city: city,
          fullAddress: `${area}, ${city}`,
          state: data.address.state || 'Telangana',
          country: data.address.country || 'India',
        };
      }

      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const detectLocation = async () => {
    try {
      setIsDetecting(true);
      setError(null);
      dispatch(setLoadingLocation(true));

      console.log('Starting location detection...');

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location detected:', latitude, longitude);

          // Get area name from coordinates
          const addressInfo = await reverseGeocode(latitude, longitude);

          if (addressInfo) {
            const locationData = {
              latitude,
              longitude,
              formattedAddress: addressInfo.fullAddress,
              area: addressInfo.area,
              city: addressInfo.city,
              state: addressInfo.state,
              country: addressInfo.country,
            };

            setLocation(locationData);
            setAreaName(addressInfo.fullAddress);
            dispatch(setUserLocation(locationData));
            dispatch(setLoadingLocation(false));
          } else {
            // Fallback to basic area detection
            const fallbackArea = getAreaFromCoordinates(latitude, longitude);
            
            const locationData = {
              latitude,
              longitude,
              formattedAddress: fallbackArea,
              area: fallbackArea,
              city: 'Hyderabad',
              state: 'Telangana',
              country: 'India',
            };

            setLocation(locationData);
            setAreaName(fallbackArea);
            dispatch(setUserLocation(locationData));
            dispatch(setLoadingLocation(false));
          }

          setIsDetecting(false);
        },
        (error) => {
          console.error('Location detection error:', error);
          setError(error.message || 'Unable to detect location');
          dispatch(setLocationError(error.message));
          dispatch(setLoadingLocation(false));
          setIsDetecting(false);

          // Show alert with options
          Alert.alert(
            'Location Detection Failed',
            'Unable to detect your location. Would you like to try again or use default location?',
            [
              {
                text: 'Try Again',
                onPress: () => detectLocation(),
              },
              {
                text: 'Use Default',
                onPress: () => handleManualEntry(),
              },
            ]
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 60000,
        }
      );
    } catch (err) {
      console.error('Location detection exception:', err);
      setError(err.message || 'Unable to detect location');
      setIsDetecting(false);
    }
  };

  const getAreaFromCoordinates = (lat, lon) => {
    // Fallback area detection for Hyderabad
    if (lat >= 17.54 && lat <= 17.56 && lon >= 78.48 && lon <= 78.50) {
      return 'Kompally, Hyderabad';
    } else if (lat >= 17.41 && lat <= 17.43 && lon >= 78.46 && lon <= 78.48) {
      return 'Banjara Hills, Hyderabad';
    } else if (lat >= 17.42 && lat <= 17.44 && lon >= 78.39 && lon <= 78.41) {
      return 'Jubilee Hills, Hyderabad';
    } else if (lat >= 17.36 && lat <= 17.50 && lon >= 78.40 && lon <= 78.55) {
      return 'Hyderabad, Telangana';
    } else {
      return 'Your Location';
    }
  };

  const handleManualEntry = () => {
    // Default location (Hyderabad/Kompally)
    const defaultLocation = {
      latitude: 17.4435,
      longitude: 78.3772,
      formattedAddress: 'Kompally, Hyderabad',
      area: 'Kompally',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    };

    setLocation(defaultLocation);
    setAreaName('Kompally, Hyderabad');
    dispatch(setUserLocation(defaultLocation));
    dispatch(setLoadingLocation(false));
    setError(null);
  };

  const handleLogin = () => {
    // Set user as authenticated
    dispatch(login({
      user: {
        name: 'Guest',
        email: 'guest@trueblack.com',
        phone: '',
      },
      token: 'guest-token',
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoMain}>TRUE BLACK</Text>
          <Text style={styles.logoSub}>SPECIALITY COFFEE</Text>
        </View>

        {/* Location Detection Section */}
        <View style={styles.content}>
          {isDetecting ? (
            <>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={styles.iconContainer}>
                  <Icon name="location" size={64} color={colors.textPrimary} />
                </View>
              </Animated.View>
              <ActivityIndicator 
                size="large" 
                color={colors.textPrimary} 
                style={styles.spinner}
              />
              <Text style={styles.title}>Detecting your location...</Text>
              <Text style={styles.subtitle}>
                Finding the nearest TRUE BLACK store
              </Text>
            </>
          ) : error ? (
            <>
              <View style={styles.iconContainer}>
                <Icon name="location-outline" size={64} color={colors.error} />
              </View>
              <Text style={styles.title}>Location Detection Failed</Text>
              <Text style={styles.subtitle}>{error}</Text>

              <TouchableOpacity style={styles.button} onPress={detectLocation}>
                <Icon
                  name="refresh"
                  size={20}
                  color={colors.textLight}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleManualEntry}
              >
                <Text style={styles.secondaryButtonText}>Use Default Location</Text>
              </TouchableOpacity>
            </>
          ) : location ? (
            <>
              <View style={styles.iconContainer}>
                <Icon name="checkmark-circle" size={64} color={colors.success} />
              </View>
              <Text style={styles.title}>You're in</Text>
              <Text style={styles.locationText}>{areaName}</Text>
              <View style={styles.locationBadge}>
                <Icon name="pin" size={16} color={colors.textLight} />
                <Text style={styles.locationBadgeText}>{location.city}</Text>
              </View>
              <ActivityIndicator
                size="small"
                color={colors.textSecondary}
                style={styles.loader}
              />
              <Text style={styles.redirectText}>Taking you to TRUE BLACK...</Text>
            </>
          ) : null}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xxxl * 2,
  },
  logoMain: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
    fontFamily: 'System',
  },
  logoSub: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textPrimary,
    letterSpacing: 3,
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  spinner: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: 'Montserrat-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: spacing.lg,
  },
  locationText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: 'Montserrat-SemiBold',
    paddingHorizontal: spacing.xl,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.lg,
  },
  locationBadgeText: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: 'Montserrat-SemiBold',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    minWidth: '80%',
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.5,
    fontFamily: 'Montserrat-SemiBold',
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '80%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    fontFamily: 'Montserrat-SemiBold',
  },
  loader: {
    marginTop: spacing.md,
  },
  redirectText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontFamily: 'Montserrat-Regular',
  },
  bottomSection: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
});

export default LocationLoginScreen;
