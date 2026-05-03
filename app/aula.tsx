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
      <View className="flex-1 bg-background rounded-t-[24px] overflow-hidden">
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
                style={{ height: 200, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                contentFit="cover"
                className="w-full"
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

                if (bloco.tipo === 'subtitulo') {
                  return (
                    <Text
                      key={bloco.id}
                      className="text-primary text-[22px] leading-[28px] font-bold mt-2 mb-4"
                      accessible={true}
                      accessibilityRole="header"
                    >
                      {bloco.conteudo}
                    </Text>
                  );
                }

                if (bloco.tipo === 'separador') {
                  return (
                    <View key={bloco.id} className="h-[2px] bg-border-light my-6 mx-auto w-[80%] rounded" />
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

                if (bloco.tipo === 'video') {
                  const videoId = extractYouTubeId(bloco.url);
                  if (videoId) {
                    return (
                      <View key={bloco.id} className="w-full h-[210px] mb-6 rounded-xl overflow-hidden shadow-sm elevation-2 bg-black">
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
                        className="bg-[#FF0000] rounded-xl p-4 flex-row items-center justify-center mb-6 gap-2"
                      >
                        <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
                        <Text className="text-white text-base font-bold">Assistir Vídeo Externo</Text>
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
          className="absolute bottom-8 right-8 bg-accent w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5 z-50"
          accessible={true}
          accessibilityLabel="Voltar ao início da página"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-up" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
