import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../styles/theme';

type Props = {
    title: string;
    variant?: 'default';
};

const TShirtTitle = React.memo<Props>(({ title, variant = 'default' }) => {
    return (
        <Text style={[styles.base, variant && styles[variant]]}>
            {title.toUpperCase()}
        </Text>
    );
});

TShirtTitle.displayName = 'TShirtTitle';

export default TShirtTitle;

const styles = StyleSheet.create({
    base: {
        fontFamily: FONTS.title,
        fontSize: 24,
        color: COLORS.primaryBlue,
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: 28,
    },
    default: {
        // Variant par défaut
    },
});
