import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface NeonProgressBarProps {
  progress: number;
  title?: string;
  pseudo?: string;
  level: number;
  nextLevel: number;
  xpText: string;
  color?: 'blue' | 'orange';
  compact?: boolean;
}

const COLORS = {
  blue: ['#6600FF', '#3300FD'],
  orange: ['#FF6A00', '#FF3600'],
};

export default function NeonProgressBar({
  progress = 0,
  title,
  pseudo,
  level,
  nextLevel,
  xpText,
  color = 'blue',
  compact = false,
}: NeonProgressBarProps) {
  const borderStyle = color === 'blue' ? styles.blueBorder : styles.orangeBorder;
  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {pseudo && <Text style={[styles.pseudo, compact && styles.pseudoCompact]}>{pseudo}</Text>}
      <View style={[styles.progressBarBackground, compact && styles.progressCompact, borderStyle]}>
        <LinearGradient
          colors={COLORS[color] as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]}
        />
        <Text style={[styles.xpText, compact && styles.xpTextCompact]}>{xpText}</Text>
      </View>
      <View style={styles.levelRow}>
        <Text style={styles.levelText}>Lv.{level}</Text>
        <Text style={styles.levelText}>Lv.{nextLevel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  wrapperCompact: {
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Minasans',
  },
  pseudo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Minasans',
  },
  pseudoCompact: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: '#111',
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 4,
    // boxShadow pour le web
    boxShadow: '0 0 10px 2px #3300FD',
  },
  progressCompact: {
    height: 14,
  },
  blueBorder: {
    borderColor: '#3300FD',
    boxShadow: '0 0 10px 2px #3300FD',
  },
  orangeBorder: {
    borderColor: '#FF3600',
    boxShadow: '0 0 10px 2px #FF3600',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 10,
  },
  xpText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 1,
    fontFamily: 'Helvetica',
    // Pas de textShadow
  },
  xpTextCompact: {
    fontSize: 10,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  levelText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
});
