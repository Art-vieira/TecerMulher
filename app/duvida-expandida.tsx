import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { LocalStorage, Duvida } from '../services/localStorage';

export default function DuvidaExpandidaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [duvida, setDuvida] = useState<Duvida | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDuvida() {
      if (!id) return;
      const data = await LocalStorage.getDuvidaById(Array.isArray(id) ? id[0] : id);
      setDuvida(data);
      setCarregando(false);
    }
    carregarDuvida();
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ───── CABEÇALHO ───── */}
      <View className="flex-row items-center px-5 py-4 bg-primary">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2">Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* ───── CORPO ───── */}
      <View className="flex-1 bg-[#F2F0F5] rounded-t-[24px] overflow-hidden">
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
            {/* Cartão principal da dúvida */}
            <View className="bg-white rounded-[24px] p-6 mb-6 shadow-sm shadow-black/5 elevation-2">
              <Text className="text-[20px] font-bold text-primary mb-2 leading-[26px]" style={{ fontFamily: 'Poppins' }}>
                {duvida.title}
              </Text>
              
              <View className="h-[1px] bg-[#E0DCE8] my-4" />
              
              <Text className="text-[15px] text-text-dark leading-[24px]">
                {duvida.respostaExpandida || duvida.resposta || duvida.respostaCurta}
              </Text>
            </View>

            {/* Imagem */}
            {duvida.imagemDuvida ? (
              <Image
                source={{ uri: duvida.imagemDuvida }}
                style={{ height: 220, resizeMode: 'cover' }}
                className="w-full rounded-[16px] mb-10 shadow-sm shadow-black/10 elevation-2"
                accessible={true}
                accessibilityLabel="Imagem ilustrativa da dúvida"
              />
            ) : null}

            {/* Área de Suporte */}
            <View className="items-center mt-8 mb-10">
              <View className="w-16 h-16 rounded-2xl bg-[#E0DCE8] items-center justify-center mb-3">
                <Text className="text-primary text-[28px] font-bold opacity-60">?</Text>
              </View>
              <Text className="text-[#A39BB0] font-medium text-[15px]">Estamos aqui para ajudar</Text>
            </View>

          </ScrollView>
        )}
      </View>

      <BottomNav currentRoute="duvidas" />
    </SafeAreaView>
  );
}
