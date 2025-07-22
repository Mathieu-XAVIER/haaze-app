import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getUser, User, Vetement } from '../services/api';
import NeonCard from '../components/NeonCard';

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
                            <NeonCard color="blue">
                                <Text style={styles.vetementName}>{item.nom}</Text>
                                <Text style={styles.vetementId}>NFC : {item.nfcId}</Text>
                                <Text style={styles.vetementCmd}>Commande : {item.numeroCommande}</Text>
                            </NeonCard>
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3300FD',
        marginBottom: 18,
        letterSpacing: 1.5,
        fontFamily: 'Minasans',
        // Aucun effet de néon
    },
    info: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 4,
        fontFamily: 'Helvetica',
    },
    value: {
        color: '#6EE7FF',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    sectionTitle: {
        color: '#FF3600',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 10,
        letterSpacing: 1.2,
        fontFamily: 'Minasans',
    },
    vetementCard: {
        backgroundColor: '#18181B',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#3300FD',
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
    vetementCmd: {
        color: '#6EE7FF',
        fontSize: 13,
        marginTop: 2,
        fontFamily: 'Helvetica',
    },
    empty: {
        color: '#AAA',
        fontStyle: 'italic',
        marginTop: 10,
    },
});
