import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Text } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

const QRScannerScreen = ({ route, navigation }) => {
  const { onScan } = route.params || {};
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  
  const device = useCameraDevice('back');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    console.log('Camera permission status:', cameraPermission);
    
    if (cameraPermission === 'granted') {
      setHasPermission(true);
    } else if (cameraPermission === 'not-determined') {
      const newPermission = await Camera.requestCameraPermission();
      console.log('New permission:', newPermission);
      setHasPermission(newPermission === 'granted');
    } else {
      // Permission denied
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in Settings to scan QR codes.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isScanning) {
        setIsScanning(false);
        const qrData = codes[0].value;
        console.log('QR Code scanned:', qrData);
        
        // Extract table number from QR code
        const tableMatch = qrData.match(/\d+/);
        const tableNumber = tableMatch ? tableMatch[0] : qrData;
        
        // Call the callback
        if (onScan) {
          onScan(tableNumber);
        }
        
        // Go back
        navigation.goBack();
      }
    },
  });

  const handleManualEntry = () => {
    Alert.prompt(
      'Enter Table Number',
      'Please enter your table number',
      (tableNumber) => {
        if (tableNumber && onScan) {
          onScan(tableNumber);
          navigation.goBack();
        }
      },
      'plain-text',
      '',
      'default'
    );
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.permissionContent}>
          <Icon name="camera-off-outline" size={80} color={colors.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Please enable camera access in Settings to scan table QR codes.
          </Text>
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={handleManualEntry}
          >
            <Text style={styles.manualEntryButtonText}>Enter Manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      {/* Overlay */}
      <SafeAreaView style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonCamera}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={28} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.instructionText}>
            Point camera at table QR code
          </Text>
        </View>

        {/* Manual Entry Option */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={handleManualEntry}
          >
            <Icon name="keypad-outline" size={24} color={colors.textLight} />
            <Text style={styles.manualButtonText}>Enter Manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  permissionTitle: {
    ...typography.h3,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.body1,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  settingsButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.round,
    marginBottom: spacing.lg,
  },
  settingsButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  manualEntryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  manualEntryButtonText: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCamera: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.textLight,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    ...typography.body1,
    color: colors.textLight,
    marginTop: spacing.xxxl,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.round,
    gap: spacing.sm,
  },
  manualButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
});

export default QRScannerScreen;
