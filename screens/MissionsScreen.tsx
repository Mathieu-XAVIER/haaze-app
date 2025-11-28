import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

type Mission = {
    id: string;
    title: string;
    reward: string;
    progress: number;
    total: number;
};

const missions: Mission[] = [
    { id: '1', title: 'Réponds à ce quizz', reward: '+1 skin', progress: 1, total: 2 },
    { id: '2', title: 'Change 1 fois de skin', reward: '+500 xp', progress: 1, total: 2 },
    { id: '3', title: "Découvre l’univers de cette collection", reward: '+750 xp', progress: 1, total: 2 },
];

const skins = [
    { id: 'skin-1', image: require('../assets/tshirt.png') },
    { id: 'skin-2', image: require('../assets/tshirt.png') },
    { id: 'add', image: null },
];

const MissionCard = ({ mission }: { mission: Mission }) => {
    const ratio = Math.min(mission.progress / mission.total, 1);
    return (
        <View style={styles.missionCard}>
            <View style={styles.missionHeader}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionReward}>{mission.reward}</Text>
            </View>
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
                {mission.progress}/{mission.total}
            </Text>
        </View>
    );
};

const BorderButton = ({
    children,
    variant = 'primary',
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'dark';
}) => (
    <View style={[styles.borderButton, variant === 'dark' && styles.borderButtonDark]}>
        <Text style={[styles.borderButtonText, variant === 'dark' && styles.borderButtonTextDark]}>{children}</Text>
    </View>
);

export default function MissionsScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.heroHeader}>
                <Image source={require('../assets/logo.png')} style={styles.logo} tintColor={COLORS.textDark} />
                <Text style={styles.pseudo}>Je suis le pseudo</Text>
            </View>

            <View style={styles.skinsRow}>
                {skins.map(skin => (
                    <View key={skin.id} style={[styles.skinBubble, !skin.image && styles.skinBubbleEmpty]}>
                        {skin.image ? (
                            <Image source={skin.image} style={styles.skinImage} resizeMode="contain" />
                        ) : (
                            <Text style={styles.addSymbol}>＋</Text>
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>T-SHIRT HAAZE #1</Text>
                <View style={styles.sectionUnderline} />
            </View>

            {missions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
            ))}

            <BorderButton>Voir toutes les missions</BorderButton>

            <View style={styles.heroFooter}>
                <Image source={require('../assets/tshirt.png')} style={styles.heroImage} resizeMode="contain" />
                <View style={styles.levelInfo}>
                    <View style={styles.levelRow}>
                        <Text style={styles.levelLabel}>T-shirt HAAZE</Text>
                        <Text style={styles.levelLabel}>Lv. 1 → Lv. 2</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: '55%' }]} />
                    </View>
                    <View style={styles.buttonRow}>
                        <BorderButton>Tester le skin</BorderButton>
                        <BorderButton variant="dark">Voir tous les skins</BorderButton>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 90,
        gap: 20,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 42,
        height: 42,
    },
    pseudo: {
        fontSize: 20,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textTransform: 'uppercase',
    },
    skinsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    skinBubble: {
        flex: 1,
        height: 70,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    skinBubbleEmpty: {
        borderStyle: 'dashed',
        borderColor: '#c4b4ff',
    },
    skinImage: {
        width: 45,
        height: 45,
    },
    addSymbol: {
        fontSize: 28,
        color: '#9d8bff',
    },
    sectionHeader: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 1,
    },
    sectionUnderline: {
        width: 72,
        height: 6,
        borderRadius: 999,
        backgroundColor: COLORS.accentYellow,
        marginTop: 6,
    },
    missionCard: {
        backgroundColor: COLORS.missionCard,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.missionBorder,
        marginTop: 12,
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    missionTitle: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.missionText,
        flex: 1,
        marginRight: 12,
    },
    missionReward: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.missionText,
    },
    progressTrack: {
        height: 8,
        borderRadius: 999,
        backgroundColor: '#f7f2ff',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primaryBlue,
    },
    progressLabel: {
        marginTop: 6,
        color: COLORS.missionText,
        fontSize: 12,
        fontFamily: FONTS.body,
    },
    borderButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: '#fff',
    },
    borderButtonDark: {
        borderColor: COLORS.textDark,
    },
    borderButtonText: {
        color: COLORS.primaryBlue,
        fontFamily: FONTS.bodyBold,
    },
    borderButtonTextDark: {
        color: COLORS.textDark,
    },
    heroFooter: {
        backgroundColor: '#fff',
        borderRadius: 26,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderWidth: 2,
        borderColor: '#e3dbff',
    },
    heroImage: {
        width: 140,
        height: 160,
    },
    levelInfo: {
        flex: 1,
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    levelLabel: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
});
