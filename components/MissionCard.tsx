import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { stylesIncomplete, stylesComplete } from '../styles/MissionCard.styles';

interface MissionCardProps {
  title: string;
  progress: number;
  total: number;
  xp: number;
  terminee?: boolean;
}

export default function MissionCard(props: MissionCardProps) {
  if (props.terminee) {
    return <MissionCardComplete {...props} />;
  }
  return <MissionCardIncomplete {...props} />;
}

function MissionCardBorder({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={["#3300FD", "#FF3600"]}
      start={{ x: 0.1, y: 0.9 }}
      end={{ x: 0.9, y: 0.1 }}
      locations={[0.35, 0.65]}
      style={stylesIncomplete.border}
    >
      <View style={stylesIncomplete.gap}>
        <View style={stylesIncomplete.innerContent}>{children}</View>
      </View>
    </LinearGradient>
  );
}

function MissionCardIncomplete({ title, progress, total, xp }: MissionCardProps) {
  return (
    <MissionCardBorder>
      <View style={stylesIncomplete.content}>
        <View style={stylesIncomplete.leftContent}>
          <Text style={stylesIncomplete.title}>{title}</Text>
          <View style={stylesIncomplete.progressBarWrapper}>
            <View style={stylesIncomplete.progressBarBg}>
              <View style={[stylesIncomplete.progressBarFill, { width: `${Math.min((progress / total) * 100, 100)}%` }]} />
            </View>
            <Text style={stylesIncomplete.progressText}>{progress}/{total}</Text>
          </View>
        </View>
        <Text style={stylesIncomplete.xp}>
          <Text style={stylesIncomplete.xpPlus}>+</Text>{xp} XP
        </Text>
      </View>
    </MissionCardBorder>
  );
}

function MissionCardComplete({ xp }: MissionCardProps) {
  return (
    <LinearGradient
      colors={["#FF3600", "#3300FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={stylesComplete.card}
    >
      <View style={stylesComplete.content}>
        <Text style={stylesComplete.leftText}>RÉCUPÉRER</Text>
        <Text style={stylesComplete.rightText}>+{xp} XP</Text>
      </View>
    </LinearGradient>
  );
}
