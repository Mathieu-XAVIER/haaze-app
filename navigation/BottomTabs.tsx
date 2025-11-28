import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';

import HomeScreen from '../screens/HomeScreen';
import MissionsScreen from '../screens/MissionsScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, FONTS } from '../styles/theme';

const Tab = createBottomTabNavigator();

type Props = {
    onLogout: () => void;
};

const ICONS: Record<
    string,
    {
        active: any;
        inactive: any;
    }
> = {
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
            // fire and forget to ensure availability on native
            asset.downloadAsync?.();
        }
        return asset.uri;
    } catch {
        return undefined;
    }
};

const HaazeTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.tabWrapper}>
            <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 0) }]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                              ? options.title
                              : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const iconSet = ICONS[route.name];
                    const iconUri = iconSet ? resolveIconUri(isFocused ? iconSet.active : iconSet.inactive) : undefined;

                    const isHome = route.name === 'Home';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[styles.tabButton, isHome && styles.homeTabButton]}
                            activeOpacity={0.92}
                        >
                            <View
                                style={[
                                    styles.iconWrapper,
                                    isFocused && styles.iconWrapperActive,
                                    isHome && styles.homeIconWrapper,
                                    isHome && isFocused && styles.homeIconWrapperActive,
                                ]}
                            >
                                {iconUri ? (
                                    <SvgUri width={isHome ? 32 : 24} height={isHome ? 32 : 24} uri={iconUri} />
                                ) : (
                                    <Text style={styles.fallbackIcon}>{label?.toString().charAt(0)}</Text>
                                )}
                            </View>
                            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default function BottomTabs({ onLogout }: Props) {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <HaazeTabBar {...props} />}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Missions" component={MissionsScreen} />
            <Tab.Screen name="Collection" component={CollectionScreen} />
            <Tab.Screen name="Profil">
                {props => <ProfileScreen {...props} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 0,
        backgroundColor: COLORS.primaryBlue,
        width: '100%',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.primaryBlue,
        paddingTop: 6,
        paddingBottom: 6,
        paddingHorizontal: Platform.OS === 'ios' ? 12 : 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1.5,
        borderColor: '#4D25FF',
        width: '100%',
        minHeight: 52,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 2,
    },
    homeTabButton: {
        marginTop: 0,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    iconWrapperActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    homeIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        borderColor: '#fff',
        marginTop: 0,
        marginBottom: 2,
        shadowColor: '#fff',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    homeIconWrapperActive: {
        elevation: 10,
    },
    tabLabel: {
        fontSize: Platform.OS === 'ios' ? 10 : 9,
        textTransform: 'uppercase',
        color: '#E0D5FF',
        fontFamily: FONTS.bodyBold,
        letterSpacing: 0.8,
        marginTop: 2,
    },
    tabLabelActive: {
        color: '#fff',
    },
    fallbackIcon: {
        color: COLORS.primaryBlue,
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
    },
});