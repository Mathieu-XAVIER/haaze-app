import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

interface Props {
    progress: number;
    pseudo: string;
    level: number;
    nextLevel: number;
    xpText: string;
    compact?: boolean;
}

export default function CustomBlueProgressBar({
                                                  progress = 0,
                                                  pseudo,
                                                  level,
                                                  nextLevel,
                                                  xpText,
                                                  compact = false
                                              }: Props) {
    return (
        <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
            {!compact && (
                <Text style={styles.levelGeneral}>Lv.{level}</Text>
            )}

            <View style={styles.content}>
                <Text style={[styles.pseudo, compact && styles.pseudoCompact]}>
                    {pseudo}
                </Text>

                <View style={[styles.progressBarBackground, compact && styles.progressCompact]}>
                    <LinearGradient
                        colors={['#6600FF', '#3300FD']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={[styles.progressFill, {width: `${Math.min(progress * 100, 100)}%`}]}
                    />
                    <Text style={[styles.xpText, compact && styles.xpTextCompact]}>
                        {xpText}
                    </Text>
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
        marginBottom: 20,
    },
    wrapperCompact: {
        marginBottom: 10,
    },
    levelGeneral: {
        color: '#888',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        minWidth: 40,
    },
    content: {
        flex: 1,
    },
    pseudo: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    pseudoCompact: {
        fontSize: 14,
        marginBottom: 4,
    },
    progressBarBackground: {
        height: 20,
        backgroundColor: '#111',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    progressCompact: {
        height: 14,
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
    xpTextCompact: {
        fontSize: 10,
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
