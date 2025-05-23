import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

// @ts-ignore
export default function MissionCard({title, progress, total, xp}) {
    const progressPercent = (progress / total) * 100;

    return (
        <LinearGradient
            colors={['#FF3600', '#3300FD']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.card}
        >
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressFill, {width: `${progressPercent}%`}]}/>
                            <Text style={styles.progressText}>{progress}/{total}</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.xp}>
                    <Text style={styles.xpPlus}>+</Text>{xp} XP
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginBottom: 16,
        padding: 2,
        overflow: 'hidden',
    },
    content: {
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    leftContent: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    progressContainer: {
        width: '100%',
    },
    progressBarBackground: {
        height: 20,
        backgroundColor: '#111',
        borderColor: '#FFF',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#FFF',
    },
    progressText: {
        color: '#000',
        fontWeight: 'bold',
        zIndex: 1,
    },
    xp: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    xpPlus: {
        color: '#FF3600',
        fontSize: 18,
    },
});
