import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
                <View style={styles.progressLabelContainer}>
                    <Text style={styles.progressLabel}>
                        {mission.progress}/{mission.total}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const BorderButton = ({
    children,
    variant = 'primary',
    hero = false,
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'dark' | 'missions';
    hero?: boolean;
}) => {
    const buttonStyle = hero
        ? [styles.heroButton, variant === 'dark' && styles.heroButtonDark]
        : variant === 'missions'
          ? styles.missionsButton
          : [styles.borderButton, variant === 'dark' && styles.borderButtonDark];

    const textStyle = hero
        ? variant === 'dark'
            ? styles.heroButtonTextDark
            : styles.heroButtonText
        : variant === 'missions'
          ? styles.missionsButtonText
          : variant === 'dark'
            ? styles.borderButtonTextDark
            : styles.borderButtonText;

    return (
        <TouchableOpacity activeOpacity={0.8} style={buttonStyle}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    );
};

export default function MissionsScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <LinearGradient
                colors={['#CFCEFB', '#f5f4ff', COLORS.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style={styles.heroSection}
            >
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
            </LinearGradient>

            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>T-SHIRT HAAZE #1</Text>
                    <View style={styles.sectionUnderline} />
                </View>
            </View>

            {missions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
            ))}

            <View style={styles.missionsButtonContainer}>
                <BorderButton variant="missions">Voir toutes les missions</BorderButton>
            </View>

            <View style={styles.heroFooter}>
                <Image source={require('../assets/tshirt.png')} style={styles.heroImage} resizeMode="contain" />
                <View style={styles.levelInfo}>
                    <View style={styles.heroProgressTrack}>
                        <View style={[styles.heroProgressFill, { width: '55%' }]} />
                    </View>
                    <View style={styles.levelRow}>
                        <Text style={styles.levelLabel}>T-shirt HAAZE</Text>
                        <Text style={styles.levelLabel}>Lv. 1 → Lv. 2</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        <BorderButton hero>Tester le skin</BorderButton>
                        <BorderButton hero variant="dark">Voir tous les skins</BorderButton>
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
        paddingTop: 40,
        paddingBottom: 120,
        gap: 20,
    },
    heroSection: {
        marginBottom: 20,
        paddingVertical: 20,
        paddingTop: 30,
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 10,
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
        marginTop: 20,
        marginBottom: 16,
    },
    sectionTitleContainer: {
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 1,
        lineHeight: 28,
    },
    sectionUnderline: {
        height: 6,
        borderRadius: 10,
        backgroundColor: COLORS.accentYellow,
        marginTop: -2,
        alignSelf: 'stretch',
    },
    missionCard: {
        backgroundColor: '#8173FF',
        borderRadius: 5,
        padding: 18,
        marginBottom: 12,
        borderWidth: 0,
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    missionTitle: {
        fontFamily: FONTS.bodyBold,
        color: '#fff',
        flex: 1,
        marginRight: 12,
    },
    missionReward: {
        fontFamily: FONTS.bodyBold,
        color: '#fff',
    },
    progressTrack: {
        height: 12,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'visible',
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    progressLabelContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressLabel: {
        color: '#000',
        fontSize: 10,
        fontFamily: FONTS.bodyBold,
    },
    missionsButtonContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    missionsButton: {
        width: '80%',
        paddingVertical: 14,
        borderRadius: 2,
        alignItems: 'center',
        backgroundColor: '#E5E4FF',
    },
    missionsButtonText: {
        color: '#3300FD',
        fontFamily: FONTS.bodyBold,
    },
    heroButton: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 14,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: COLORS.primaryBlue,
    },
    heroButtonDark: {
        backgroundColor: COLORS.textDark,
    },
    heroButtonText: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
    },
    heroButtonTextDark: {
        color: '#fff',
    },
    borderButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
        alignItems: 'center',
        backgroundColor: 'transparent',
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
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    heroImage: {
        width: 140,
        height: 160,
    },
    levelInfo: {
        flex: 1,
    },
    heroProgressTrack: {
        height: 6,
        backgroundColor: '#eae4ff',
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 8,
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    levelLabel: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
    },
    heroProgressFill: {
        height: '100%',
        backgroundColor: COLORS.primaryBlue,
    },
    buttonRow: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 12,
    },
});
