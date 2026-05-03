import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDuvidaForm } from '../../hooks/useDuvidaForm';

export default function AddDuvidaScreen() {
  const router = useRouter();
  
  const {
    title, setTitle,
    tipoResposta, setTipoResposta,
    respostaCurta, setRespostaCurta,
    respostaExpandida, setRespostaExpandida,
    imagemDuvida, setImagemDuvida,
    salvando,
    salvarDuvida
  } = useDuvidaForm();

  const handleSave = async () => {
    const res = await salvarDuvida();
    if (res.success) {
      if (Platform.OS === 'web') {
        window.alert('Sucesso! 🎉 Dúvida salva com sucesso!');
        router.back();
      } else {
        Alert.alert('Sucesso! 🎉', 'Dúvida salva com sucesso!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert('Atenção: ' + (res.error || 'Erro desconhecido.'));
      } else {
        Alert.alert('Atenção', res.error || 'Erro desconhecido.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Cancelar criação"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-bold flex-1 text-center">
          Nova Dúvida
        </Text>
        {/* Botão Salvar no cabeçalho */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={salvando}
          className="min-h-[44px] justify-center ml-2"
          accessible={true}
          accessibilityLabel="Salvar dúvida"
          accessibilityRole="button"
        >
          {salvando
            ? <ActivityIndicator color="#CF96D5" size="small" />
            : <Text className="text-[#CF96D5] text-[16px] font-bold">Salvar</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 bg-[#1A1A1A] rounded-t-[20px]">
        <ScrollView
          contentContainerClassName="p-6 pb-20"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campo Pergunta */}
          <View className="bg-transparent rounded-xl p-4 mb-6 border border-[#3C3C3C]">
            <Text className="text-white text-[14px] font-bold mb-2">Pergunta</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Coloque o título da pergunta..."
              placeholderTextColor="#6B5E80"
              className="bg-transparent rounded-lg p-3 text-[14px] text-white border border-[#3C3C3C]"
              accessible={true}
              accessibilityLabel="Digite a pergunta da dúvida"
            />
          </View>

          {/* Tipo de Resposta */}
          <View className="bg-transparent rounded-xl p-4 mb-6 border border-[#3C3C3C]">
            <Text className="text-white text-[14px] font-bold mb-3">Tipo da Resposta</Text>
            <View className="flex-row bg-[#1A1A1A] rounded-xl border border-[#3C3C3C] p-1">
              <TouchableOpacity 
                onPress={() => setTipoResposta('curta')}
                className={`flex-1 rounded-lg py-3 items-center justify-center ${tipoResposta === 'curta' ? 'bg-[#391A65]' : 'bg-transparent'}`}
              >
                <Text className="text-white font-bold text-[14px]">Curta</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setTipoResposta('expandida')}
                className={`flex-1 rounded-lg py-3 items-center justify-center ${tipoResposta === 'expandida' ? 'bg-[#391A65]' : 'bg-transparent'}`}
              >
                <Text className="text-white font-bold text-[14px]">Expandida</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Resposta Curta Accordion */}
          <View className="bg-transparent rounded-xl border border-[#3C3C3C] mb-4 overflow-hidden">
            <TouchableOpacity 
              onPress={() => setTipoResposta('curta')}
              className="flex-row justify-between items-center p-4 bg-[#1A1A1A]"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name={tipoResposta === 'curta' ? 'chevron-up' : 'chevron-down'} size={20} color="#6B5E80" />
                <Text className="text-[#6B5E80] font-bold text-[14px]">Resposta curta</Text>
              </View>
              {tipoResposta === 'curta' && (
                <Text className="text-[#6B5E80] text-[12px]">{respostaCurta.length}/100</Text>
              )}
            </TouchableOpacity>
            
            {tipoResposta === 'curta' && (
              <View className="px-4 pb-4 bg-[#1A1A1A]">
                <TextInput
                  value={respostaCurta}
                  onChangeText={(v) => {
                    if (v.length <= 100) setRespostaCurta(v);
                  }}
                  placeholder="Descreva a resposta resumida..."
                  placeholderTextColor="#6B5E80"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-transparent rounded-lg p-3 text-[14px] text-white min-h-[100px] border border-[#3C3C3C]"
                />
              </View>
            )}
          </View>

          {/* Resposta Expandida Accordion */}
          <View className="bg-transparent rounded-xl border border-[#3C3C3C] mb-4 overflow-hidden">
            <TouchableOpacity 
              onPress={() => setTipoResposta('expandida')}
              className="flex-row justify-between items-center p-4 bg-[#1A1A1A]"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name={tipoResposta === 'expandida' ? 'chevron-up' : 'chevron-down'} size={20} color="#6B5E80" />
                <Text className="text-[#6B5E80] font-bold text-[14px]">Resposta expandida</Text>
              </View>
            </TouchableOpacity>
            
            {tipoResposta === 'expandida' && (
              <View className="px-4 pb-4 bg-[#1A1A1A]">
                <TextInput
                  value={respostaExpandida}
                  onChangeText={setRespostaExpandida}
                  placeholder="Descreva a resposta mais detalhada..."
                  placeholderTextColor="#6B5E80"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-transparent rounded-lg p-3 text-[14px] text-white min-h-[120px] mb-4 border border-[#3C3C3C]"
                />

                <View className="border border-[#3C3C3C] rounded-xl p-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white text-[14px] font-bold">Imagem</Text>
                    {imagemDuvida ? (
                      <TouchableOpacity onPress={() => setImagemDuvida('')}>
                        <Ionicons name="trash-outline" size={20} color="#6B5E80" />
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {imagemDuvida && imagemDuvida.startsWith('http') ? (
                    <Image
                      source={{ uri: imagemDuvida }}
                      style={{ height: 160, resizeMode: 'cover' }}
                      className="w-full rounded-xl mb-4"
                    />
                  ) : (
                    <View className="w-full h-[140px] rounded-xl mb-4 bg-transparent justify-center items-center border border-dashed border-[#3C3C3C]">
                      <Ionicons name="image-outline" size={28} color="#FFFFFF" />
                      <Text className="text-white text-[12px] mt-2 font-medium">Upload da Imagem</Text>
                    </View>
                  )}

                  <TextInput
                    value={imagemDuvida}
                    onChangeText={setImagemDuvida}
                    placeholder="Cole o link da imagem..."
                    placeholderTextColor="#6B5E80"
                    autoCapitalize="none"
                    keyboardType="url"
                    className="bg-transparent rounded-lg p-3 text-[13px] text-white border border-[#3C3C3C]"
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
