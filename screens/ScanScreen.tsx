import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function ScanScreen() {
    const [nfcId, setNfcId] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);

    const scanNfc = async () => {
        setScanning(true);
        try {
            await NfcManager.start();
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();
            setNfcId(tag?.id || 'Inconnu');
            await NfcManager.cancelTechnologyRequest();
        } catch (ex) {
            if (Platform.OS === 'ios' && ex === 'cancelled') {
                // L'utilisateur a annulé le scan
            } else {
                Alert.alert('Erreur', 'Impossible de scanner la puce NFC.');
            }
        } finally {
            setScanning(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/nfc-icon.png')} style={styles.icon} />
            <Text style={styles.title}>Scan d’un vêtement</Text>
            <Text style={styles.subtitle}>
                Approche ton téléphone de la puce NFC de ton vêtement pour l'activer.
            </Text>

            <TouchableOpacity style={styles.scanButton} onPress={scanNfc} disabled={scanning}>
                <Text style={styles.scanText}>{scanning ? 'Scan en cours...' : 'Scanner maintenant'}</Text>
            </TouchableOpacity>

            {nfcId && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>ID de la puce détectée :</Text>
                    <Text style={styles.resultValue}>{nfcId}</Text>
                </View>
            )}
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
        color: '#6EE7FF', // bleu néon
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

    resultContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    resultLabel: {
        color: '#6EE7FF',
        fontSize: 14,
        marginBottom: 4,
    },
    resultValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },
});
