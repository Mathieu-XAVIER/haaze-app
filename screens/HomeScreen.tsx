import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.brand}>Haaze</Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.level}>Niveau 5 - JohnDoe</Text>
                <ProgressBar progress={0.6} color="#3300FD" style={styles.progress} />
            </View>

            <Image source={require('../assets/vetement-principal.png')} style={styles.mainImage} />

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.ctaPrimary}>
                    <Text style={styles.ctaText}>Voir les skins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaSecondary}>
                    <Text style={styles.ctaText}>Changer de vêtement</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.missionsContainer}>
                <Text style={styles.sectionTitle}>Missions en cours</Text>

                {[1, 2, 3].map((id) => (
                    <View key={id} style={styles.missionItem}>
                        <Text style={styles.missionTitle}>Mission {id} : Trouver le tag caché</Text>
                        <Text style={styles.reward}>Récompense : 50 XP</Text>
                        <ProgressBar progress={id * 0.2} color="#FF3600" style={styles.progress} />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    brand: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userInfo: {
        marginBottom: 20,
    },
    level: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 4,
    },
    progress: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#222',
    },
    mainImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 10,
        marginVertical: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    ctaPrimary: {
        flex: 1,
        backgroundColor: '#3300FD',
        padding: 12,
        borderRadius: 8,
        marginRight: 10,
        alignItems: 'center',
    },
    ctaSecondary: {
        flex: 1,
        backgroundColor: '#FF3600',
        padding: 12,
        borderRadius: 8,
        marginLeft: 10,
        alignItems: 'center',
    },
    ctaText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    missionsContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    missionItem: {
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
    },
    missionTitle: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 4,
    },
    reward: {
        color: '#FF3600',
        marginBottom: 4,
    },
});