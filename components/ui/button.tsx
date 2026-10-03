import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  children,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'ghost':
        return styles.btnGhost;
      case 'destructive':
        return styles.btnDestructive;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'ghost':
        return styles.textGhost;
      case 'destructive':
        return styles.textDestructive;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'icon':
        return styles.sizeIcon;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.12)' }}
      style={({ pressed }) => [
        styles.base,
        getSizeStyle(),
        getVariantStyle(),
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#818CF8' : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          {title ? (
            <Text style={[styles.textBase, getVariantTextStyle(), textStyle]}>{title}</Text>
          ) : (
            children
          )}
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}> = (props) => <Button {...props} variant="primary" size="md" />;

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  sizeSm: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sizeMd: {
    height: 50,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  sizeLg: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  sizeIcon: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    borderRadius: 12,
  },
  btnPrimary: {
    backgroundColor: '#6366F1',
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  btnSecondary: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDestructive: {
    backgroundColor: '#DC2626',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
    }),
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#F1F5F9',
  },
  textOutline: {
    color: '#CBD5E1',
  },
  textGhost: {
    color: '#94A3B8',
  },
  textDestructive: {
    color: '#FFFFFF',
  },
});
