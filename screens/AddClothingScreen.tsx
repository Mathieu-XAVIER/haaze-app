import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getUser, getOrderClothes, linkClothing, User, Order, Clothing } from '../services/api';
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

export default function AddClothingScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [clothes, setClothes] = useState<Clothing[]>([]);
    const [selectedClothing, setSelectedClothing] = useState<Clothing | null>(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        // Initialiser NFC si disponible
        if (NfcManager) {
            NfcManager.start().catch((err: any) => {
                console.log('[NFC] Erreur d\'initialisation:', err);
            });
        }
        
        loadData();
        return () => {
            if (NfcManager) {
                NfcManager.cancelTechnologyRequest().catch(() => {});
            }
        };
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const userData = await getUser();
            setUser(userData);
            setOrders(userData.orders || []);
        } catch (error) {
            console.error('[AddClothingScreen] Erreur lors du chargement:', error);
            Alert.alert('Erreur', 'Impossible de charger vos commandes');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrder = async (order: Order) => {
        setSelectedOrder(order);
        setSelectedClothing(null);
        try {
            const orderClothes = await getOrderClothes(order.numero_commande);
            setClothes(orderClothes);
        } catch (error) {
            console.error('[AddClothingScreen] Erreur lors du chargement des vêtements:', error);
            Alert.alert('Erreur', 'Impossible de charger les vêtements de cette commande');
        }
    };

    const handleScanNFC = async () => {
        if (!selectedClothing) {
            Alert.alert('Erreur', 'Veuillez d\'abord sélectionner un vêtement');
            return;
        }

        // Si NFC Manager n'est pas disponible (Expo Go), utiliser la simulation
        if (!NfcManager) {
            Alert.alert(
                'Mode développement',
                'Le scan NFC nécessite un build natif. Voulez-vous simuler la liaison ?',
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
                                await linkClothing(selectedClothing.id, `NFC-DEV-${Date.now()}`);
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

            // Demander l'accès NFC
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // Lire le tag NFC
            const tag = await NfcManager.getTag();
            const nfcId = tag?.id || '';

            if (!nfcId) {
                Alert.alert('Erreur', 'Impossible de lire l\'identifiant NFC');
                setScanning(false);
                return;
            }

            // Lier le vêtement au tag NFC
            await linkClothing(selectedClothing.id, nfcId);

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
            console.error('[AddClothingScreen] Erreur lors du scan NFC:', error);
            
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
                                await linkClothing(selectedClothing.id, `NFC-DEV-${Date.now()}`);
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
            <View style={[styles.screen, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <LinearGradient
                colors={['#CFCEFB', '#f5f4ff', COLORS.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style={styles.heroSection}
            >
                <View style={styles.heroHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.heroTitle}>Ajouter un vêtement</Text>
                </View>
            </LinearGradient>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>MES COMMANDES</Text>
                        <View style={styles.sectionUnderline} />
                    </View>
                </View>

                {orders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>Aucune commande disponible</Text>
                    </View>
                ) : (
                    <View style={styles.ordersList}>
                        {orders.map(order => (
                            <TouchableOpacity
                                key={order.id}
                                onPress={() => handleSelectOrder(order)}
                                style={[
                                    styles.orderCard,
                                    selectedOrder?.id === order.id && styles.orderCardSelected,
                                ]}
                            >
                                <Text style={styles.orderText}>Commande {order.numero_commande}</Text>
                                {selectedOrder?.id === order.id && (
                                    <Text style={styles.selectedIndicator}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {selectedOrder && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>VÊTEMENTS DE LA COMMANDE</Text>
                            <View style={styles.sectionUnderline} />
                        </View>
                    </View>

                    {clothes.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Aucun vêtement dans cette commande</Text>
                        </View>
                    ) : (
                        <View style={styles.clothesList}>
                            {clothes.map(clothing => (
                                <TouchableOpacity
                                    key={clothing.id}
                                    onPress={() => setSelectedClothing(clothing)}
                                    style={[
                                        styles.clothingCard,
                                        selectedClothing?.id === clothing.id && styles.clothingCardSelected,
                                    ]}
                                >
                                    <Text style={styles.clothingText}>{clothing.name}</Text>
                                    {selectedClothing?.id === clothing.id && (
                                        <Text style={styles.selectedIndicator}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            )}

            {selectedClothing && (
                <View style={styles.scanSection}>
                    <TouchableOpacity
                        style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
                        onPress={handleScanNFC}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 120,
    },
    heroSection: {
        marginBottom: 30,
        paddingVertical: 20,
        paddingTop: 30,
        paddingBottom: 30,
        marginHorizontal: -20,
        paddingHorizontal: 20,
        minHeight: 400,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 10,
    },
    backButtonText: {
        fontSize: 24,
        color: COLORS.textDark,
        fontFamily: FONTS.title,
    },
    heroTitle: {
        fontSize: 20,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 16,
    },
    sectionTitleContainer: {
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 1,
        lineHeight: 28,
        textTransform: 'uppercase',
    },
    sectionUnderline: {
        height: 9,
        borderRadius: 33,
        backgroundColor: COLORS.accentYellow,
        marginTop: -2,
        width: 258,
    },
    ordersList: {
        gap: 12,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 18,
        borderWidth: 2,
        borderColor: '#8173ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderCardSelected: {
        backgroundColor: '#E5E4FF',
        borderColor: COLORS.primaryBlue,
    },
    orderText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.primaryBlue,
        fontSize: 16,
    },
    clothesList: {
        gap: 12,
    },
    clothingCard: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 18,
        borderWidth: 2,
        borderColor: '#8173ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clothingCardSelected: {
        backgroundColor: '#E5E4FF',
        borderColor: COLORS.primaryBlue,
    },
    clothingText: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.primaryBlue,
        fontSize: 16,
    },
    selectedIndicator: {
        fontSize: 20,
        color: COLORS.primaryBlue,
        fontFamily: FONTS.bodyBold,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyStateText: {
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        fontSize: 14,
    },
    scanSection: {
        marginTop: 32,
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

