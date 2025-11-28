import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { COLORS, FONTS } from '../styles/theme';

type Mission = {
    id: string;
    title: string;
    progress: number;
    total: number;
    xp: number;
};

type Collection = {
    id: string;
    title: string;
    subtitle: string;
    image: ImageSourcePropType;
};

const missions: Mission[] = [
    { id: '1', title: 'Je suis la mission 1', progress: 1, total: 2, xp: 350 },
    { id: '2', title: 'Je suis la mission 2', progress: 1, total: 2, xp: 350 },
    { id: '3', title: 'Je suis la mission 3', progress: 1, total: 2, xp: 350 },
];

const collections: Collection[] = [
    { id: 'ol', title: 'HAAZE X OL', subtitle: 'COLLECTIONS À VENIR', image: require('../assets/badge-1.png') },
    {
        id: 'forever',
        title: 'HAAZE X FOREVER VACATION',
        subtitle: 'COLLECTIONS À VENIR',
        image: require('../assets/badge-2.png'),
    },
];

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

const BorderButton = ({
    children,
    onPress,
    variant = 'primary',
    hero = false,
}: {
    children: React.ReactNode;
    onPress?: () => void;
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
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
    );
};

const MissionCard = ({ mission }: { mission: Mission }) => {
    const ratio = mission.progress / mission.total;
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
};

const CollectionCard = ({ collection }: { collection: Collection }) => (
    <ImageBackground source={collection.image} style={styles.collectionCard} imageStyle={styles.collectionImage}>
        <View style={styles.collectionOverlay} />
        <View style={styles.collectionTextWrapper}>
            <Text style={styles.collectionTitle}>{collection.title}</Text>
        </View>
    </ImageBackground>
);

export default function HomeScreen() {
    const changeIconUri = changeOutfitIcon?.uri;

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
                    <Text style={styles.heroTitle}>Je suis le pseudo</Text>
                </View>
                <Image source={require('../assets/tshirt.png')} style={styles.heroImage} resizeMode="contain" />

                <View style={styles.skinLabelRow}>
                    <Text style={styles.skinLabel}>T-shirt HAAZE #1</Text>
                    {changeIconUri ? <SvgUri width={32} height={32} uri={changeIconUri} /> : null}
                </View>

                <View style={styles.heroProgressTrack}>
                    <View style={styles.heroProgressFill} />
                </View>
                <View style={styles.levelRow}>
                    <Text style={styles.levelLabel}>Lv. 1</Text>
                    <Text style={styles.levelLabel}>Lv. 2</Text>
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
            {missions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
            ))}
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
                {collections.map(collection => (
                    <CollectionCard key={collection.id} collection={collection} />
                ))}
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
        marginHorizontal: -20,
        paddingHorizontal: 20,
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
    heroImage: {
        width: '100%',
        height: 280,
        marginVertical: 20,
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
        color: '#5c5c5c',
        fontSize: 12,
        fontFamily: FONTS.body,
    },
    heroProgressTrack: {
        height: 6,
        backgroundColor: '#eae4ff',
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 8,
    },
    heroProgressFill: {
        width: '55%',
        backgroundColor: COLORS.primaryBlue,
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
        color: '#000',
        fontSize: 10,
        fontFamily: FONTS.bodyBold,
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
});