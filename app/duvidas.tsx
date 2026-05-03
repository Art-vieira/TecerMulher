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
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className="px-6 py-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-6"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <View className="bg-primary/10 p-2 rounded-full mr-3">
            <Ionicons name="arrow-back" size={24} color="#4C1D95" />
          </View>
          <Text className="text-primary text-lg font-bold">Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 px-6">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Text className="text-text-dark text-3xl font-bold mb-8">
            Dúvidas Frequentes
          </Text>
          
          {duvidas.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-surface rounded-[24px] p-6 mb-4 shadow-xl shadow-primary/5 border border-primary/5 flex-row items-center justify-between"
              activeOpacity={0.9}
              accessible={true}
              accessibilityLabel={`Dúvida: ${item.title}`}
              accessibilityRole="button"
            >
              <Text className="text-lg font-bold text-text-dark flex-1 mr-4">
                {item.title}
              </Text>
              <View className="bg-accent/10 p-2 rounded-full">
                <Ionicons name="chevron-forward" size={20} color="#EC4899" />
              </View>
            </TouchableOpacity>
          ))}

          <View className="mt-12 bg-primary/5 p-8 rounded-[32px] border border-primary/5 items-center">
            <View className="bg-primary/10 p-4 rounded-full mb-4">
              <Ionicons name="help-circle" size={32} color="#4C1D95" />
            </View>
            <Text className="text-text-dark text-xl font-bold text-center mb-2">Ainda tem dúvidas?</Text>
            <Text className="text-text-muted text-center mb-6">Nossa equipe está pronta para te ajudar com qualquer questão.</Text>
            <TouchableOpacity className="bg-primary px-8 py-4 rounded-2xl shadow-lg shadow-primary/20">
              <Text className="text-white font-bold">Falar com Suporte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Botão flutuante Adicionar (Admin) */}
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => alert('Em breve: Adicionar dúvida!')}
          activeOpacity={0.8}
          className="absolute bottom-10 right-8 bg-primary w-16 h-16 rounded-full justify-center items-center shadow-2xl shadow-primary/40"
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
