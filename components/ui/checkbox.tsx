import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onCheckedChange }: CheckboxProps) {
  return (
    <Pressable
      style={[styles.container, checked && styles.checked]}
      onPress={() => onCheckedChange(!checked)}
    >
      {checked && <Ionicons name="checkmark" size={16} color={colors.background} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
