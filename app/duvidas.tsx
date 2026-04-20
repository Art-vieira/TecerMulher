import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function DuvidasScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const { isAdmin } = useAuth();

  // Mock
  const duvidas = [
    {
      id: '1',
      title: 'Como resetar a senha?',
    },
    {
      id: '2',
      title: 'Não consigo ver a imagem da aula',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ───── CABEÇALHO ROXO ───── */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-primary">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2">
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ───── CORPO ───── */}
      <View className="flex-1 bg-background rounded-t-[24px] px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Text className="text-2xl font-bold text-primary mb-5">
            Dúvidas Frequentes
          </Text>
          
          {duvidas.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-[16px] p-5 mb-4 shadow-sm shadow-black/10 elevation-2"
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel={`Dúvida: ${item.title}`}
              accessibilityRole="button"
            >
              <Text className="text-lg font-semibold text-text-dark">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Botão flutuante Adicionar (Admin) */}
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => alert('Em breve: Adicionar dúvida!')}
          activeOpacity={0.8}
          className="absolute bottom-8 right-8 bg-accent w-16 h-16 rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5"
          accessible={true}
          accessibilityLabel="Adicionar nova dúvida"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={36} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}
