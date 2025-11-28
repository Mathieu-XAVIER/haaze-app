import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Text,
    ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Remplis tous les champs');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            const token = response.data.token;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('haaze_logged_in', 'true');

            onLogin(); // bascule vers Main
        } catch (error: any) {
            console.error('[Login]', error?.response?.data || error);
            const apiMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (error?.message === 'Network Error'
                    ? "Serveur injoignable. Vérifie l'URL de ton API Laravel."
                    : null);
            Alert.alert('Erreur de connexion', apiMessage || 'Email ou mot de passe invalide');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#3300FD" />
            ) : (
                <Button title="Se connecter" onPress={handleLogin} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
});
