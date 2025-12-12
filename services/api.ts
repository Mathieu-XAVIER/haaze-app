import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const resolveApiBaseUrl = () => {
    const extra = (Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {}) as {
        apiUrl?: string;
    };

    const base = extra.apiUrl?.trim();

    return (base && base.length > 0 ? base : 'https://haaze.mathieu-xavier.fr/api').replace(/\/$/, '');
};

export const API_BASE_URL = resolveApiBaseUrl();

if (__DEV__) {
    console.log('[API] base URL:', API_BASE_URL);
}

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function getUser() {
    // Essayer /me d'abord, puis /user en fallback
    try {
        const response = await api.get('/me');
        return response.data;
    } catch (error) {
        // Fallback sur /user si /me n'existe pas
        const response = await api.get('/user');
        return response.data;
    }
}

export async function logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('haaze_logged_in');
}

export default api;

export interface Order {
    id: number;
    numero_commande: string;
    clothes?: Clothing[];
}

export interface Clothing {
    id: number;
    name: string;
    numero_commande: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    level?: number;
    xp?: number;
    xpForNextLevel?: number;
    vetements?: Vetement[];
    orders?: Order[];
}

export interface Vetement {
    id: number;
    nom: string;
    nfcId: string;
    numeroCommande: string;
    image?: string;
}

export interface Mission {
    id: number;
    title: string;
    description?: string;
    progress: number;
    total: number;
    xp: number;
    reward?: string;
    completed?: boolean;
}

export interface Collection {
    id: number;
    title: string;
    subtitle?: string;
    image?: string;
    coming_soon?: boolean;
}

export interface Skin {
    id: number;
    name: string;
    image?: string;
    active?: boolean;
    vetement_id?: number;
}

export interface UserStats {
    vetements_owned: number;
    missions_completed: number;
    total_xp: number;
    skins_count: number;
}

// Fonctions API pour récupérer les données
export async function getMissions(): Promise<Mission[]> {
    // L'endpoint /missions n'existe pas encore dans l'API
    // Retourner un tableau vide pour éviter les erreurs 404
    // TODO: Implémenter quand l'endpoint sera disponible
    return [];
}

export async function getCollections(): Promise<Collection[]> {
    // L'endpoint /collections n'existe pas encore dans l'API
    // Retourner un tableau vide pour éviter les erreurs 404
    // TODO: Implémenter quand l'endpoint sera disponible
    return [];
}

export async function getSkins(): Promise<Skin[]> {
    try {
        const response = await api.get('/skins');
        // Adapter la réponse de l'API au format attendu
        return response.data.map((skin: any) => ({
            id: skin.id,
            name: skin.name,
            image: skin.image || undefined,
            active: skin.is_default || false,
            vetement_id: skin.clothing_id,
        }));
    } catch (error) {
        console.error('[API] Erreur lors de la récupération des skins:', error);
        return [];
    }
}

export async function getUserStats(): Promise<UserStats> {
    try {
        // Calculer les stats à partir des données utilisateur
        const user = await getUser();
        const skins = await getSkins();
        
        return {
            vetements_owned: user.vetements?.length || 0,
            missions_completed: 0, // TODO: Calculer quand les missions seront disponibles
            total_xp: user.xp || 0,
            skins_count: skins.length,
        };
    } catch (error) {
        console.error('[API] Erreur lors de la récupération des stats:', error);
        // Retourner des valeurs par défaut
        return {
            vetements_owned: 0,
            missions_completed: 0,
            total_xp: 0,
            skins_count: 0,
        };
    }
}

// Récupérer les vêtements d'une commande
export async function getOrderClothes(numeroCommande: string): Promise<Clothing[]> {
    try {
        const response = await api.post('/orders/lookup', { numero_commande: numeroCommande });
        return response.data;
    } catch (error) {
        console.error('[API] Erreur lors de la récupération des vêtements de la commande:', error);
        return [];
    }
}

// Lier un vêtement à un tag NFC
export async function linkClothing(clothingId: number, nfcId: string): Promise<void> {
    try {
        await api.post('/clothes/link', {
            clothing_id: clothingId,
            nfc_id: nfcId,
        });
    } catch (error) {
        console.error('[API] Erreur lors de la liaison du vêtement:', error);
        throw error;
    }
}
