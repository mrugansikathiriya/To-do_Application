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
import { RegisterForm } from '../../components/auth/register-form';

export default function RegisterScreen() {
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
            <Ionicons name="person-add" size={28} color="#818CF8" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join To-Do App and boost your daily team productivity
          </Text>
        </View>

        <RegisterForm />

        {/* Bottom Link to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            hitSlop={10}
            android_ripple={{ color: 'rgba(129, 140, 248, 0.2)' }}
          >
            <Text style={styles.footerLink}>Login here</Text>
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
    top: 40,
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#131B2E',
    borderWidth: 1.5,
    borderColor: '#312E81',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
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
    maxWidth: 290,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 12,
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
