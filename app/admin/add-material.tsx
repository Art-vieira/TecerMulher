import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

import { useMaterialForm } from '../../hooks/useMaterialForm';

<<<<<<< HEAD
=======
 

>>>>>>> 33b55d9748e7f7f8e4d382e9e80b50a05ab75f46
export default function AddMaterialScreen() {
  const router = useRouter();
  
  const {
    titulo, setTitulo,
    imagemCapa, setImagemCapa,
    blocos,
    salvando,
    acoesBloco,
    salvarMaterial
  } = useMaterialForm();

  const handleSave = async () => {
    const res = await salvarMaterial();
    if (res.success) {
      if (Platform.OS === 'web') {
        window.alert('Sucesso! 🎉 Material salvo com sucesso!');
        router.back();
      } else {
        Alert.alert('Sucesso! 🎉', 'Material salvo com sucesso!', [
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

  const { addBlocoTexto, addBlocoImagem, addBlocoSubtitulo, addBlocoVideo, addBlocoSeparador, removeBloco, updateBloco, moverBloco } = acoesBloco;

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
          <Text className="text-white text-lg font-semibold ml-2">Cancelar</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-bold flex-1 text-center">
          Novo Material
        </Text>
        {/* Botão Salvar no cabeçalho */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={salvando}
          className="min-h-[44px] justify-center ml-2"
          accessible={true}
          accessibilityLabel="Salvar material"
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
            accessibilityLabel="Digite o título da aula"
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
            accessibilityLabel="Link da imagem de capa"
          />
          {imagemCapa.startsWith('http') ? (
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
                    name={
                      bloco.tipo === 'imagem' ? 'image-outline' :
                      bloco.tipo === 'subtitulo' ? 'text' :
                      bloco.tipo === 'video' ? 'videocam-outline' :
                      bloco.tipo === 'separador' ? 'remove-outline' :
                      'text-outline'
                    }
                    size={20}
                    color={bloco.tipo === 'imagem' || bloco.tipo === 'video' ? '#CF96D5' : '#391A65'}
                  />
                  <Text className={`font-bold text-base ${
                    bloco.tipo === 'imagem' || bloco.tipo === 'video' ? 'text-accent' : 'text-primary'
                  }`}>
                    {bloco.tipo === 'imagem' ? 'Bloco de Imagem' :
                     bloco.tipo === 'subtitulo' ? 'Bloco de Subtítulo' :
                     bloco.tipo === 'video' ? 'Bloco de Vídeo' :
                     bloco.tipo === 'separador' ? 'Separador Visual' :
                     'Bloco de Texto'}                  </Text>
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
                  accessibilityLabel="Campo de entrada de texto longo para a aula"
                />
              )}

              {/* Conteúdo do Bloco: Subtítulo */}
              {bloco.tipo === 'subtitulo' && (
                <TextInput
                  value={bloco.conteudo}
                  onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                  placeholder="Digite o subtítulo aqui..."
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#2D1B50',
                    borderWidth: 1,
                    borderColor: '#E0DCE8',
                  }}
                />
              )}

              {/* Conteúdo do Bloco: Vídeo */}
              {bloco.tipo === 'video' && (
                <>
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="Cole o link do YouTube aqui..."
                    autoCapitalize="none"
                    keyboardType="url"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14,
                      color: '#2D1B50',
                      borderWidth: 1,
                      borderColor: '#CF96D5',
                    }}
                  />
                  {bloco.url ? (
                     <Text style={{ fontSize: 12, color: '#7A6E8A', marginTop: 8 }}>O vídeo será carregado no aplicativo pelo YouTube.</Text>
                  ) : null}
                </>
              )}

              {/* Conteúdo do Bloco: Separador */}
              {bloco.tipo === 'separador' && (
                <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '80%', height: 2, backgroundColor: '#E0DCE8', borderRadius: 2 }} />
                </View>
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

                  {bloco.url.startsWith('http') && (
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

      {/* ── Botões Flutuantes: Adicionar Bloco em Horizontal ── */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E0DCE8]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 py-3 pb-8 gap-3"
        >
          <TouchableOpacity
            onPress={addBlocoTexto}
            className="bg-primary rounded-xl py-2 px-3 flex-row items-center gap-2"
          >
            <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-[13px]">+ Texto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoSubtitulo}
            className="bg-primary rounded-xl py-2 px-3 flex-row items-center gap-2"
          >
            <Ionicons name="text-outline" size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-[13px]">+ Subtítulo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoImagem}
            className="bg-accent rounded-xl py-2 px-3 flex-row items-center gap-2"
          >
            <Ionicons name="image-outline" size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-[13px]">+ Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoVideo}
            className="bg-[#FF0000] rounded-xl py-2 px-3 flex-row items-center gap-2"
          >
            <Ionicons name="logo-youtube" size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-[13px]">+ Vídeo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoSeparador}
            className="bg-gray-400 rounded-xl py-2 px-3 flex-row items-center gap-2"
          >
            <Ionicons name="remove-outline" size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-[13px]">+ Separador</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
