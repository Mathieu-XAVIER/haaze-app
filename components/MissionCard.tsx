import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NeonCard from './NeonCard';
import NeonProgressBar from './NeonProgressBar';

interface MissionCardProps {
  title: string;
  progress: number;
  total: number;
  xp: number;
}

export default function MissionCard({ title, progress, total, xp }: MissionCardProps) {
  return (
    <NeonCard color="orange" style={styles.card}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={styles.title}>{title}</Text>
          <NeonProgressBar
            progress={progress / total}
            level={0}
            nextLevel={0}
            xpText={`${progress}/${total}`}
            color="orange"
            compact
          />
        </View>
        <Text style={styles.xp}>
          <Text style={styles.xpPlus}>+</Text>{xp} XP
        </Text>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 16,
    padding: 0,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Minasans',
  },
  xp: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Minasans',
  },
  xpPlus: {
    color: '#FF3600',
    fontSize: 18,
    fontFamily: 'Minasans',
  },
});
