import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';
import { getUser, Vetement } from '../services/api';
import { COLORS, FONTS } from '../styles/theme';

type ComingCollection = {
    id: string;
    title: string;
    subtitle: string;
    image: any;
};

const comingCollections: ComingCollection[] = [
    { id: 'ol', title: 'HAAZE X OL', subtitle: 'COLLECTIONS À VENIR', image: require('../assets/badge-1.png') },
    {
        id: 'forever',
        title: 'HAAZE X FOREVER VACATION',
        subtitle: 'COLLECTIONS À VENIR',
        image: require('../assets/badge-2.png'),
    },
];

export default function CollectionScreen() {
    const [vetements, setVetements] = useState<Vetement[]>([]);

    useEffect(() => {
        getUser().then(user => setVetements(user.vetements));
    }, []);

    const outfits = useMemo(
        () =>
            vetements.length
                ? vetements.map(v => ({
                      id: v.id,
                      label: v.nom,
                      image: require('../assets/tshirt.png'),
                  }))
                : [
                      { id: 'placeholder-1', label: 'T-shirt HAAZE #1', image: require('../assets/tshirt.png') },
                      { id: 'placeholder-2', label: 'Ajouter', image: null },
                  ],
        [vetements],
    );

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.heroHeader}>
                <Image source={require('../assets/logo.png')} style={styles.logo} tintColor={COLORS.textDark} />
                <Text style={styles.pseudo}>Je suis le pseudo</Text>
            </View>

            <Section title="MES VÊTEMENTS">
                <View style={styles.outfitGrid}>
                    {outfits.map(outfit => (
                        <View key={outfit.id} style={styles.outfitCard}>
                            {outfit.image ? (
                                <Image source={outfit.image} style={styles.outfitImage} resizeMode="contain" />
                            ) : (
                                <Text style={styles.addSymbol}>＋</Text>
                            )}
                            <Text style={styles.outfitLabel}>{outfit.label}</Text>
                        </View>
                    ))}
                </View>
            </Section>

            <Section title="COLLECTIONS">
                <ImageBackground
                    source={require('../assets/badge-3.png')}
                    style={styles.collectionHero}
                    imageStyle={styles.collectionHeroImage}
                >
                    <View style={styles.collectionHeroOverlay} />
                    <Text style={styles.collectionHeroText}>HAAZE #1</Text>
                </ImageBackground>
            </Section>

            <Section title="COLLECTIONS À VENIR">
                <View style={styles.comingGrid}>
                    {comingCollections.map(collection => (
                        <ImageBackground
                            key={collection.id}
                            source={collection.image}
                            style={styles.comingCard}
                            imageStyle={styles.comingImage}
                        >
                            <View style={styles.comingOverlay} />
                            <Text style={styles.comingTitle}>{collection.title}</Text>
                        </ImageBackground>
                    ))}
                </View>
            </Section>
        </ScrollView>
    );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionUnderline} />
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 90,
        gap: 26,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 42,
        height: 42,
    },
    pseudo: {
        fontSize: 20,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textTransform: 'uppercase',
    },
    section: {
        gap: 16,
    },
    sectionHeader: {
        gap: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        letterSpacing: 1,
    },
    sectionUnderline: {
        width: 72,
        height: 6,
        borderRadius: 999,
        backgroundColor: COLORS.accentYellow,
    },
    outfitGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    outfitCard: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#b3a7ff',
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    outfitImage: {
        width: 110,
        height: 140,
        marginBottom: 12,
    },
    outfitLabel: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.primaryBlue,
        textAlign: 'center',
    },
    addSymbol: {
        fontSize: 48,
        color: '#9d8bff',
        marginVertical: 32,
    },
    collectionHero: {
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    collectionHeroImage: {
        resizeMode: 'cover',
    },
    collectionHeroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 10, 60, 0.35)',
    },
    collectionHeroText: {
        color: '#fff',
        fontSize: 26,
        fontFamily: FONTS.title,
        letterSpacing: 1,
    },
    comingGrid: {
        flexDirection: 'row',
        gap: 14,
    },
    comingCard: {
        flex: 1,
        height: 170,
        borderRadius: 18,
        overflow: 'hidden',
    },
    comingImage: {
        resizeMode: 'cover',
    },
    comingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 10, 60, 0.45)',
    },
    comingTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.title,
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
});
