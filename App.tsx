import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import ScanScreen from './screens/ScanScreen';
import AddClothingScreen from './screens/AddClothingScreen';
import OrdersScreen from './screens/OrdersScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import NFCLinkScreen from './screens/NFCLinkScreen';
import { useAppFonts } from './hooks/useAppFonts';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Scan: { numeroCommande: string };
    AddClothing: undefined;
    Orders: undefined;
    OrderDetail: { orderId: number; orderNumber: string };
    NFCLink: { orderId: number; orderNumber: string; clothingId: number; clothingName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    const { isAuthenticated, logout, loading: authLoading } = useAuth();
    const { fontsLoaded, fontError } = useAppFonts();

    React.useEffect(() => {
        if (fontError) {
            console.warn('[Fonts] Failed to load custom fonts', fontError);
        }
    }, [fontError]);

    const handleLogout = useCallback(async () => {
        await logout();
    }, [logout]);

    if (!fontsLoaded || authLoading) return null; // splash screen optionnel

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Main">
                            {props => <BottomTabs {...props} onLogout={handleLogout} />}
                        </Stack.Screen>

                        <Stack.Screen name="Scan" component={ScanScreen} />
                        <Stack.Screen name="AddClothing" component={AddClothingScreen} />
                        <Stack.Screen name="Orders" component={OrdersScreen} />
                        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
                        <Stack.Screen
                            name="NFCLink"
                            component={NFCLinkScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AppNavigator />
            </AuthProvider>
        </ErrorBoundary>
    );
}