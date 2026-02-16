import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
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

const SUBTRACT_PATHS = {
    Home: 'M393 60H0V0H2.75C30.75 0 20.75 49.9687 58.75 50C96.75 49.9687 88.75 0 114.75 0H393V60Z',
    Missions: 'M393 60H0V0H94.75C122.75 0 112.75 49.9687 150.75 50C188.75 49.9687 178.75 0 206.75 0H393V60Z',
    Collection: 'M393 60H0V0H185.75C213.75 0 203.75 49.9687 241.75 50C279.75 49.9687 269.75 0 297.75 0H393V60Z',
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

export type NavbarTab = 'Home' | 'Missions' | 'Collection' | 'Profil';

type NavbarProps = {
    activeTab: NavbarTab;
    onHomePress: () => void;
    onMissionsPress: () => void;
    onCollectionPress: () => void;
    onProfilPress: () => void;
};

const Navbar = React.memo<NavbarProps>(({ activeTab, onHomePress, onMissionsPress, onCollectionPress, onProfilPress }) => {
    const { width } = useWindowDimensions();
    const isHomeActive = activeTab === 'Home';
    const isMissionsActive = activeTab === 'Missions';
    const isCollectionActive = activeTab === 'Collection';
    const isProfilActive = activeTab === 'Profil';

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

    const baseWidth = 393;
    const scale = width / baseWidth;
    
    const buttonCenters = {
        Home: width * 0.15,
        Missions: width * 0.38,
        Collection: width * 0.62,
        Profil: width * 0.85,
    };

    const activeButtonWidth = 44 * scale;
    const activeButtonPositions = {
        Home: { left: buttonCenters.Home - activeButtonWidth / 2, top: -4 * scale },
        Missions: { left: buttonCenters.Missions - activeButtonWidth / 2, top: -4 * scale },
        Collection: { left: buttonCenters.Collection - activeButtonWidth / 2, top: -4 * scale },
        Profil: { left: buttonCenters.Profil - activeButtonWidth / 2, top: -4 * scale },
    };

    const inactiveButtonWidth = 60 * scale;
    const inactiveButtonPositions = {
        Home: { left: buttonCenters.Home - inactiveButtonWidth / 2, top: 13 * scale },
        Missions: { left: buttonCenters.Missions - inactiveButtonWidth / 2, top: 13 * scale },
        Collection: { left: buttonCenters.Collection - inactiveButtonWidth / 2, top: 13 * scale },
        Profil: { left: buttonCenters.Profil - inactiveButtonWidth / 2, top: 13 * scale },
    };

    const navbarHeight = 60;

    return (
        <View style={styles.container}>
            <Svg key={`navbar-bg-${activeTab}`} width="100%" height={navbarHeight} style={styles.backgroundSvg} viewBox="0 0 393 60" preserveAspectRatio="none">
                <Path d={SUBTRACT_PATHS[activeTab]} fill={COLORS.primaryBlue} />
            </Svg>

            <TouchableOpacity
                style={[
                    styles.button,
                    isHomeActive
                        ? { 
                            left: activeButtonPositions.Home.left, 
                            top: activeButtonPositions.Home.top,
                            width: activeButtonWidth,
                            height: activeButtonWidth,
                        }
                        : { 
                            left: inactiveButtonPositions.Home.left, 
                            top: inactiveButtonPositions.Home.top,
                            width: inactiveButtonWidth,
                            height: 'auto',
                        },
                ]}
                onPress={onHomePress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isHomeActive }}
                accessibilityLabel="Home"
            >
                {isHomeActive ? (
                    <>
                        <View style={[styles.ellipse, { width: 54 * scale, height: 54 * scale, borderRadius: 27 * scale }]} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.homeActive && (
                                <SvgUri key="home-active" uri={iconUris.homeActive} width={20 * scale} height={20 * scale} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.homeInactive && (
                                <SvgUri key="home-inactive" uri={iconUris.homeInactive} width={20 * scale} height={20 * scale} />
                            )}
                        </View>
                        <Text style={[styles.label, { fontSize: 11 * scale }]}>Accueil</Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    isMissionsActive
                        ? { 
                            left: activeButtonPositions.Missions.left, 
                            top: activeButtonPositions.Missions.top,
                            width: activeButtonWidth,
                            height: activeButtonWidth,
                        }
                        : { 
                            left: inactiveButtonPositions.Missions.left, 
                            top: inactiveButtonPositions.Missions.top,
                            width: inactiveButtonWidth,
                            height: 'auto',
                        },
                ]}
                onPress={onMissionsPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isMissionsActive }}
                accessibilityLabel="Missions"
            >
                {isMissionsActive ? (
                    <>
                        <View style={[styles.ellipse, { width: 54 * scale, height: 54 * scale, borderRadius: 27 * scale }]} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.missionsActive && (
                                <SvgUri key="missions-active" uri={iconUris.missionsActive} width={17 * scale} height={19 * scale} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.missionsInactive && (
                                <SvgUri key="missions-inactive" uri={iconUris.missionsInactive} width={17 * scale} height={19 * scale} />
                            )}
                        </View>
                        <Text style={[styles.label, { fontSize: 11 * scale }]}>Missions</Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    isCollectionActive
                        ? { 
                            left: activeButtonPositions.Collection.left, 
                            top: activeButtonPositions.Collection.top,
                            width: activeButtonWidth,
                            height: activeButtonWidth,
                        }
                        : { 
                            left: inactiveButtonPositions.Collection.left, 
                            top: inactiveButtonPositions.Collection.top,
                            width: inactiveButtonWidth,
                            height: 'auto',
                        },
                ]}
                onPress={onCollectionPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isCollectionActive }}
                accessibilityLabel="Collection"
            >
                {isCollectionActive ? (
                    <>
                        <View style={[styles.ellipse, { width: 54 * scale, height: 54 * scale, borderRadius: 27 * scale }]} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.collectionActive && (
                                <SvgUri key="collection-active" uri={iconUris.collectionActive} width={20 * scale} height={20 * scale} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.collectionInactive && (
                                <SvgUri key="collection-inactive" uri={iconUris.collectionInactive} width={20 * scale} height={20 * scale} />
                            )}
                        </View>
                        <Text style={[styles.label, { fontSize: 11 * scale }]}>Collection</Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    isProfilActive
                        ? { 
                            left: activeButtonPositions.Profil.left, 
                            top: activeButtonPositions.Profil.top,
                            width: activeButtonWidth,
                            height: activeButtonWidth,
                        }
                        : { 
                            left: inactiveButtonPositions.Profil.left, 
                            top: inactiveButtonPositions.Profil.top,
                            width: inactiveButtonWidth,
                            height: 'auto',
                        },
                ]}
                onPress={onProfilPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isProfilActive }}
                accessibilityLabel="Profil"
            >
                {isProfilActive ? (
                    <>
                        <View style={[styles.ellipse, { width: 54 * scale, height: 54 * scale, borderRadius: 27 * scale }]} />
                        <View style={styles.activeIconContainer}>
                            {iconUris.profilActive && (
                                <SvgUri key="profil-active" uri={iconUris.profilActive} width={28 * scale} height={28 * scale} />
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inactiveIconContainer}>
                            {iconUris.profilInactive && (
                                <SvgUri key="profil-inactive" uri={iconUris.profilInactive} width={20 * scale} height={20 * scale} />
                            )}
                        </View>
                        <Text style={[styles.label, { fontSize: 11 * scale }]}>Profil</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;

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
    },
    inactiveButton: {
    },
    ellipse: {
        position: 'absolute',
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
        fontFamily: FONTS.body,
        color: '#FFFFFF',
        letterSpacing: 0.55,
        textAlign: 'center',
    },
});
