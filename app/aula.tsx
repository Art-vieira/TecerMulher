import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
    </SafeAreaView>
  );
}
