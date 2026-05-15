import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import ProgressBar from '../../components/ui/ProgressBar';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useMaterial } from '../../hooks/useMateriais';
import { useAuth } from '../../hooks/useAuth';
import { useFontSize } from '../../hooks/useFontSize';

import { useConfig } from '../../context/ConfigContext';
import { renderFormattedText } from '../../utils/textUtils';

const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function AulaScreen() {
  const { id } = useLocalSearchParams();
  const [mostrarVoltarTopo, setMostrarVoltarTopo] = useState(false);
  const { isAdmin } = useAuth();
  const { config } = useConfig();
  const { userFontFactor, increase, decrease, canIncrease, canDecrease } = useFontSize();
  const [mostrarPainelFonte, setMostrarPainelFonte] = useState(false);

  // Admin usa o fator global (Firestore); usuário comum usa o fator local (AsyncStorage)
  const effectiveFactor = isAdmin
    ? (config.fontSizeFactor || 1.0)
    : (config.fontSizeFactor || 1.0) * userFontFactor;

  const fs = (size: number) => size * effectiveFactor;
  const lh = (size: number) => size * 1.5;

  const scrollViewRef = useRef<ScrollView>(null);
  
  const { material, carregando } = useMaterial(id);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [imagemAmpliada, setImagemAmpliada] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    if (imagemAmpliada) {
      if (isLandscape) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        ScreenOrientation.unlockAsync();
      }
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsLandscape(false);
    }
  }, [imagemAmpliada, isLandscape]);

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
          {/* ── Painel de tamanho de fonte (apenas usuário normal) ── */}
          {!isAdmin && (
            <>
              {mostrarPainelFonte && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 140,
                    left: 20,
                    right: 20,
                    backgroundColor: '#1E1028',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: '#3A2550',
                    zIndex: 60,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 15,
                  }}
                >
                  <Text style={{ color: '#B39DCC', fontSize: 13, fontWeight: '600', marginBottom: 16, textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' }}>
                    Tamanho da letra
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                      onPress={decrease}
                      disabled={!canDecrease}
                      activeOpacity={0.7}
                      accessibilityLabel="Diminuir letra"
                      style={{
                        width: 64, height: 64,
                        borderRadius: 16,
                        backgroundColor: canDecrease ? '#2A1A3A' : '#1A1028',
                        borderWidth: 1, borderColor: '#3A2550',
                        alignItems: 'center', justifyContent: 'center',
                        opacity: canDecrease ? 1 : 0.4,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800' }}>A-</Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '900' }}>
                        {Math.round(userFontFactor * 100)}%
                      </Text>
                      <Text style={{ color: '#B39DCC', fontSize: 11, fontWeight: '600', letterSpacing: 1 }}>TAMANHO</Text>
                    </View>

                    <TouchableOpacity
                      onPress={increase}
                      disabled={!canIncrease}
                      activeOpacity={0.7}
                      accessibilityLabel="Aumentar letra"
                      style={{
                        width: 64, height: 64,
                        borderRadius: 16,
                        backgroundColor: canIncrease ? '#391A65' : '#1A1028',
                        alignItems: 'center', justifyContent: 'center',
                        opacity: canIncrease ? 1 : 0.4,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>A+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Botão Aa flutuante */}
              <TouchableOpacity
                onPress={() => setMostrarPainelFonte(v => !v)}
                activeOpacity={0.8}
                accessibilityLabel="Ajustar tamanho da letra"
                accessibilityRole="button"
                style={{
                  position: 'absolute',
                  bottom: 60,
                  left: 24,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: mostrarPainelFonte ? '#391A65' : '#7C3AED',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 60,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>Aa</Text>
              </TouchableOpacity>
            </>
          )}

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
              style={{ width: '100%', height: 200, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
              resizeMode="cover"
              className="w-full"
              accessible={true}
              accessibilityLabel="Imagem de capa da aula"
            />
          ) : null}
          <View className="px-6 pt-6">
            <Text 
              className="text-primary font-extrabold mb-8" 
              style={{ fontSize: fs(28), lineHeight: lh(28) }}
              accessible={true} 
              accessibilityRole="header"
            >
              {material.title}
            </Text>
            {material.blocos.map((bloco) => {
              if (bloco.tipo === 'texto') {
                return (
                  <View key={bloco.id} className="bg-surface-sheet rounded-2xl border border-border-active/50 pt-[23px] pb-6 px-6 mb-6 flex-col items-start gap-4 shadow-sm elevation-1 w-full">
                    {bloco.titulo ? (
                      <Text 
                        className="text-primary font-bold" 
                        style={{ fontSize: fs(22), lineHeight: lh(22) }}
                        accessible={true} 
                        accessibilityRole="header"
                      >
                        {renderFormattedText(bloco.titulo)}
                      </Text>
                    ) : null}
                    <Text 
                      className="text-text-dark font-medium" 
                      style={{ fontSize: fs(18), lineHeight: lh(18) }}
                      accessible={true} 
                      accessibilityLabel={bloco.conteudo}
                    >
                      {renderFormattedText(bloco.conteudo)}
                    </Text>
                  </View>
                );
              }
              if (bloco.tipo === 'subtitulo') {
                return (
                  <Text 
                    key={bloco.id} 
                    className="text-primary font-bold mt-2 mb-4" 
                    style={{ fontSize: fs(24), lineHeight: lh(24) }}
                    accessible={true} 
                    accessibilityRole="header"
                  >
                    {renderFormattedText(bloco.conteudo)}
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
                    <TouchableOpacity 
                      activeOpacity={0.8} 
                      onPress={() => setImagemAmpliada(bloco.url || null)}
                      className="relative"
                      accessible={true} 
                      accessibilityLabel={bloco.alt ? `Ampliar: ${bloco.alt}` : "Ampliar imagem ilustrativa da aula"}
                      accessibilityRole="button"
                    >
                      <Image source={{ uri: bloco.url }} style={{ width: '100%', height: 220 }} resizeMode="contain" className="w-full rounded-xl shadow-sm elevation-2 bg-surface-card" />
                      <View className="absolute bottom-3 right-3 bg-black/70 px-4 py-2 rounded-full flex-row items-center">
                        <Ionicons name="expand" size={24} color="#FFFFFF" />
                        <Text className="text-white ml-2 font-bold text-base">Ampliar Imagem</Text>
                      </View>
                    </TouchableOpacity>
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
                    <View className="p-4 flex-row flex-1 items-center">
                      <Ionicons name="warning" size={fs(28)} color="#C0392B" />
                      <Text 
                        className="text-text-dark font-medium ml-3 flex-1"
                        style={{ fontSize: fs(18), lineHeight: lh(18) }}
                      >
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

      {/* Modal de Imagem Ampliada */}
      <Modal 
        visible={!!imagemAmpliada} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={() => setImagemAmpliada(null)}
      >
        <View className="flex-1 bg-black/95 justify-center items-center">
          {imagemAmpliada && (
            <Image 
              source={{ uri: imagemAmpliada }} 
              style={{ width: '100%', height: '80%' }} 
              resizeMode="contain" 
            />
          )}
          <View className="absolute bottom-10 flex-row gap-4 px-4 w-full justify-center">
            <TouchableOpacity 
              onPress={() => setIsLandscape(!isLandscape)}
              className="bg-[#D35400] px-6 py-4 rounded-full flex-row items-center shadow-lg shadow-black/50"
              accessible={true}
              accessibilityLabel={isLandscape ? "Voltar para retrato" : "Girar para deitado"}
              accessibilityRole="button"
            >
              <Ionicons name="phone-landscape-outline" size={32} color="#FFFFFF" />
              <Text className="text-white ml-3 font-bold text-xl">Girar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setImagemAmpliada(null)}
              className="bg-primary px-6 py-4 rounded-full flex-row items-center shadow-lg shadow-black/50"
              accessible={true}
              accessibilityLabel="Fechar imagem ampliada"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={32} color="#FFFFFF" />
              <Text className="text-white ml-3 font-bold text-xl">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}




