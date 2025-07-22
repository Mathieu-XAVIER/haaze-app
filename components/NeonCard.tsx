import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface NeonCardProps {
  children: React.ReactNode;
  color?: 'blue' | 'orange';
  style?: StyleProp<ViewStyle>;
}

const COLORS = {
  blue: '#3300FD',
  orange: '#FF3600',
};

export default function NeonCard({ children, color = 'blue', style }: NeonCardProps) {
  return (
    <View style={[styles.base, styles[color], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#18181B',
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    // boxShadow pour le web
    boxShadow: '0 0 10px 2px #3300FD',
  },
  blue: {
    borderColor: COLORS.blue,
    boxShadow: '0 0 10px 2px #3300FD',
  },
  orange: {
    borderColor: COLORS.orange,
    boxShadow: '0 0 10px 2px #FF3600',
  },
});
