import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import CustomProgressBar from '../components/CustomProgressBar';
import { ProgressBar } from 'react-native-paper';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.brand}>HAAZE</Text>
            </View>

            <Text style={styles.pseudo}>Mathieu</Text>

            <View style={styles.userBlock}>
                <Text style={styles.levelText}>Lv.1</Text>
                <ProgressBar progress={0} color="#3300FD" style={styles.progressBar} />
                <Text style={styles.levelText}>Lv.2</Text>
            </View>

            <View style={styles.tshirtContainer}>
                <ImageBackground
                    source={require('../assets/bg-vortex.png')}
                    style={styles.tshirtWrapper}
                    imageStyle={styles.vortexImage}
                    resizeMode="cover"
                >
                    <Image source={require('../assets/tshirt.png')} style={styles.tshirtImage} />
                </ImageBackground>
            </View>

            <View style={styles.tshirtLevelWrapper}>
                <Text style={styles.itemLabel}>T-shirt HAAZE #1</Text>

                <CustomProgressBar progress={0.6} />

                <View style={styles.levelRow}>
                    <Text style={styles.levelText}>Lv.1</Text>
                    <Text style={styles.levelText}>Lv.2</Text>
                </View>
            </View>



            {/* Boutons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.neonButtonBlue}>
                    <Text style={styles.btnText}>Voir tous les skins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.neonButtonBlue}>
                    <Text style={styles.btnText}>Changer de vêtement</Text>
                </TouchableOpacity>
            </View>


            {/* Missions */}
            <Text style={styles.sectionTitle}>MISSIONS EN COURS</Text>

            <View style={styles.missionCard}>
                <Text style={styles.missionTitle}>Je suis la mission 1</Text>
                <View style={styles.missionRow}>
                    <ProgressBar progress={0.5} color="#FF3600" style={styles.progressMission} />
                    <Text style={styles.xp}>+350 XP</Text>
                </View>
            </View>

            <View style={styles.missionCard}>
                <Text style={styles.missionTitle}>Je suis la mission 3</Text>
                <View style={styles.missionRow}>
                    <ProgressBar progress={0.5} color="#FF3600" style={styles.progressMission} />
                    <Text style={styles.xp}>+350 XP</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.viewAllBtn}>
                <Text style={styles.btnText}>Voir toutes les missions</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        padding: 20,
        flex: 1,
    },

    // LOGO ET TITRE CÔTE À CÔTE & CENTRÉS
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 8,
    },
    brand: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 2,
    },

    pseudo: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'left',
        marginBottom: 6,
    },
    userBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    levelText: {
        color: '#FFF',
        fontSize: 14,
    },
    progressBar: {
        flex: 1,
        marginHorizontal: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#111',
    },
    tshirtContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tshirtWrapper: {
        width: 400,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vortexImage: {
        borderRadius: 140,
        opacity: 0.6,
    },
    tshirtImage: {
        width: 190,
        height: 190,
        resizeMode: 'contain',
    },

    // T-SHIRT LVL
    tshirtLevelWrapper: {
        marginBottom: 20,
    },

    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },

    itemLabel: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'left',
    },

    // Buttons
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },

    neonButtonBlue: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 14,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#3300FD',
        borderRadius: 0, // coins carrés
        alignItems: 'center',
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 10, // pour Android
    },

    btnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: '#3300FD',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    missionCard: {
        backgroundColor: '#111',
        borderColor: '#3300FD',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    missionTitle: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 6,
    },
    missionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressMission: {
        flex: 1,
        marginRight: 10,
        height: 8,
        borderRadius: 8,
        backgroundColor: '#222',
    },
    xp: {
        color: '#FF3600',
        fontWeight: 'bold',
    },
    viewAllBtn: {
        borderColor: '#FF3600',
        borderWidth: 2,
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
    },
});
