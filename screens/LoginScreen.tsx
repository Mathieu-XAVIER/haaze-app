import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { COLORS, FONTS } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

const assets = {
    background: 'https://www.figma.com/api/mcp/asset/d07ad023-aab6-4798-b9b7-a6f663f31570',
    overlay: 'https://www.figma.com/api/mcp/asset/796bb468-d491-4563-b06e-295aa245774b',
    logo: 'https://www.figma.com/api/mcp/asset/81a888c9-eaa6-467f-a91d-ffc84c088506',
    logoText: 'https://www.figma.com/api/mcp/asset/9f6abe53-ca4e-42c3-b70e-5f3a36aece36',
    apple: 'https://www.figma.com/api/mcp/asset/503a17e1-9756-4619-a643-b66746dead95',
    google: 'https://www.figma.com/api/mcp/asset/319a5599-2cec-4f78-8976-31f510d176c7',
};

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = useCallback(async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Remplis tous les champs');
            return;
        }

        setLoading(true);

        try {
            const formBody = new URLSearchParams({ email, password }).toString();
            const response = await api.post('/login', formBody, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const token = response.data.token;

            await login(token);
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
    }, [email, password, login]);

    const SocialButton = React.memo<{
        label: string;
        iconUri: string;
        onPress?: () => void;
    }>(({ label, iconUri, onPress }) => (
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.9} onPress={onPress}>
            <Image source={{ uri: iconUri }} style={styles.socialIcon} />
            <Text style={styles.socialLabel}>{label}</Text>
        </TouchableOpacity>
    ));

    SocialButton.displayName = 'SocialButton';

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
            <ScrollView bounces={false} contentContainerStyle={styles.flex}>
                <ImageBackground source={{ uri: assets.background }} style={styles.background} resizeMode="cover">
                    <Image source={{ uri: assets.overlay }} style={styles.overlayImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.32)', 'rgba(255,255,255,0.78)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.gradient}
                    />

                    <View style={styles.content}>
                        <View style={styles.logoStack}>
                            <Image source={{ uri: assets.logo }} style={styles.logoMark} />
                            <Image source={{ uri: assets.logoText }} style={styles.logoText} />
                        </View>

                        <Text style={styles.heroTitle}>JE SUIS LE SLOGAN SUR{'\n'}DEUX LIGNES</Text>

                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Adresse mail"
                                placeholderTextColor="rgba(30,30,30,0.5)"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Mot de passe"
                                placeholderTextColor="rgba(30,30,30,0.5)"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TouchableOpacity
                                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.92}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.primaryButtonText}>Se connecter</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.socialStack}>
                            <SocialButton label="Continuer avec Apple" iconUri={assets.apple} />
                            <SocialButton label="Continuer avec Google" iconUri={assets.google} />
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    overlayImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 36,
        justifyContent: 'flex-end',
        gap: 28,
    },
    logoStack: {
        alignItems: 'center',
        gap: 8,
    },
    logoMark: {
        width: 80,
        height: 86,
        resizeMode: 'contain',
    },
    logoText: {
        width: 110,
        height: 18,
        resizeMode: 'contain',
    },
    heroTitle: {
        fontFamily: FONTS.title,
        fontSize: 24,
        color: '#1e1e1e',
        textAlign: 'center',
        letterSpacing: 0,
        textTransform: 'uppercase',
        lineHeight: 24,
    },
    form: {
        gap: 20,
        width: '100%',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#1e1e1e',
        paddingVertical: 10,
        fontFamily: FONTS.body,
        fontSize: 16,
        color: '#1e1e1e',
    },
    primaryButton: {
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlue,
        borderWidth: 1,
        borderColor: COLORS.primaryBlue,
    },
    primaryButtonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    socialStack: {
        gap: 12,
        width: '100%',
    },
    socialButton: {
        height: 50,
        borderRadius: 8,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    socialIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    socialLabel: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
        color: '#1e1e1e',
        letterSpacing: 0.6,
    },
});
