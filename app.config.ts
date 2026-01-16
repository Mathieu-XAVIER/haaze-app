import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'https://haaze.mathieu-xavier.fr/api';
    
    if (process.env.NODE_ENV === 'development') {
        console.log('[Config] EXPO_PUBLIC_API_URL from env:', process.env.EXPO_PUBLIC_API_URL);
        console.log('[Config] Final apiUrl:', apiUrl);
    }

    return {
        ...config,
        name: 'haaze',
        slug: 'haaze',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        newArchEnabled: true,
        splash: {
            image: './assets/splash-icon.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        plugins: [
            './plugins/withNfc.js',
            './plugins/withAndroidProviders.js',
        ],
        ios: {
            supportsTablet: true,
            infoPlist: {
                NFCReaderUsageDescription: 'Cette application utilise le NFC pour scanner et lier vos vêtements à votre compte.',
            },
            bundleIdentifier: 'fr.mathieuxavier.haaze',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            edgeToEdgeEnabled: true,
            package: 'fr.mathieuxavier.haaze',
        },
        web: {
            favicon: './assets/favicon.png',
        },
        extra: {
            ...config.extra,
            apiUrl,
            eas: {
                projectId: '8629aa80-ad11-4509-9cee-f602d830adcd',
            },
        },
    };
};
