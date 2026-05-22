import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, useWindowDimensions, Modal, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useMateriaisList } from '../../hooks/useMateriais';
import { useDuvidasList } from '../../hooks/useDuvidas';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { OfflineService } from '../../services/OfflineService';

export default function TelaMenu() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { materiais, refresh } = useMateriaisList();
  const { duvidas } = useDuvidasList();
  
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [testFilePath, setTestFilePath] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function checkOfflineRequirements() {
      if (isAdmin) return; // Apenas para estudantes
      
      // O usuário ainda não tem materiais offline; exibe o modal de download imediatamente
      setShowDownloadModal(true);
    }
    checkOfflineRequirements();
  }, [isAdmin]);

  const handleStartDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress('Iniciando...');
    
    // Marca o prompt como respondido imediatamente para que não reapareça
    await OfflineService.setPromptAnswered();

    try {
      const success = await OfflineService.downloadAllMaterials((msg) => {
        setDownloadProgress(msg);
      });
      
      if (success) {
        setDownloadProgress('Download concluído com sucesso!');
        setTimeout(() => {
          setIsDownloading(false);
          setShowDownloadModal(false);
          // Refresh the material list to load the newly saved offline data
          refresh();
        }, 1500);
      } else {
        setDownloadProgress('Falha ao baixar algumas aulas.');
        setTimeout(() => {
          setIsDownloading(false);
          setShowDownloadModal(false);
        }, 2000);
      }
    } catch (error) {
      setDownloadProgress('Erro ao realizar download.');
      setTimeout(() => {
        setIsDownloading(false);
        setShowDownloadModal(false);
      }, 2000);
    }
  };

  const handleCancelDownload = async () => {
    setShowDownloadModal(false);
  };

  const handleBack = async () => {
    // Estudantes voltam para a tela inicial
    router.replace('/');
  };

  const settingsButton = (
    <TouchableOpacity
      onPress={() => router.push('/configuracoes')}
      activeOpacity={0.8}
      className="justify-center pl-4"
      accessible={true}
      accessibilityLabel="Configurações"
      accessibilityRole="button"
    >
      <Ionicons name="settings-sharp" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout
      onBack={handleBack}
      rightElement={isAdmin ? settingsButton : null}
      currentRoute="menu"
      hideBack={isAdmin}
    >
      {isAdmin ? (
        /* ── Layout Admin ── */
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            <Text className="text-[19px] font-bold text-admin-dark mb-5">
              Acompanhamento
            </Text>

            <View className="flex-row justify-between w-full mb-6">
              <View className="bg-primary rounded-[16px] p-5 w-[48%] min-h-[110px] justify-center shadow-sm">
                <Text className="text-white text-[32px] font-bold">{materiais.length}</Text>
                <Text className="text-white text-base font-normal">Materiais</Text>
              </View>
              <View className="bg-primary rounded-[16px] p-5 w-[48%] min-h-[110px] justify-center shadow-sm">
                <Text className="text-white text-[32px] font-bold">{duvidas.length}</Text>
                <Text className="text-white text-base font-normal">Dúvidas</Text>
              </View>
            </View>

            <Link href="/material" asChild>
              <TouchableOpacity className="bg-white w-full rounded-[20px] p-5 flex-row items-center mb-4 shadow-sm elevation-2" activeOpacity={0.8}>
                <View className="w-14 h-14 bg-primary rounded-[14px] items-center justify-center mr-4">
                  <Ionicons name="book" size={28} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary text-[17px] font-bold mb-0.5">Gerenciar Materiais</Text>
                  <Text className="text-primary text-[13px] opacity-70">Adicione ou edite aulas</Text>
                </View>
              </TouchableOpacity>
            </Link>

            <Link href="/duvidas" asChild>
              <TouchableOpacity className="bg-white w-full rounded-[20px] p-5 flex-row items-center mb-4 shadow-sm elevation-2" activeOpacity={0.8}>
                <View className="w-14 h-14 bg-primary rounded-[14px] items-center justify-center mr-4">
                  <Ionicons name="chatbubbles" size={28} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary text-[17px] font-bold mb-0.5">Gerenciar Dúvidas</Text>
                  <Text className="text-primary text-[13px] opacity-70">Edite ou crie novas dúvidas</Text>
                </View>
              </TouchableOpacity>
            </Link>

            <View className="flex-1 items-center justify-end pb-2">
              <Image
                source={require("../../assets/images/LogoTecerP.svg")}
                style={{ width: 160, height: 80 }}
                contentFit="contain"
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        /* ── Layout Estudante ── */
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingHorizontal: isTablet ? 64 : 32, 
            paddingTop: isTablet ? 64 : 32, 
            paddingBottom: 100, 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ width: '100%', flexDirection: isTablet ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: isTablet ? 32 : 20 }}>
            <Link href="/material" asChild>
              <TouchableOpacity
                style={{ width: '100%', maxWidth: isTablet ? 400 : 300, height: isTablet ? 220 : 160, flex: isTablet ? 1 : undefined }}
                className="bg-primary rounded-[30px] items-center justify-center shadow-md shadow-primary/30"
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Acessar sessão de Materiais"
                accessibilityRole="button"
              >
                <Image
                  source={require("../../assets/images/aula.svg")}
                  style={{ width: isTablet ? 60 : 45, height: isTablet ? 65 : 50, marginBottom: isTablet ? 16 : 12 }}
                  contentFit="contain"
                />
                <Text className={`text-white font-bold ${isTablet ? 'text-[32px]' : 'text-[26px]'}`}>Materiais</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/duvidas" asChild>
              <TouchableOpacity
                style={{ width: '100%', maxWidth: isTablet ? 400 : 300, height: isTablet ? 220 : 160, flex: isTablet ? 1 : undefined }}
                className="bg-primary rounded-[30px] items-center justify-center shadow-md shadow-primary/30"
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Acessar sessão de Dúvidas"
                accessibilityRole="button"
              >
                <Image
                  source={require("../../assets/images/duvidas.svg")}
                  style={{ width: isTablet ? 65 : 50, height: isTablet ? 60 : 45, marginBottom: isTablet ? 16 : 12 }}
                  contentFit="contain"
                />
                <Text className={`text-white font-bold ${isTablet ? 'text-[32px]' : 'text-[26px]'}`}>Dúvidas</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Image
            source={require("../../assets/images/Tecer-C.png")}
            style={{ width: isTablet ? 350 : 250, height: isTablet ? 250 : 180, marginBottom: 9, marginTop: isTablet ? 40 : 20 }}
            contentFit="contain"
            accessible={true}
            accessibilityLabel="Logo Unifesspa Tecer"
          />
        </ScrollView>
      )}

        {/* Debug button to test filesystem write */}
        <TouchableOpacity
          onPress={async () => {
            try {
              const baseDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory;
              if (!baseDir) {
                console.warn('⚠️ Nenhum diretório disponível para escrita');
                return;
              }
              const targetDir = `${baseDir}TecerMulher_Offline/`;
              // Garante que o diretório exista
              await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
              const testPath = `${targetDir}test.txt`;
              await FileSystem.writeAsStringAsync(testPath, 'Teste de escrita');
              console.log('✍️ Test file written to', testPath);
              setTestFilePath(testPath);
            } catch (e) {
              console.error('Erro ao escrever arquivo de teste', e);
            }
          }}
          activeOpacity={0.8}
          style={{ width: '100%', backgroundColor: '#FF5722', paddingVertical: 12, borderRadius: 12, marginTop: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Teste FS Write</Text>
        </TouchableOpacity>
        {testFilePath ? (
          <Text style={{ marginTop: 8, color: '#333', textAlign: 'center' }}>Arquivo escrito em:{'\n'}{testFilePath}</Text>
        ) : null}

      {/* Modal de Download de Materiais Offline */}
      <Modal
        visible={showDownloadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!isDownloading) setShowDownloadModal(false);
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 340, borderRadius: 24, padding: 24, alignItems: 'center' }}>
            {!isDownloading ? (
              <>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(57, 26, 101, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                  <Ionicons name="cloud-download-outline" size={36} color="#391A65" />
                </View>
                <Text style={{ color: '#391A65', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
                  Materiais Offline
                </Text>
                <Text style={{ color: '#777777', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                  Identificamos que você está conectado ao Wi-Fi. Deseja baixar os materiais para estudar mesmo sem internet?
                </Text>
                
                <TouchableOpacity
                  onPress={handleStartDownload}
                  activeOpacity={0.8}
                  style={{ width: '100%', backgroundColor: '#391A65', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Baixar agora</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleCancelDownload}
                  activeOpacity={0.8}
                  style={{ width: '100%', paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE' }}
                >
                  <Text style={{ color: '#3C3C3C', fontWeight: '600', fontSize: 16 }}>Depois</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(57, 26, 101, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                  <ActivityIndicator size="large" color="#391A65" />
                </View>
                <Text style={{ color: '#391A65', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
                  Baixando Aulas...
                </Text>
                <Text style={{ color: '#777777', fontSize: 14, textAlign: 'center', marginBottom: 16, paddingHorizontal: 8, lineHeight: 20 }}>
                  Por favor, não feche o aplicativo enquanto realizamos o download.
                </Text>
                <View style={{ backgroundColor: '#F9F9F9', width: '100%', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', alignItems: 'center' }}>
                  <Text style={{ color: '#391A65', fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
                    {downloadProgress}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}




