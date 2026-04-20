import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebase.config';

import { useMaterialForm } from '../../hooks/useMaterialForm';

export default function EditMaterialScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const {
    titulo, setTitulo,
    imagemCapa, setImagemCapa,
    blocos,
    salvando,
    carregandoDados,
    acoesBloco,
    salvarMaterial
  } = useMaterialForm(id);

  // ── Salvar Edições no Firebase ──
  const handleSave = async () => {
    const res = await salvarMaterial();
    if (res.success) {
      Alert.alert('Sucesso! 🎉', 'Edições salvas com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Erro', res.error || 'Ocorreu um erro.');
    }
  };

  const { addBlocoTexto, addBlocoImagem, removeBloco, updateBloco, moverBloco } = acoesBloco;

  if (carregandoDados) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white mt-4 text-base font-semibold">Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Cancelar edições"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2">Cancelar</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-bold flex-1 text-center">
          Editando Material
        </Text>
        
        {/* Botão Atualizar no cabeçalho */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={salvando}
          className="min-h-[44px] justify-center ml-2"
          accessible={true}
          accessibilityLabel="Salvar edições"
          accessibilityRole="button"
        >
          {salvando
            ? <ActivityIndicator color="#CF96D5" size="small" />
            : <Text className="text-accent text-lg font-bold">Salvar</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 bg-background rounded-t-[30px]">
        <ScrollView
          contentContainerClassName="p-6 pb-36"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campo Título */}
          <Text className="text-text-dark text-lg font-bold mb-2">Título da Aula</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Aplicativos de Transporte"
            placeholderTextColor="#6B5E80"
            className="bg-white rounded-xl p-4 text-lg mb-5 border border-border-light text-text-dark"
            accessible={true}
            accessibilityLabel="Edite o título da aula"
          />

          {/* ─ Campo Fixo: Imagem de Capa ─ */}
          <Text className="text-text-dark text-lg font-bold mb-2">Imagem de Capa</Text>
          <TextInput
            value={imagemCapa}
            onChangeText={setImagemCapa}
            placeholder="Cole o link da imagem de capa (https://...)"
            placeholderTextColor="#6B5E80"
            autoCapitalize="none"
            keyboardType="url"
            className="bg-white rounded-xl p-4 text-base text-text-dark mb-3 border border-border-light"
            accessible={true}
            accessibilityLabel="Edite o link da imagem de capa"
          />
          {imagemCapa && imagemCapa.startsWith('http') ? (
             <Image
             source={{ uri: imagemCapa }}
             style={{ height: 180, resizeMode: 'cover' }}
             className="w-full rounded-xl mb-7"
           />
          ) : (
            <View className="w-full h-24 rounded-xl mb-7 bg-[#EDE9F5] justify-center items-center border border-dashed border-accent">
              <Ionicons name="image-outline" size={36} color="#CF96D5" />
              <Text className="text-text-muted text-[15px] mt-1 font-medium">Prévia da capa aparecerá aqui</Text>
            </View>
          )}

          {/* Blocos de Conteúdo */}
          {blocos.length > 0 && (
            <Text className="text-text-dark text-lg font-bold mb-3">
              Conteúdo da Aula
            </Text>
          )}

          {blocos.map((bloco, idx) => (
            <View
              key={bloco.id}
              className={`bg-white rounded-[16px] p-4 mb-4 border ${
                bloco.tipo === 'imagem' ? 'border-accent' : 'border-border-light'
              }`}
            >
              {/* Cabeçalho do Bloco */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={bloco.tipo === 'imagem' ? 'image-outline' : 'text-outline'}
                    size={20}
                    color={bloco.tipo === 'imagem' ? '#CF96D5' : '#391A65'}
                  />
                  <Text className={`font-bold text-base ${
                    bloco.tipo === 'imagem' ? 'text-accent' : 'text-primary'
                  }`}>
                    {bloco.tipo === 'imagem' ? 'Bloco de Imagem' : 'Bloco de Texto'}
                  </Text>
                </View>

                {/* Controles */}
                <View className="flex-row items-center gap-1">
                  <TouchableOpacity
                    onPress={() => moverBloco(bloco.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 min-h-[30px]"
                    accessible={true}
                    accessibilityLabel="Mover bloco para cima"
                  >
                    <Ionicons name="chevron-up-outline" size={24} color={idx === 0 ? '#C5BFD0' : '#391A65'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moverBloco(bloco.id, 'down')}
                    disabled={idx === blocos.length - 1}
                    className="p-1 min-h-[30px]"
                    accessible={true}
                    accessibilityLabel="Mover bloco para baixo"
                  >
                    <Ionicons name="chevron-down-outline" size={24} color={idx === blocos.length - 1 ? '#C5BFD0' : '#391A65'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeBloco(bloco.id)}
                    className="ml-2 p-1 min-h-[30px]"
                    accessible={true}
                    accessibilityLabel="Remover bloco"
                  >
                    <Ionicons name="trash-outline" size={22} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Conteúdo do Bloco: Texto */}
              {bloco.tipo === 'texto' && (
                <TextInput
                  value={bloco.conteudo}
                  onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                  placeholder="Digite o texto da aula aqui..."
                  placeholderTextColor="#6B5E80"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="bg-[#F8F8F8] rounded-xl p-4 text-[17px] text-text-dark min-h-[120px] border border-[#E0DCE8]"
                  accessible={true}
                  accessibilityLabel="Editar texto"
                />
              )}

              {/* Conteúdo do Bloco: Imagem */}
              {bloco.tipo === 'imagem' && (
                <>
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="Cole o link da imagem aqui (https://...)"
                    placeholderTextColor="#6B5E80"
                    autoCapitalize="none"
                    keyboardType="url"
                    className="bg-white rounded-xl p-4 text-base text-text-dark mb-3 border border-border-light"
                  />

                  {/* Preview da imagem se o link estiver preenchido */}
                  {bloco.url && bloco.url.startsWith('http') && (
                     <Image
                     source={{ uri: bloco.url }}
                     style={{ height: 160, resizeMode: 'contain' }}
                     className="w-full rounded-xl mb-3 bg-[#EDE9F5]"
                   />
                  )}

                  <TextInput
                    value={bloco.alt}
                    onChangeText={(v) => updateBloco(bloco.id, 'alt', v)}
                    placeholder="Descrição da imagem (Acessibilidade ALT)"
                    placeholderTextColor="#6B5E80"
                    className="bg-[#F8F8F8] rounded-xl p-4 text-base text-text-dark border border-[#E0DCE8]"
                  />
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Botões Flutuantes: Adicionar Bloco ── */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 pb-8 flex-row gap-3 border-t border-[#E0DCE8]">
        <TouchableOpacity
          onPress={addBlocoTexto}
          className="flex-1 bg-primary rounded-[14px] py-4 flex-row justify-center items-center gap-2 min-h-[58px]"
          accessible={true}
          accessibilityLabel="Adicionar novo bloco de texto"
          accessibilityRole="button"
        >
          <Ionicons name="text-outline" size={22} color="#FFFFFF" />
          <Text className="text-white font-bold text-[17px]">+ Texto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={addBlocoImagem}
          className="flex-1 bg-accent rounded-[14px] py-4 flex-row justify-center items-center gap-2 min-h-[58px]"
          accessible={true}
          accessibilityLabel="Adicionar novo bloco de imagem"
          accessibilityRole="button"
        >
          <Ionicons name="image-outline" size={22} color="#FFFFFF" />
          <Text className="text-white font-bold text-[17px]">+ Imagem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
