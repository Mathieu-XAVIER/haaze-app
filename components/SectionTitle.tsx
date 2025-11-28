import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

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
            <View>
                <Text style={styles.text}>{title}</Text>
                <View style={styles.underline} />
            </View>
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
        fontFamily: FONTS.title,
        textAlign: 'left',
        letterSpacing: 2,
    },
    underline: {
        width: 60,
        height: 6,
        borderRadius: 10,
        backgroundColor: COLORS.accentYellow,
        marginTop: 4,
    },
});
