import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase.config';

import { useMateriaisList } from '../hooks/useMateriais';
import { useAuth } from '../hooks/useAuth';

export default function TelaMateriais() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const { materiais, carregando, apagarMaterial } = useMateriaisList();

  // ── Apagar material ──
  const handleApagar = async (id: string, titulo: string) => {
    setMenuAberto(null);
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Tem certeza que deseja apagar "${titulo}"?`);
      if (confirm) {
        const { success, error } = await apagarMaterial(id);
        if (success) {
          window.alert(`✅ "${titulo}" foi removido com sucesso.`);
        } else {
          window.alert(`Erro: Não foi possível apagar.\n\nDetalhe: ${error.message}`);
        }
      }
    } else {
      Alert.alert(
        'Apagar Material',
        `Tem certeza que deseja apagar "${titulo}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Apagar',
            style: 'destructive',
            onPress: async () => {
              const { success, error } = await apagarMaterial(id);
              if (success) {
                Alert.alert('✅ Apagado', `"${titulo}" foi removido com sucesso.`);
              } else {
                Alert.alert('Erro', `Não foi possível apagar.\n\nDetalhe: ${error.message}`);
              }
            },
          },
        ]
      );
    }
  };

  // ── Editar material ──
  const handleEditar = (id: string) => {
    setMenuAberto(null);
    router.push({ pathname: '/admin/edit-material', params: { id } } as any);
  };

  const materiaisFiltrados = materiais.filter((item) =>
    item.title.toLowerCase().includes(pesquisa.toLowerCase())
  );

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

        <View className="flex-row items-center bg-surface rounded-2xl px-5 py-3 shadow-lg shadow-primary/5 border border-primary/5">
          <Ionicons name="search" size={22} color="#4C1D95" style={{ opacity: 0.5 }} />
          <TextInput
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="O que você procura?"
            placeholderTextColor="#9CA3AF"
            className="ml-3 text-lg flex-1 text-text-dark font-medium"
            accessible={true}
            accessibilityLabel="Campo de pesquisa"
          />
        </View>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 px-6">
        {carregando ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4C1D95" />
            <Text className="text-primary mt-4 text-lg font-bold">Carregando...</Text>
          </View>
        ) : materiaisFiltrados.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-primary/5 p-8 rounded-full mb-6">
              <Ionicons name="book-outline" size={80} color="#4C1D95" style={{ opacity: 0.2 }} />
            </View>
            <Text className="text-text-muted text-xl text-center font-medium px-10">
              {pesquisa ? 'Não encontramos nada com esse nome.' : 'Nenhum material disponível.'}
            </Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 100 }}
            onScroll={() => setMenuAberto(null)}
            scrollEventThrottle={16}
          >
            <Text className="text-text-dark text-3xl font-bold mb-6">Materiais</Text>
            
            {materiaisFiltrados.map((item) => (
              <View 
                key={item.id} 
                className={`mb-8 relative ${menuAberto === item.id ? 'z-50' : 'z-1'}`}
              >
                {/* Card */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    if (menuAberto) { setMenuAberto(null); return; }
                    router.push({ pathname: '/aula', params: { id: item.id } } as any);
                  }}
                  className="bg-surface rounded-[32px] overflow-hidden shadow-xl shadow-primary/10 border border-primary/5"
                  accessible={true}
                  accessibilityLabel={`Material: ${item.title}`}
                  accessibilityRole="button"
                >
                  {/* Imagem de Capa */}
                  {item.imagemCapa ? (
                    <Image
                      source={{ uri: item.imagemCapa }}
                      style={{ height: 180 }}
                      contentFit="cover"
                      className="w-full"
                    />
                  ) : (
                    <View style={{ height: 180 }} className="w-full bg-primary/5 justify-center items-center">
                      <Ionicons name="image-outline" size={48} color="#4C1D95" style={{ opacity: 0.2 }} />
                    </View>
                  )}

                  {/* Título */}
                  <View className="p-6">
                    <Text
                      className="text-text-dark text-xl font-bold leading-7"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <View className="flex-row items-center mt-3">
                      <View className="bg-accent/10 px-3 py-1 rounded-full">
                        <Text className="text-accent text-xs font-bold uppercase tracking-wider">Novo</Text>
                      </View>
                      <Text className="text-text-muted text-sm ml-3">Acessar aula →</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Três pontinhos (só para admin) */}
                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuAberto(menuAberto === item.id ? null : item.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 rounded-full w-10 h-10 justify-center items-center z-20 shadow-md"
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color="#4C1D95" />
                  </TouchableOpacity>
                )}

                {/* Dropdown do menu */}
                {menuAberto === item.id && (
                  <View 
                    style={{ position: 'absolute', top: 50, right: 12, zIndex: 999 }}
                    className="bg-white rounded-2xl py-2 shadow-2xl min-w-[160px] border border-gray-100"
                  >
                    <TouchableOpacity
                      onPress={() => handleEditar(item.id)}
                      className="flex-row items-center px-4 py-3 gap-2"
                    >
                      <Ionicons name="create-outline" size={20} color="#4C1D95" />
                      <Text className="text-primary text-base font-bold">Editar</Text>
                    </TouchableOpacity>

                    <View className="h-[1px] bg-gray-100 mx-3" />

                    <TouchableOpacity
                      onPress={() => handleApagar(item.id, item.title)}
                      className="flex-row items-center px-4 py-3 gap-2"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      <Text className="text-error text-base font-bold">Apagar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Botão + (admin) */}
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => router.push('/admin/add-material')}
          activeOpacity={0.8}
          className="absolute bottom-10 right-8 bg-primary w-16 h-16 rounded-full justify-center items-center shadow-2xl shadow-primary/40"
          accessible={true}
          accessibilityLabel="Adicionar novo material"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={36} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}
