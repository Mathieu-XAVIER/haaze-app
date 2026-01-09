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

function normalizeImageUrl(imageUrl: string | undefined): string | undefined {
    if (!imageUrl) return undefined;
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        if (imageUrl.includes('/storage/')) {
            return imageUrl;
        }
        return imageUrl;
    }
    
    const baseUrl = API_BASE_URL.replace('/api', '');
    
    if (imageUrl.startsWith('/storage/')) {
        return `${baseUrl}${imageUrl}`;
    } else if (!imageUrl.startsWith('/')) {
        return `${baseUrl}/storage/${imageUrl}`;
    } else {
        return `${baseUrl}${imageUrl}`;
    }
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
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const url = error.config?.url;
        const status = error.response?.status;
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || errorData?.exception || error.message;
        
        if (url === '/skins' && status === 500) {
            return Promise.reject(error);
        }
        
        if (url === '/me' && status === 500 && errorMessage?.includes('Column not found') && errorMessage?.includes('clothing')) {
            return Promise.reject(error);
        }
        
        return Promise.reject(error);
    }
);

export async function getUser(): Promise<User> {
    try {
        const response = await api.get('/me');
        const user = response.data.data || response.data;
        
        if (user && user.id) {
            // Nouvelle structure : user_clothing avec relation clothing
            const rawVetements = user.vetements || user.clothes || user.clothings || user.owned_clothing || user.user_clothing || [];
            
            const clothesMap = new Map<number, any>();
            if (user.orders && Array.isArray(user.orders)) {
                user.orders.forEach((order: any) => {
                    if (order.clothes && Array.isArray(order.clothes)) {
                        order.clothes.forEach((clothing: any) => {
                            if (clothing.id) {
                                clothesMap.set(clothing.id, clothing);
                            }
                        });
                    }
                });
            }
            
            const vetements = rawVetements.map((vetement: any) => {
                // Nouvelle structure : vetement peut être un UserClothing avec une relation clothing
                const userClothing = vetement;
                const clothing = vetement.clothing || vetement;
                const fullClothing = clothesMap.get(clothing?.id || vetement.id) || clothing;
                
                let imageUrl = vetement.image 
                    || vetement.image_url 
                    || vetement.media_url
                    || vetement.get_first_media_url
                    || vetement.first_media_url
                    || clothing?.image
                    || clothing?.image_url
                    || clothing?.media_url;
                
                if (!imageUrl && fullClothing) {
                    imageUrl = fullClothing.image 
                        || fullClothing.image_url 
                        || fullClothing.media_url
                        || fullClothing.get_first_media_url
                        || fullClothing.first_media_url;
                }
                
                if (!imageUrl) {
                    const mediaSource = fullClothing?.media || clothing?.media || vetement.media;
                    if (mediaSource) {
                        if (Array.isArray(mediaSource) && mediaSource.length > 0) {
                            imageUrl = mediaSource[0].original_url 
                                || mediaSource[0].url 
                                || mediaSource[0].full_url
                                || mediaSource[0].getUrl?.();
                        } else if (mediaSource.original_url) {
                            imageUrl = mediaSource.original_url;
                        } else if (mediaSource.url) {
                            imageUrl = mediaSource.url;
                        }
                    }
                }
                
                imageUrl = normalizeImageUrl(imageUrl);
                
                // Nouvelle structure : nfc_id peut venir de user_clothing directement ou via nfc_tag
                const nfcId = vetement.nfc_id 
                    || vetement.nfcId 
                    || userClothing?.nfc_id
                    || userClothing?.nfc_code
                    || userClothing?.nfc_tag?.uid
                    || clothing?.nfc_tag?.uid
                    || vetement.nfc_tag_id
                    || '';
                
                const mappedVetement = {
                    id: userClothing?.id || clothing?.id || vetement.id,
                    clothingId: clothing?.id || vetement.clothing_id || vetement.id,
                    nom: clothing?.nom || clothing?.name || vetement.nom || vetement.name || '',
                    nfcId: nfcId,
                    numeroCommande: userClothing?.order_number || vetement.numero_commande || vetement.numeroCommande || clothing?.order_number || vetement.order_number || '',
                    image: imageUrl || undefined,
                };
                
                return mappedVetement;
            });
            
            const vetementsWithoutImages = vetements.filter(v => !v.image);
            if (vetementsWithoutImages.length > 0) {
                const imagePromises = vetementsWithoutImages.map(async (vetement) => {
                    try {
                        // Utiliser clothingId si disponible, sinon id
                        const clothingId = vetement.clothingId || vetement.id;
                        const clothingResponse = await api.get(`/clothes/${clothingId}`);
                        const clothing = clothingResponse.data.data || clothingResponse.data;
                        let imageUrl = clothing?.image 
                            || clothing?.image_url 
                            || clothing?.media_url
                            || clothing?.get_first_media_url
                            || clothing?.first_media_url;
                        
                        if (!imageUrl && clothing?.media) {
                            if (Array.isArray(clothing.media) && clothing.media.length > 0) {
                                imageUrl = clothing.media[0].original_url 
                                    || clothing.media[0].url 
                                    || clothing.media[0].full_url;
                            }
                        }
                        
                        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                            imageUrl = `${API_BASE_URL.replace('/api', '')}/storage/${imageUrl}`;
                        } else if (imageUrl && imageUrl.startsWith('/')) {
                            imageUrl = `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
                        }
                        
                        return { id: vetement.id, image: imageUrl || undefined };
                    } catch (error) {
                        return { id: vetement.id, image: undefined };
                    }
                });
                
                const imageResults = await Promise.allSettled(imagePromises);
                imageResults.forEach((result) => {
                    if (result.status === 'fulfilled' && result.value.image) {
                        const vetementIndex = vetements.findIndex(v => v.id === result.value.id);
                        if (vetementIndex !== -1) {
                            vetements[vetementIndex].image = result.value.image;
                        }
                    }
                });
            }
            
            // Normaliser les commandes pour inclure la date
            const normalizedOrders = (user.orders || user.commandes || []).map((order: any) => ({
                id: order.id,
                numero_commande: order.numero_commande || order.numeroCommande || order.order_number || '',
                date: order.date || order.created_at || order.createdAt || order.date_commande || '',
                clothes: order.clothes || order.clothings || [],
            }));
            
            return {
                id: user.id,
                name: user.name || user.pseudo || user.username || '',
                email: user.email || '',
                level: user.level || user.niveau || 1,
                xp: user.xp || 0,
                xpForNextLevel: user.xp_for_next_level || user.xpForNextLevel || 100,
                vetements: vetements,
                orders: normalizedOrders,
            };
        }
        throw new Error('Réponse utilisateur invalide');
    } catch (error: any) {
        return {
            id: 0,
            name: 'Utilisateur',
            email: '',
            level: 1,
            xp: 0,
            xpForNextLevel: 100,
            vetements: [],
            orders: [],
        };
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
    date?: string;
    created_at?: string;
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
    clothingId?: number; // ID du vêtement dans le catalogue (clothing)
    nom: string;
    nfcId: string;
    numeroCommande: string;
    image?: string;
}

export interface Mission {
    id: number;
    title: string;
    name?: string;
    description?: string;
    progress: number;
    current_progress?: number;
    total: number;
    target?: number;
    xp: number;
    reward?: string;
    completed?: boolean;
    is_completed?: boolean;
}

export interface Collection {
    id: number;
    title: string;
    name?: string;
    subtitle?: string;
    image?: string;
    coming_soon?: boolean;
    is_coming_soon?: boolean;
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

export async function getMissions(): Promise<Mission[]> {
    try {
        const response = await api.get('/missions');
        const data = response.data.data || response.data || [];
        if (Array.isArray(data)) {
            return data.map((mission: any) => ({
                id: mission.id,
                title: mission.title || mission.name || '',
                description: mission.description,
                progress: mission.progress || mission.current_progress || 0,
                total: mission.total || mission.target || 1,
                xp: mission.xp || 0,
                reward: mission.reward,
                completed: mission.completed || mission.is_completed || false,
            }));
        }
        return [];
    } catch (error: any) {
        return [];
    }
}

export async function getCollections(): Promise<Collection[]> {
    try {
        const response = await api.get('/collections');
        const data = response.data.data || response.data || [];
        if (Array.isArray(data)) {
            return data.map((collection: any) => ({
                id: collection.id,
                title: collection.title || collection.name || '',
                subtitle: collection.subtitle,
                image: collection.image,
                coming_soon: collection.coming_soon || collection.is_coming_soon || false,
            }));
        }
        return [];
    } catch (error: any) {
        return [];
    }
}

export async function getSkins(): Promise<Skin[]> {
    try {
        const response = await api.get('/skins');
        const data = response.data.data || response.data || [];
        // Adapter la réponse de l'API au format attendu
        return Array.isArray(data) ? data.map((skin: any) => ({
            id: skin.id,
            name: skin.name || skin.nom,
            image: skin.image || undefined,
            active: skin.is_default || skin.active || false,
            vetement_id: skin.clothing_id || skin.vetement_id,
        })) : [];
    } catch (error) {
        return [];
    }
}

export async function getClothes(): Promise<Vetement[]> {
    try {
        const response = await api.get('/clothes');
        const data = response.data.data || response.data || [];
        return Array.isArray(data) ? data.map((clothing: any) => {
            let imageUrl = clothing.image 
                || clothing.image_url 
                || clothing.media_url
                || clothing.get_first_media_url
                || clothing.first_media_url;
            
            if (!imageUrl && clothing.media) {
                if (Array.isArray(clothing.media) && clothing.media.length > 0) {
                    imageUrl = clothing.media[0].original_url 
                        || clothing.media[0].url 
                        || clothing.media[0].full_url;
                } else if (clothing.media.original_url) {
                    imageUrl = clothing.media.original_url;
                } else if (clothing.media.url) {
                    imageUrl = clothing.media.url;
                }
            }
            
            imageUrl = normalizeImageUrl(imageUrl);
            
            return {
                id: clothing.id,
                nom: clothing.nom || clothing.name,
                nfcId: clothing.nfc_id || clothing.nfcId || clothing.nfc_tag?.uid || '',
                numeroCommande: clothing.numero_commande || clothing.numeroCommande || clothing.order_number || '',
                image: imageUrl || undefined,
            };
        }) : [];
    } catch (error) {
        return [];
    }
}

export async function getClothing(clothingId: number): Promise<Vetement> {
    try {
        const response = await api.get(`/clothes/${clothingId}`);
        const clothing = response.data.data || response.data;
        return {
            id: clothing.id,
            nom: clothing.nom || clothing.name,
            nfcId: clothing.nfc_id || clothing.nfcId || '',
            numeroCommande: clothing.numero_commande || clothing.numeroCommande || '',
            image: clothing.image || clothing.media?.[0]?.original_url || clothing.media?.[0]?.url || clothing.get_first_media_url || undefined,
        };
    } catch (error) {
        throw error;
    }
}

export async function checkNfc(nfcId: string): Promise<Vetement | null> {
    try {
        const response = await api.get(`/nfc/check/${nfcId}`);
        // Nouvelle structure : la réponse contient un UserClothing avec une relation clothing
        const userClothing = response.data.data || response.data;
        if (!userClothing) return null;
        
        const clothing = userClothing.clothing || userClothing;
        
        let imageUrl = userClothing.image 
            || clothing?.image 
            || userClothing.image_url 
            || clothing?.image_url
            || userClothing.media_url
            || clothing?.media_url;
        
        if (!imageUrl) {
            const mediaSource = clothing?.media || userClothing.media;
            if (mediaSource) {
                if (Array.isArray(mediaSource) && mediaSource.length > 0) {
                    imageUrl = mediaSource[0].original_url 
                        || mediaSource[0].url 
                        || mediaSource[0].full_url;
                } else if (mediaSource.original_url) {
                    imageUrl = mediaSource.original_url;
                } else if (mediaSource.url) {
                    imageUrl = mediaSource.url;
                }
            }
        }
        
        imageUrl = normalizeImageUrl(imageUrl);
        
        return {
            id: userClothing.id || clothing?.id || 0,
            clothingId: clothing?.id,
            nom: clothing?.nom || clothing?.name || userClothing.nom || userClothing.name || '',
            nfcId: userClothing.nfc_id || userClothing.nfcId || userClothing.nfc_code || nfcId,
            numeroCommande: userClothing.order_number || userClothing.numero_commande || userClothing.numeroCommande || clothing?.order_number || '',
            image: imageUrl || undefined,
        };
    } catch (error) {
        return null;
    }
}

export async function getUserStats(): Promise<UserStats> {
    try {
        try {
            const response = await api.get('/user/stats');
            const stats = response.data.data || response.data;
            if (stats) {
                return {
                    vetements_owned: stats.vetements_owned || stats.vetements_count || 0,
                    missions_completed: stats.missions_completed || stats.missions_count || 0,
                    total_xp: stats.total_xp || stats.xp || 0,
                    skins_count: stats.skins_count || stats.skins || 0,
                };
            }
        } catch (statsError: any) {
        }
        
        const user = await getUser();
        const skins = await getSkins();
        const missions = await getMissions();
        
        const missionsCompleted = missions.filter(m => m.completed || (m.progress >= m.total)).length;
        
        return {
            vetements_owned: user.vetements?.length || 0,
            missions_completed: missionsCompleted,
            total_xp: user.xp || 0,
            skins_count: skins.length,
        };
    } catch (error) {
        return {
            vetements_owned: 0,
            missions_completed: 0,
            total_xp: 0,
            skins_count: 0,
        };
    }
}

export async function getOrderClothes(numeroCommande: string): Promise<Clothing[]> {
    try {
        const response = await api.post('/orders/lookup', { numero_commande: numeroCommande });
        const data = response.data.data || response.data || [];
        return Array.isArray(data) ? data.map((clothing: any) => ({
            id: clothing.id,
            name: clothing.name || clothing.nom,
            numero_commande: clothing.numero_commande || numeroCommande,
        })) : [];
    } catch (error) {
        return [];
    }
}

export async function linkOrderClothes(orderId: number): Promise<{ success: boolean; message: string; linked_count: number }> {
    try {
        const response = await api.post(`/orders/${orderId}/link-clothes`);
        return response.data.data || response.data;
    } catch (error) {
        throw error;
    }
}

export async function linkClothing(clothingId: number, nfcId: string): Promise<Vetement> {
    try {
        const response = await api.post('/clothes/link', {
            clothing_id: clothingId,
            nfc_id: nfcId,
        });
        // Nouvelle structure : la réponse contient un UserClothing avec une relation clothing
        const userClothing = response.data.data || response.data;
        const clothing = userClothing.clothing || userClothing;
        
        let imageUrl = userClothing.image 
            || clothing?.image 
            || userClothing.image_url 
            || clothing?.image_url
            || userClothing.media_url
            || clothing?.media_url;
        
        if (!imageUrl) {
            const mediaSource = clothing?.media || userClothing.media;
            if (mediaSource) {
                if (Array.isArray(mediaSource) && mediaSource.length > 0) {
                    imageUrl = mediaSource[0].original_url 
                        || mediaSource[0].url 
                        || mediaSource[0].full_url;
                } else if (mediaSource.original_url) {
                    imageUrl = mediaSource.original_url;
                } else if (mediaSource.url) {
                    imageUrl = mediaSource.url;
                }
            }
        }
        
        imageUrl = normalizeImageUrl(imageUrl);
        
        return {
            id: userClothing.id || clothingId,
            clothingId: clothing?.id || clothingId,
            nom: clothing?.nom || clothing?.name || userClothing.nom || userClothing.name || '',
            nfcId: userClothing.nfc_id || userClothing.nfcId || userClothing.nfc_code || nfcId,
            numeroCommande: userClothing.order_number || userClothing.numero_commande || userClothing.numeroCommande || clothing?.order_number || '',
            image: imageUrl || undefined,
        };
    } catch (error) {
        throw error;
    }
}
