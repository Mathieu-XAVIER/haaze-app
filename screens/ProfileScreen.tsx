import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {getUser, logout, User} from '../services/api';
import NeonCard from '../components/NeonCard';

export default function ProfileScreen({onLogout}: { onLogout: () => void }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser().then(setUser);
    }, []);

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>H</Text>
                <Text style={styles.username}>{user?.name || 'Je suis le pseudo'}</Text>
            </View>

            <View style={styles.tshirtContainer}>
                <Text style={styles.tshirtName}>T-shirt HAAZE #1</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {width: '40%'}]}/>
                </View>
                <Text style={styles.level}>Lv.1</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Voir tous les skins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Changer de vêtements</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>MISSIONS EN COURS</Text>
            <FlatList
                data={[1, 2, 3]}
                keyExtractor={(item) => item.toString()}
                renderItem={({item}) => (
                    <View style={styles.missionCard}>
                        <Text style={styles.missionText}>Je suis la mission {item} +350 XP</Text>
                        <View style={styles.missionBar}>
                            <View style={[styles.missionFill, {width: '50%'}]}/>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.missionButton}>
                <Text style={styles.missionButtonText}>Voir toutes les missions</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Collections à venir</Text>
            <FlatList
                horizontal
                data={[
                    {id: '1', label: 'HAAZE X OL'},
                    {id: '2', label: 'HAAZE X FOREVER VACATION'},
                ]}
                renderItem={({item}) => (
                    <View style={styles.collectionCard}>
                        <Text style={styles.collectionText}>{item.label}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff', padding: 20},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
    logo: {fontSize: 40, fontWeight: 'bold', marginRight: 10},
    username: {fontSize: 18, fontWeight: '500'},
    tshirtContainer: {marginBottom: 20},
    tshirtName: {fontSize: 16, marginBottom: 6},
    progressBar: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: 8,
        backgroundColor: '#3300FD',
    },
    level: {fontSize: 12, color: '#555', marginTop: 4},
    buttonRow: {flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16},
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {color: '#fff', fontWeight: 'bold'},
    sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#3300FD', marginVertical: 12},
    missionCard: {
        backgroundColor: '#3300FD',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    missionText: {color: '#fff', marginBottom: 4},
    missionBar: {
        height: 6,
        backgroundColor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
    },
    missionFill: {height: 6, backgroundColor: '#000'},
    missionButton: {
        marginTop: 10,
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    missionButtonText: {
        color: '#3300FD',
        fontWeight: 'bold',
        fontSize: 14,
    },
    collectionCard: {
        backgroundColor: '#000',
        borderRadius: 12,
        marginRight: 10,
        padding: 20,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
    logoutButton: {
        marginTop: 30,
        alignSelf: 'center',
        backgroundColor: '#FF3600',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    logoutText: {color: '#fff', fontWeight: 'bold'},
});
