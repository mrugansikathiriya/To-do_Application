import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoginForm } from '../../components/auth/login-form';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.rootContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Glow ambient accent circle behind logo */}
        <View style={styles.ambientGlow} />

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="checkbox" size={32} color="#818CF8" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to manage your tasks and board seamlessly
          </Text>
        </View>

        <LoginForm />

        {/* Bottom Link to Register */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable
            onPress={() => router.push('/(auth)/register')}
            hitSlop={10}
            android_ripple={{ color: 'rgba(129, 140, 248, 0.2)' }}
          >
            <Text style={styles.footerLink}>Register here</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  ambientGlow: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#131B2E',
    borderWidth: 1.5,
    borderColor: '#312E81',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  footerLink: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
