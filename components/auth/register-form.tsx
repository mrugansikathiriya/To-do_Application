import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../schemas/auth.schema';
import { useAuthStore } from '../../stores/auth.store';
import { FormInput } from '../ui/input';
import { PrimaryButton } from '../ui/button';
import { useRouter } from 'expo-router';

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await registerUser({
        username: data.username,
        email: data.email,
      });
      if (success) {
        router.replace('/(dashboard)');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <View style={styles.card}>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Username"
            placeholder="Choose a username (e.g. jordan_doe)"
            iconName="person-outline"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.username?.message}
            autoComplete="username"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Email ID"
            placeholder="you@example.com"
            iconName="mail-outline"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            autoComplete="email"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Password"
            placeholder="Min 8 chars, 1 uppercase, 1 digit"
            iconName="lock-closed-outline"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            autoComplete="new-password"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Confirm Password"
            placeholder="Re-enter password to confirm"
            iconName="shield-checkmark-outline"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      <View style={styles.buttonWrapper}>
        <PrimaryButton
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  buttonWrapper: {
    marginTop: 8,
  },
});
