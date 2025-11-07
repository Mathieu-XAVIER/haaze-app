import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MissionsScreen from '../screens/MissionsScreen';
import ScanScreen from '../screens/ScanScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#000000', borderTopWidth: 0 },
                tabBarActiveTintColor: '#3300FD',
                tabBarInactiveTintColor: '#FF3600',
                tabBarLabelStyle: {
                    fontFamily: 'Minasans',
                    fontWeight: 'bold',
                    fontSize: 13,
                },
                tabBarIcon: ({ color, size }) => {
                    const icons: any = {
                        Home: 'home',
                        Missions: 'flag',
                        Scan: 'scan',
                        Collection: 'albums',
                        Profil: 'person',
                    };
                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Missions" component={MissionsScreen} />
            {/*<Tab.Screen name="Scan" component={ScanScreen} />*/}
            <Tab.Screen name="Collection" component={CollectionScreen} />
            <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
