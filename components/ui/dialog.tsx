import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  contentStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialogContainer, contentStyle]}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{title}</Text>
                  {description && <Text style={styles.description}>{description}</Text>}
                </View>
                <Pressable
                  onPress={onClose}
                  hitSlop={10}
                  style={styles.closeButton}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Ionicons name="close" size={22} color="#94A3B8" />
                </Pressable>
              </View>

              {/* Content Body */}
              <View style={styles.body}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 13, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    padding: 22,
    ...Platform.select({
      android: { elevation: 12 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '100%',
  },
});
