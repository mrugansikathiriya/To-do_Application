import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth.store';
import { useTaskStore } from '../../stores/task.store';
import { Avatar } from '../ui/avatar';

export interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const tasks = useTaskStore((state) => state.tasks);
  const insets = useSafeAreaInsets();

  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
  const username = user?.username || 'Guest';

  const confirmLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 12,
          },
        ]}
      >     
       {/* User Info Left */}
      <View style={styles.userSection}>
        <Avatar
          uri={user?.avatarUrl}
          name={username}
          size="md"
          showStatus
          statusColor="#10B981"
        />
        <View style={styles.textDetails}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username} numberOfLines={1}>
            {username} 👋
          </Text>
          <Text style={styles.pendingText}>
            {pendingCount === 0
              ? 'All tasks completed 🎉'
              : `${pendingCount} active task${pendingCount === 1 ? '' : 's'} pending`}
          </Text>
        </View>
      </View>

      {/* Right Controls: Quick Add + Logout */}
      <View style={styles.actionsSection}>
        {onOpenCreateModal && (
          <Pressable
            onPress={onOpenCreateModal}
            style={styles.addBtn}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>New</Text>
          </Pressable>
        )}

        <Pressable
          onPress={confirmLogout}
          style={styles.logoutBtn}
          android_ripple={{ color: 'rgba(239, 68, 68, 0.2)' }}
        >
          <Ionicons name="log-out-outline" size={19} color="#F87171" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 18,
  paddingBottom: 14,
  backgroundColor: '#0F172A',
  borderBottomWidth: 1,
  borderBottomColor: '#1E293B',
},
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textDetails: {
    flex: 1,
  },
  greeting: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  pendingText: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '600',
    marginTop: 1,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E1420',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
