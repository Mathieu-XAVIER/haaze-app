import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import api from '../services/api';

// Définition du type des paramètres de navigation
interface ScanParams {
    numeroCommande: string;
}

export default function ScanScreen() {
    const route = useRoute<RouteProp<{ params: ScanParams }, 'params'>>();
    const numeroCommande = route.params?.numeroCommande || '';

    const [vetements, setVetements] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        if (!numeroCommande) return;
        console.log('[Scan] Numéro de commande :', numeroCommande);
        fetchVetements();
    }, [numeroCommande]);

    const fetchVetements = async () => {
        try {
            const res = await api.post('/orders/lookup', { numero_commande: numeroCommande });
            setVetements(res.data);
        } catch (err) {
            console.error('[API] Échec récupération vêtements', err);
            Alert.alert('Erreur', "Impossible de récupérer les vêtements");
        }
    };

    const startScan = async () => {
        Alert.alert(
            'NFC désactivé',
            "La lecture NFC est temporairement désactivée pour pouvoir tester l'application dans Expo Go. Réactive-la après avoir créé un build natif."
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Relier un vêtement</Text>
            <Text style={styles.subtitle}>Commande : {numeroCommande}</Text>

            <FlatList
                data={vetements}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelected(item)}
                        style={[styles.item, selected?.id === item.id && styles.selected]}
                    >
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun vêtement à lier</Text>}
            />

            {selected && (
                <Button title="Scanner la puce NFC" onPress={startScan} color="#3300FD" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { color: '#AAA', marginBottom: 20 },
    item: {
        backgroundColor: '#181818',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#444',
    },
    selected: {
        borderColor: '#3300FD',
    },
    itemText: {
        color: '#FFF',
        fontSize: 16,
    },
    empty: {
        color: '#AAA',
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center',
    },
});