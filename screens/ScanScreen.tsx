import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ScanScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Missions</Text>
            <Text style={styles.subtitle}>Bientôt disponible...</Text>
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