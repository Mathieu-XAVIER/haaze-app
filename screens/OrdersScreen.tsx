import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../styles/theme';
import { getOrders, OrderWithItems } from '../services/api';

type NavigationProp = NativeStackNavigationProp<{
    Orders: undefined;
    OrderDetail: { orderId: number; orderNumber: string };
}>;

// Hauteur approximative d'une carte de commande
const ITEM_HEIGHT = 200;

// Composant OrderCard extrait et mémorisé
const OrderCard = React.memo<{
    order: OrderWithItems;
    formatDate: (dateString: string) => string;
    isFullyLinked: (order: OrderWithItems) => boolean;
    onNavigateToDetail: (orderId: number, orderNumber: string) => void;
}>(({ order, formatDate, isFullyLinked, onNavigateToDetail }) => {
    const fullyLinked = isFullyLinked(order);

    const handlePress = useCallback(() => {
        onNavigateToDetail(order.id, order.order_number);
    }, [order.id, order.order_number, onNavigateToDetail]);

    return (
        <View style={[styles.orderCard, fullyLinked && styles.orderCardComplete]}>
            <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>Commande {order.order_number}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
                </View>
                {fullyLinked && (
                    <View style={styles.checkBadge}>
                        <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
                    </View>
                )}
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                        {order.total_linked}/{order.total_items} vêtements liés
                    </Text>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${order.total_items > 0
                                            ? Math.min((order.total_linked / order.total_items) * 100, 100)
                                            : 0}%`,
                                    },
                                    fullyLinked && styles.progressFillComplete,
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {!fullyLinked && (
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={handlePress}
                    activeOpacity={0.8}
                >
                    <Ionicons name="link" size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.linkButtonText}>Lier mes vêtements</Text>
                </TouchableOpacity>
            )}

            {fullyLinked && (
                <View style={styles.completeBadge}>
                    <Ionicons name="checkmark" size={16} color="#22C55E" />
                    <Text style={styles.completeText}>Tous vos vêtements sont liés !</Text>
                </View>
            )}
        </View>
    );
});

OrderCard.displayName = 'OrderCard';

export default function OrdersScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadOrders = useCallback(async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('[OrdersScreen] Erreur lors du chargement des commandes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Rafraîchir quand on revient sur l'écran
    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [loadOrders])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadOrders(true);
    }, [loadOrders]);

    const formatDate = useCallback((dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    }, []);

    const isFullyLinked = useCallback((order: OrderWithItems): boolean => {
        return order.total_linked >= order.total_items && order.total_items > 0;
    }, []);

    const handleNavigateToDetail = useCallback((orderId: number, orderNumber: string) => {
        navigation.navigate('OrderDetail', { orderId, orderNumber });
    }, [navigation]);

    const renderOrderCard = useCallback(({ item }: { item: OrderWithItems }) => (
        <OrderCard
            order={item}
            formatDate={formatDate}
            isFullyLinked={isFullyLinked}
            onNavigateToDetail={handleNavigateToDetail}
        />
    ), [formatDate, isFullyLinked, handleNavigateToDetail]);

    const getItemLayout = useCallback(
        (_data: OrderWithItems[] | null | undefined, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        []
    );

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const keyExtractor = useCallback((item: OrderWithItems) => item.id.toString(), []);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleGoBack}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.title}>MES COMMANDES</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.titleUnderline} />

            <FlatList
                data={orders}
                keyExtractor={keyExtractor}
                renderItem={renderOrderCard}
                contentContainerStyle={styles.listContent}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={10}
                getItemLayout={getItemLayout}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primaryBlue]}
                        tintColor={COLORS.primaryBlue}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color={COLORS.cardBorder} />
                        <Text style={styles.emptyTitle}>Aucune commande</Text>
                        <Text style={styles.emptyText}>
                            Vos commandes apparaîtront ici une fois effectuées.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const cardShadow = Platform.select({
    web: { boxShadow: '0px 4px 12px rgba(51, 0, 253, 0.15)' },
    default: {
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
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
        paddingBottom: 10,
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
    title: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 1,
    },
    headerSpacer: {
        width: 40,
    },
    titleUnderline: {
        height: 6,
        width: 180,
        backgroundColor: COLORS.accentYellow,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: -4,
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
        ...cardShadow,
    },
    orderCardComplete: {
        borderColor: '#22C55E',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 18,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: '#666',
    },
    checkBadge: {
        marginLeft: 12,
    },
    progressSection: {
        marginBottom: 16,
    },
    progressInfo: {
        gap: 8,
    },
    progressText: {
        fontSize: 14,
        fontFamily: FONTS.bodyBold,
        color: COLORS.primaryBlue,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E4FF',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primaryBlue,
        borderRadius: 4,
    },
    progressFillComplete: {
        backgroundColor: '#22C55E',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 14,
        borderRadius: 8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    linkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
    completeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#F0FDF4',
        borderRadius: 8,
    },
    completeText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: FONTS.bodyBold,
        color: '#22C55E',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: FONTS.body,
        color: '#666',
        textAlign: 'center',
    },
});
