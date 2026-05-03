import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  MATERIAIS: '@TecerMulher:materiais',
  USER_SESSION: '@TecerMulher:user_session',
};

export type Bloco = {
  id: string;
  tipo: 'texto' | 'subtitulo' | 'imagem' | 'video' | 'separador';
  conteudo?: string;
  url?: string;
  alt?: string;
};

export type Material = {
  id: string;
  title: string;
  imagemCapa?: string;
  blocos: Bloco[];
  createdAt: string;
};

const MOCK_MATERIAIS: Material[] = [
  {
    id: '1',
    title: 'Introdução ao Mundo Digital',
    imagemCapa: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    blocos: [
      { id: 'b1', tipo: 'subtitulo', conteudo: 'O que é a Internet?' },
      { id: 'b2', tipo: 'texto', conteudo: 'A internet é uma rede global que conecta bilhões de dispositivos em todo o mundo.' },
    ]
  },
  {
    id: '2',
    title: 'Segurança na Rede',
    imagemCapa: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    blocos: [
      { id: 'b3', tipo: 'subtitulo', conteudo: 'Protegendo seus dados' },
      { id: 'b4', tipo: 'texto', conteudo: 'Nunca compartilhe suas senhas com estranhos.' },
    ]
  }
];

export const LocalStorage = {
  // --- MATERIAIS ---
  async getMateriais(): Promise<Material[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MATERIAIS);
      if (data) return JSON.parse(data);
      
      // Se não houver dados, inicializa com mocks
      await this.saveMateriais(MOCK_MATERIAIS);
      return MOCK_MATERIAIS;
    } catch (e) {
      console.error('Error getting materiais:', e);
      return [];
    }
  },

  async saveMateriais(materiais: Material[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MATERIAIS, JSON.stringify(materiais));
    } catch (e) {
      console.error('Error saving materiais:', e);
    }
  },

  async getMaterialById(id: string): Promise<Material | null> {
    const materiais = await this.getMateriais();
    return materiais.find(m => m.id === id) || null;
  },

  async addMaterial(material: Omit<Material, 'id' | 'createdAt'>): Promise<Material> {
    const materiais = await this.getMateriais();
    const newMaterial: Material = {
      ...material,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    await this.saveMateriais([newMaterial, ...materiais]);
    return newMaterial;
  },

  async updateMaterial(id: string, updates: Partial<Material>): Promise<void> {
    const materiais = await this.getMateriais();
    const updated = materiais.map(m => m.id === id ? { ...m, ...updates } : m);
    await this.saveMateriais(updated);
  },

  async deleteMaterial(id: string): Promise<void> {
    const materiais = await this.getMateriais();
    const filtered = materiais.filter(m => m.id !== id);
    await this.saveMateriais(filtered);
  },

  // --- AUTH ---
  async saveUserSession(user: { email: string } | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(KEYS.USER_SESSION, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(KEYS.USER_SESSION);
      }
    } catch (e) {
      console.error('Error saving session:', e);
    }
  },

  async getUserSession(): Promise<{ email: string } | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error getting session:', e);
      return null;
    }
  }
};
