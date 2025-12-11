import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SvgUri } from 'react-native-svg';
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
 * 
 * @example
 * ```tsx
 * <Navbar
 *   activeTab="Home"
 *   onHomePress={() => navigation.navigate('Home')}
 *   onMissionsPress={() => navigation.navigate('Missions')}
 *   onCollectionPress={() => navigation.navigate('Collection')}
 *   onProfilPress={() => navigation.navigate('Profil')}
 * />
 * ```
 */
type NavbarProps = {
    activeTab: NavbarTab;
    onHomePress: () => void;
    onMissionsPress: () => void;
    onCollectionPress: () => void;
    onProfilPress: () => void;
};

type TabItem = {
    id: NavbarTab;
    label: string;
    onPress: () => void;
};

export default function Navbar({ activeTab, onHomePress, onMissionsPress, onCollectionPress, onProfilPress }: NavbarProps) {
    const tabs: TabItem[] = [
        {
            id: 'Home',
            label: 'Accueil',
            onPress: onHomePress,
        },
        {
            id: 'Missions',
            label: 'Missions',
            onPress: onMissionsPress,
        },
        {
            id: 'Collection',
            label: 'Collection',
            onPress: onCollectionPress,
        },
        {
            id: 'Profil',
            label: 'Profil',
            onPress: onProfilPress,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.background} />
            <View style={styles.tabsContainer}>
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const isHome = tab.id === 'Home';
                    const iconSet = ICONS[tab.id];
                    const iconUri = iconSet ? resolveIconUri(isActive ? iconSet.active : iconSet.inactive) : undefined;

                    // Dimensions des icônes selon le type
                    const iconWidth = tab.id === 'Missions' ? 17 : 20;
                    const iconHeight = tab.id === 'Missions' ? 19 : 20;

                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tab, isActive && styles.tabActive, isHome && styles.homeTab]}
                            onPress={tab.onPress}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isActive }}
                            accessibilityLabel={tab.label}
                        >
                            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                                {isActive ? (
                                    <View style={styles.activeIconWrapper}>
                                        <View style={styles.ellipse} />
                                        <View style={styles.iconInner}>
                                            {iconUri && <SvgUri uri={iconUri} width={iconWidth} height={iconHeight} />}
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.inactiveIconWrapper}>
                                        {iconUri && <SvgUri uri={iconUri} width={iconWidth} height={iconHeight} />}
                                    </View>
                                )}
                            </View>
                            {!isActive && (
                                <Text style={styles.label} numberOfLines={1}>
                                    {tab.label}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primaryBlue,
        width: '100%',
        height: '100%',
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        height: '100%',
        paddingHorizontal: 39,
        paddingTop: 13,
        position: 'relative',
        zIndex: 1,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    tabActive: {
        marginTop: -4,
    },
    homeTab: {
        // Style spécifique pour Home si nécessaire
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    iconContainerActive: {
        marginBottom: 0,
    },
    activeIconWrapper: {
        width: 44,
        height: 44,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inactiveIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ellipse: {
        position: 'absolute',
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#ffffff',
        top: -9,
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
    iconInner: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        position: 'relative',
    },
    label: {
        fontSize: 11,
        fontFamily: FONTS.body,
        color: '#ffffff',
        letterSpacing: 0.55,
        marginTop: 2,
        textAlign: 'center',
    },
});

