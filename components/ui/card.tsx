import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

export const Card: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

export const CardDescription: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
    }),
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
  content: {
    paddingVertical: 4,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
