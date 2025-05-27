import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ScanScreen() {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/nfc-icon.png')} style={styles.icon} />
            <Text style={styles.title}>Scan d’un vêtement</Text>
            <Text style={styles.subtitle}>
                Approche ton téléphone de la puce NFC de ton vêtement pour l'activer.
            </Text>

            <TouchableOpacity style={styles.scanButton}>
                <Text style={styles.scanText}>Scanner maintenant</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        width: 100,
        height: 100,
        marginBottom: 30,
        tintColor: '#3300FD',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 1.5,
    },

    subtitle: {
        fontSize: 16,
        color: '#AAA',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 40,
    },

    scanButton: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FF3600',
        backgroundColor: 'transparent',
        shadowColor: '#FF3600',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 10,
    },

    scanText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
