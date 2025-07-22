import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getUser, User, Vetement } from '../services/api';

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser().then(setUser);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon Profil</Text>
            {user && (
                <>
                    <Text style={styles.info}>Nom : <Text style={styles.value}>{user.name}</Text></Text>
                    <Text style={styles.info}>Email : <Text style={styles.value}>{user.email}</Text></Text>
                    <Text style={styles.sectionTitle}>Mes vêtements</Text>
                    <FlatList
                        data={user.vetements}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.vetementCard}>
                                <Text style={styles.vetementName}>{item.nom}</Text>
                                <Text style={styles.vetementId}>NFC : {item.nfcId}</Text>
                                <Text style={styles.vetementCmd}>Commande : {item.numeroCommande}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.empty}>Aucun vêtement associé</Text>}
                    />
                </>
            )}
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
    info: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 4,
    },
    value: {
        color: '#6EE7FF',
        fontWeight: 'bold',
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
    vetementCmd: {
        color: '#6EE7FF',
        fontSize: 13,
        marginTop: 2,
    },
    empty: {
        color: '#AAA',
        fontStyle: 'italic',
        marginTop: 10,
    },
});
