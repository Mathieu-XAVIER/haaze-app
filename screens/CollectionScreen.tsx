import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getUser, Skin, Vetement } from '../services/api';
import NeonButton from '../components/NeonButton';
import NeonCard from '../components/NeonCard';

export default function CollectionScreen() {
    const [vetements, setVetements] = useState<Vetement[]>([]);
    const [skins, setSkins] = useState<Skin[]>([]);

    useEffect(() => {
        getUser().then(user => {
            setVetements(user.vetements);
            // Récupérer tous les skins débloqués de tous les vêtements
            const allSkins = user.vetements.flatMap(v => v.skinsDebloques);
            setSkins(allSkins);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ta Collection</Text>
            <Text style={styles.sectionTitle}>Vêtements associés</Text>
            <FlatList
                data={vetements}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <NeonCard color="blue">
                        <Text style={styles.vetementName}>{item.nom}</Text>
                        <Text style={styles.vetementId}>NFC : {item.nfcId}</Text>
                    </NeonCard>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun vêtement associé</Text>}
            />
            <Text style={styles.sectionTitle}>Skins débloqués</Text>
            <FlatList
                data={skins}
                keyExtractor={item => item.id}
                horizontal
                renderItem={({ item }) => (
                    <NeonCard color="orange" style={{width: 110, alignItems: 'center', padding: 10, marginRight: 12}}>
                        <Image source={require('../assets/vetement-principal.png')} style={styles.skinImage} resizeMode="contain" />
                        <Text style={styles.skinName}>{item.nom}</Text>
                    </NeonCard>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun skin débloqué</Text>}
                contentContainerStyle={{ paddingVertical: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0A0A0A',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3300FD',
        marginBottom: 18,
        letterSpacing: 1.5,
        fontFamily: 'Minasans',
        // Aucun effet de néon
    },
    sectionTitle: {
        color: '#FF3600',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 10,
        letterSpacing: 1.2,
        fontFamily: 'Minasans',
        textShadowColor: '#FF3600',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    vetementCard: {
        backgroundColor: '#18181B',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#6EE7FF',
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 6,
    },
    vetementName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        fontFamily: 'Helvetica',
    },
    vetementId: {
        color: '#AAA',
        fontSize: 13,
        fontFamily: 'Helvetica',
    },
    skinCard: {
        backgroundColor: 'transparent',
        borderRadius: 16,
        padding: 10,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#3300FD',
        width: 110,
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 16,
        elevation: 8,
    },
    skinImage: {
        width: 60,
        height: 60,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    skinName: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Helvetica',
        textShadowColor: '#3300FD',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    empty: {
        color: '#AAA',
        fontStyle: 'italic',
        marginTop: 10,
    },
});
