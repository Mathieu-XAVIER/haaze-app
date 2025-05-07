import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CollectionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ta Collection</Text>
            <Text style={styles.subtitle}>Tu n'as encore rien débloqué !</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
    },
});