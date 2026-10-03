import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ label, error, iconName, isPassword = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            Boolean(error) && styles.inputWrapperError,
          ]}
        >
          {iconName && (
            <Ionicons
              name={iconName}
              size={20}
              color={error ? '#EF4444' : isFocused ? '#818CF8' : '#64748B'}
              style={styles.leadingIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={styles.textInput}
            placeholderTextColor="#475569"
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            {...props}
          />

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={12}
              style={styles.trailingIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#94A3B8"
              />
            </Pressable>
          )}
        </View>

        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1.2,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#131D36',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#1E1420',
  },
  leadingIcon: {
    marginRight: 10,
  },
  trailingIcon: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
    paddingHorizontal: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
  },
});
