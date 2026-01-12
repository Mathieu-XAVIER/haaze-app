import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../styles/theme';
import { getUnlinkedClothes, UnlinkedClothing } from '../services/api';

type RouteParams = {
    OrderDetail: {
        orderId: number;
        orderNumber: string;
    };
};

type NavigationProp = NativeStackNavigationProp<{
    OrderDetail: { orderId: number; orderNumber: string };
    NFCLink: { orderId: number; orderNumber: string; clothingId: number; clothingName: string };
}>;

export default function OrderDetailScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp<RouteParams, 'OrderDetail'>>();
    const { orderId, orderNumber } = route.params;

    const [unlinkedClothes, setUnlinkedClothes] = useState<UnlinkedClothing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadUnlinkedClothes = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            const data = await getUnlinkedClothes(orderId);
            setUnlinkedClothes(data);
        } catch (error) {
            console.error('[OrderDetailScreen] Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadUnlinkedClothes();
    }, [orderId]);

    // Rafraîchir quand on revient sur l'écran (après scan NFC)
    useFocusEffect(
        useCallback(() => {
            loadUnlinkedClothes();
        }, [orderId])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadUnlinkedClothes(true);
    };

    const handleScanNFC = (item: UnlinkedClothing) => {
        navigation.navigate('NFCLink', {
            orderId,
            orderNumber,
            clothingId: item.clothing.id,
            clothingName: item.clothing.name,
        });
    };

    const renderClothingItem = ({ item }: { item: UnlinkedClothing }) => {
        return (
            <View style={styles.clothingCard}>
                <View style={styles.clothingImageContainer}>
                    {item.clothing.image_url ? (
                        <Image
                            source={{ uri: item.clothing.image_url }}
                            style={styles.clothingImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.clothingImagePlaceholder}>
                            <Ionicons name="shirt-outline" size={32} color={COLORS.cardBorder} />
                        </View>
                    )}
                </View>

                <View style={styles.clothingInfo}>
                    <Text style={styles.clothingName} numberOfLines={2}>
                        {item.clothing.name}
                    </Text>
                    {item.clothing.brand?.name && (
                        <Text style={styles.clothingBrand}>{item.clothing.brand.name}</Text>
                    )}
                    <View style={styles.remainingBadge}>
                        <Text style={styles.remainingText}>
                            {item.remaining} restant{item.remaining > 1 ? 's' : ''} à lier
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => handleScanNFC(item)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="scan" size={20} color="#fff" />
                    <Text style={styles.scanButtonText}>Scanner NFC</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    const allLinked = unlinkedClothes.length === 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>COMMANDE</Text>
                    <Text style={styles.orderNumber}>{orderNumber}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            {allLinked ? (
                <View style={styles.successContainer}>
                    <View style={styles.successIconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
                    </View>
                    <Text style={styles.successTitle}>Félicitations !</Text>
                    <Text style={styles.successText}>
                        Tous vos vêtements de cette commande sont liés à leurs tags NFC.
                    </Text>
                    <TouchableOpacity
                        style={styles.backToOrdersButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.backToOrdersText}>Retour aux commandes</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.infoBar}>
                        <Ionicons name="information-circle" size={20} color={COLORS.primaryBlue} />
                        <Text style={styles.infoText}>
                            Scannez le tag NFC de chaque vêtement pour le lier à votre compte.
                        </Text>
                    </View>

                    <FlatList
                        data={unlinkedClothes}
                        keyExtractor={(item) => `${item.id}-${item.clothing_id}`}
                        renderItem={renderClothingItem}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.primaryBlue]}
                                tintColor={COLORS.primaryBlue}
                            />
                        }
                    />
                </>
            )}
        </View>
    );
}

const cardShadow = Platform.select({
    web: { boxShadow: '0px 4px 12px rgba(51, 0, 253, 0.12)' },
    default: {
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 3,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...cardShadow,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 1,
    },
    orderNumber: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        marginTop: 2,
    },
    headerSpacer: {
        width: 40,
    },
    infoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E4FF',
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        fontFamily: FONTS.body,
        color: COLORS.primaryBlue,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    clothingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.cardBorder,
        ...cardShadow,
    },
    clothingImageContainer: {
        width: '100%',
        height: 160,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#F5F5F5',
    },
    clothingImage: {
        width: '100%',
        height: '100%',
    },
    clothingImagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
    },
    clothingInfo: {
        marginBottom: 12,
    },
    clothingName: {
        fontSize: 18,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        marginBottom: 4,
    },
    clothingBrand: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: '#666',
        marginBottom: 8,
    },
    remainingBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    remainingText: {
        fontSize: 13,
        fontFamily: FONTS.bodyBold,
        color: '#D97706',
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    successIconContainer: {
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontFamily: FONTS.title,
        color: '#22C55E',
        marginBottom: 12,
    },
    successText: {
        fontSize: 16,
        fontFamily: FONTS.body,
        color: COLORS.textDark,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    backToOrdersButton: {
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    backToOrdersText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
});
