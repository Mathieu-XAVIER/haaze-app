import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
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
            const [userData, collectionsData] = await Promise.all([
                getUser(),
                getCollections(),
            ]);
            setUser(userData);
            setVetements(userData.vetements || []);
            
            // Séparer les collections disponibles et à venir
            const available = collectionsData.filter(c => !c.coming_soon);
            const coming = collectionsData.filter(c => c.coming_soon);
            setCollections(available);
            setComingCollections(coming);
        } catch (error) {
            console.error('[CollectionScreen] Erreur lors du chargement des données:', error);
            setVetements([]);
            setCollections([]);
            setComingCollections([]);
        } finally {
            setLoading(false);
        }
    };

    const outfits = useMemo(() => {
        const items = vetements && vetements.length > 0
            ? vetements.slice(0, 2).map(v => ({
                  id: v.id,
                  label: v.nom,
                  image: v.image || require('../assets/tshirt.png'),
                  isAdd: false,
              }))
            : [
                  { id: 'placeholder-1', label: 'T-shirt HAAZE #1', image: require('../assets/tshirt.png'), isAdd: false },
              ];
        
        // Ajouter le bouton "+" si on a moins de 2 vêtements
        if (items.length < 2) {
            items.push({ id: 'add', label: 'Ajouter', image: null, isAdd: true });
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
            <LinearGradient
                colors={['#CFCEFB', '#f5f4ff', COLORS.backgroundLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
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

            <Section title="MES VÊTEMENTS">
                <View style={styles.outfitContainer}>
                    {outfits.length > 0 && (
                        <View style={styles.outfitCardFirst}>
                            <ImageBackground
                                source={typeof outfits[0].image === 'string' ? { uri: outfits[0].image } : outfits[0].image}
                                style={styles.outfitImageBg}
                                imageStyle={styles.outfitImage}
                            >
                                <View style={styles.outfitOverlay} />
                            </ImageBackground>
                        </View>
                    )}
                    <View style={styles.outfitGrid}>
                        {outfits.slice(1).map((outfit) => (
                            <View key={outfit.id} style={styles.outfitCard}>
                            {outfit.isAdd ? (
                                <TouchableOpacity
                                    style={styles.addCard}
                                    onPress={() => navigation.navigate('AddClothing' as never)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.addSymbol}>+</Text>
                                </TouchableOpacity>
                            ) : (
                                    <ImageBackground
                                        source={typeof outfit.image === 'string' ? { uri: outfit.image } : outfit.image}
                                        style={styles.outfitImageBg}
                                        imageStyle={styles.outfitImage}
                                    >
                                        <View style={styles.outfitOverlay} />
                                    </ImageBackground>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </Section>

            <Section title="COLLECTIONS">
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
                                    image: require('../assets/badge-3.png'),
                                }}
                            />
                            <CollectionCard
                                collection={{
                                    id: 2,
                                    title: 'HAAZE\nX\nCLEMO',
                                    image: require('../assets/badge-3.png'),
                                }}
                            />
                        </>
                    )}
                </View>
            </Section>

            <Section title="COLLECTIONS À VENIR">
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
            source={collection.image ? (typeof collection.image === 'string' ? { uri: collection.image } : collection.image) : require('../assets/badge-3.png')}
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.sectionUnderline} />
            </View>
        </View>
        {children}
    </View>
);

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
        gap: 32,
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
    },
    heroLogo: {
        width: 42,
        height: 42,
        marginRight: 12,
    },
    heroTitle: {
        fontSize: 20,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textTransform: 'uppercase',
    },
    section: {
        gap: 16,
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
    outfitContainer: {
        marginTop: 48,
        gap: 16,
    },
    outfitCardFirst: {
        width: 175,
        height: 175,
        borderRadius: 9,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#8173ff',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    outfitGrid: {
        flexDirection: 'row',
        gap: 15,
        flexWrap: 'wrap',
    },
    outfitCard: {
        width: 175,
        height: 175,
        borderRadius: 9,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#8173ff',
        backgroundColor: '#fff',
    },
    outfitImageBg: {
        width: '100%',
        height: '100%',
    },
    outfitImage: {
        resizeMode: 'cover',
    },
    outfitOverlay: {
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
        color: '#8173ff',
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
        textTransform: 'uppercase',
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
        textTransform: 'uppercase',
        lineHeight: 28,
    },
});
