import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../hooks/useAuth';

import { useDuvidasList } from '../hooks/useDuvidas';

export default function DuvidasScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const { isAdmin } = useAuth();
  const { duvidas, carregando, apagarDuvida } = useDuvidasList();

  const duvidasFiltradas = duvidas.filter((item) =>
    item.title.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleApagar = async (id: string, titulo: string) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Tem certeza que deseja apagar a dúvida "${titulo}"?`);
      if (confirm) {
        const { success, error } = await apagarDuvida(id);
        if (success) {
          window.alert(`✅ Dúvida removida com sucesso.`);
        } else {
          window.alert(`Erro: Não foi possível apagar.\n\nDetalhe: ${error.message}`);
        }
      }
    } else {
      Alert.alert(
        'Apagar Dúvida',
        `Tem certeza que deseja apagar "${titulo}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Apagar',
            style: 'destructive',
            onPress: async () => {
              const { success, error } = await apagarDuvida(id);
              if (success) {
                Alert.alert('✅ Apagada', `Dúvida removida com sucesso.`);
              } else {
                Alert.alert('Erro', `Não foi possível apagar.\n\nDetalhe: ${error.message}`);
              }
            },
          },
        ]
      );
    }
  };

  const toggleAccordion = (item: any) => {
    if (item.tipoResposta === 'expandida') {
      router.push({ pathname: '/duvida-expandida', params: { id: item.id } } as any);
      return;
    }

    // Toggle for 'curta'
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
    }
  };

  const renderAdminDuvida = (item: any) => {
    const respostaText = item.tipoResposta === 'expandida' 
      ? item.respostaExpandida 
      : (item.respostaCurta || item.resposta || '');

    return (
      <View
        key={item.id}
        className="bg-white rounded-[16px] p-5 mb-4 shadow-sm shadow-black/10 elevation-2"
      >
        <Text className="text-[17px] font-bold text-primary mb-2" style={{ fontFamily: 'Poppins' }}>
          {item.title}
        </Text>
        
        <Text className="text-[14px] text-text-dark mb-4 leading-[22px]">
          <Text className="font-semibold text-text-dark">Resposta: </Text>
          {respostaText}
        </Text>

        <View className="flex-row gap-3">
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/admin/edit-duvida', params: { id: item.id } } as any)}
            className="w-10 h-10 border border-[#E0DCE8] rounded-xl items-center justify-center bg-white"
          >
            <Ionicons name="pencil" size={18} color="#6B5E80" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleApagar(item.id, item.title)}
            className="w-10 h-10 border border-[#E0DCE8] rounded-xl items-center justify-center bg-white"
          >
            <Ionicons name="trash" size={18} color="#6B5E80" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderUserDuvida = (item: any) => {
    const isExpanded = expandedId === item.id;
    const isExpandidaType = item.tipoResposta === 'expandida';

    return (
      <View
        key={item.id}
        className={`bg-white rounded-[16px] mb-4 shadow-sm shadow-black/10 elevation-2 overflow-hidden ${isExpanded ? 'border border-[#391A65]' : ''}`}
      >
        <TouchableOpacity 
          onPress={() => toggleAccordion(item)}
          activeOpacity={0.8}
          className="flex-row justify-between items-center p-5"
        >
          <Text className="text-[16px] font-bold text-primary flex-1 pr-4" style={{ fontFamily: 'Poppins' }}>
            {item.title}
          </Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#391A65" 
          />
        </TouchableOpacity>

        {isExpanded && !isExpandidaType && (
          <View className="px-5 pb-5">
            <Text className="text-[15px] text-text-dark leading-[24px]">
              {item.respostaCurta || item.resposta || ''}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ───── CABEÇALHO ───── */}
      <View className={`flex-row items-center px-5 py-4 ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2 mr-3">Voltar</Text>
        </TouchableOpacity>
        
        {isAdmin ? (
          <Text className="text-white text-[16px] font-bold flex-1 text-center pr-[70px]" style={{ fontFamily: 'Poppins' }}>
            Dúvidas
          </Text>
        ) : (
          <View className="flex-1 flex-row items-center bg-white rounded-full px-3 py-1.5 h-10">
            <Ionicons name="search" size={18} color="#A39BB0" />
            <TextInput
              value={pesquisa}
              onChangeText={setPesquisa}
              placeholder="Procurar..."
              placeholderTextColor="#A39BB0"
              className="ml-2 flex-1 text-black text-[14px]"
              accessible={true}
              accessibilityLabel="Campo de pesquisa"
            />
          </View>
        )}
      </View>

      {/* ───── CORPO ───── */}
      <View className="flex-1 bg-[#F2F0F5] rounded-t-[24px] overflow-hidden">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24, paddingTop: 32 }}>
          
          {/* Search bar inside body only for admin */}
          {isAdmin && (
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-6 shadow-sm shadow-black/5 elevation-2 mx-1 mt-1">
              <Ionicons name="search" size={22} color="#A39BB0" />
              <TextInput
                value={pesquisa}
                onChangeText={setPesquisa}
                placeholder="Buscar dúvidas..."
                placeholderTextColor="#A39BB0"
                className="ml-3 text-base flex-1 text-black"
                accessible={true}
                accessibilityLabel="Campo de pesquisa"
              />
            </View>
          )}

          {!isAdmin && (
            <>
              <Text className="text-[20px] font-bold text-primary mb-1" style={{ fontFamily: 'Poppins' }}>
                Dúvidas Frequentes
              </Text>
              <Text className="text-[14px] text-text-muted mb-6">
                Toque em uma pergunta para ver a resposta.
              </Text>
            </>
          )}

          {duvidasFiltradas.length === 0 ? (
            <Text className="text-center text-[#6B5E80] mt-10">Nenhuma dúvida encontrada.</Text>
          ) : (
            duvidasFiltradas.map((item) => isAdmin ? renderAdminDuvida(item) : renderUserDuvida(item))
          )}
        </ScrollView>
      </View>

      {/* Botão flutuante Adicionar (Admin) */}
      {isAdmin && (
        <TouchableOpacity
          onPress={() => router.push('/admin/add-duvida')}
          activeOpacity={0.8}
          className="absolute bottom-[140px] right-6 bg-[#391A65] w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5"
          accessible={true}
          accessibilityLabel="Adicionar nova dúvida"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      <BottomNav currentRoute="duvidas" />
    </SafeAreaView>
  );
}
