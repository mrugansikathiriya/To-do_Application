import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  statusColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = 'User',
  size = 'md',
  showStatus = true,
  statusColor = '#10B981', // Emerald active
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str: string) => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const getSizeDims = () => {
    switch (size) {
      case 'sm':
        return { container: 34, font: 12, dot: 9 };
      case 'lg':
        return { container: 52, font: 18, dot: 13 };
      case 'xl':
        return { container: 68, font: 24, dot: 16 };
      case 'md':
      default:
        return { container: 42, font: 14, dot: 11 };
    }
  };

  const dims = getSizeDims();

  return (
    <View style={[{ position: 'relative' }, style]}>
      <View
        style={[
          styles.container,
          {
            width: dims.container,
            height: dims.container,
            borderRadius: dims.container / 2,
          },
        ]}
      >
        {uri && !imageError ? (
          <Image
            source={{ uri }}
            style={{
              width: dims.container,
              height: dims.container,
              borderRadius: dims.container / 2,
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Text style={[styles.initials, { fontSize: dims.font }]}>{getInitials(name)}</Text>
        )}
      </View>
      {showStatus && (
        <View
          style={[
            styles.statusDot,
            {
              width: dims.dot,
              height: dims.dot,
              borderRadius: dims.dot / 2,
              backgroundColor: statusColor,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#090D16',
  },
});
