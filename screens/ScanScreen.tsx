import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { getOrderClothes, linkClothing, Clothing } from '../services/api';
import api from '../services/api';
import { COLORS, FONTS } from '../styles/theme';

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

// Définition du type des paramètres de navigation
interface ScanParams {
    numeroCommande: string;
}

export default function ScanScreen() {
    const route = useRoute<RouteProp<{ params: ScanParams }, 'params'>>();
    const navigation = useNavigation();
    const numeroCommande = route.params?.numeroCommande || '';

    const [vetements, setVetements] = useState<Clothing[]>([]);
    const [selected, setSelected] = useState<Clothing | null>(null);
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialiser NFC si disponible
        if (NfcManager) {
            NfcManager.start().catch((err: any) => {
                console.log('[NFC] Erreur d\'initialisation:', err);
            });
        }
        
        if (numeroCommande) {
            console.log('[Scan] Numéro de commande :', numeroCommande);
            fetchVetements();
        }
        
        return () => {
            if (NfcManager) {
                NfcManager.cancelTechnologyRequest().catch(() => {});
            }
        };
    }, [numeroCommande]);

    const fetchVetements = async () => {
        try {
            setLoading(true);
            const clothes = await getOrderClothes(numeroCommande);
            setVetements(clothes);
        } catch (err) {
            console.error('[API] Échec récupération vêtements', err);
            Alert.alert('Erreur', "Impossible de récupérer les vêtements");
        } finally {
            setLoading(false);
        }
    };

    const startScan = async () => {
        if (!selected) {
            Alert.alert('Erreur', 'Veuillez d\'abord sélectionner un vêtement');
            return;
        }

        // Si NFC Manager n'est pas disponible (Expo Go), utiliser la simulation
        if (!NfcManager) {
            Alert.alert(
                'NFC non disponible dans Expo Go',
                'Le scan NFC nécessite un development build. Pour tester le NFC réel, créez un build avec: eas build --profile development --platform ios\n\nVoulez-vous simuler la liaison pour le développement ?',
                [
                    {
                        text: 'Annuler',
                        style: 'cancel',
                    },
                    {
                        text: 'Simuler',
                        onPress: async () => {
                            try {
                                setScanning(true);
                                await linkClothing(selected.id, `NFC-DEV-${Date.now()}`);
                                Alert.alert(
                                    'Succès',
                                    'Vêtement lié avec succès (simulation) !',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                navigation.goBack();
                                            },
                                        },
                                    ]
                                );
                            } catch (err) {
                                Alert.alert('Erreur', 'Impossible de lier le vêtement');
                            } finally {
                                setScanning(false);
                            }
                        },
                    },
                ]
            );
            return;
        }

        try {
            setScanning(true);
            
            // Vérifier si NFC est disponible
            const isSupported = await NfcManager.isSupported();
            if (!isSupported) {
                Alert.alert(
                    'NFC non disponible',
                    'Votre appareil ne supporte pas le NFC ou il est désactivé.'
                );
                setScanning(false);
                return;
            }

            let nfcId = '';

            // Sur iOS, on utilise registerTagEvent
            if (Platform.OS === 'ios') {
                return new Promise<void>((resolve, reject) => {
                    let tagDetected = false;

                    const cleanup = () => {
                        NfcManager.setEventListener(null);
                        NfcManager.cancelTechnologyRequest().catch(() => {});
                        setScanning(false);
                    };

                    // Écouter les tags détectés
                    NfcManager.setEventListener((tag: any) => {
                        if (tag && !tagDetected) {
                            tagDetected = true;
                            // Sur iOS, l'ID peut être dans différentes propriétés
                            nfcId = tag.id || tag.identifier || '';
                            
                            if (nfcId) {
                                // Convertir l'ID en format string si c'est un array
                                if (Array.isArray(nfcId)) {
                                    nfcId = nfcId.map((b: number) => b.toString(16).padStart(2, '0')).join(':');
                                }
                                
                                linkClothing(selected.id, nfcId)
                                    .then(() => {
                                        cleanup();
                                        Alert.alert(
                                            'Succès',
                                            'Vêtement lié avec succès !',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => {
                                                        navigation.goBack();
                                                        resolve();
                                                    },
                                                },
                                            ]
                                        );
                                    })
                                    .catch((err) => {
                                        cleanup();
                                        Alert.alert('Erreur', 'Impossible de lier le vêtement');
                                        reject(err);
                                    });
                            } else {
                                cleanup();
                                Alert.alert('Erreur', 'Impossible de lire l\'identifiant NFC');
                                reject(new Error('No NFC ID'));
                            }
                        }
                    });

                    // Démarrer la session NFC sur iOS
                    NfcManager.start()
                        .then(() => {
                            Alert.alert(
                                'Prêt à scanner',
                                'Approchez le haut de votre iPhone du tag NFC',
                                [{ text: 'OK' }]
                            );
                        })
                        .catch((err) => {
                            cleanup();
                            Alert.alert('Erreur', 'Impossible de démarrer le scan NFC');
                            reject(err);
                        });

                    // Timeout après 30 secondes
                    setTimeout(() => {
                        if (!tagDetected) {
                            cleanup();
                            Alert.alert(
                                'Timeout',
                                'Aucun tag NFC détecté. Voulez-vous réessayer ?',
                                [
                                    { text: 'Annuler', style: 'cancel', onPress: () => reject(new Error('Timeout')) },
                                    { text: 'Réessayer', onPress: () => startScan() },
                                ]
                            );
                        }
                    }, 30000);
                });
            }

            // Android : utiliser requestTechnology
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // Lire le tag NFC
            const tag = await NfcManager.getTag();
            nfcId = tag?.id || '';

            if (!nfcId) {
                Alert.alert('Erreur', 'Impossible de lire l\'identifiant NFC');
                setScanning(false);
                return;
            }

            // Lier le vêtement au tag NFC
            await linkClothing(selected.id, nfcId);

            Alert.alert(
                'Succès',
                'Vêtement lié avec succès !',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.error('[ScanScreen] Erreur lors du scan NFC:', error);
            
            if (error.message?.includes('User canceled') || error.message?.includes('cancelled')) {
                // L'utilisateur a annulé, pas besoin d'afficher d'erreur
                setScanning(false);
                return;
            }

            // En cas d'erreur, proposer la simulation
            Alert.alert(
                'Erreur NFC',
                'Impossible de scanner la puce NFC. Voulez-vous simuler la liaison ?',
                [
                    {
                        text: 'Annuler',
                        style: 'cancel',
                        onPress: () => {
                            setScanning(false);
                        },
                    },
                    {
                        text: 'Simuler',
                        onPress: async () => {
                            try {
                                await linkClothing(selected.id, `NFC-DEV-${Date.now()}`);
                                Alert.alert(
                                    'Succès',
                                    'Vêtement lié avec succès (simulation) !',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                navigation.goBack();
                                            },
                                        },
                                    ]
                                );
                            } catch (err) {
                                Alert.alert('Erreur', 'Impossible de lier le vêtement');
                            } finally {
                                setScanning(false);
                            }
                        },
                    },
                ]
            );
        } finally {
            setScanning(false);
            try {
                if (NfcManager) {
                    await NfcManager.cancelTechnologyRequest();
                }
            } catch (e) {
                // Ignorer les erreurs de cancellation
            }
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Relier un vêtement</Text>
            <Text style={styles.subtitle}>Commande : {numeroCommande}</Text>

            <FlatList
                data={vetements}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelected(item)}
                        style={[styles.item, selected?.id === item.id && styles.selected]}
                    >
                        <Text style={styles.itemText}>{item.name}</Text>
                        {selected?.id === item.id && (
                            <Text style={styles.selectedIndicator}>✓</Text>
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun vêtement à lier</Text>}
            />

            {selected && (
                <View style={styles.scanSection}>
                    <TouchableOpacity
                        style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
                        onPress={startScan}
                        disabled={scanning}
                    >
                        {scanning ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.scanButtonText}>Scanner la puce NFC</Text>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.scanHint}>
                        Approchez votre téléphone de la puce NFC du vêtement
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
        padding: 20,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: COLORS.textDark,
        fontSize: 24,
        fontFamily: FONTS.title,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    subtitle: {
        color: COLORS.textDark,
        fontFamily: FONTS.body,
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 5,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#8173ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selected: {
        backgroundColor: '#E5E4FF',
        borderColor: COLORS.primaryBlue,
    },
    itemText: {
        color: COLORS.primaryBlue,
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
    selectedIndicator: {
        fontSize: 20,
        color: COLORS.primaryBlue,
        fontFamily: FONTS.bodyBold,
    },
    empty: {
        color: COLORS.textDark,
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center',
    },
    scanSection: {
        marginTop: 20,
        alignItems: 'center',
    },
    scanButton: {
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 5,
        minWidth: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonDisabled: {
        opacity: 0.7,
    },
    scanButtonText: {
        color: '#fff',
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        textTransform: 'uppercase',
    },
    scanHint: {
        marginTop: 12,
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
