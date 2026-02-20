import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    ImageSourcePropType,
    Platform,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../styles/theme';
import { getUser, getMissions, getCollections, Mission, Collection, User } from '../services/api';

const changeOutfitIcon = Asset.fromModule(require('../assets/picto-changer-de-vetement.svg'));
changeOutfitIcon.downloadAsync?.();

const borderButtonShadow =
    Platform.OS === 'web'
        ? { boxShadow: '0px 0px 10px rgba(51, 0, 253, 0.35)' }
        : {
              shadowColor: COLORS.primaryBlue,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
          };

const borderButtonDarkShadow =
    Platform.OS === 'web'
        ? { boxShadow: '0px 0px 10px rgba(28, 28, 28, 0.45)' }
        : {
              shadowColor: COLORS.textDark,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
          };

const missionShadow =
    Platform.OS === 'web'
        ? { boxShadow: '0px 6px 12px rgba(179, 155, 255, 0.2)' }
        : {
              shadowColor: COLORS.missionBorder,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
          };

const collectionShadow =
    Platform.OS === 'web'
        ? { boxShadow: '0px 0px 12px rgba(51, 0, 253, 0.25)' }
        : {
              shadowColor: COLORS.primaryBlue,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
          };

const BorderButton = React.memo<{
    children: React.ReactNode;
    onPress?: () => void;
    variant?: 'primary' | 'dark' | 'missions';
    hero?: boolean;
}>(({ children, onPress, variant = 'primary', hero = false }) => {
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
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    );
});

BorderButton.displayName = 'BorderButton';

const MissionCard = React.memo<{ mission: Mission }>(({ mission }) => {
    const ratio = Math.min(mission.progress / mission.total, 1);
    return (
        <View style={styles.missionCard}>
            <View style={styles.missionHeader}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionXp}>+{mission.xp} xp</Text>
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
});

MissionCard.displayName = 'MissionCard';

const CollectionCard = React.memo<{ collection: { id: string; title: string; subtitle: string; image: ImageSourcePropType | { uri: string } } }>(({ collection }) => (
    <ImageBackground source={collection.image} style={styles.collectionCard} imageStyle={styles.collectionImage}>
        <View style={styles.collectionOverlay} />
        <View style={styles.collectionTextWrapper}>
            <Text style={styles.collectionTitle}>{collection.title}</Text>
        </View>
    </ImageBackground>
));

CollectionCard.displayName = 'CollectionCard';

export default function HomeScreen() {
    const { width } = useWindowDimensions();
    const changeIconUri = changeOutfitIcon?.uri;
    const [user, setUser] = useState<User | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            // Charger les données en parallèle, mais gérer les erreurs individuellement
            const results = await Promise.allSettled([
                getUser(),
                getMissions(),
                getCollections(),
            ]);
            
            // Traiter les résultats
            if (results[0].status === 'fulfilled') {
                setUser(results[0].value);
            } else {
                console.error('[HomeScreen] Erreur lors du chargement de l\'utilisateur:', results[0].reason);
            }
            
            if (results[1].status === 'fulfilled') {
                setMissions(results[1].value.slice(0, 3)); // Limiter à 3 missions pour l'écran d'accueil
            } else {
                console.error('[HomeScreen] Erreur lors du chargement des missions:', results[1].reason);
                setMissions([]);
            }
            
            if (results[2].status === 'fulfilled') {
                setCollections(results[2].value.filter(c => c.coming_soon).slice(0, 2)); // Collections à venir
            } else {
                console.error('[HomeScreen] Erreur lors du chargement des collections:', results[2].reason);
                setCollections([]);
            }
        } catch (error) {
            console.error('[HomeScreen] Erreur inattendue lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Rafraîchir les données quand on revient sur la page
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const getProgressPercentage = useCallback(() => {
        if (!user || !user.xp || !user.xpForNextLevel) return 0;
        // Calculer le XP du niveau actuel (reste après avoir soustrait les niveaux précédents)
        const currentLevelXp = user.xp % (user.xpForNextLevel || 1);
        const percentage = (currentLevelXp / (user.xpForNextLevel || 1)) * 100;
        return Math.min(Math.max(percentage, 0), 100); // S'assurer que c'est entre 0 et 100
    }, [user]);

    const getCurrentLevel = useCallback(() => {
        return user?.level || 1;
    }, [user]);

    const getNextLevel = useCallback(() => {
        return (user?.level || 1) + 1;
    }, [user]);

    if (loading) {
        return (
            <View style={[styles.screen, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

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
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.heroLogo}
                        tintColor={COLORS.textDark}
                    />
                    <Text style={styles.heroTitle}>{user?.name || 'Je suis le pseudo'}</Text>
                </View>
                <Image source={require('../assets/tshirt.png')} style={styles.heroImage} resizeMode="contain" />

                <View style={styles.skinLabelRow}>
                    <Text style={styles.skinLabel}>T-shirt HAAZE #1</Text>
                    {changeIconUri ? <SvgUri width={32} height={32} uri={changeIconUri} /> : null}
                </View>

                <View style={styles.heroProgressTrack}>
                    <LinearGradient
                        colors={['#6740ff', '#3300fd']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.heroProgressFill, { width: `${getProgressPercentage()}%` }]}
                    />
                </View>
                <View style={styles.levelRow}>
                    <Text style={styles.levelLabel}>Lv. {getCurrentLevel()}</Text>
                    <Text style={styles.levelLabel}>Lv. {getNextLevel()}</Text>
                </View>

                <View style={styles.buttonRow}>
                    <BorderButton hero>Tester le skin</BorderButton>
                    <BorderButton hero variant="dark">Voir tous les skins</BorderButton>
                </View>
            </LinearGradient>

            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>MISSIONS EN COURS</Text>
                    <View style={styles.sectionUnderline} />
                </View>
            </View>
            {missions.length > 0 ? (
                missions.map(mission => (
                    <MissionCard key={mission.id} mission={mission} />
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Aucune mission en cours</Text>
                </View>
            )}
            <View style={styles.missionsButtonContainer}>
                <BorderButton variant="missions">Voir toutes les missions</BorderButton>
            </View>

            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>COLLECTIONS À VENIR</Text>
                    <View style={styles.sectionUnderline} />
                </View>
            </View>
            <View style={styles.collectionGrid}>
                {collections.length > 0 ? (
                    collections.map(collection => (
                        <CollectionCard
                            key={collection.id}
                            collection={{
                                id: String(collection.id),
                                title: collection.title,
                                subtitle: collection.subtitle || 'COLLECTIONS À VENIR',
                                image: collection.image
                                    ? { uri: collection.image }
                                    : require('../assets/badge-1.png'),
                            }}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>Aucune collection à venir</Text>
                    </View>
                )}
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
        flexGrow: 1,
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
        fontSize: 12,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    heroImage: {
        width: '100%',
        maxWidth: '100%',
        height: 280,
        marginVertical: 20,
        alignSelf: 'center',
    },
    skinLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    skinLabel: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
    },
    levelLabel: {
        color: '#1e1e1e',
        fontSize: 7,
        fontFamily: FONTS.body,
    },
    heroProgressTrack: {
        height: 12,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6740ff',
        borderRadius: 0,
        overflow: 'hidden',
        marginBottom: 8,
    },
    heroProgressFill: {
        width: '55%',
        height: '100%',
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    heroButton: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
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
        backgroundColor: '#1e1e1e',
    },
    heroButtonText: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
    },
    heroButtonTextDark: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
    },
    borderButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
        alignItems: 'center',
        backgroundColor: 'transparent',
        ...borderButtonShadow,
    },
    borderButtonDark: {
        borderColor: COLORS.textDark,
        ...borderButtonDarkShadow,
    },
    borderButtonText: {
        color: COLORS.primaryBlue,
        fontFamily: FONTS.bodyBold,
    },
    borderButtonTextDark: {
        color: COLORS.textDark,
    },
    missionsButtonContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    missionsButton: {
        width: '100%',
        maxWidth: 310,
        paddingVertical: 12,
        paddingHorizontal: 67,
        borderRadius: 2,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
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
        padding: 18,
        marginBottom: 12,
        borderWidth: 0,
        ...missionShadow,
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    missionTitle: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
        flex: 1,
        marginRight: 10,
    },
    missionXp: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
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
        color: '#130077',
        fontSize: 8,
        fontFamily: FONTS.bodyBold,
        letterSpacing: 0.4,
    },
    collectionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    collectionCard: {
        flex: 1,
        height: 170,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
        ...collectionShadow,
    },
    collectionImage: {
        resizeMode: 'cover',
    },
    collectionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 10, 60, 0.45)',
    },
    collectionTextWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    collectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.title,
        textAlign: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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