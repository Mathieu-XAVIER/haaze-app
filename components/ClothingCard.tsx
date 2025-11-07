import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ImageSourcePropType } from 'react-native';

interface ClothingCardProps {
    imageSource: ImageSourcePropType;
    title: string;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ imageSource, title }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Pressable
            style={styles.card}
            onPressIn={() => setIsHovered(true)}
            onPressOut={() => setIsHovered(false)}
        >
            <View style={styles.imageContainer}>
                {/* Fond vortex */}
                <Image source={require('../assets/bg-vortex.png')} style={styles.vortexBackground} />

                {/* Fond blanc */}
                <View style={styles.whiteBackground} />

                {/* Image vêtement */}
                <Image source={imageSource} style={styles.clothingImage} />
            </View>

            {/* Overlay titre */}
            {isHovered && (
                <View style={styles.overlay}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            )}
        </Pressable>
    );
};

export default ClothingCard;

const styles = StyleSheet.create({
    card: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 15,
        position: 'relative',
        backgroundColor: '#fff', // si jamais tu veux forcer le fond
    },

    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    vortexBackground: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    whiteBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        opacity: 0.9,
        position: 'absolute',
    },
    clothingImage: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain',
        zIndex: 2,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    title: {
        color: '#3300FD',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
