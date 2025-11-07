import {create} from 'zustand';


interface ClothingItem {
    id: number;
    name: string;
    nfc_code?: string;
}


interface ClothingStore {
    collection: ClothingItem[];
    setCollection: (items: ClothingItem[]) => void;
    addToCollection: (item: ClothingItem) => void;
}


export const useClothingStore = create<ClothingStore>((set) => ({
    collection: [],
    setCollection: (items) => set({collection: items}),
    addToCollection: (item) => set((state) => ({collection: [...state.collection, item]}))
}));