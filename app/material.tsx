import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
<<<<<<< HEAD
  Image,
=======
  Modal,
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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
  const handleApagar = (id: string, titulo: string) => {
    setMenuAberto(null);
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
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />

<<<<<<< HEAD

=======
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
      {/* ── Cabeçalho ── */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2">Voltar</Text>
        </TouchableOpacity>

        <View className="flex-row items-center bg-white rounded-full px-4 py-2 w-[65%] shadow-sm">
          <Ionicons name="search" size={20} color="#000000" style={{ opacity: 0.3 }} />
          <TextInput
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Procurar..."
            placeholderTextColor="#6B5E80"
            className="ml-2 text-base flex-1 text-black py-1"
            accessible={true}
            accessibilityLabel="Campo de pesquisa"
          />
        </View>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 bg-background rounded-t-[24px] px-6 pt-8">
        {carregando ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#391A65" />
            <Text className="text-primary mt-3 text-base font-semibold">Carregando materiais...</Text>
          </View>
        ) : materiaisFiltrados.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="book-outline" size={60} color="#C5BFD0" />
            <Text className="text-text-muted mt-4 text-base text-center font-medium">
              {pesquisa ? 'Nenhum material encontrado.' : 'Nenhum material disponível ainda.'}
            </Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 100 }}
            onScroll={() => setMenuAberto(null)}
            scrollEventThrottle={16}
          >
            {materiaisFiltrados.map((item) => (
<<<<<<< HEAD
              <View key={item.id} className="mb-6 relative">
=======
              <View 
                key={item.id} 
                style={{ 
                  marginBottom: 24, 
                  position: 'relative',
                  zIndex: menuAberto === item.id ? 100 : 1,
                  elevation: menuAberto === item.id ? 100 : 1
                }}
              >
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
                {/* Card */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    if (menuAberto) { setMenuAberto(null); return; }
                    router.push({ pathname: '/aula', params: { id: item.id } } as any);
                  }}
                  className="bg-[#F8F8F8] rounded-[30px] pt-1.5 px-1.5 h-[215px] shadow-md shadow-[#3C3C3C]/20 elevation-4"
                  accessible={true}
                  accessibilityLabel={`Material: ${item.title}`}
                  accessibilityRole="button"
                >
                  {/* Imagem de Capa */}
                  {item.imagemCapa ? (
                    <Image
                      source={{ uri: item.imagemCapa }}
                      style={{ height: 146, resizeMode: 'cover' }}
                      className="w-full rounded-t-[26px]"
                    />
                  ) : (
                    <View className="w-full h-[146px] rounded-t-[26px] bg-[#EDE9F5] justify-center items-center">
                      <Ionicons name="image-outline" size={40} color="#C5BFD0" />
                    </View>
                  )}

                  {/* Título */}
                  <View className="flex-1 justify-center items-center px-3">
                    <Text
                      className="text-primary text-lg font-bold leading-6 text-center"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </View>
<<<<<<< HEAD

                  {/* Três pontinhos (só para admin) */}
                  {isAdmin && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setMenuAberto(menuAberto === item.id ? null : item.id);
                      }}
                      className="absolute bottom-2 right-4 bg-transparent rounded-full w-10 h-10 justify-center items-center z-20"
                      accessible={true}
                      accessibilityLabel="Opções do material"
                      accessibilityRole="button"
                    >
                      <Ionicons name="ellipsis-horizontal" size={24} color="#391A65" />
                    </TouchableOpacity>
                  )}
=======
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
                </TouchableOpacity>

                {/* Três pontinhos (só para admin) - Movido para fora para não conflitar toques */}
                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuAberto(menuAberto === item.id ? null : item.id);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 16,
                      backgroundColor: 'transparent',
                      borderRadius: 20,
                      width: 36,
                      height: 36,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 20,
                    }}
                  >
                    <Ionicons name="ellipsis-horizontal" size={22} color="#391A65" />
                  </TouchableOpacity>
                )}

                {/* Dropdown do menu (aparece abaixo do card) */}
                {menuAberto === item.id && (
                  <View 
                    style={{ position: 'absolute', top: 50, right: 12, zIndex: 999, elevation: 10 }}
                    className="bg-white rounded-2xl py-2 shadow-xl min-w-[160px] border border-gray-100"
                  >
                    <TouchableOpacity
                      onPress={() => handleEditar(item.id)}
                      className="flex-row items-center px-4 py-3 gap-2 bg-white"
                      accessible={true}
                      accessibilityLabel="Editar Material"
                    >
                      <Ionicons name="create-outline" size={20} color="#391A65" />
                      <Text className="text-primary text-base font-semibold">Editar</Text>
                    </TouchableOpacity>

                    <View className="h-[1px] bg-[#F0EDF5] mx-3" />

                    <TouchableOpacity
                      onPress={() => handleApagar(item.id, item.title)}
                      className="flex-row items-center px-4 py-3 gap-2 bg-white"
                      accessible={true}
                      accessibilityLabel="Apagar Material"
                    >
                      <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                      <Text className="text-error text-base font-semibold">Apagar</Text>
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
          className="absolute bottom-8 right-8 bg-accent w-16 h-16 rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5"
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
