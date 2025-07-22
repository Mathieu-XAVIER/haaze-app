import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomBlueProgressBar from "../components/CustomBlueProgressBar";
import MissionCard from "../components/MissionCard";
import CustomOrangeProgressBar from "../components/CustomOrangeProgressBar";
import SectionTitle from "../components/SectionTitle";
import { getMissions, Mission } from '../services/api';
import NeonButton from '../components/NeonButton';
import NeonProgressBar from '../components/NeonProgressBar';

export default function MissionsScreen() {
    const [missions, setMissions] = useState<Mission[]>([]);

    useEffect(() => {
        getMissions().then(setMissions);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <NeonProgressBar
                    progress={0.4}
                    pseudo="Mathieu"
                    level={1}
                    nextLevel={2}
                    xpText="800/2000xp"
                    color="blue"
                    compact={true}
                />
            </View>

            <View style={styles.sectionWrapper}>
                <ImageBackground
                    source={require('../assets/bg-title-missions.png')}
                    style={styles.missionTitleWrapper}
                    imageStyle={styles.missionTitleImage}
                    resizeMode="cover"
                >
                    <SectionTitle title="MISSIONS EN COURS"/>
                </ImageBackground>

                {/* Affichage dynamique des missions mockées */}
                {missions.map(mission => (
                    <MissionCard
                        key={mission.id}
                        title={mission.titre}
                        progress={mission.terminee ? 1 : 0}
                        total={1}
                        xp={mission.type === 'scan' ? 350 : mission.type === 'ra' ? 500 : 750}
                    />
                ))}

                <NeonButton color="blue" onPress={() => {}} style={{marginTop: 16}}>
                    Voir toutes les missions
                </NeonButton>
            </View>

            <View style={styles.tshirtContainer}>
                <ImageBackground
                    source={require('../assets/bg-vortex.png')}
                    style={styles.tshirtWrapper}
                    imageStyle={styles.vortexImage}
                    resizeMode="cover"
                >
                    <Image source={require('../assets/tshirt.png')} style={styles.tshirtImage} resizeMode="contain" />
                </ImageBackground>

                <NeonProgressBar
                    progress={0.6}
                    title="T-shirt HAAZE"
                    level={3}
                    nextLevel={4}
                    xpText="3500/6000xp"
                    color="orange"
                />
            </View>

            <View style={styles.sectionWrapper}>
                <ImageBackground
                    source={require('../assets/bg-title-missions.png')}
                    style={styles.missionTitleWrapper}
                    imageStyle={styles.missionTitleImage}
                    resizeMode="cover"
                >
                    <SectionTitle title="Missions de ce vêtement"/>
                </ImageBackground>

                {/* Filtres */}
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>Trier par :</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>XP décroissant ⌄</Text>
                    </TouchableOpacity>
                </View>

                {/* Liste de missions */}
                <MissionCard title="Faire 2 pompes" progress={0} total={2} xp={350}/>
                <MissionCard title="Marcher 5000 pas" progress={0} total={5} xp={500}/>
                <MissionCard title="Jouer 3 parties" progress={0} total={3} xp={750}/>

                <NeonButton color="blue" onPress={() => {}} style={{marginTop: 16}}>
                    Voir toutes les missions
                </NeonButton>
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
        margin: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 8,
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
        marginTop: 16,
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
    btnPlus: {
        color: '#FF3600',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        textShadowColor: '#FF3600',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
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
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginLeft: 4,
    },
    filterLabel: {
        color: '#AAA',
        fontSize: 14,
        marginRight: 8,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3300FD',
        borderRadius: 4,
    },
    filterText: {
        color: '#FFF',
        fontSize: 14,
    }
});
