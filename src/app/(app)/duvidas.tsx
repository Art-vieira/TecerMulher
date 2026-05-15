import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBar from '../../components/ui/SearchBar';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useAuth } from '../../hooks/useAuth';

import { useDuvidasList } from '../../hooks/useDuvidas';

import { useConfig } from '../../context/ConfigContext';
import { useToast } from '../../context/ToastContext';
import { useFontSize } from '../../hooks/useFontSize';
import { renderFormattedText } from '../../utils/textUtils';

export default function DuvidasScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const { isAdmin } = useAuth();
  const { config } = useConfig();
  const { showToast, showConfirm } = useToast();
  const { duvidas, apagarDuvida } = useDuvidasList();
  const { userFontFactor, increase, decrease, canIncrease, canDecrease } = useFontSize();
  const [mostrarPainelFonte, setMostrarPainelFonte] = useState(false);

  // Admin usa o fator global (Firestore); usuário comum usa o fator local (AsyncStorage)
  const effectiveFactor = isAdmin
    ? (config.fontSizeFactor || 1.0)
    : (config.fontSizeFactor || 1.0) * userFontFactor;

  const fs = (size: number) => size * effectiveFactor;
  const lh = (size: number) => size * 1.5;

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
    const confirmado = await showConfirm({
      title: 'Apagar Dúvida',
      message: `Tem certeza que deseja apagar "${titulo}"?`,
      confirmText: 'Apagar',
      cancelText: 'Cancelar',
      destructive: true,
    });
    if (confirmado) {
      const { success, error } = await apagarDuvida(id);
      if (success) {
        showToast({ message: 'Dúvida removida com sucesso.', type: 'success' });
      } else {
        showToast({ message: `Não foi possível apagar: ${error?.message}`, type: 'error' });
      }
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
    const isExpanded = expandedId === item.id;
    const respostaText = item.tipoResposta === 'expandida' 
      ? item.respostaExpandida 
      : (item.respostaCurta || item.resposta || '');

    return (
      <View
        key={item.id}
        className={`bg-white rounded-[16px] p-5 mb-4 shadow-sm shadow-black/10 elevation-2 ${isExpanded ? 'border border-primary' : ''}`}
      >
        <View className="flex-row items-start justify-between mb-4 gap-2">
          <TouchableOpacity 
            onPress={() => toggleAccordion(item)}
            activeOpacity={0.8}
            className="flex-1"
          >
            <Text 
              className="font-bold text-primary mb-2"
              style={{ fontSize: fs(17), lineHeight: lh(17) }}
            >
              {renderFormattedText(item.title)}
            </Text>
            
            <Text 
              className="text-text-dark leading-[22px]"
              style={{ fontSize: fs(14), lineHeight: lh(14) }}
              numberOfLines={isExpanded ? undefined : 2}
            >
              <Text className="font-semibold text-text-dark">Resposta: </Text>
              {renderFormattedText(respostaText)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => lerDuvida(item.title, respostaText)}
            className="w-10 h-10 bg-surface-muted rounded-full items-center justify-center"
            accessible={true}
            accessibilityLabel="Ouvir resposta"
          >
            <Ionicons name="volume-high" size={20} color="#391A65" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/admin/edit-duvida', params: { id: item.id } } as any)}
            className="w-10 h-10 border border-surface-muted rounded-xl items-center justify-center bg-white"
          >
            <Ionicons name="pencil" size={18} color="#6B5E80" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleApagar(item.id, item.title)}
            className="w-10 h-10 border border-surface-muted rounded-xl items-center justify-center bg-white"
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
        className={`bg-white rounded-[16px] mb-4 shadow-sm shadow-black/10 elevation-2 overflow-hidden ${isExpanded ? 'border border-primary' : ''}`}
      >
        <View className="flex-row items-center justify-between pr-5">
          <TouchableOpacity 
            onPress={() => toggleAccordion(item)}
            activeOpacity={0.8}
            className="flex-row justify-between items-center p-5 flex-1"
          >
            <Text 
              className="font-bold text-primary flex-1 pr-4"
              style={{ fontSize: fs(16), lineHeight: lh(16) }}
            >
              {renderFormattedText(item.title)}
            </Text>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#391A65" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => lerDuvida(item.title, isExpandidaType ? item.respostaExpandida : (item.respostaCurta || item.resposta || ''))}
            className="w-10 h-10 bg-surface-muted rounded-full items-center justify-center ml-2"
            accessible={true}
            accessibilityLabel="Ouvir resposta"
          >
            <Ionicons name="volume-high" size={20} color="#391A65" />
          </TouchableOpacity>
        </View>

        {isExpanded && !isExpandidaType && (
          <View className="px-5 pb-5">
            <Text 
              className="text-text-dark leading-[24px]"
              style={{ fontSize: fs(15), lineHeight: lh(15) }}
            >
              {renderFormattedText(item.respostaCurta || item.resposta || '')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenLayout
      title="Dúvidas"
      currentRoute="duvidas"
      onBack={() => router.replace('/menu')}
      overlay={
        <>
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

          {!isAdmin && (
            <>
              {mostrarPainelFonte && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 220,
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
                  bottom: 150,
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
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 220, paddingHorizontal: 24, paddingTop: 32 }}>

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
          <Text className="text-center text-text-subtle mt-10">Nenhuma dúvida encontrada.</Text>
        ) : (
          duvidasFiltradas.map((item) => isAdmin ? renderAdminDuvida(item) : renderUserDuvida(item))
        )}
      </ScrollView>
    </ScreenLayout>
  );
}



