import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

// Utilitaire pour la persistance web/mobile
const storage = typeof window !== 'undefined' && window.localStorage
  ? {
      get: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
      set: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),
      remove: (key: string) => Promise.resolve(window.localStorage.removeItem(key)),
    }
  : require('@react-native-async-storage/async-storage');

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Vérifier la session au lancement
  useEffect(() => {
    storage.get('haaze_logged_in').then((val: any) => {
      setIsLoggedIn(val === 'true');
    });
  }, []);

  // Fonction de login
  const handleLogin = () => {
    setIsLoggedIn(true);
    storage.set('haaze_logged_in', 'true');
  };

  // Fonction de logout (optionnel)
  const handleLogout = () => {
    setIsLoggedIn(false);
    storage.remove('haaze_logged_in');
  };

  if (isLoggedIn === null) return null; // ou un splash screen

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
