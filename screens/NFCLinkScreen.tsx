import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../styles/theme';
import { scanNfcForOrder, checkNfcStatus } from '../services/api';

// Import conditionnel de NFC Manager
let NfcManager: any = null;
let NfcTech: any = null;

try {
    const nfcModule = require('react-native-nfc-manager');
    NfcManager = nfcModule.default;
    NfcTech = nfcModule.NfcTech;
} catch (error) {
    console.log('[NFC] Module NFC non disponible (Expo Go)');
}

type RouteParams = {
    NFCLink: {
        orderId: number;
        orderNumber: string;
        clothingId: number;
        clothingName: string;
    };
};

type NavigationProp = NativeStackNavigationProp<{
    NFCLink: RouteParams['NFCLink'];
    OrderDetail: { orderId: number; orderNumber: string };
}>;

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export default function NFCLinkScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp<RouteParams, 'NFCLink'>>();
    const { orderId, orderNumber, clothingId, clothingName } = route.params;

    const [status, setStatus] = useState<ScanStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Animation des ondes
    const wave1 = useRef(new Animated.Value(0)).current;
    const wave2 = useRef(new Animated.Value(0)).current;
    const wave3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Initialiser NFC si disponible
        if (NfcManager) {
            NfcManager.start().catch((err: any) => {
                console.log('[NFC] Erreur d\'initialisation:', err);
            });
        }

        return () => {
            if (NfcManager) {
                NfcManager.cancelTechnologyRequest().catch(() => {});
            }
        };
    }, []);

    useEffect(() => {
        if (status === 'scanning') {
            startWaveAnimation();
        } else {
            wave1.setValue(0);
            wave2.setValue(0);
            wave3.setValue(0);
        }
    }, [status]);

    const startWaveAnimation = () => {
        const createWaveAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        Animated.parallel([
            createWaveAnimation(wave1, 0),
            createWaveAnimation(wave2, 400),
            createWaveAnimation(wave3, 800),
        ]).start();
    };

    const handleNfcTag = async (nfcId: string) => {
        try {
            // Vérifier d'abord si le tag est déjà lié
            const nfcStatus = await checkNfcStatus(nfcId);
            if (nfcStatus.isLinked) {
                setStatus('error');
                setErrorMessage('Ce tag NFC est déjà lié à un autre vêtement');
                return;
            }

            // Lier le vêtement
            const result = await scanNfcForOrder(orderId, clothingId, nfcId);

            if (result.success) {
                setStatus('success');
                setSuccessMessage(result.message || `${clothingName} lié avec succès !`);
                
                // Retourner automatiquement après 2 secondes
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            } else {
                setStatus('error');
                setErrorMessage(result.message);
            }
        } catch (error: any) {
            console.error('[NFCLink] Erreur:', error);
            setStatus('error');
            setErrorMessage('Une erreur est survenue lors de la liaison');
        }
    };

    const startScan = async () => {
        setStatus('scanning');
        setErrorMessage('');

        // Si NFC Manager n'est pas disponible (Expo Go)
        if (!NfcManager) {
            // Simuler pour le développement
            setTimeout(async () => {
                const simulatedNfcId = `NFC-SIM-${Date.now()}`;
                await handleNfcTag(simulatedNfcId);
            }, 2000);
            return;
        }

        try {
            // Vérifier si NFC est disponible
            const isSupported = await NfcManager.isSupported();
            if (!isSupported) {
                setStatus('error');
                setErrorMessage('Votre appareil ne supporte pas le NFC ou il est désactivé.');
                return;
            }

            // Sur iOS
            if (Platform.OS === 'ios') {
                await handleiOSScan();
            } else {
                // Sur Android
                await handleAndroidScan();
            }
        } catch (error: any) {
            console.error('[NFCLink] Erreur lors du scan:', error);
            
            if (error.message?.includes('User canceled') || error.message?.includes('cancelled')) {
                setStatus('idle');
                return;
            }

            setStatus('error');
            setErrorMessage('Impossible de scanner la puce NFC. Veuillez réessayer.');
        } finally {
            try {
                if (NfcManager) {
                    await NfcManager.cancelTechnologyRequest();
                }
            } catch (e) {
                // Ignorer
            }
        }
    };

    const handleiOSScan = async () => {
        return new Promise<void>((resolve, reject) => {
            let tagDetected = false;
            const timeoutId = setTimeout(() => {
                if (!tagDetected) {
                    NfcManager.cancelTechnologyRequest().catch(() => {});
                    setStatus('error');
                    setErrorMessage('Aucun tag NFC détecté. Veuillez réessayer.');
                    reject(new Error('Timeout'));
                }
            }, 30000);

            NfcManager.setEventListener('DiscoverTag', async (tag: any) => {
                if (tag && !tagDetected) {
                    tagDetected = true;
                    clearTimeout(timeoutId);

                    let nfcId = tag.id || tag.identifier || '';
                    if (Array.isArray(nfcId)) {
                        nfcId = nfcId.map((b: number) => b.toString(16).padStart(2, '0')).join(':');
                    }

                    if (nfcId) {
                        await handleNfcTag(nfcId);
                        resolve();
                    } else {
                        setStatus('error');
                        setErrorMessage('Impossible de lire l\'identifiant NFC');
                        reject(new Error('No NFC ID'));
                    }
                }
            });

            NfcManager.registerTagEvent()
                .catch((err: any) => {
                    clearTimeout(timeoutId);
                    reject(err);
                });
        });
    };

    const handleAndroidScan = async () => {
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();
        
        let nfcId = tag?.id || '';
        if (Array.isArray(nfcId)) {
            nfcId = nfcId.map((b: number) => b.toString(16).padStart(2, '0')).join(':');
        }

        if (!nfcId) {
            setStatus('error');
            setErrorMessage('Impossible de lire l\'identifiant NFC');
            return;
        }

        await handleNfcTag(nfcId);
    };

    const handleRetry = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    const renderWave = (animatedValue: Animated.Value, size: number) => {
        const scale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2.5],
        });
        const opacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
        });

        return (
            <Animated.View
                style={[
                    styles.wave,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.clothingName}>{clothingName}</Text>
                <Text style={styles.orderInfo}>Commande {orderNumber}</Text>

                <View style={styles.scanArea}>
                    {status === 'scanning' && (
                        <View style={styles.wavesContainer}>
                            {renderWave(wave1, 120)}
                            {renderWave(wave2, 120)}
                            {renderWave(wave3, 120)}
                        </View>
                    )}

                    <View
                        style={[
                            styles.iconContainer,
                            status === 'success' && styles.iconContainerSuccess,
                            status === 'error' && styles.iconContainerError,
                        ]}
                    >
                        {status === 'idle' && (
                            <Ionicons name="wifi" size={64} color={COLORS.primaryBlue} />
                        )}
                        {status === 'scanning' && (
                            <ActivityIndicator size="large" color={COLORS.primaryBlue} />
                        )}
                        {status === 'success' && (
                            <Ionicons name="checkmark" size={64} color="#fff" />
                        )}
                        {status === 'error' && (
                            <Ionicons name="alert" size={64} color="#fff" />
                        )}
                    </View>
                </View>

                {status === 'idle' && (
                    <>
                        <Text style={styles.instruction}>
                            Approchez le tag NFC de votre vêtement
                        </Text>
                        <Text style={styles.subInstruction}>
                            Placez le haut de votre téléphone sur l'étiquette NFC du vêtement
                        </Text>

                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={startScan}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="scan" size={24} color="#fff" />
                            <Text style={styles.scanButtonText}>Démarrer le scan</Text>
                        </TouchableOpacity>
                    </>
                )}

                {status === 'scanning' && (
                    <>
                        <Text style={styles.instruction}>Recherche du tag NFC...</Text>
                        <Text style={styles.subInstruction}>
                            Maintenez votre téléphone proche de l'étiquette NFC
                        </Text>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setStatus('idle');
                                if (NfcManager) {
                                    NfcManager.cancelTechnologyRequest().catch(() => {});
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <Text style={styles.successTitle}>Vêtement lié !</Text>
                        <Text style={styles.successMessage}>{successMessage}</Text>
                        <Text style={styles.redirectMessage}>
                            Retour automatique dans quelques secondes...
                        </Text>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <Text style={styles.errorTitle}>Erreur</Text>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRetry}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="refresh" size={20} color="#fff" />
                            <Text style={styles.retryButtonText}>Réessayer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backLinkButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backLinkText}>Retour à la commande</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {!NfcManager && status === 'idle' && (
                <View style={styles.devWarning}>
                    <Ionicons name="information-circle" size={20} color="#D97706" />
                    <Text style={styles.devWarningText}>
                        Mode développement : Le NFC sera simulé (Expo Go)
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
        alignItems: 'flex-end',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 3,
            },
        }),
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    clothingName: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 8,
    },
    orderInfo: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: '#666',
        marginBottom: 50,
    },
    scanArea: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    wavesContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wave: {
        position: 'absolute',
        borderWidth: 3,
        borderColor: COLORS.primaryBlue,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E4FF',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    iconContainerSuccess: {
        backgroundColor: '#22C55E',
    },
    iconContainerError: {
        backgroundColor: '#EF4444',
    },
    instruction: {
        fontSize: 20,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 12,
    },
    subInstruction: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 8,
        gap: 12,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: FONTS.bodyBold,
    },
    cancelButton: {
        paddingVertical: 16,
        paddingHorizontal: 40,
    },
    cancelButtonText: {
        color: COLORS.primaryBlue,
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
    successTitle: {
        fontSize: 28,
        fontFamily: FONTS.title,
        color: '#22C55E',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 16,
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 16,
    },
    redirectMessage: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: '#666',
        fontStyle: 'italic',
    },
    errorTitle: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: '#EF4444',
        marginBottom: 12,
    },
    errorMessage: {
        fontSize: 16,
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 8,
        gap: 10,
        marginBottom: 16,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
    backLinkButton: {
        paddingVertical: 12,
    },
    backLinkText: {
        color: COLORS.primaryBlue,
        fontSize: 14,
        fontFamily: FONTS.body,
        textDecorationLine: 'underline',
    },
    devWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF3C7',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 8,
        gap: 8,
    },
    devWarningText: {
        fontSize: 12,
        fontFamily: FONTS.body,
        color: '#D97706',
    },
});
