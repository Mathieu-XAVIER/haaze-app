/**
 * Types for raw API responses (snake_case from Laravel)
 */

export interface RawMediaItem {
    original_url?: string;
    url?: string;
    full_url?: string;
    getUrl?: () => string;
}

export interface RawBrand {
    id: number;
    name: string;
}

export interface RawCollection {
    id: number;
    name: string;
}

export interface RawNfcTag {
    uid?: string;
}

export interface RawClothing {
    id: number;
    nom?: string;
    name?: string;
    description?: string;
    image?: string;
    image_url?: string;
    media_url?: string;
    get_first_media_url?: string;
    first_media_url?: string;
    media?: RawMediaItem[] | RawMediaItem;
    nfc_id?: string;
    nfcId?: string;
    nfc_tag?: RawNfcTag;
    nfc_tag_id?: string;
    numero_commande?: string;
    numeroCommande?: string;
    order_number?: string;
    clothing_id?: number;
    brand?: RawBrand;
    collection?: RawCollection;
}

export interface RawUserClothing {
    id: number;
    clothing_id?: number;
    nfc_id?: string;
    nfcId?: string;
    nfc_code?: string;
    nfc_tag?: RawNfcTag;
    order_number?: string;
    numero_commande?: string;
    numeroCommande?: string;
    image?: string;
    image_url?: string;
    media_url?: string;
    media?: RawMediaItem[] | RawMediaItem;
    clothing?: RawClothing;
    nom?: string;
    name?: string;
}

export interface RawOrder {
    id: number;
    numero_commande?: string;
    numeroCommande?: string;
    order_number?: string;
    date?: string;
    created_at?: string;
    createdAt?: string;
    date_commande?: string;
    clothes?: RawClothing[];
    clothings?: RawClothing[];
    items?: RawOrderItem[];
    order_items?: RawOrderItem[];
    total_items?: number;
    total_linked?: number;
}

export interface RawOrderItem {
    id: number;
    clothing_id: number;
    quantity?: number;
    price?: number;
    linked_count?: number;
    clothing?: RawClothing;
}

export interface RawUser {
    id: number;
    name?: string;
    pseudo?: string;
    username?: string;
    email: string;
    level?: number;
    niveau?: number;
    xp?: number;
    xp_for_next_level?: number;
    xpForNextLevel?: number;
    vetements?: RawUserClothing[];
    clothes?: RawUserClothing[];
    clothings?: RawUserClothing[];
    owned_clothing?: RawUserClothing[];
    user_clothing?: RawUserClothing[];
    orders?: RawOrder[];
    commandes?: RawOrder[];
}

export interface RawMission {
    id: number;
    title?: string;
    name?: string;
    description?: string;
    progress?: number;
    current_progress?: number;
    total?: number;
    target?: number;
    xp?: number;
    reward?: string;
    completed?: boolean;
    is_completed?: boolean;
}

export interface RawCollectionData {
    id: number;
    title?: string;
    name?: string;
    subtitle?: string;
    image?: string;
    coming_soon?: boolean;
    is_coming_soon?: boolean;
}

export interface RawSkin {
    id: number;
    name?: string;
    nom?: string;
    image?: string;
    is_default?: boolean;
    active?: boolean;
    clothing_id?: number;
    vetement_id?: number;
}

export interface RawStats {
    vetements_owned?: number;
    vetements_count?: number;
    missions_completed?: number;
    missions_count?: number;
    total_xp?: number;
    xp?: number;
    skins_count?: number;
    skins?: number;
}
