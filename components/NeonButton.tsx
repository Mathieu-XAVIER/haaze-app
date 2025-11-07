import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface NeonButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  color?: 'blue' | 'orange';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const COLORS = {
  blue: '#3300FD',
  orange: '#FF3600',
};

export default function NeonButton({ children, onPress, color = 'blue', style, disabled = false }: NeonButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.base,
        styles[color],
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    // boxShadow pour le web
    boxShadow: '0 0 12px 2px #3300FD',
  },
  blue: {
    borderColor: COLORS.blue,
    boxShadow: '0 0 12px 2px #3300FD',
  },
  orange: {
    borderColor: COLORS.orange,
    boxShadow: '0 0 12px 2px #FF3600',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Minasans',
    letterSpacing: 1.2,
    // Pas de textShadow
  },
});
