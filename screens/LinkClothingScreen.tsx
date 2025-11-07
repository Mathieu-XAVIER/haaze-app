import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, StyleSheet } from 'react-native';
import { useClothingStore } from '../store/clothing';
import axios from 'axios';


export default function LinkClothingScreen() {
    const [orderNumber, setOrderNumber] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const { addToCollection } = useClothingStore();


    const fetchClothes = async () => {
        try {
            const res = await axios.post('/api/orders/lookup', { order_number: orderNumber });
            setItems(res.data);
        } catch (e) {
            Alert.alert('Erreur', 'Commande introuvable ou non associée à votre compte');
        }
    };


    const attachClothing = async (id: number) => {
        try {
            const res = await axios.post('/api/clothes/link', { clothing_id: id });
            addToCollection(res.data.clothing);
            Alert.alert('Succès', 'Vêtement connecté à votre collection');
        } catch {
            Alert.alert('Erreur', 'Ce vêtement est déjà lié ou une erreur est survenue');
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Numéro de commande"
                value={orderNumber}
                onChangeText={setOrderNumber}
                style={styles.input}
            />
            <Button title="Rechercher" onPress={fetchClothes} />
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Button title="Lier" onPress={() => attachClothing(item.id)} />
                    </View>
                )}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
    itemContainer: { marginVertical: 10 },
    itemText: { fontSize: 16, marginBottom: 5 }
});