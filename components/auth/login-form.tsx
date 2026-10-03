import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { loginSchema, LoginFormData } from '../../schemas/auth.schema';
import { useAuthStore } from '../../stores/auth.store';
import { FormInput } from '../ui/input';
import { PrimaryButton } from '../ui/button';
import { useRouter } from 'expo-router';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login({ username: data.username });
      if (success) {
        router.replace('/(dashboard)');
      }
    } catch (err) {
      console.error('Login error:', err);
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
            placeholder="e.g. alex_dev"
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
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Password"
            placeholder="Enter your password"
            iconName="lock-closed-outline"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      <View style={styles.buttonWrapper}>
        <PrimaryButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />
      </View>

      <View style={styles.demoNotice}>
        <Ionicons name="information-circle-outline" size={15} color="#64748B" />
        <Text style={styles.demoNoticeText}>
          Any username (min 3 chars) & password (min 6) works
        </Text>
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
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  demoNoticeText: {
    fontSize: 12,
    color: '#64748B',
  },
});
