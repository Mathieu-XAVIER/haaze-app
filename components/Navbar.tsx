import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SvgUri } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { COLORS, FONTS } from '../styles/theme';

const ICONS = {
    Home: {
        active: require('../assets/navigation/home-bleu.svg'),
        inactive: require('../assets/navigation/home-blanc.svg'),
    },
    Missions: {
        active: require('../assets/navigation/mission-bleu.svg'),
        inactive: require('../assets/navigation/mission-blanc.svg'),
    },
    Collection: {
        active: require('../assets/navigation/collection-bleu.svg'),
        inactive: require('../assets/navigation/collection-blanc.svg'),
    },
    Profil: {
        active: require('../assets/navigation/profil-bleu.svg'),
        inactive: require('../assets/navigation/profil-blanc.svg'),
    },
};

// Paths SVG pour les différentes formes concaves selon l'onglet actif
// Structure basée sur le path Home mais avec la courbe décalée selon la position de l'ellipse
// Home: ellipse x=2.75, centre à x=58.75, courbe de 2.75 à 114.75
// Missions: ellipse x=94.75, centre à x=150.75, courbe de 94.75 à 206.75
// Collection: ellipse x=185.75, centre à x=241.75, courbe de 185.75 à 297.75
// Profil: ellipse x=276.75, centre à x=332.75, courbe de 276.75 à 388.75
const SUBTRACT_PATHS = {
    // Home : courbe à gauche (2.75 -> 114.75)
    Home: 'M393 60H0V0H2.75C30.75 0 20.75 49.9687 58.75 50C96.75 49.9687 88.75 0 114.75 0H393V60Z',
    // Missions : courbe centrée (94.75 -> 206.75)
    Missions: 'M393 60H0V0H94.75C122.75 0 112.75 49.9687 150.75 50C188.75 49.9687 178.75 0 206.75 0H393V60Z',
    // Collection : courbe au centre-droite (185.75 -> 297.75)
    Collection: 'M393 60H0V0H185.75C213.75 0 203.75 49.9687 241.75 50C279.75 49.9687 269.75 0 297.75 0H393V60Z',
    // Profil : courbe à droite (276.75 -> 388.75)
    Profil: 'M393 60H0V0H276.75C304.75 0 294.75 49.9687 332.75 50C370.75 49.9687 360.75 0 388.75 0H393V60Z',
};

const resolveIconUri = (source: any) => {
    if (!source) return undefined;
    try {
        const asset = Asset.fromModule(source);
        if (!asset.downloading && !asset.downloaded) {
            asset.downloadAsync?.();
        }
        return asset.uri;
    } catch {
        return undefined;
    }
};

/**
 * Type pour les onglets de la navbar
 */
export type NavbarTab = 'Home' | 'Missions' | 'Collection' | 'Profil';

/**
 * Props du composant Navbar
 * 
 * @param activeTab - L'onglet actuellement actif ('Home' | 'Missions' | 'Collection' | 'Profil')
 * @param onHomePress - Callback appelé lors du clic sur l'onglet Home
 * @param onMissionsPress - Callback appelé lors du clic sur l'onglet Missions
 * @param onCollectionPress - Callback appelé lors du clic sur l'onglet Collection
 * @param onProfilPress - Callback appelé lors du clic sur l'onglet Profil
 */
type NavbarProps = {
    activeTab: NavbarTab;
    onHomePress: () => void;
    onMissionsPress: () => void;
    onCollectionPress: () => void;
    onProfilPress: () => void;
};

export default function Navbar({ activeTab, onHomePress, onMissionsPress, onCollectionPress, onProfilPress }: NavbarProps) {
    const isHomeActive = activeTab === 'Home';
    const isMissionsActive = activeTab === 'Missions';
    const isCollectionActive = activeTab === 'Collection';
    const isProfilActive = activeTab === 'Profil';

    // Utiliser useMemo pour recalculer les icônes quand activeTab change
    const iconUris = useMemo(() => {
        return {
            homeActive: resolveIconUri(ICONS.Home.active),
            homeInactive: resolveIconUri(ICONS.Home.inactive),
            missionsActive: resolveIconUri(ICONS.Missions.active),
            missionsInactive: resolveIconUri(ICONS.Missions.inactive),
            collectionActive: resolveIconUri(ICONS.Collection.active),
            collectionInactive: resolveIconUri(ICONS.Collection.inactive),
            profilActive: resolveIconUri(ICONS.Profil.active),
            profilInactive: resolveIconUri(ICONS.Profil.inactive),
        };
    }, []);

    // Positions selon l'onglet actif - espacement uniforme de 92px entre les centres
    // Largeur bouton actif: 44px, donc centre = left + 22
    // Home centre: 58.75, Missions: 150.75, Collection: 241.75, Profil: 332.75
    const activeButtonPositions = {
        Home: { left: 36.75, top: -4 },      // centre: 58.75
        Missions: { left: 128.75, top: -4 }, // centre: 150.75 (espacement: 92)
        Collection: { left: 219.75, top: -4 }, // centre: 241.75 (espacement: 91)
        Profil: { left: 310.75, top: -4 },   // centre: 332.75 (espacement: 91)
    };

    // Positions inactives - espacement uniforme de 92px entre les centres
    // Largeur bouton inactif: 60px, donc centre = left + 30
    // Pour avoir le même espacement que les actifs, je calcule à partir du centre
    const inactiveButtonPositions = {
        Home: { left: 28.75, top: 13 },      // centre: 58.75 (même que actif)
        Missions: { left: 120.75, top: 13 }, // centre: 150.75 (espacement: 92)
        Collection: { left: 211.75, top: 13 }, // centre: 241.75 (espacement: 91)
        Profil: { left: 302.75, top: 13 },  // centre: 332.75 (espacement: 91)
    };

    const activeIconPositions = {
        Home: { left: 0, top: 0, width: 20, height: 20 },
        Missions: { left: 0, top: 0, width: 17, height: 19 },
        Collection: { left: 0, top: 0, width: 20, height: 20 },
        Profil: { left: 0, top: 0, width: 28, height: 28 },
    };

    return (
        <View style={styles.container}>
            {/* Forme concave de la navbar */}
            <Svg key={`navbar-bg-${activeTab}`} width="100%" height={60} style={styles.backgroundSvg} viewBox="0 0 393 60" preserveAspectRatio="none">
                <Path d={SUBTRACT_PATHS[activeTab]} fill={COLORS.primaryBlue} />
            </Svg>

            {/* Élément Home */}
            <TouchableOpacity
                style={[
                    styles.button,
                    isHomeActive
                        ? { left: activeButtonPositions.Home.left, top: activeButtonPositions.Home.top }
                        : { left: inactiveButtonPositions.Home.left, top: inactiveButtonPositions.Home.top },
                    isHomeActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={onHomePress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isHomeActive }}
                accessibilityLabel="Home"
            >
                {isHomeActive ? (
                    <>
                        <View style={styles.ellipse} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.homeActive && (
                                <SvgUri key="home-active" uri={iconUris.homeActive} width={20} height={20} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.homeInactive && (
                                <SvgUri key="home-inactive" uri={iconUris.homeInactive} width={20} height={20} />
                            )}
                        </View>
                        <Text style={styles.label}>Accueil</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Élément Missions */}
            <TouchableOpacity
                style={[
                    styles.button,
                    isMissionsActive
                        ? { left: activeButtonPositions.Missions.left, top: activeButtonPositions.Missions.top }
                        : { left: inactiveButtonPositions.Missions.left, top: inactiveButtonPositions.Missions.top },
                    isMissionsActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={onMissionsPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isMissionsActive }}
                accessibilityLabel="Missions"
            >
                {isMissionsActive ? (
                    <>
                        <View style={styles.ellipse} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.missionsActive && (
                                <SvgUri key="missions-active" uri={iconUris.missionsActive} width={17} height={19} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.missionsInactive && (
                                <SvgUri key="missions-inactive" uri={iconUris.missionsInactive} width={17} height={19} />
                            )}
                        </View>
                        <Text style={styles.label}>Missions</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Élément Collection */}
            <TouchableOpacity
                style={[
                    styles.button,
                    isCollectionActive
                        ? { left: activeButtonPositions.Collection.left, top: activeButtonPositions.Collection.top }
                        : { left: inactiveButtonPositions.Collection.left, top: inactiveButtonPositions.Collection.top },
                    isCollectionActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={onCollectionPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isCollectionActive }}
                accessibilityLabel="Collection"
            >
                {isCollectionActive ? (
                    <>
                        <View style={styles.ellipse} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.collectionActive && (
                                <SvgUri key="collection-active" uri={iconUris.collectionActive} width={20} height={20} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.collectionInactive && (
                                <SvgUri key="collection-inactive" uri={iconUris.collectionInactive} width={20} height={20} />
                            )}
                        </View>
                        <Text style={styles.label}>Collection</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Élément Profil */}
            <TouchableOpacity
                style={[
                    styles.button,
                    isProfilActive
                        ? { left: activeButtonPositions.Profil.left, top: activeButtonPositions.Profil.top }
                        : { left: inactiveButtonPositions.Profil.left, top: inactiveButtonPositions.Profil.top },
                    isProfilActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={onProfilPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isProfilActive }}
                accessibilityLabel="Profil"
            >
                {isProfilActive ? (
                    <>
                        <View style={styles.ellipse} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.profilActive && (
                                <SvgUri key="profil-active" uri={iconUris.profilActive} width={28} height={28} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.profilInactive && (
                                <SvgUri key="profil-inactive" uri={iconUris.profilInactive} width={20} height={20} />
                            )}
                        </View>
                        <Text style={styles.label}>Profil</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        position: 'relative',
    },
    backgroundSvg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    activeButton: {
        width: 44,
        height: 44,
    },
    inactiveButton: {
        width: 60,
        height: 'auto',
    },
    ellipse: {
        position: 'absolute',
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#FFFFFF',
        top: -5,
        left: -5,
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                elevation: 4,
            },
        }),
    },
    activeIconContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    inactiveIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 11,
        fontFamily: FONTS.body,
        color: '#FFFFFF',
        letterSpacing: 0.55,
        textAlign: 'center',
    },
});
