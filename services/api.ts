import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://10.26.129.166:8000/api',
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
