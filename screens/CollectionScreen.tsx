import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import CustomBlueProgressBar from '../components/CustomBlueProgressBar';
import SectionTitle from "../components/SectionTitle";
import ClothingCard from "../components/ClothingCard";
import {useNavigation} from '@react-navigation/native';

export default function CollectionScreen() {
    const [activeTab, setActiveTab] = useState<'inventaire' | 'collection'>('inventaire');
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo}/>
                <CustomBlueProgressBar
                    progress={0.4}
                    pseudo="Mathieu"
                    level={1}
                    nextLevel={2}
                    xpText="800/2000xp"
                    compact={true}
                />
            </View>

            {/* Onglets */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'inventaire' && styles.activeTab]}
                    onPress={() => setActiveTab('inventaire')}
                >
                    <Text style={styles.tabText}>Inventaire</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'collection' && styles.activeTab]}
                    onPress={() => setActiveTab('collection')}
                >
                    <Text style={styles.tabText}>Collection</Text>
                </TouchableOpacity>
            </View>

            {/* Contenu selon l'onglet actif */}
            <View style={styles.content}>
                {activeTab === 'inventaire' ? (
                    <>
                        <SectionTitle title="Mes vêtements"/>
                        <View style={styles.grid}>
                            <ClothingCard imageSource={require('../assets/tshirt.png')} title="T-shirt #1"/>
                            <ClothingCard imageSource={require('../assets/tshirt.png')} title="T-shirt #2"/>
                            <ClothingCard imageSource={require('../assets/tshirt.png')} title="T-shirt #3"/>
                            <ClothingCard imageSource={require('../assets/tshirt.png')} title="T-shirt #4"/>
                        </View>

                        <SectionTitle title="Mes badges"/>
                        <View style={styles.badgeGrid}>
                            <Image source={require('../assets/badge-1.png')} style={styles.badge}/>
                            <Image source={require('../assets/badge-2.png')} style={styles.badge}/>
                            <Image source={require('../assets/badge-3.png')} style={styles.badge}/>
                        </View>

                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => navigation.navigate('Scan')} // Assure-toi que la route 'Scan' existe
                        >
                            <Text style={styles.scanButtonText}>Scanner un vêtement</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <SectionTitle title="Collections"/>
                        <SectionTitle title="Collections à venir"/>
                    </>
                )}
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
        marginBottom: 20,
    },

    logo: {
        width: 50,
        height: 50,
        marginRight: 8,
    },

    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#3300FD',
        paddingBottom: 10,
    },

    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    activeTab: {
        borderBottomWidth: 4,
        borderBottomColor: '#3300FD',
        shadowColor: '#3300FD',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },

    tabText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    content: {
        paddingTop: 10,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },

    badge: {
        width: '32%',
        aspectRatio: 1,
        marginBottom: 15,
        resizeMode: 'contain',
    },

    scanButton: {
        margin: 30,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#FF3600',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowColor: '#FF3600',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },

    scanButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    placeholder: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
