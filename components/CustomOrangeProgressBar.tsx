import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

interface Props {
    progress: number;
    title: string;
    level: number;
    nextLevel: number;
    xpText: string;
}

// @ts-ignore
export default function CustomOrangeProgressBar({progress = 0, title, level, nextLevel, xpText}: Props) {
    return (
        <View style={styles.wrapper}>

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.progressBarBackground}>
                    <LinearGradient
                        colors={['#FF6A00', '#FF3600']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={[styles.progressFill, {width: `${Math.min(progress * 100, 100)}%`}]}
                    />
                    <Text style={styles.xpText}>{xpText}</Text>
                </View>
                <View style={styles.levelRow}>
                    <Text style={styles.levelText}>Lv.{level}</Text>
                    <Text style={styles.levelText}>Lv.{nextLevel}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    levelGeneral: {
        color: '#888', // gris
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        minWidth: 40,
    },
    content: {
        flex: 1,
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    progressBarBackground: {
        height: 20,
        backgroundColor: '#111',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    progressFill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
    },
    xpText: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        zIndex: 1,
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    levelText: {
        color: '#FFF',
        fontSize: 14,
    },
});
