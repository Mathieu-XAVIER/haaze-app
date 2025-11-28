import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

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
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            edgeToEdgeEnabled: true,
            package: 'com.anonymous.haaze',
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

