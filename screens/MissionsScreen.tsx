import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, ActivityIndicator, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../styles/theme';
import { getUser, getMissions, getClothes, User, Mission, Vetement } from '../services/api';
import TShirtTitle from '../components/TShirtTitle';

const formatReward = (mission: Mission): string => {
    if (mission.reward) return mission.reward;
    return `+${mission.xp} xp`;
};

const MissionCard = ({ mission }: { mission: Mission }) => {
    const ratio = Math.min(mission.progress / mission.total, 1);
    const progressPercent = `${ratio * 100}%`;

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.missionCard}>
            <View style={styles.missionContent}>
                <View style={styles.missionHeader}>
                    <Text style={styles.missionTitle} numberOfLines={2}>
                        {mission.title}
                    </Text>
                    <Text style={styles.missionReward}>
                        {formatReward(mission)}
                    </Text>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        {ratio > 0 && (
                            <LinearGradient
                                colors={['#E5E4FF', '#ffffff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.progressFillImage, { width: progressPercent }]}
                            />
                        )}
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
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const [user, setUser] = useState<User | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [selectedVetement, setSelectedVetement] = useState<Vetement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                getUser(),
                getMissions(),
                getClothes(),
            ]);
            if (results[0].status === 'fulfilled') {
                const userData = results[0].value;
                if ((!userData.vetements || userData.vetements.length === 0) && results[2]?.status === 'fulfilled') {
                    const clothes = results[2].value;
                    if (clothes && clothes.length > 0) {
                        userData.vetements = clothes;
                    }
                }
                
                setUser(userData);
                if (userData.vetements && userData.vetements.length > 0 && !selectedVetement) {
                    const firstVetementWithImage = userData.vetements.find((v: Vetement) => v.image);
                    if (firstVetementWithImage) {
                        setSelectedVetement(firstVetementWithImage);
                    }
                }
            }
            
            if (results[1].status === 'fulfilled') {
                setMissions(results[1].value);
            } else {
                setMissions([]);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const getProgressPercentage = () => {
        if (!user || !user.xp || !user.xpForNextLevel) return 0;
        const currentLevelXp = user.xp % (user.xpForNextLevel || 1);
        const percentage = (currentLevelXp / (user.xpForNextLevel || 1)) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    };

    const getOrderedVetements = (): Vetement[] => {
        if (!user?.vetements || user.vetements.length === 0) return [];
        return user.vetements.filter(v => v.image);
    };

    const getFilteredMissions = (): Mission[] => {
        if (!selectedVetement) return missions;
        return missions.filter(mission => {
            const missionVetementId = (mission as any).vetement_id || (mission as any).clothing_id;
            return missionVetementId === selectedVetement.id;
        });
    };

    if (loading) {
        return (
            <View style={[styles.screen, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    const orderedVetements = getOrderedVetements();
    const filteredMissions = getFilteredMissions();
    const displayVetements = orderedVetements.slice(0, 3);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#CFCEFB', 'rgba(255, 255, 255, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.89]}
                style={styles.heroSection}
            >
                <View style={styles.heroHeader}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.heroLogo}
                        tintColor={COLORS.textDark}
                    />
                    {user?.name && (
                        <Text style={styles.heroTitle}>{user.name}</Text>
                    )}
                </View>

                <View style={styles.skinsRow}>
                    {displayVetements.filter(v => v.image).map(vetement => (
                        <TouchableOpacity
                            key={vetement.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedVetement(vetement)}
                            style={[
                                styles.skinBubble,
                                selectedVetement?.id === vetement.id && styles.skinBubbleActive,
                            ]}
                        >
                            <Image 
                                source={{ uri: vetement.image! }} 
                                style={styles.skinImage} 
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                        activeOpacity={0.8} 
                        style={styles.skinBubble}
                        onPress={() => navigation.navigate('AddClothing' as never)}
                    >
                        <Text style={styles.addSymbol}>+</Text>
                    </TouchableOpacity>
                </View>
                {selectedVetement?.nom && (
                    <>
                        <View style={styles.tshirtTitleContainer}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <Text style={styles.sectionTitle}>{selectedVetement.nom.toUpperCase()}</Text>
                                    <View style={styles.sectionUnderline} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.missionsList}>
                            {filteredMissions.length > 0 ? (
                                filteredMissions.map(mission => (
                                    <MissionCard key={mission.id} mission={mission} />
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateText}>Aucune mission</Text>
                                </View>
                            )}
                        </View>
                        {selectedVetement?.image && (
                            <View style={styles.heroFooter}>
                                <View style={styles.tshirtContainer}>
                                    <Image
                                        source={{ uri: selectedVetement.image }}
                                        style={styles.heroImage}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={styles.levelInfo}>
                                    <Text style={styles.tshirtTitle}>{selectedVetement.nom}</Text>
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
                        )}
                    </>
                )}
            </LinearGradient>
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
        paddingTop: 0,
        flexGrow: 1,
    },
    heroSection: {
        marginBottom: 0,
        paddingVertical: 20,
        paddingTop: 55,
        paddingBottom: 0,
        marginHorizontal: -20,
        paddingHorizontal: 20,
        minHeight: 444,
        alignItems: 'center',
        overflow: 'hidden',
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        paddingHorizontal: 16,
        gap: 12,
    },
    heroLogo: {
        width: 48,
        height: 52,
    },
    heroTitle: {
        fontSize: 12,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    skinsRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        alignSelf: 'flex-start',
        width: '100%',
    },
    tshirtTitleContainer: {
        alignSelf: 'flex-start',
        marginTop: 32,
        paddingTop: 0,
        width: '100%',
    },
    missionsList: {
        gap: 8,
        width: '100%',
        marginTop: 16,
        alignSelf: 'flex-start',
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
        backgroundColor: 'transparent',
    },
    addSymbol: {
        fontSize: 24,
        color: '#3300fd',
        fontFamily: 'Minasans-Regular',
        fontWeight: '400',
    },
    sectionContainer: {
        paddingHorizontal: 0,
        marginTop: 0,
        gap: 16,
        width: '100%',
        maxWidth: 365,
        alignSelf: 'center',
    },
    sectionHeader: {
        marginBottom: 0,
        marginTop: 0,
    },
    sectionTitleContainer: {
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 0,
        lineHeight: 24,
        textTransform: 'uppercase',
    },
    sectionUnderline: {
        height: 9,
        borderRadius: 33,
        backgroundColor: COLORS.accentYellow,
        marginTop: 20,
        alignSelf: 'stretch',
    },
    missionCard: {
        backgroundColor: '#8173FF',
        borderRadius: 5,
        padding: 12,
        width: '100%',
    },
    missionContent: {
        gap: 10,
        width: '100%',
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    missionTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#ffffff',
        letterSpacing: 0.6,
        flex: 1,
        marginRight: 12,
        fontWeight: '700',
    },
    missionReward: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#ffffff',
        letterSpacing: 0.6,
        minWidth: 76.333,
        textAlign: 'center',
        fontWeight: '800',
    },
    progressContainer: {
        position: 'relative',
        width: '100%',
        maxWidth: 319,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    progressTrack: {
        position: 'absolute',
        width: '100%',
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
        fontWeight: '600',
        alignSelf: 'center',
        top: 1,
    },
    missionsButtonContainer: {
        alignItems: 'center',
        marginTop: 16,
        width: '100%',
    },
    missionsButton: {
        width: '100%',
        maxWidth: 310,
        paddingVertical: 12,
        paddingHorizontal: 67,
        borderRadius: 2,
        backgroundColor: '#E5E4FF',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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
        fontWeight: '700',
        width: 230,
        textAlign: 'center',
    },
    heroFooter: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 0,
        marginTop: 16,
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '100%',
        alignSelf: 'flex-start',
    },
    tshirtContainer: {
        width: 147,
        height: 163,
        flexShrink: 0,
    },
    heroImage: {
        width: 147,
        height: 163,
        backgroundColor: 'transparent',
    },
    levelInfo: {
        flex: 1,
        height: 163,
        gap: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        minWidth: 0,
        flexShrink: 1,
        paddingRight: 0,
    },
    tshirtTitle: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#1e1e1e',
        letterSpacing: 0.6,
        marginBottom: 8,
        marginTop: 0,
        textAlign: 'left',
        fontWeight: '700',
        alignSelf: 'flex-start',
    },
    progressBarContainer: {
        width: '100%',
        maxWidth: 200,
        height: 12,
        position: 'relative',
        marginBottom: 4,
        alignSelf: 'flex-start',
    },
    progressBarTrack: {
        position: 'absolute',
        width: '100%',
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
        width: '100%',
        maxWidth: 200,
        alignSelf: 'flex-start',
        marginBottom: 8,
        marginTop: 0,
    },
    levelLabel: {
        fontFamily: FONTS.body,
        fontSize: 7,
        color: '#1e1e1e',
        fontWeight: '400',
    },
    buttonRow: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        marginTop: 'auto',
        alignItems: 'flex-start',
        maxWidth: 173,
    },
    heroButton: {
        width: 172,
        maxWidth: '100%',
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
        maxWidth: '100%',
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: '#1e1e1e',
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
    heroButtonText: {
        color: '#ffffff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
        fontWeight: '700',
        width: 141,
        textAlign: 'center',
    },
    heroButtonTextDark: {
        color: '#ffffff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
        fontWeight: '700',
        width: 141,
        textAlign: 'center',
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
