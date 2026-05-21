import * as FileSystemImport from 'expo-file-system';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DatabaseRepository from './DatabaseRepository';
import { Material } from '../types';

const FileSystem = FileSystemImport as any;

const KEYS = {
  OFFLINE_MATERIAIS: '@TecerMulher:offline_materiais',
  PROMPT_ANSWERED: '@TecerMulher:prompt_download_answered',
};

const OFFLINE_DIR = `${FileSystem.documentDirectory}TecerMulher_Offline/`;

// Garante que o diretório para armazenamento offline exista
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(OFFLINE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(OFFLINE_DIR, { intermediates: true });
  }
}

// Baixa um arquivo individual e retorna o caminho local
async function downloadFile(url: string, filename: string): Promise<string> {
  try {
    await ensureDirExists();
    const localUri = `${OFFLINE_DIR}${filename}`;
    
    // Se o arquivo já existe localmente, evita re-download
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      return localUri;
    }
    
    const { uri } = await FileSystem.downloadAsync(url, localUri);
    return uri;
  } catch (error) {
    console.error(`Falha ao baixar o arquivo (${url}):`, error);
    return url; // Fallback para a URL online caso dê erro
  }
}

export const OfflineService = {
  // Verifica conexão ativa à internet
  async isConnected(): Promise<boolean> {
    try {
      const state = await Network.getNetworkStateAsync();
      return !!state.isConnected && !!state.isInternetReachable;
    } catch (e) {
      return false;
    }
  },

  // Verifica se está conectado no Wi-Fi
  async isWiFiConnected(): Promise<boolean> {
    try {
      const state = await Network.getNetworkStateAsync();
      return state.type === Network.NetworkStateType.WIFI;
    } catch (e) {
      return false;
    }
  },

  // Retorna os materiais armazenados em modo offline
  async getOfflineMateriais(): Promise<Material[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.OFFLINE_MATERIAIS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler materiais offline:', e);
      return [];
    }
  },

  // Verifica se já existem materiais baixados offline
  async hasOfflineMateriais(): Promise<boolean> {
    const materiais = await this.getOfflineMateriais();
    return materiais.length > 0;
  },

  // Baixa todos os materiais e suas respectivas imagens
  async downloadAllMaterials(onProgress?: (msg: string) => void): Promise<boolean> {
    try {
      if (onProgress) onProgress('Buscando aulas da nuvem...');
      const materiais = await DatabaseRepository.getMateriais();
      
      if (!materiais || materiais.length === 0) {
        if (onProgress) onProgress('Nenhum material encontrado para baixar.');
        return true;
      }

      const offlineMateriais: Material[] = [];

      for (let i = 0; i < materiais.length; i++) {
        const m = materiais[i];
        if (onProgress) onProgress(`Aulas: ${i + 1}/${materiais.length} - Baixando "${m.title}"...`);

        // 1. Baixar Imagem de Capa se existir
        let localCapa = m.imagemCapa;
        if (m.imagemCapa && (m.imagemCapa.startsWith('http') || m.imagemCapa.startsWith('https'))) {
          const ext = m.imagemCapa.split('.').pop()?.split('?')[0] || 'jpg';
          localCapa = await downloadFile(m.imagemCapa, `capa_${m.id}.${ext}`);
        }

        // 2. Baixar Imagens dentro dos Blocos
        const localBlocos = [];
        if (m.blocos && Array.isArray(m.blocos)) {
          for (const b of m.blocos) {
            if (b.tipo === 'imagem' && b.url && (b.url.startsWith('http') || b.url.startsWith('https'))) {
              const ext = b.url.split('.').pop()?.split('?')[0] || 'jpg';
              const localUrl = await downloadFile(b.url, `bloco_${m.id}_${b.id}.${ext}`);
              localBlocos.push({ ...b, url: localUrl });
            } else {
              localBlocos.push(b);
            }
          }
        }

        offlineMateriais.push({
          ...m,
          imagemCapa: localCapa,
          blocos: localBlocos,
        });
      }

      // 3. Limpeza de arquivos órfãos (imagens de aulas que foram apagadas do servidor)
      if (onProgress) onProgress('Otimizando espaço e limpando arquivos antigos...');
      const activeLocalUris = new Set<string>();
      offlineMateriais.forEach(m => {
        if (m.imagemCapa && m.imagemCapa.startsWith('file://')) {
          activeLocalUris.add(m.imagemCapa);
        }
        if (m.blocos && Array.isArray(m.blocos)) {
          m.blocos.forEach(b => {
            if (b.tipo === 'imagem' && b.url && b.url.startsWith('file://')) {
              activeLocalUris.add(b.url);
            }
          });
        }
      });

      const dirInfo = await FileSystem.getInfoAsync(OFFLINE_DIR);
      if (dirInfo.exists) {
        const localFiles = await FileSystem.readDirectoryAsync(OFFLINE_DIR);
        for (const filename of localFiles) {
          const fileUri = `${OFFLINE_DIR}${filename}`;
          if (!activeLocalUris.has(fileUri)) {
            try {
              await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch (err) {
              console.error(`Erro ao apagar arquivo órfão ${filename}:`, err);
            }
          }
        }
      }

      // Salva os metadados com caminhos atualizados no AsyncStorage
      await AsyncStorage.setItem(KEYS.OFFLINE_MATERIAIS, JSON.stringify(offlineMateriais));
      if (onProgress) onProgress('Download concluído com sucesso!');
      return true;
    } catch (e) {
      console.error('Erro ao baixar materiais offline:', e);
      if (onProgress) onProgress('Erro ao realizar download das aulas.');
      return false;
    }
  },

  // Limpa o cache offline
  async clearOfflineMaterials(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.OFFLINE_MATERIAIS);
      const dirInfo = await FileSystem.getInfoAsync(OFFLINE_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(OFFLINE_DIR, { idempotent: true });
      }
    } catch (e) {
      console.error('Erro ao limpar cache offline:', e);
    }
  },

  // Rastreia se o aluno respondeu o prompt
  async isPromptAnswered(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(KEYS.PROMPT_ANSWERED);
      return val === 'true';
    } catch (e) {
      return false;
    }
  },

  async setPromptAnswered(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PROMPT_ANSWERED, 'true');
    } catch (e) {
      console.error(e);
    }
  }
};
