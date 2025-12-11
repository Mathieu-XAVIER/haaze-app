import React from 'react';
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

const HaazeTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 10);
    
    // Récupérer l'onglet actif de manière plus fiable
    const activeRoute = state.routes[state.index];
    const currentTab = (activeRoute?.name || 'Home') as NavbarTab;

    const handlePress = (routeName: NavbarTab) => {
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
    };

    return (
        <View style={[styles.tabWrapper, { paddingBottom: bottomPadding }]}>
            {/* Fond qui s'étend sous la navbar pour combler l'espace vide */}
            <View style={[styles.backgroundExtension, { height: bottomPadding }]} />
            <Navbar
                activeTab={currentTab}
                onHomePress={() => handlePress('Home')}
                onMissionsPress={() => handlePress('Missions')}
                onCollectionPress={() => handlePress('Collection')}
                onProfilPress={() => handlePress('Profil')}
            />
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