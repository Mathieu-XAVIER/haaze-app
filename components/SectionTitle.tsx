import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

type Props = {
    title: string;
};

export default function SectionTitle({ title }: Props) {
    return (
        <ImageBackground
            source={require('../assets/bg-title-missions.png')}
            style={styles.wrapper}
            imageStyle={styles.image}
            resizeMode="cover"
        >
            <Text style={styles.text}>{title}</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        paddingLeft: 20,
        marginLeft: -20,
        marginBottom: 20,
    },
    image: {
        borderRadius: 20,
        resizeMode: 'cover',
        transform: [{ scale: 1.5 }],
    },
    text: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        letterSpacing: 2,
    },
});
