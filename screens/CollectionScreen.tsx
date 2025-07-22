import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getUser, Skin, Vetement } from '../services/api';

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
                    <View style={styles.vetementCard}>
                        <Text style={styles.vetementName}>{item.nom}</Text>
                        <Text style={styles.vetementId}>NFC : {item.nfcId}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun vêtement associé</Text>}
            />
            <Text style={styles.sectionTitle}>Skins débloqués</Text>
            <FlatList
                data={skins}
                keyExtractor={item => item.id}
                horizontal
                renderItem={({ item }) => (
                    <View style={styles.skinCard}>
                        {/* Remplacer require par une vraie image si dispo */}
                        <Image source={require('../assets/vetement-principal.png')} style={styles.skinImage} />
                        <Text style={styles.skinName}>{item.nom}</Text>
                    </View>
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
        color: '#6EE7FF',
        marginBottom: 18,
        letterSpacing: 1.5,
    },
    sectionTitle: {
        color: '#FF3600',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 10,
        letterSpacing: 1.2,
    },
    vetementCard: {
        backgroundColor: '#18181B',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#6EE7FF',
    },
    vetementName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    vetementId: {
        color: '#AAA',
        fontSize: 13,
    },
    skinCard: {
        backgroundColor: '#18181B',
        borderRadius: 10,
        padding: 10,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6EE7FF',
        width: 110,
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
    },
    empty: {
        color: '#AAA',
        fontStyle: 'italic',
        marginTop: 10,
    },
});
