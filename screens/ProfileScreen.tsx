import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity } from 'react-native';
import { getUser, logout, User } from '../services/api';
import { COLORS, FONTS } from '../styles/theme';

const badges = [
    { id: 'b1', image: require('../assets/badge-1.png') },
    { id: 'b2', image: require('../assets/badge-2.png') },
    { id: 'b3', image: require('../assets/badge-3.png') },
];

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser().then(setUser);
    }, []);

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    const derivedStats = [
        {
            id: 'owned',
            label: 'Vêtements possédés',
            value: String(user?.vetements?.length ?? 1),
        },
        { id: 'missions', label: 'Nombre de missions réussis', value: '1' },
        { id: 'xp', label: 'Expérience totale obtenue', value: '2 850 xp' },
        { id: 'skins', label: 'Nombre de skin(s)', value: '1' },
    ];

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <ImageBackground
                source={require('../assets/bg-vortex.png')}
                style={styles.hero}
                imageStyle={styles.heroImage}
            >
                <View style={styles.heroOverlay} />
                <View style={styles.heroContent}>
                    <Image source={require('../assets/badge-3.png')} style={styles.avatar} />
                    <Text style={styles.pseudo}>{user?.name || 'Je suis le pseudo'}</Text>
                    <Text style={styles.subtitle}>Membre depuis le 20 octobre 2025</Text>
                </View>
            </ImageBackground>

            <Section title="STATISTIQUES">
                {derivedStats.map(stat => (
                    <View key={stat.id} style={styles.statCard}>
                        <Text style={styles.statLabel}>{stat.label} :</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                    </View>
                ))}
            </Section>

            <Section title="BADGES">
                <View style={styles.badgeRow}>
                    {badges.map(badge => (
                        <View key={badge.id} style={styles.badgeCard}>
                            <Image source={badge.image} style={styles.badgeImage} resizeMode="contain" />
                        </View>
                    ))}
                </View>
            </Section>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
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
        paddingBottom: 90,
    },
    hero: {
        height: 260,
        justifyContent: 'flex-end',
    },
    heroImage: {
        resizeMode: 'cover',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    heroContent: {
        alignItems: 'center',
        paddingBottom: 30,
        gap: 8,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#fff',
    },
    pseudo: {
        fontFamily: FONTS.title,
        fontSize: 20,
        color: COLORS.textDark,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontFamily: FONTS.body,
        color: '#5c5c5c',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 24,
        gap: 12,
    },
    sectionHeader: {
        gap: 6,
    },
    sectionTitle: {
        fontFamily: FONTS.title,
        color: COLORS.primaryBlue,
        fontSize: 18,
        letterSpacing: 1,
    },
    sectionUnderline: {
        width: 80,
        height: 6,
        borderRadius: 999,
        backgroundColor: COLORS.accentYellow,
    },
    statCard: {
        borderWidth: 1.5,
        borderColor: '#c3b9ff',
        borderRadius: 20,
        padding: 18,
        backgroundColor: '#fff',
    },
    statLabel: {
        fontFamily: FONTS.bodyBold,
        color: COLORS.primaryBlue,
        marginBottom: 6,
    },
    statValue: {
        fontFamily: FONTS.body,
        color: COLORS.textDark,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 14,
    },
    badgeCard: {
        flex: 1,
        height: 90,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#e3dbff',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeImage: {
        width: 48,
        height: 48,
    },
    logoutButton: {
        marginTop: 30,
        alignSelf: 'center',
        paddingHorizontal: 26,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: COLORS.primaryBlue,
    },
    logoutText: {
        color: COLORS.primaryBlue,
        fontFamily: FONTS.bodyBold,
    },
});
