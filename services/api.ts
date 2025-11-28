import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const resolveApiBaseUrl = () => {
    const extra = (Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {}) as {
        apiUrl?: string;
    };

    const base = extra.apiUrl?.trim();

    return (base && base.length > 0 ? base : 'http://127.0.0.1:8000/api').replace(/\/$/, '');
};

export const API_BASE_URL = resolveApiBaseUrl();

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
    const response = await api.get('/user');
    return response.data;
}

export async function logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('haaze_logged_in');
}

export default api;

export interface User {
    id: number;
    name: string;
    email: string;
    vetements?: {
        id: number;
        nom: string;
        nfcId: string;
        numeroCommande: string;
    }[];
}
