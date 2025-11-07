import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomOrangeProgressBar from '../components/CustomOrangeProgressBar';
import CustomBlueProgressBar from '../components/CustomBlueProgressBar';
import MissionCard from '../components/MissionCard';
import SectionTitle from '../components/SectionTitle';
import {useNavigation} from '@react-navigation/native';
import NeonButton from '../components/NeonButton';
import NeonProgressBar from '../components/NeonProgressBar';

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.brand}>HAAZE</Text>
            </View>

            <NeonProgressBar
                progress={0.4}
                pseudo="Mathieu"
                level={1}
                nextLevel={2}
                xpText="800/2000xp"
                color="blue"
            />

            <View style={styles.tshirtContainer}>
                <ImageBackground
                    source={require('../assets/bg-vortex.png')}
                    style={styles.tshirtWrapper}
                    imageStyle={styles.vortexImage}
                    resizeMode="cover"
                >
                    <Image source={require('../assets/tshirt.png')} style={styles.tshirtImage} resizeMode="contain" />
                </ImageBackground>
            </View>

            <NeonProgressBar
                progress={0.6}
                title="T-shirt HAAZE"
                level={3}
                nextLevel={4}
                xpText="3500/6000xp"
                color="orange"
            />

            {/* Boutons avec NeonButton */}
            <View style={styles.buttonRow}>
                <NeonButton color="blue" onPress={() => {}}>
                    Voir tous les skins
                </NeonButton>
                <NeonButton color="blue" onPress={() => {}}>
                    Changer de vêtement
                </NeonButton>
            </View>

            {/* Missions */}
            <View style={styles.sectionWrapper}>
                <ImageBackground
                    source={require('../assets/bg-title-missions.png')}
                    style={styles.missionTitleWrapper}
                    imageStyle={styles.missionTitleImage}
                    resizeMode="cover"
                >
                    <SectionTitle title="MISSIONS EN COURS"/>
                </ImageBackground>

                <MissionCard title="Faire 2 pompes" progress={1} total={2} xp={350} />
                <MissionCard title="Marcher 5000 pas" progress={3} total={5} xp={500} />
                <MissionCard title="Jouer 3 parties" progress={2} total={3} xp={750} />

                <TouchableOpacity
                    style={styles.viewAllBtn}
                    onPress={() => navigation.navigate('Missions')}
                >
                    <Text style={styles.btnText}>Voir toutes les missions</Text>
                    <Text style={styles.btnPlus}>+</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        padding: 20,
        paddingTop: 50,
        flex: 1,
    },
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3300FD',
        letterSpacing: 2,
        fontFamily: 'Minasans',
        // Aucun effet de néon
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
        opacity: 0.8,
    },
    tshirtImage: {
        width: 190,
        height: 190,
        resizeMode: 'contain',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    neonButtonBlue: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 0,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 16,
        elevation: 10,
        overflow: 'hidden',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Helvetica',
        letterSpacing: 1.2,
        textShadowColor: '#3300FD',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        paddingVertical: 14,
    },
    sectionWrapper: {
        padding: 16,
    },
    missionTitleWrapper: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        paddingLeft: 20,
        marginLeft: -40,
        marginBottom: 20,
    },
    missionTitleImage: {
        borderRadius: 20,
        resizeMode: 'cover',
        transform: [{scale: 1.5}],
    },
    viewAllBtn: {
        margin: 20,
        borderWidth: 2,
        borderColor: '#3300FD',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 12,
        shadowColor: '#3300FD',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 8,
    },
    btnPlus: {
        color: '#FF3600',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        textShadowColor: '#FF3600',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
});
