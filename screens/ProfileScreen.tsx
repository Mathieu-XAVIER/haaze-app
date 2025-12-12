import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getUser, logout, getUserStats, User, UserStats } from '../services/api';
import { COLORS, FONTS } from '../styles/theme';

const assets = {
    background: 'https://www.figma.com/api/mcp/asset/4eea6cce-fa6f-4789-889e-fd82d9276671',
    avatar: 'https://www.figma.com/api/mcp/asset/b892f95b-4012-4a35-bc0e-98a156a6baad',
    settings: 'https://www.figma.com/api/mcp/asset/80df65ec-8540-47d6-b61e-268fcf91c2ca',
    badgeTotem: 'https://www.figma.com/api/mcp/asset/e8ff4d99-489a-43fb-9a30-a976fd6fcb20',
    badgeOrange: 'https://www.figma.com/api/mcp/asset/87e916ab-70e9-431c-a5a7-9cd5961e5ebe',
    badgeDiamond: 'https://www.figma.com/api/mcp/asset/22f132b5-df0b-4501-b6d8-ee85ef3f4984',
};

type SectionProps = {
    title: string;
    underlineWidth?: number;
    children: React.ReactNode;
};

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [userData, statsData] = await Promise.all([getUser(), getUserStats()]);
            setUser(userData);
            setStats(statsData);
        } catch (error) {
            console.error('[ProfileScreen] Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    const formatXP = (xp: number): string => {
        return xp.toLocaleString('fr-FR') + ' xp';
    };

    const derivedStats = [
        {
            id: 'owned',
            label: 'Vêtements possédés',
            value: String(stats?.vetements_owned ?? user?.vetements?.length ?? 0),
        },
        {
            id: 'missions',
            label: 'Nombre de missions réussis',
            value: String(stats?.missions_completed ?? 0),
        },
        {
            id: 'xp',
            label: 'Expérience totale obtenue',
            value: formatXP(stats?.total_xp ?? user?.xp ?? 0),
        },
        {
            id: 'skins',
            label: 'Nombre de skin(s)',
            value: String(stats?.skins_count ?? 0),
        },
    ];

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'Membre depuis le 20 octobre 2025';
        try {
            const date = new Date(dateString);
            return `Membre depuis le ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        } catch {
            return 'Membre depuis le 20 octobre 2025';
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
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroWrapper}>
                <ImageBackground
                    source={{ uri: assets.background }}
                    style={styles.hero}
                    imageStyle={styles.heroImage}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(207,206,251,0.85)', 'rgba(255,255,255,0.2)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.heroGradient}
                    />

                    <View style={styles.heroTopRow}>
                        <View />
                        <TouchableOpacity style={styles.settingsButton} onPress={handleLogout} activeOpacity={0.82}>
                            <Image source={{ uri: assets.settings }} style={styles.settingsIcon} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarOuterRing}>
                        <View style={styles.avatarInnerRing}>
                            <Image source={{ uri: assets.avatar }} style={styles.avatar} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.pseudo}>{user?.name || 'Je suis le pseudo'}</Text>
                <Text style={styles.subtitle}>{formatDate()}</Text>
            </View>

            <Section title="STATISTIQUES" underlineWidth={150}>
                {derivedStats.map(stat => (
                    <View key={stat.id} style={styles.statCard}>
                        <Text style={styles.statText}>{stat.label} : {stat.value}</Text>
                    </View>
                ))}
            </Section>

            <Section title="BADGES" underlineWidth={90}>
                <View style={styles.badgeRow}>
                    <Image source={{ uri: assets.badgeTotem }} style={styles.badgeImage} resizeMode="contain" />
                    <Image source={{ uri: assets.badgeOrange }} style={styles.badgeImage} resizeMode="contain" />
                    <Image source={{ uri: assets.badgeDiamond }} style={styles.badgeImage} resizeMode="contain" />
                </View>
            </Section>
        </ScrollView>
    );
}

const Section = ({ title, underlineWidth = 120, children }: SectionProps) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={[styles.sectionUnderline, { width: underlineWidth }]} />
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    content: {
        paddingBottom: 120,
    },
    heroWrapper: {
        position: 'relative',
        height: 230,
    },
    hero: {
        flex: 1,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroTopRow: {
        position: 'absolute',
        right: 18,
        top: 18,
        left: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#1e1e1e',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    settingsIcon: {
        width: 22,
        height: 22,
        tintColor: '#1e1e1e',
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: -52,
        alignSelf: 'center',
    },
    avatarOuterRing: {
        width: 116,
        height: 116,
        borderRadius: 58,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3300fd',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    avatarInnerRing: {
        width: 98,
        height: 98,
        borderRadius: 49,
        borderWidth: 4,
        borderColor: COLORS.accentYellow,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    avatar: {
        width: 86,
        height: 86,
        borderRadius: 43,
    },
    userInfo: {
        marginTop: 68,
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 6,
    },
    pseudo: {
        fontFamily: FONTS.bodyBold,
        fontSize: 18,
        color: '#1e1e1e',
    },
    subtitle: {
        fontFamily: FONTS.body,
        fontSize: 12,
        color: '#1e1e1e',
        letterSpacing: 0.2,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 32,
        gap: 16,
    },
    sectionHeader: {
        marginBottom: 4,
    },
    sectionTitle: {
        fontFamily: FONTS.title,
        fontSize: 24,
        letterSpacing: 1,
        color: COLORS.primaryBlue,
    },
    sectionUnderline: {
        height: 6,
        borderRadius: 10,
        backgroundColor: COLORS.accentYellow,
        marginTop: -2,
    },
    statCard: {
        borderWidth: 2,
        borderColor: '#130077',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#130077',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    statText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 11,
        color: COLORS.primaryBlue,
        letterSpacing: 0.55,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        marginTop: 12,
        paddingHorizontal: 2,
    },
    badgeImage: {
        width: 90,
        height: 86,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
