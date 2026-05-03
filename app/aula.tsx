import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useMaterial } from '../hooks/useMateriais';

const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

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
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <View className="bg-primary/10 p-2 rounded-full mr-3">
            <Ionicons name="arrow-back" size={24} color="#4C1D95" />
          </View>
          <Text className="text-primary text-lg font-bold">Voltar</Text>
        </TouchableOpacity>
        <Text className="text-text-dark text-lg font-bold flex-1 text-center pr-10" numberOfLines={1}>
          Aula
        </Text>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1">
        {carregando ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4C1D95" />
            <Text className="text-primary mt-4 text-lg font-bold">Carregando aula...</Text>
          </View>
        ) : !material ? (
          <View className="flex-1 justify-center items-center px-8">
             <View className="bg-error/10 p-6 rounded-full mb-6">
                <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
             </View>
             <Text className="text-text-dark text-xl font-bold text-center">
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
            showsVerticalScrollIndicator={false}
          >
            {/* Capa */}
            {material.imagemCapa ? (
              <View className="px-6 mb-8">
                <Image
                  source={{ uri: material.imagemCapa }}
                  style={{ height: 240 }}
                  contentFit="cover"
                  className="w-full rounded-[32px] shadow-xl shadow-primary/10"
                  accessible={true}
                  accessibilityLabel="Imagem de capa da aula"
                />
              </View>
            ) : null}

            <View className="px-8">
              {/* Titulo */}
              <Text className="text-text-dark text-[32px] leading-[40px] font-bold mb-10" accessible={true} accessibilityRole="header">
                {material.title}
              </Text>

              {/* Blocos */}
              {material.blocos.map((bloco) => {
                if (bloco.tipo === 'texto') {
                  return (
                    <Text
                      key={bloco.id}
                      className="text-text-dark text-[18px] leading-[30px] mb-8 font-medium"
                      accessible={true}
                      accessibilityLabel={bloco.conteudo}
                    >
                      {bloco.conteudo}
                    </Text>
                  );
                }

                if (bloco.tipo === 'subtitulo') {
                  return (
                    <View key={bloco.id} className="mb-6 mt-4">
                      <Text
                        className="text-primary text-[24px] font-bold"
                        accessible={true}
                        accessibilityRole="header"
                      >
                        {bloco.conteudo}
                      </Text>
                      <View className="h-1 w-10 bg-accent mt-2 rounded-full" />
                    </View>
                  );
                }

                if (bloco.tipo === 'separador') {
                  return (
                    <View key={bloco.id} className="h-[1px] bg-border-light my-10 mx-auto w-full" />
                  );
                }

                if (bloco.tipo === 'imagem') {
                  const hasUrl = bloco.url && bloco.url.startsWith('http');
                  if (!hasUrl) return null;
                  
                  return (
                    <View key={bloco.id} className="mb-8">
                      <View className="bg-surface p-2 rounded-[24px] shadow-lg shadow-primary/5 border border-primary/5">
                        <Image
                          source={{ uri: bloco.url }}
                          style={{ height: 240, resizeMode: 'contain' }}
                          className="w-full rounded-[20px] bg-primary/5"
                          accessible={true}
                          accessibilityLabel={bloco.alt || "Imagem ilustrativa da aula"}
                        />
                      </View>
                      {bloco.alt ? (
                        <Text className="text-text-muted text-sm text-center mt-3 italic font-medium">
                          {bloco.alt}
                        </Text>
                      ) : null}
                    </View>
                  );
                }

                if (bloco.tipo === 'video') {
                  const videoId = extractYouTubeId(bloco.url);
                  if (videoId) {
                    return (
                      <View key={bloco.id} className="w-full h-[220px] mb-8 rounded-[24px] overflow-hidden shadow-xl shadow-primary/10 border border-primary/5 bg-black">
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
                        className="bg-[#FF0000] rounded-2xl p-5 flex-row items-center justify-center mb-8 gap-3 shadow-lg shadow-red-500/20"
                      >
                        <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
                        <Text className="text-white text-lg font-bold">Assistir no YouTube</Text>
                      </TouchableOpacity>
                    );
                  }
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
          className="absolute bottom-10 right-8 bg-primary w-14 h-14 rounded-full justify-center items-center shadow-2xl shadow-primary/40 z-50"
          accessible={true}
          accessibilityLabel="Voltar ao início da página"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-up" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
