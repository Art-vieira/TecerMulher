import * as FileSystem from 'expo-file-system/legacy';

import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DatabaseRepository from './DatabaseRepository';
import { Material, Duvida } from '../types';

const KEYS = {
  OFFLINE_MATERIAIS: '@TecerMulher:offline_materiais',
  OFFLINE_DUVIDAS: '@TecerMulher:offline_duvidas',
  PROMPT_ANSWERED: '@TecerMulher:prompt_download_answered',
};

const OFFLINE_DIR = (FileSystem as any).documentDirectory ? `${(FileSystem as any).documentDirectory}TecerMulher_Offline/` : ((FileSystem as any).cacheDirectory ? `${(FileSystem as any).cacheDirectory}TecerMulher_Offline/` : null); // Fallback to cacheDirectory if documentDirectory unavailable

// Garante que o diretório para armazenamento offline exista
async function ensureDirExists() {
  console.log('✅ OFFLINE_DIR:', OFFLINE_DIR);
  if (!OFFLINE_DIR) return;
  const dirInfo = await FileSystem.getInfoAsync(OFFLINE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(OFFLINE_DIR, { intermediates: true });
  }
}

// Extrai com segurança a extensão do arquivo a partir da URL
function getSafeExtension(url: string): string {
  try {
    const cleanUrl = url.split('?')[0];
    const parts = cleanUrl.split('.');
    const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    if (ext && ext.length <= 5 && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
  } catch (e) {
    console.error('Erro ao extrair extensão:', e);
  }
  return 'jpg';
}

// Baixa um arquivo individual e retorna o caminho local
async function downloadFile(url: string, filename: string): Promise<string> {
  try {
    if (!OFFLINE_DIR) {
      return url;
    }
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
    throw error; // Repassa o erro para rastreamento de falhas parciais
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

  // Verifica se está conectado no Wi‑Fi (compatível com diferentes valores de tipo)
  async isWiFiConnected(): Promise<boolean> {
    try {
      const state = await Network.getNetworkStateAsync();
      // state.type can be enum number or string; handle both
      if (typeof state.type === 'number') {
        return state.type === (Network as any).NetworkStateType?.WIFI;
      }
      const typeStr = (state.type ?? '').toString().toLowerCase();
      return typeStr === 'wifi' || typeStr === 'wlan';
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

  // Retorna as dúvidas armazenadas em modo offline
  async getOfflineDuvidas(): Promise<Duvida[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.OFFLINE_DUVIDAS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler dúvidas offline:', e);
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
      if (!OFFLINE_DIR) {
        if (onProgress) onProgress('Armazenamento offline não suportado nesta plataforma.');
        return false;
      }

      if (onProgress) onProgress('Buscando aulas e dúvidas da nuvem...');
      const materiais = await DatabaseRepository.getMateriais();
      const duvidas = await DatabaseRepository.getDuvidas();
      
      if ((!materiais || materiais.length === 0) && (!duvidas || duvidas.length === 0)) {
        if (onProgress) onProgress('Nenhum dado encontrado para baixar.');
        return true;
      }

      const offlineMateriais: Material[] = [];
      let hasFailures = false;

      for (let i = 0; i < materiais.length; i++) {
        const m = materiais[i];
        if (onProgress) onProgress(`Aulas: ${i + 1}/${materiais.length} - Baixando "${m.title}"...`);

        // Skip YouTube URLs (they cannot be downloaded offline)
        const isYouTube = (url: string) => /(?:youtube\.com|youtu\.be)/i.test(url);
        let localCapa = m.imagemCapa;
        if (m.imagemCapa && (m.imagemCapa.startsWith('http') || m.imagemCapa.startsWith('https')) && !isYouTube(m.imagemCapa)) {
          const ext = getSafeExtension(m.imagemCapa);
          try {
            localCapa = await downloadFile(m.imagemCapa, `capa_${m.id}.${ext}`);
          } catch (err) {
            console.error(`Erro ao baixar imagem de capa do material ${m.id}:`, err);
            hasFailures = true;
          }
        }

        // 2. Baixar Imagens dentro dos Blocos
        const localBlocos = [];
        if (m.blocos && Array.isArray(m.blocos)) {
          for (const b of m.blocos) {
            // Skip YouTube URLs for block images
            if (b.tipo === 'imagem' && b.url && (b.url.startsWith('http') || b.url.startsWith('https')) && !isYouTube(b.url)) {
              const ext = getSafeExtension(b.url);
              try {
                const localUrl = await downloadFile(b.url, `bloco_${m.id}_${b.id}.${ext}`);
                localBlocos.push({ ...b, url: localUrl });
              } catch (err) {
                console.error(`Erro ao baixar imagem do bloco ${b.id}:`, err);
                hasFailures = true;
                localBlocos.push(b); // Fallback para a URL online
              }
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

      // 2.5 Baixar Imagens das Dúvidas
      const offlineDuvidas: Duvida[] = [];
      if (duvidas && duvidas.length > 0) {
        for (let i = 0; i < duvidas.length; i++) {
          const d = duvidas[i];
          let localImage = d.imagemDuvida;
          
          if (d.imagemDuvida && d.imagemDuvida.startsWith('http')) {
            const ext = getSafeExtension(d.imagemDuvida);
            try {
              localImage = await downloadFile(d.imagemDuvida, `duvida_${d.id}.${ext}`);
            } catch (err) {
              console.error(`Erro ao baixar imagem da dúvida ${d.id}:`, err);
              hasFailures = true;
            }
          }
          
          offlineDuvidas.push({ ...d, imagemDuvida: localImage });
        }
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
      offlineDuvidas.forEach(d => {
        if (d.imagemDuvida && d.imagemDuvida.startsWith('file://')) {
          activeLocalUris.add(d.imagemDuvida);
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
      await AsyncStorage.setItem(KEYS.OFFLINE_DUVIDAS, JSON.stringify(offlineDuvidas));
      
      if (onProgress) {
        if (hasFailures) {
          onProgress('Algumas imagens falharam, mas as demais foram salvas offline.');
        } else {
          onProgress('Download concluído com sucesso!');
        }
      }
      return !hasFailures;
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
      if (!OFFLINE_DIR) return;
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
