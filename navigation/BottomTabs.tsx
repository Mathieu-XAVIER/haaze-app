import React, { useCallback } from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import MissionsScreen from '../screens/MissionsScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Navbar, { NavbarTab } from '../components/Navbar';
import { COLORS } from '../styles/theme';

const Tab = createBottomTabNavigator();

type Props = {
    onLogout: () => void;
};

const HaazeTabBar = React.memo<BottomTabBarProps>(({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 10);

    // Récupérer l'onglet actif de manière plus fiable
    const activeRoute = state.routes[state.index];
    const currentTab = (activeRoute?.name || 'Home') as NavbarTab;

    const handlePress = useCallback((routeName: NavbarTab) => {
        const targetRoute = state.routes.find(r => r.name === routeName);
        if (!targetRoute) return;

        const event = navigation.emit({
            type: 'tabPress',
            target: targetRoute.key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.navigate(routeName);
        }
    }, [state.routes, navigation]);

    const handleHomePress = useCallback(() => handlePress('Home'), [handlePress]);
    const handleMissionsPress = useCallback(() => handlePress('Missions'), [handlePress]);
    const handleCollectionPress = useCallback(() => handlePress('Collection'), [handlePress]);
    const handleProfilPress = useCallback(() => handlePress('Profil'), [handlePress]);

    return (
        <View style={[styles.tabWrapper, { paddingBottom: bottomPadding }]}>
            {/* Fond qui s'étend sous la navbar pour combler l'espace vide */}
            <View style={[styles.backgroundExtension, { height: bottomPadding }]} />
            <Navbar
                activeTab={currentTab}
                onHomePress={handleHomePress}
                onMissionsPress={handleMissionsPress}
                onCollectionPress={handleCollectionPress}
                onProfilPress={handleProfilPress}
            />
        </View>
    );
});

HaazeTabBar.displayName = 'HaazeTabBar';

const BottomTabs = React.memo<Props>(({ onLogout }) => {
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
});

BottomTabs.displayName = 'BottomTabs';

export default BottomTabs;

const styles = StyleSheet.create({
    tabWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 0,
        width: '100%',
        alignItems: 'center',
    },
    backgroundExtension: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.primaryBlue,
        width: '100%',
    },
});