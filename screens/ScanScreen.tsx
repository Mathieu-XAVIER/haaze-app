import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as NFC from 'expo-nfc';

export default function ScanScreen() {
    useEffect(() => {
        const init = async () => {
            const available = await NFC.isAvailableAsync();
            if (!available) {
                Alert.alert('NFC non disponible sur ce périphérique');
            }
        };
        init();
    }, []);

    const startNfcScan = async () => {
        try {
            const tag = await NFC.readTagAsync();
            Alert.alert('Tag NFC détecté', JSON.stringify(tag));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Scanner un tag NFC</Text>
            <Button title="Lancer le scan" onPress={startNfcScan} />
        </View>
    );
}