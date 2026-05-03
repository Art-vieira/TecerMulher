import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
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
import BottomNav from '../components/BottomNav';

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
    <SafeAreaView className={`flex-1 ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className={`flex-row items-center justify-between px-5 py-4 ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          {!isAdmin && <Text className="text-white text-lg font-semibold ml-2">Voltar</Text>}
        </TouchableOpacity>

        {isAdmin ? (
          <Text className="text-white text-[16px] font-bold" style={{ fontFamily: 'Poppins' }}>
            Materiais
          </Text>
        ) : (
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
        )}
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 bg-[#F2F0F5] rounded-t-[24px] overflow-hidden">
        {carregando ? (
          <View className="flex-1 justify-center items-center pt-8">
            <ActivityIndicator size="large" color="#391A65" />
            <Text className="text-primary mt-3 text-base font-semibold">Carregando materiais...</Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24, paddingTop: 32 }}
            onScroll={() => setMenuAberto(null)}
            scrollEventThrottle={16}
          >
            {/* Search bar specifically for Admin in body */}
            {isAdmin && (
              <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-6 shadow-sm shadow-black/5 elevation-2">
                <Ionicons name="search" size={22} color="#A39BB0" />
                <TextInput
                  value={pesquisa}
                  onChangeText={setPesquisa}
                  placeholder="Buscar materiais..."
                  placeholderTextColor="#A39BB0"
                  className="ml-3 text-base flex-1 text-black"
                  accessible={true}
                  accessibilityLabel="Campo de pesquisa"
                />
              </View>
            )}

            {materiaisFiltrados.length === 0 ? (
              <View className="items-center pt-8">
                <Ionicons name="book-outline" size={60} color="#C5BFD0" />
                <Text className="text-text-muted mt-4 text-base text-center font-medium">
                  {pesquisa ? 'Nenhum material encontrado.' : 'Nenhum material disponível ainda.'}
                </Text>
              </View>
            ) : (
              materiaisFiltrados.map((item) => (
                <View 
                  key={item.id} 
                  className={`mb-6 relative ${menuAberto === item.id ? 'z-50 elevation-5' : 'z-1'}`}
                >
                  {/* Card */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      if (menuAberto) { setMenuAberto(null); return; }
                      router.push({ pathname: '/aula', params: { id: item.id } } as any);
                    }}
                    className="bg-white rounded-[24px] pt-1.5 px-1.5 h-[215px] shadow-sm shadow-[#3C3C3C]/10 elevation-3"
                    accessible={true}
                    accessibilityLabel={`Material: ${item.title}`}
                    accessibilityRole="button"
                  >
                    {/* Imagem de Capa */}
                    {item.imagemCapa ? (
                      <Image
                        source={{ uri: item.imagemCapa }}
                        style={{ height: 146, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                        contentFit="cover"
                        className="w-full"
                      />
                    ) : (
                      <View style={{ height: 146, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} className="w-full bg-[#EDE9F5] justify-center items-center">
                        <Ionicons name="image-outline" size={40} color="#C5BFD0" />
                      </View>
                    )}

                    {/* Título */}
                    <View className={`flex-1 flex-row items-center px-4 ${isAdmin ? 'justify-between' : 'justify-center'}`}>
                      <Text
                        className={`text-primary text-[16px] font-bold leading-[20px] ${isAdmin ? 'text-left flex-1 mr-4' : 'text-center'}`}
                        style={{ fontFamily: 'Poppins' }}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Três pontinhos (só para admin) - Movido para fora para não conflitar toques */}
                  {isAdmin && (
                    <TouchableOpacity
                      onPress={() => {
                        setMenuAberto(menuAberto === item.id ? null : item.id);
                      }}
                      className="absolute bottom-2 right-2 bg-transparent rounded-full w-12 h-12 justify-center items-center z-20"
                    >
                      <Ionicons name="ellipsis-vertical" size={24} color="#391A65" />
                    </TouchableOpacity>
                  )}

                  {/* Dropdown do menu (aparece abaixo do card) */}
                  {menuAberto === item.id && (
                    <View 
                      style={{ position: 'absolute', top: 160, right: 30, zIndex: 999, elevation: 10 }}
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
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Botão + (admin) */}
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => router.push('/admin/add-material')}
          activeOpacity={0.8}
          className="absolute bottom-[130px] right-6 bg-[#391A65] w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5"
          accessible={true}
          accessibilityLabel="Adicionar novo material"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
      
      <BottomNav currentRoute="material" />
    </SafeAreaView>
  );
}
