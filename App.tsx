import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('haaze_logged_in').then((val) => {
            setIsLoggedIn(val === 'true');
        });
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        AsyncStorage.setItem('haaze_logged_in', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        AsyncStorage.removeItem('haaze_logged_in');
    };

    if (isLoggedIn === null) return null; // splash screen optionnel

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isLoggedIn ? (
                    <Stack.Screen name="Login">
                        {props => <LoginScreen {...props} onLogin={handleLogin} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Main">
                        {props => <BottomTabs {...props} onLogout={handleLogout} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}