import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Image } from 'expo-image';
import ScreenLayout from '../../components/layout/ScreenLayout';
import * as Repository from '../../services/DatabaseRepository';
import { Duvida } from '../../types';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../hooks/useAuth';
import { useFontSize } from '../../hooks/useFontSize';
import FloatingFontControl from '../../components/ui/FloatingFontControl';
import { renderFormattedText } from '../../utils/textUtils';

export default function DuvidaExpandidaScreen() {
  const { id } = useLocalSearchParams();
  const [duvida, setDuvida] = useState<Duvida | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { isAdmin } = useAuth();
  const { config } = useConfig();
  const { userFontFactor } = useFontSize();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Admin usa o fator global (Firestore); usuário comum usa o fator local (AsyncStorage)
  const effectiveFactor = isAdmin
    ? (config.fontSizeFactor || 1.0)
    : (config.fontSizeFactor || 1.0) * userFontFactor;
  
  const fs = (size: number) => size * effectiveFactor;
  const lh = (size: number) => size * 1.5;

  useEffect(() => {
    async function carregarDuvida() {
      if (!id) return;
      const data = await Repository.getDuvidaById(Array.isArray(id) ? id[0] : id);
      setDuvida(data);
      setCarregando(false);
    }
    carregarDuvida();
  }, [id]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const toggleSpeech = async () => {
    if (!duvida) return;
    
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = `${duvida.title}. ${duvida.respostaExpandida || duvida.resposta || duvida.respostaCurta || ''}`;
      Speech.speak(textToSpeak, { 
        language: 'pt-BR',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  return (
    <ScreenLayout
      showBackLabel={true}
      currentRoute="duvidas"
      overlay={
        <>
          {!isAdmin && (
            <FloatingFontControl bottomPosition={150} panelBottomPosition={220} />
          )}

        {/* Botão de Áudio (Para todos: Admin e Usuário) */}
        {duvida && (
          <TouchableOpacity
            onPress={toggleSpeech}
            activeOpacity={0.8}
            className="absolute bottom-[150px] right-8 bg-primary w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5 z-50"
            accessible={true}
            accessibilityLabel={isSpeaking ? "Parar leitura" : "Ouvir dúvida"}
            accessibilityRole="button"
          >
            <Ionicons name={isSpeaking ? "stop" : "volume-high"} size={32} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        </>
      }
    >
      {carregando ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#391A65" />
          <Text className="text-primary mt-3 text-base font-semibold">Carregando dúvida...</Text>
        </View>
      ) : !duvida ? (
        <View className="flex-1 justify-center items-center px-6">
           <Ionicons name="alert-circle-outline" size={60} color="#E74C3C" />
           <Text className="text-text-dark text-lg font-bold text-center mt-4">
             Dúvida não encontrada.
           </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24, paddingTop: 32 }}
        >
          <View className="bg-white rounded-[24px] p-6 mb-6 shadow-sm shadow-black/5 elevation-2">
            <Text 
              className="font-bold text-primary mb-2"
              style={{ fontSize: fs(20), lineHeight: lh(20) }}
            >
              {renderFormattedText(duvida.title)}
            </Text>
            <View className="h-[1px] bg-surface-muted my-4" />
            <Text 
              className="text-text-dark"
              style={{ fontSize: fs(15), lineHeight: lh(15) }}
            >
              {renderFormattedText(duvida.respostaExpandida || duvida.resposta || duvida.respostaCurta)}
            </Text>
          </View>
          {duvida.imagemDuvida ? (
            <Image
              source={{ uri: duvida.imagemDuvida }}
              style={{ height: 220, resizeMode: 'cover' }}
              className="w-full rounded-[16px] mb-10 shadow-sm shadow-black/10 elevation-2"
              accessible={true}
              accessibilityLabel="Imagem ilustrativa da dúvida"
            />
          ) : null}
          <View className="items-center mt-8 mb-10">
            <View className="w-16 h-16 rounded-2xl bg-surface-muted items-center justify-center mb-3">
              <Text className="text-primary text-[28px] font-bold opacity-60">?</Text>
            </View>
            <Text className="text-text-placeholder font-medium text-[15px]">Estamos aqui para ajudar</Text>
          </View>
        </ScrollView>
      )}
    </ScreenLayout>
  );
}





