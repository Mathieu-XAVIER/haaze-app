import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../styles/theme';
import { getUser, getMissions, getSkins, User, Mission, Skin } from '../services/api';

const assets = {
    logo: 'https://www.figma.com/api/mcp/asset/5a24b7a1-cfaf-419c-8698-3f668cfb4eb0',
    tshirt1: 'https://www.figma.com/api/mcp/asset/4c2b7748-4d83-462b-87f9-2bad1280c0c5',
    tshirt2: 'https://www.figma.com/api/mcp/asset/46b4e4c5-1fc8-4fab-8d16-09f46be49fd0',
    progressFill: 'https://www.figma.com/api/mcp/asset/79ae9a43-82df-42c9-8558-de13d59a2f8c',
};

const formatReward = (mission: Mission): string => {
    if (mission.reward) return mission.reward;
    return `+${mission.xp} xp`;
};

const MissionCard = ({ mission }: { mission: Mission }) => {
    const ratio = Math.min(mission.progress / mission.total, 1);
    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.missionCard}>
            <View style={styles.missionContent}>
                <View style={styles.missionHeader}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionReward}>{formatReward(mission)}</Text>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <Image
                            source={{ uri: assets.progressFill }}
                            style={[styles.progressFillImage, { width: `${ratio * 100}%` }]}
                            resizeMode="stretch"
                        />
                    </View>
                    <Text style={styles.progressLabel}>
                        {mission.progress}/{mission.total}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function MissionsScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [skins, setSkins] = useState<Skin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [userData, missionsData, skinsData] = await Promise.all([
                getUser(),
                getMissions(),
                getSkins(),
            ]);
            setUser(userData);
            setMissions(missionsData);
            setSkins(skinsData);
        } catch (error) {
            console.error('[MissionsScreen] Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActiveSkin = () => {
        return skins.find(s => s.active) || skins[0];
    };

    const getProgressPercentage = () => {
        if (!user || !user.xp || !user.xpForNextLevel) return 34;
        const currentLevelXp = user.xp % (user.xpForNextLevel || 1);
        return (currentLevelXp / (user.xpForNextLevel || 1)) * 100;
    };

    if (loading) {
        return (
            <View style={[styles.screen, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    const activeSkin = getActiveSkin();
    const displaySkins = skins.slice(0, 3);
    const hasMoreSkins = skins.length > 3;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#CFCEFB', '#f5f4ff', COLORS.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style={styles.heroSection}
            >
                <View style={styles.heroHeader}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.heroLogo}
                        tintColor={COLORS.textDark}
                    />
                    <Text style={styles.heroTitle}>{user?.name || 'Je suis le pseudo'}</Text>
                </View>

                <View style={styles.skinsRow}>
                    {displaySkins.map(skin => (
                        <View
                            key={skin.id}
                            style={[
                                styles.skinBubble,
                                skin.active && styles.skinBubbleActive,
                            ]}
                        >
                            {skin.image ? (
                                <Image source={{ uri: skin.image }} style={styles.skinImage} resizeMode="contain" />
                            ) : (
                                <Text style={styles.addSymbol}>+</Text>
                            )}
                        </View>
                    ))}
                    {hasMoreSkins && (
                        <View style={[styles.skinBubble, styles.skinBubbleEmpty]}>
                            <Text style={styles.addSymbol}>+</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>T-SHIRT HAAZE #1</Text>
                    <View style={styles.sectionUnderline} />
                </View>

                <View style={styles.missionsList}>
                    {missions.length > 0 ? (
                        missions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Aucune mission disponible</Text>
                        </View>
                    )}
                </View>

                <View style={styles.missionsButtonContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.missionsButton}>
                        <Text style={styles.missionsButtonText}>Voir toutes les missions</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.heroFooter}>
                <View style={styles.tshirtContainer}>
                    <Image
                        source={activeSkin?.image ? { uri: activeSkin.image } : { uri: assets.tshirt1 }}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.levelInfo}>
                    <Text style={styles.tshirtTitle}>{activeSkin?.name || 'T-shirt HAAZE #1'}</Text>
                    <View style={styles.progressBarContainer}>
                        <LinearGradient
                            colors={['#6740ff', '#3300fd']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${getProgressPercentage()}%` }]}
                        />
                        <View style={styles.progressBarTrack} />
                    </View>
                    <View style={styles.levelLabels}>
                        <Text style={styles.levelLabel}>Lv.{user?.level || 1}</Text>
                        <Text style={styles.levelLabel}>Lv.{(user?.level || 1) + 1}</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.heroButton}>
                            <Text style={styles.heroButtonText}>Tester le skin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.heroButtonDark}>
                            <Text style={styles.heroButtonTextDark}>Voir tous les skins</Text>
                        </TouchableOpacity>
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
        paddingBottom: 120,
        paddingTop: 40,
    },
    heroSection: {
        marginBottom: 30,
        paddingVertical: 20,
        paddingTop: 30,
        paddingBottom: 30,
        marginHorizontal: -20,
        paddingHorizontal: 20,
        minHeight: 400,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    heroLogo: {
        width: 42,
        height: 42,
        marginRight: 12,
    },
    heroTitle: {
        fontSize: 20,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textTransform: 'uppercase',
    },
    skinsRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    skinBubble: {
        width: 50,
        height: 50,
        borderRadius: 117,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        ...Platform.select({
            web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)' },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                elevation: 2,
            },
        }),
    },
    skinBubbleActive: {
        borderWidth: 1,
        borderColor: '#8173ff',
        backgroundColor: '#f8f8f8',
    },
    skinBubbleEmpty: {
        backgroundColor: '#ffffff',
    },
    skinImage: {
        width: 25,
        height: 27,
    },
    addSymbol: {
        fontSize: 24,
        color: '#3300fd',
        fontFamily: 'Minasans',
    },
    sectionContainer: {
        paddingHorizontal: 13,
        marginTop: 32,
        gap: 16,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        textTransform: 'uppercase',
        marginBottom: 20,
    },
    sectionUnderline: {
        height: 9,
        borderRadius: 33,
        backgroundColor: COLORS.accentYellow,
        width: 261,
        marginTop: -2,
    },
    missionsList: {
        gap: 8,
    },
    missionCard: {
        backgroundColor: '#8173FF',
        borderRadius: 5,
        padding: 12,
    },
    missionContent: {
        gap: 10,
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    missionTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#ffffff',
        letterSpacing: 0.6,
        flex: 1,
        marginRight: 12,
    },
    missionReward: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#ffffff',
        letterSpacing: 0.6,
        minWidth: 76,
        textAlign: 'center',
    },
    progressContainer: {
        position: 'relative',
        width: 319,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressTrack: {
        position: 'absolute',
        width: 319,
        height: 14,
        borderRadius: 2,
        borderWidth: 0.75,
        borderColor: '#e5e4ff',
        backgroundColor: '#8173FF',
        overflow: 'hidden',
    },
    progressFillImage: {
        height: 14,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    progressLabel: {
        position: 'absolute',
        fontFamily: FONTS.bodyBold,
        fontSize: 8,
        color: '#130077',
        letterSpacing: 0.4,
        zIndex: 1,
    },
    missionsButtonContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    missionsButton: {
        width: 310,
        paddingVertical: 12,
        paddingHorizontal: 67,
        borderRadius: 2,
        backgroundColor: '#E5E4FF',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)' },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                elevation: 2,
            },
        }),
    },
    missionsButtonText: {
        color: '#3300FD',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
    },
    heroFooter: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 13,
        marginTop: 32,
        alignItems: 'flex-start',
    },
    tshirtContainer: {
        width: 147,
        height: 163,
    },
    heroImage: {
        width: 147,
        height: 163,
    },
    levelInfo: {
        flex: 1,
        gap: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    tshirtTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#1e1e1e',
        letterSpacing: 0.6,
        marginBottom: 20,
        alignSelf: 'center',
    },
    progressBarContainer: {
        width: 271,
        height: 12,
        position: 'relative',
        marginBottom: 35,
    },
    progressBarTrack: {
        position: 'absolute',
        width: 271,
        height: 12,
        borderWidth: 1,
        borderColor: '#6740ff',
        borderRadius: 0,
    },
    progressBarFill: {
        position: 'absolute',
        height: 12,
        borderWidth: 1,
        borderColor: '#6740ff',
        borderRadius: 0,
    },
    levelLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 271,
        position: 'absolute',
        top: 35,
    },
    levelLabel: {
        fontFamily: FONTS.body,
        fontSize: 7,
        color: '#1e1e1e',
    },
    buttonRow: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        marginTop: 12,
        alignItems: 'center',
    },
    heroButton: {
        width: 172,
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: COLORS.primaryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)' },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                elevation: 2,
            },
        }),
    },
    heroButtonDark: {
        width: 173,
        backgroundColor: '#1e1e1e',
    },
    heroButtonText: {
        color: '#ffffff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
    },
    heroButtonTextDark: {
        color: '#ffffff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyStateText: {
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        fontSize: 14,
    },
});
