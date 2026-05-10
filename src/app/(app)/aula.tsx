import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import YoutubeIframe from 'react-native-youtube-iframe';
import ProgressBar from '../../components/ui/ProgressBar';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useMaterial } from '../../hooks/useMateriais';
import { useAuth } from '../../hooks/useAuth';

const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function AulaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [mostrarVoltarTopo, setMostrarVoltarTopo] = useState(false);
  const { isAdmin } = useAuth();
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { material, carregando } = useMaterial(id);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const textoParaLer = material?.blocos
        ?.filter((b: any) => b.tipo === 'texto' || b.tipo === 'subtitulo' || b.tipo === 'alerta')
        .map((b: any) => {
           if (b.tipo === 'texto' && b.titulo) {
              return `${b.titulo}. ${b.conteudo}`;
           }
           if (b.tipo === 'alerta') {
              return `Atenção. ${b.conteudo}`;
           }
           return b.conteudo;
        })
        .join('. ') || '';

      if (textoParaLer) {
        Speech.speak(`${material?.title}. ${textoParaLer}`, {
          language: 'pt-BR',
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
        setIsSpeaking(true);
      }
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentHeight > layoutHeight) {
      const progress = Math.max(0, Math.min(100, (offsetY / (contentHeight - layoutHeight)) * 100));
      setReadingProgress(Math.round(progress));
    } else {
      setReadingProgress(100);
    }

    // Mostrar botão de voltar ao topo se rolar mais de 300px
    setMostrarVoltarTopo(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScreenLayout
      title="Visualizando Aula"
      titleAlign="center"
      titleClassName="font-bold"
      containerClassName="bg-background pt-5"
      overlay={
        <>
          {mostrarVoltarTopo && (
            <TouchableOpacity
              onPress={scrollToTop}
              activeOpacity={0.8}
              className={`absolute bottom-[130px] right-8 ${isAdmin ? 'bg-primary' : 'bg-accent'} w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5 z-50`}
              accessible={true}
              accessibilityLabel="Voltar ao início da página"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-up" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={toggleSpeech}
            activeOpacity={0.8}
            className="absolute bottom-[60px] right-8 bg-primary w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5 z-50"
            accessible={true}
            accessibilityLabel={isSpeaking ? "Parar leitura" : "Ouvir aula"}
            accessibilityRole="button"
          >
            <Ionicons name={isSpeaking ? "stop" : "volume-high"} size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      }
    >
      {!carregando && material && (
        <ProgressBar progress={readingProgress} className="px-6 mb-4" />
      )}
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
            <Text className="text-primary text-[28px] leading-[34px] font-extrabold mb-8" accessible={true} accessibilityRole="header">
              {material.title}
            </Text>
            {material.blocos.map((bloco) => {
              if (bloco.tipo === 'texto') {
                return (
                  <View key={bloco.id} className="bg-surface-sheet rounded-2xl border border-border-active/50 pt-[23px] pb-6 px-6 mb-6 flex-col items-start gap-4 shadow-sm elevation-1 w-full">
                    {bloco.titulo ? (
                      <Text className="text-primary text-[20px] leading-[26px] font-bold" accessible={true} accessibilityRole="header">
                        {bloco.titulo}
                      </Text>
                    ) : null}
                    <Text className="text-text-dark text-[16px] leading-[26px] font-medium" accessible={true} accessibilityLabel={bloco.conteudo}>
                      {bloco.conteudo}
                    </Text>
                  </View>
                );
              }
              if (bloco.tipo === 'subtitulo') {
                return (
                  <Text key={bloco.id} className="text-primary text-[22px] leading-[28px] font-bold mt-2 mb-4" accessible={true} accessibilityRole="header">
                    {bloco.conteudo}
                  </Text>
                );
              }
              if (bloco.tipo === 'separador') {
                return <View key={bloco.id} className="h-[2px] bg-border-light my-6 mx-auto w-[80%] rounded" />;
              }
              if (bloco.tipo === 'imagem') {
                const hasUrl = bloco.url && (bloco.url.startsWith('http') || bloco.url.startsWith('file') || bloco.url.startsWith('data'));
                if (!hasUrl) return null;
                return (
                  <View key={bloco.id} className="mb-6">
                    <Image source={{ uri: bloco.url }} style={{ height: 220, resizeMode: 'contain' }} className="w-full rounded-xl shadow-sm elevation-2 bg-surface-card" accessible={true} accessibilityLabel={bloco.alt || "Imagem ilustrativa da aula"} />
                    {bloco.alt ? <Text className="text-text-muted text-sm text-center mt-2 italic font-medium">{bloco.alt}</Text> : null}
                  </View>
                );
              }
              if (bloco.tipo === 'video') {
                const videoId = bloco.url ? extractYouTubeId(bloco.url) : null;
                if (videoId) {
                  return (
                    <View key={bloco.id} className="w-full mb-6 rounded-xl overflow-hidden shadow-sm elevation-2 bg-black">
                      <YoutubeIframe height={210} videoId={videoId} initialPlayerParams={{ preventFullScreen: false, showClosedCaptions: false, controls: true }} />
                    </View>
                  );
                } else {
                  return (
                    <TouchableOpacity key={bloco.id} onPress={() => Linking.openURL(bloco.url || '')} className="bg-[#FF0000] rounded-xl p-4 flex-row items-center justify-center mb-6 gap-2">
                      <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
                      <Text className="text-white text-base font-bold">Assistir Vídeo Externo</Text>
                    </TouchableOpacity>
                  );
                }
              }
              if (bloco.tipo === 'alerta') {
                return (
                  <View key={bloco.id} className="bg-white rounded-[12px] mb-6 flex-row overflow-hidden shadow-sm elevation-2">
                    <View className="w-[6px] bg-error" />
                    <View className="p-4 flex-row flex-1">
                      <Ionicons name="warning" size={24} color="#C0392B" className="mt-1" />
                      <Text className="text-text-dark text-[15px] leading-[22px] font-medium ml-3 flex-1">
                        <Text className="font-bold text-error">Atenção: </Text>
                        {bloco.conteudo}
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </View>
        </ScrollView>
      )}
    </ScreenLayout>
  );
}




