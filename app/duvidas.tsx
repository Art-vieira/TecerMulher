import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
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
import SearchBar from '../components/SearchBar';
import { useAuth } from '../hooks/useAuth';

import { useDuvidasList } from '../hooks/useDuvidas';

export default function DuvidasScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const { isAdmin } = useAuth();
  const { duvidas, carregando, apagarDuvida } = useDuvidasList();

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const lerDuvida = async (titulo: string, resposta: string) => {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      Speech.stop();
    } else if (resposta) {
      Speech.speak(`${titulo}. ${resposta}`, { language: 'pt-BR' });
    }
  };

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
        <Text className="text-[17px] font-bold text-primary mb-2">
          {item.title}
        </Text>
        
        <View className="flex-row items-start justify-between mb-4 gap-2">
          <Text 
            className="text-[14px] text-text-dark leading-[22px] flex-1"
            numberOfLines={2}
          >
            <Text className="font-semibold text-text-dark">Resposta: </Text>
            {respostaText}
          </Text>
          <TouchableOpacity
            onPress={() => lerDuvida(item.title, respostaText)}
            className="w-10 h-10 bg-[#E0DCE8] rounded-full items-center justify-center"
            accessible={true}
            accessibilityLabel="Ouvir resposta"
          >
            <Ionicons name="volume-high" size={20} color="#391A65" />
          </TouchableOpacity>
        </View>

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
          <Text className="text-[16px] font-bold text-primary flex-1 pr-4">
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
            <View className="flex-row items-start justify-between gap-2">
              <Text className="text-[15px] text-text-dark leading-[24px] flex-1">
                {item.respostaCurta || item.resposta || ''}
              </Text>
              <TouchableOpacity
                onPress={() => lerDuvida(item.title, item.respostaCurta || item.resposta || '')}
                className="w-10 h-10 bg-[#E0DCE8] rounded-full items-center justify-center ml-2"
                accessible={true}
                accessibilityLabel="Ouvir resposta"
              >
                <Ionicons name="volume-high" size={20} color="#391A65" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ───── CABEÇALHO ───── */}
      <View className={`flex-row items-center justify-between px-5 h-[88px] ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center min-h-[50px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          {!isAdmin && <Text className="text-white text-lg font-semibold ml-2 mr-3">Voltar</Text>}
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-semibold flex-1 text-right">
          Dúvidas
        </Text>
      </View>

      {/* ───── CORPO ───── */}
      <View className="flex-1 bg-[#F2F0F5] rounded-t-[24px] overflow-hidden">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24, paddingTop: 32 }}>
          
          {isAdmin && (
            <SearchBar 
              value={pesquisa} 
              onChangeText={setPesquisa} 
              placeholder="Buscar dúvidas..." 
            />
          )}

          {!isAdmin && (
            <>
              <Text className="text-[20px] font-bold text-primary mb-1">
                Dúvidas Frequentes
              </Text>
              <Text className="text-[14px] text-text-muted mb-4">
                Toque em uma pergunta para ver a resposta.
              </Text>
              <SearchBar 
                value={pesquisa} 
                onChangeText={setPesquisa} 
                placeholder="Buscar dúvidas..." 
              />
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
          className="absolute right-6 bottom-[140px] w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-black/50 elevation-5"
          accessible={true}
          accessibilityLabel="Adicionar nova dúvida"
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      )}
      
      <BottomNav currentRoute="duvidas" />
    </SafeAreaView>
  );
}
