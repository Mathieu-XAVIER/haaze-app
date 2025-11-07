import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import NeonButton from '../components/NeonButton';

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
            <Image source={require('../assets/nfc-icon.png')} style={styles.icon} tintColor="#3300FD" resizeMode="contain" />
            <Text style={styles.title}>Scan d’un vêtement</Text>
            <Text style={styles.subtitle}>
                Approche ton téléphone de la puce NFC de ton vêtement pour l'activer.
            </Text>

            <NeonButton color="blue" onPress={scanNfc} style={{width: 220}} disabled={scanning}>
                {scanning ? 'Scan en cours...' : 'Scanner maintenant'}
            </NeonButton>

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
        backgroundColor: '#0A0A0A',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 30,
        tintColor: '#3300FD',
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3300FD',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 2,
        fontFamily: 'Minasans',
        textShadowColor: '#6EE7FF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 40,
        fontFamily: 'Helvetica',
    },
    scanButton: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3300FD',
        backgroundColor: 'transparent',
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 16,
        elevation: 10,
        marginBottom: 16,
    },
    scanText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Minasans',
        textShadowColor: '#3300FD',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    resultContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    resultLabel: {
        color: '#FF3600',
        fontSize: 14,
        marginBottom: 4,
        fontFamily: 'Minasans',
        textShadowColor: '#FF3600',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    resultValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        fontFamily: 'Helvetica',
        textShadowColor: '#3300FD',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
});
