import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUser, getCollections, Vetement, User, Collection } from '../services/api';
import { COLORS, FONTS } from '../styles/theme';

export default function CollectionScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState<User | null>(null);
    const [vetements, setVetements] = useState<Vetement[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [comingCollections, setComingCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    // Rafraîchir les données quand on revient sur la page (après ajout d'un vêtement)
    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            setLoading(true);
            // Charger les données en parallèle, mais gérer les erreurs individuellement
            const results = await Promise.allSettled([
                getUser(),
                getCollections(),
            ]);
            
            // Traiter les résultats
            if (results[0].status === 'fulfilled') {
                setUser(results[0].value);
                setVetements(results[0].value.vetements || []);
            } else {
                console.error('[CollectionScreen] Erreur lors du chargement de l\'utilisateur:', results[0].reason);
                setVetements([]);
            }
            
            if (results[1].status === 'fulfilled') {
                // Séparer les collections disponibles et à venir
                const available = results[1].value.filter(c => !c.coming_soon);
                const coming = results[1].value.filter(c => c.coming_soon);
                setCollections(available);
                setComingCollections(coming);
            } else {
                console.error('[CollectionScreen] Erreur lors du chargement des collections:', results[1].reason);
                setCollections([]);
                setComingCollections([]);
            }
        } catch (error) {
            console.error('[CollectionScreen] Erreur inattendue lors du chargement des données:', error);
            setVetements([]);
            setCollections([]);
            setComingCollections([]);
        } finally {
            setLoading(false);
        }
    };

    // Préparer les vêtements pour l'affichage selon le design Figma
    const displayedVetements = useMemo(() => {
        const items: Array<{ id: string | number; nom: string; image: any; isAdd?: boolean }> = [];
        
        if (vetements && vetements.length > 0) {
            // Prendre les 3 premiers vêtements
            vetements.slice(0, 3).forEach(v => {
                items.push({
                    id: v.id,
                    nom: v.nom || 'HAAZE #1',
                    image: v.image ? { uri: v.image } : require('../assets/tshirt.png'),
                    isAdd: false,
                });
            });
        } else {
            // Vêtements par défaut si aucun n'est disponible
            items.push({
                id: 'default-1',
                nom: 'HAAZE #1',
                image: require('../assets/tshirt.png'),
                isAdd: false,
            });
        }
        
        // Ajouter le bouton "+" si on a moins de 3 vêtements
        if (items.length < 3) {
            items.push({ id: 'add', nom: 'Ajouter', image: null, isAdd: true });
        }
        
        return items;
    }, [vetements]);

    if (loading) {
        return (
            <View style={[styles.screen, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primaryBlue} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header avec gradient */}
            <LinearGradient
                colors={['#CFCEFB', 'rgba(255, 255, 255, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroSection}
            >
                <View style={styles.heroHeader}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.heroLogo}
                        tintColor={COLORS.textDark}
                    />
                    <Text style={styles.heroTitle}>{user?.name || 'Je suis le pseudo'}</Text>
                </View>
            </LinearGradient>

            {/* Section MES VÊTEMENTS */}
            <Section title="MES VÊTEMENTS" underlineWidth={258}>
                <View style={styles.vetementsContainer}>
                    {/* Premier vêtement (grand) */}
                    {displayedVetements.length > 0 && !displayedVetements[0].isAdd && (
                        <View style={styles.vetementCardFirst}>
                            <ImageBackground
                                source={displayedVetements[0].image}
                                style={styles.vetementImageBg}
                                imageStyle={styles.vetementImage}
                            >
                                <View style={styles.vetementOverlay} />
                            </ImageBackground>
                        </View>
                    )}
                    
                    {/* Deuxième et troisième vêtements (petits) */}
                    <View style={styles.vetementsGrid}>
                        {displayedVetements.slice(1, 3).map((vetement) => (
                            <View key={vetement.id} style={styles.vetementCard}>
                                {vetement.isAdd ? (
                                    <TouchableOpacity
                                        style={styles.addCard}
                                        onPress={() => navigation.navigate('AddClothing' as never)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.addSymbol}>+</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <ImageBackground
                                        source={vetement.image}
                                        style={styles.vetementImageBg}
                                        imageStyle={styles.vetementImage}
                                    >
                                        <View style={styles.vetementOverlay} />
                                    </ImageBackground>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </Section>

            {/* Section COLLECTIONS */}
            <Section title="COLLECTIONS" underlineWidth={208}>
                <View style={styles.collectionsGrid}>
                    {collections.length > 0 ? (
                        collections.slice(0, 2).map(collection => (
                            <CollectionCard key={collection.id} collection={collection} />
                        ))
                    ) : (
                        <>
                            <CollectionCard
                                collection={{
                                    id: 1,
                                    title: 'HAAZE #1',
                                    image: require('../assets/bg-vortex.png'),
                                }}
                            />
                            <CollectionCard
                                collection={{
                                    id: 2,
                                    title: 'HAAZE\nX\nCLEMO',
                                    image: require('../assets/bg-vortex.png'),
                                }}
                            />
                        </>
                    )}
                </View>
            </Section>

            {/* Section COLLECTIONS À VENIR */}
            <Section title="COLLECTIONS À VENIR" underlineWidth={323}>
                <View style={styles.comingGrid}>
                    {comingCollections.length > 0 ? (
                        comingCollections.slice(0, 2).map(collection => (
                            <ComingCollectionCard key={collection.id} collection={collection} />
                        ))
                    ) : (
                        <>
                            <ComingCollectionCard
                                collection={{
                                    id: 1,
                                    title: 'HAAZE\nX\nOL',
                                    image: require('../assets/badge-1.png'),
                                }}
                            />
                            <ComingCollectionCard
                                collection={{
                                    id: 2,
                                    title: 'HAAZE\nX\nFOREVER\nVACATION',
                                    image: require('../assets/badge-2.png'),
                                }}
                            />
                        </>
                    )}
                </View>
            </Section>
        </ScrollView>
    );
}

const CollectionCard = ({ collection }: { collection: Collection & { image?: any } }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.collectionCard}>
        <ImageBackground
            source={collection.image ? (typeof collection.image === 'string' ? { uri: collection.image } : collection.image) : require('../assets/bg-vortex.png')}
            style={styles.collectionCardBg}
            imageStyle={styles.collectionCardImage}
        >
            <View style={styles.collectionOverlay} />
            <Text style={styles.collectionTitle}>{collection.title}</Text>
        </ImageBackground>
    </TouchableOpacity>
);

const ComingCollectionCard = ({ collection }: { collection: Collection & { image?: any } }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.comingCard}>
        <ImageBackground
            source={collection.image ? (typeof collection.image === 'string' ? { uri: collection.image } : collection.image) : require('../assets/badge-1.png')}
            style={styles.comingCardBg}
            imageStyle={styles.comingImage}
        >
            <View style={styles.comingOverlay} />
            <Text style={styles.comingTitle}>{collection.title}</Text>
        </ImageBackground>
    </TouchableOpacity>
);

const Section = ({ title, children, underlineWidth = 258 }: { title: string; children: React.ReactNode; underlineWidth?: number }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={[styles.sectionUnderline, { width: underlineWidth }]} />
            </View>
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 59,
        paddingBottom: 120,
    },
    heroSection: {
        marginBottom: 0,
        paddingVertical: 20,
        paddingTop: 30,
        paddingBottom: 30,
        marginHorizontal: -20,
        paddingHorizontal: 20,
        height: 444,
        justifyContent: 'flex-start',
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: 16,
    },
    heroLogo: {
        width: 48,
        height: 52,
        marginRight: 12,
    },
    heroTitle: {
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
        color: '#1E1E1E',
        letterSpacing: 0.8,
    },
    section: {
        marginTop: 32,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitleContainer: {
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 0,
        lineHeight: 24,
        textTransform: 'uppercase',
    },
    sectionUnderline: {
        height: 9,
        borderRadius: 33,
        backgroundColor: COLORS.accentYellow,
        marginTop: 19,
    },
    vetementsContainer: {
        marginTop: 48,
        gap: 16,
    },
    vetementCardFirst: {
        width: 175,
        height: 175,
        borderRadius: 9,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#8173FF',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    vetementsGrid: {
        flexDirection: 'row',
        gap: 15,
        flexWrap: 'wrap',
    },
    vetementCard: {
        width: 175,
        height: 175,
        borderRadius: 9,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#8173FF',
        backgroundColor: '#fff',
    },
    vetementImageBg: {
        width: '100%',
        height: '100%',
    },
    vetementImage: {
        resizeMode: 'cover',
    },
    vetementOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    addCard: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addSymbol: {
        fontSize: 50,
        color: '#8173FF',
        fontFamily: FONTS.title,
    },
    collectionsGrid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 48,
    },
    collectionCard: {
        flex: 1,
        height: 175,
        borderRadius: 9,
        overflow: 'hidden',
    },
    collectionCardBg: {
        width: '100%',
        height: '100%',
    },
    collectionCardImage: {
        resizeMode: 'cover',
    },
    collectionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    collectionTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        color: '#fff',
        fontSize: 24,
        fontFamily: FONTS.title,
        textAlign: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        textTransform: 'uppercase',
        lineHeight: 28,
    },
    comingGrid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 49,
    },
    comingCard: {
        flex: 1,
        height: 175,
        borderRadius: 9,
        overflow: 'hidden',
    },
    comingCardBg: {
        width: '100%',
        height: '100%',
    },
    comingImage: {
        resizeMode: 'cover',
    },
    comingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    comingTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        color: '#fff',
        fontSize: 24,
        fontFamily: FONTS.title,
        textAlign: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        textTransform: 'uppercase',
        lineHeight: 28,
    },
});
