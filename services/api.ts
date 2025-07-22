// Interfaces principales
export interface User {
  id: string;
  email: string;
  name: string;
  vetements: Vetement[];
}

export interface Vetement {
  id: string;
  nfcId: string;
  numeroCommande: string;
  nom: string;
  skinsDebloques: Skin[];
}

export interface Mission {
  id: string;
  titre: string;
  description: string;
  terminee: boolean;
  type: 'scan' | 'lieu' | 'ra';
}

export interface Skin {
  id: string;
  nom: string;
  image: string; // chemin ou url de l'image
}

// Mocks de données
export const mockSkins: Skin[] = [
  { id: 'skin1', nom: 'Néon Bleu', image: 'skin-neon-bleu.png' },
  { id: 'skin2', nom: 'Vortex Orange', image: 'skin-vortex-orange.png' },
];

export const mockVetements: Vetement[] = [
  {
    id: 'v1',
    nfcId: '04A224B1C2D3',
    numeroCommande: 'CMD123456',
    nom: 'T-shirt Haaze X',
    skinsDebloques: [mockSkins[0]],
  },
];

export const mockMissions: Mission[] = [
  {
    id: 'm1',
    titre: 'Premier scan',
    description: 'Scanne ton vêtement pour la première fois.',
    terminee: true,
    type: 'scan',
  },
  {
    id: 'm2',
    titre: 'Effet RA',
    description: 'Utilise un effet de réalité augmentée.',
    terminee: false,
    type: 'ra',
  },
];

export const mockUser: User = {
  id: 'u1',
  email: 'test@haaze.com',
  name: 'Mathieu',
  vetements: mockVetements,
};

// Fonctions pour récupérer les données (mock)
export function getUser(): Promise<User> {
  return Promise.resolve(mockUser);
}

export function getMissions(): Promise<Mission[]> {
  return Promise.resolve(mockMissions);
}

export function getVetements(): Promise<Vetement[]> {
  return Promise.resolve(mockVetements);
}

export function getSkins(): Promise<Skin[]> {
  return Promise.resolve(mockSkins);
}
