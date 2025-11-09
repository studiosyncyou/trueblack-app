import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography } from '../../config/theme';

const QuantityCounter = ({ quantity, onIncrement, onDecrement, small = false }) => {
  return (
    <View style={[styles.container, small && styles.containerSmall]}>
      <TouchableOpacity
        style={[styles.button, small && styles.buttonSmall]}
        onPress={onDecrement}
        activeOpacity={0.7}
      >
        <Icon 
          name="remove" 
          size={small ? 16 : 20} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>
      
      <View style={[styles.countContainer, small && styles.countContainerSmall]}>
        <Text style={[styles.countText, small && styles.countTextSmall]}>
          {quantity}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, small && styles.buttonSmall]}
        onPress={onIncrement}
        activeOpacity={0.7}
      >
        <Icon 
          name="add" 
          size={small ? 16 : 20} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: 0, // No rounded corners
    backgroundColor: colors.surface,
  },
  containerSmall: {
    height: 32,
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  buttonSmall: {
    width: 28,
    height: 28,
  },
  countContainer: {
    minWidth: 40,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainerSmall: {
    minWidth: 32,
  },
  countText: {
    ...typography.body1,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.textPrimary,
  },
  countTextSmall: {
    fontSize: 14,
  },
});

export default QuantityCounter;
