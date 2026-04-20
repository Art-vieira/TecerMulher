import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
<<<<<<< HEAD
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
=======
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
<<<<<<< HEAD
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase.config';

import { useMaterial } from '../hooks/useMateriais';

export default function AulaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [mostrarVoltarTopo, setMostrarVoltarTopo] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { material, carregando } = useMaterial(id);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Mostrar botão de voltar ao topo se rolar mais de 300px
    setMostrarVoltarTopo(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className="flex-row items-center px-5 py-4 bg-primary">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Voltar para a página anterior"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2">Voltar</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center pr-10" numberOfLines={1}>
          Visualizando Aula
        </Text>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 bg-background rounded-t-[24px]">
        {carregando ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#391A65" />
            <Text className="text-primary mt-3 text-base font-semibold">Carregando aula...</Text>
          </View>
        ) : !material ? (
          <View className="flex-1 justify-center items-center px-6">
             <Ionicons name="alert-circle-outline" size={60} color="#E74C3C" />
             <Text className="text-text-dark text-lg font-bold text-center mt-4">
               Material não encontrado.
             </Text>
             <Text className="text-text-muted text-base text-center mt-2">
               Esta aula pode ter sido removida ou não está mais disponível.
             </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerClassName="pb-40"
            showsVerticalScrollIndicator={true}
          >
            {/* Capa */}
            {material.imagemCapa ? (
              <Image
                source={{ uri: material.imagemCapa }}
                style={{ height: 200, resizeMode: 'cover' }}
                className="w-full rounded-t-[24px]"
                accessible={true}
                accessibilityLabel="Imagem de capa da aula"
              />
            ) : null}

            <View className="px-6 pt-6">
              {/* Titulo */}
              <Text className="text-primary text-[28px] leading-[34px] font-extrabold mb-8" accessible={true} accessibilityRole="header">
                {material.title}
              </Text>

              {/* Blocos */}
              {material.blocos.map((bloco) => {
                if (bloco.tipo === 'texto') {
                  return (
                    <Text
                      key={bloco.id}
                      className="text-text-dark text-[18px] leading-[28px] mb-6 font-medium text-justify"
                      accessible={true}
                      accessibilityLabel={bloco.conteudo}
                    >
                      {bloco.conteudo}
                    </Text>
                  );
                }

                if (bloco.tipo === 'imagem') {
                  const hasUrl = bloco.url && bloco.url.startsWith('http');
                  if (!hasUrl) return null;
                  
                  return (
                    <View key={bloco.id} className="mb-6">
                      <Image
                        source={{ uri: bloco.url }}
                        style={{ height: 220, resizeMode: 'contain' }}
                        className="w-full rounded-xl shadow-sm elevation-2 bg-[#EDE9F5]"
                        accessible={true}
                        accessibilityLabel={bloco.alt || "Imagem ilustrativa da aula"}
                      />
                      {bloco.alt ? (
                        <Text className="text-text-muted text-sm text-center mt-2 italic font-medium">
                          {bloco.alt}
                        </Text>
                      ) : null}
                    </View>
                  );
                }

                return null;
              })}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Botão flutuante para subir ao topo */}
      {mostrarVoltarTopo && (
        <TouchableOpacity
          onPress={scrollToTop}
          activeOpacity={0.8}
          className="absolute bottom-8 right-8 bg-accent w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5 z-50"
          accessible={true}
          accessibilityLabel="Voltar ao início da página"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-up" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
=======
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { db } from '../firebase.config';

// ─── Tipos de Blocos ──────────────────────────────────
type BlocoTexto = { id: string; tipo: 'texto'; conteudo: string };
type BlocoImagem = { id: string; tipo: 'imagem'; url: string; alt: string };
type BlocoSubtitulo = { id: string; tipo: 'subtitulo'; conteudo: string };
type BlocoVideo = { id: string; tipo: 'video'; url: string };
type BlocoSeparador = { id: string; tipo: 'separador' };
type Bloco = BlocoTexto | BlocoImagem | BlocoSubtitulo | BlocoVideo | BlocoSeparador;

// Utilitário para extrair ID do vídeo do YouTube
const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function AulaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const materialId = typeof params.id === 'string' ? params.id : '';

  const [titulo, setTitulo] = useState('');
  const [imagemCapa, setImagemCapa] = useState('');
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!materialId) {
      Alert.alert('Erro', 'Aula não encontrada', [{ text: 'OK', onPress: () => router.back() }]);
      return;
    }

    const fetchAula = async () => {
      try {
        const docRef = doc(db, 'materiais', materialId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTitulo(data.title || 'Aula sem Título');
          setImagemCapa(data.imagemCapa || '');
          setBlocos(data.blocos || []);
        } else {
          Alert.alert('Erro', 'Material não encontrado');
          router.back();
        }
      } catch (error) {
        console.error('Erro ao buscar aula:', error);
        Alert.alert('Erro', 'Não foi possível carregar a aula.');
      } finally {
        setLoading(false);
      }
    };
    fetchAula();
  }, [materialId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#391A65" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#391A65',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Capa */}
        {imagemCapa ? (
          <Image
            source={{ uri: imagemCapa }}
            style={{ width: '100%', height: 200, resizeMode: 'cover' }}
          />
        ) : null}

        {/* Informações Iniciais */}
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2D1B50', marginBottom: 24, lineHeight: 32 }}>
            {titulo}
          </Text>

          {/* Renderização dos Blocos */}
          {blocos.map((bloco) => {
            switch (bloco.tipo) {
              case 'texto':
                return (
                  <Text key={bloco.id} style={{ fontSize: 16, color: '#4A4A4A', lineHeight: 24, marginBottom: 20 }}>
                    {bloco.conteudo}
                  </Text>
                );
              
              case 'subtitulo':
                return (
                  <Text key={bloco.id} style={{ fontSize: 20, fontWeight: '700', color: '#391A65', marginTop: 12, marginBottom: 16 }}>
                    {bloco.conteudo}
                  </Text>
                );

              case 'separador':
                return (
                  <View key={bloco.id} style={{ height: 1, backgroundColor: '#E0DCE8', marginVertical: 24 }} />
                );

              case 'imagem':
                return (
                  <View key={bloco.id} style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden' }}>
                    <Image
                      source={{ uri: bloco.url }}
                      style={{ width: '100%', height: 220, resizeMode: 'cover' }}
                      accessibilityLabel={bloco.alt || 'Imagem da aula'}
                    />
                  </View>
                );

              case 'video':
                const videoId = extractYouTubeId(bloco.url);
                if (videoId) {
                  return (
                    <View key={bloco.id} style={{ width: '100%', height: 210, marginBottom: 20, borderRadius: 16, overflow: 'hidden' }}>
                      <WebView
                        source={{ uri: `https://www.youtube.com/embed/${videoId}?rel=0` }}
                        style={{ flex: 1 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsFullscreenVideo={true}
                      />
                    </View>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      key={bloco.id}
                      onPress={() => Linking.openURL(bloco.url)}
                      style={{
                        backgroundColor: '#FF0000',
                        borderRadius: 14,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        gap: 10,
                      }}
                    >
                      <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Assistir Vídeo Externo</Text>
                    </TouchableOpacity>
                  );
                }

              default:
                return null;
            }
          })}
        </View>
      </ScrollView>
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
    </SafeAreaView>
  );
}
