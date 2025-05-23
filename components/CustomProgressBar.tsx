import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// @ts-ignore
export default function CustomProgressBar({ progress }) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FF6A00', '#FF3600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.fill, { width: `${progress * 100}%` }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 10,
        backgroundColor: '#222',
        borderRadius: 0,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});
