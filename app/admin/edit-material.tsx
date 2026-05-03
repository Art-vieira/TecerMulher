import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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

  const handleSave = async () => {
    const res = await salvarMaterial();
    if (res.success) {
      if (Platform.OS === 'web') {
        window.alert('Sucesso! 🎉 Edições salvas com sucesso!');
        router.back();
      } else {
        Alert.alert('Sucesso! 🎉', 'Edições salvas com sucesso!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert('Erro: ' + (res.error || 'Ocorreu um erro.'));
      } else {
        Alert.alert('Erro', res.error || 'Ocorreu um erro.');
      }
    }
  };

  const { addBlocoTexto, addBlocoImagem, addBlocoSubtitulo, addBlocoVideo, addBlocoSeparador, removeBloco, updateBloco, moverBloco } = acoesBloco;

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
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-bold flex-1 text-center">
          Editar material
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
            : <Text className="text-[#CF96D5] text-[16px] font-bold">Salvar</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Corpo ── */}
      <View className="flex-1 bg-[#1A1A1A] rounded-t-[20px]">
        <ScrollView
          contentContainerClassName="p-6 pb-36"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campo Título */}
          <Text className="text-white text-[15px] font-bold mb-2">Titulo</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Introdução à História da Arte"
            placeholderTextColor="#6B5E80"
            className="bg-transparent rounded-xl p-4 text-[15px] mb-6 border border-[#3C3C3C] text-white"
            accessible={true}
            accessibilityLabel="Edite o título da aula"
          />

          {/* ─ Campo Fixo: Imagem de Capa ─ */}
          {imagemCapa && imagemCapa.startsWith('http') ? (
            <View className="relative mb-6">
              <Image
                source={{ uri: imagemCapa }}
                style={{ height: 180, resizeMode: 'cover' }}
                className="w-full rounded-xl"
              />
              <TextInput
                value={imagemCapa}
                onChangeText={setImagemCapa}
                placeholder="Link da imagem..."
                placeholderTextColor="#6B5E80"
                autoCapitalize="none"
                keyboardType="url"
                className="absolute bottom-2 left-2 right-2 bg-black/60 rounded-lg p-2 text-[12px] text-white"
              />
            </View>
          ) : (
            <View className="w-full h-[180px] rounded-xl mb-6 bg-transparent justify-center items-center border border-dashed border-[#3C3C3C] relative">
              <Ionicons name="image-outline" size={32} color="#FFFFFF" />
              <Text className="text-white text-[13px] mt-2 font-medium">Upload Imagem de Capa</Text>
              <TextInput
                value={imagemCapa}
                onChangeText={setImagemCapa}
                placeholder="Cole o link da imagem..."
                placeholderTextColor="#6B5E80"
                autoCapitalize="none"
                keyboardType="url"
                className="absolute bottom-2 left-2 right-2 bg-transparent text-[12px] text-white px-2 py-1 border-b border-[#3C3C3C]"
              />
            </View>
          )}

          {/* Blocos de Conteúdo */}
          {blocos.map((bloco, idx) => (
            <View
              key={bloco.id}
              className={`bg-transparent rounded-xl p-4 mb-4 border ${
                bloco.tipo === 'imagem' ? 'border-[#CF96D5]' : 'border-[#3C3C3C]'
              }`}
            >
              {/* Cabeçalho do Bloco */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-bold text-[14px]">
                    {bloco.tipo === 'imagem' ? 'Imagem' :
                     bloco.tipo === 'subtitulo' ? 'Subtítulo' :
                     bloco.tipo === 'video' ? 'Link do YT' :
                     bloco.tipo === 'separador' ? 'Separador Visual' :
                     'Conteúdo'}
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
                    <Ionicons name="arrow-up-outline" size={20} color={idx === 0 ? '#555555' : '#FFFFFF'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moverBloco(bloco.id, 'down')}
                    disabled={idx === blocos.length - 1}
                    className="p-1 min-h-[30px]"
                    accessible={true}
                    accessibilityLabel="Mover bloco para baixo"
                  >
                    <Ionicons name="arrow-down-outline" size={20} color={idx === blocos.length - 1 ? '#555555' : '#FFFFFF'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeBloco(bloco.id)}
                    className="ml-2 p-1 min-h-[30px]"
                    accessible={true}
                    accessibilityLabel="Remover bloco"
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
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
                  className="bg-transparent rounded-lg p-3 text-[14px] text-white min-h-[100px] border border-[#3C3C3C]"
                  accessible={true}
                  accessibilityLabel="Editar texto"
                />
              )}

              {/* Conteúdo do Bloco: Subtítulo */}
              {bloco.tipo === 'subtitulo' && (
                <TextInput
                  value={bloco.conteudo}
                  onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                  placeholder="Digite o subtítulo aqui..."
                  placeholderTextColor="#6B5E80"
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#3C3C3C',
                  }}
                />
              )}

              {/* Conteúdo do Bloco: Vídeo */}
              {bloco.tipo === 'video' && (
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-[#2D1B50] items-center justify-center">
                     <Ionicons name="play-outline" size={20} color="#FFFFFF" />
                  </View>
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="https://youtube.com/watch?v="
                    placeholderTextColor="#6B5E80"
                    autoCapitalize="none"
                    keyboardType="url"
                    className="flex-1 bg-transparent rounded-lg p-3 text-[13px] text-white border border-[#3C3C3C]"
                  />
                </View>
              )}

              {/* Conteúdo do Bloco: Separador */}
              {bloco.tipo === 'separador' && (
                <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '80%', height: 2, backgroundColor: '#3C3C3C', borderRadius: 2 }} />
                </View>
              )}

              {/* Conteúdo do Bloco: Imagem */}
              {bloco.tipo === 'imagem' && (
                <>
                  {bloco.url && bloco.url.startsWith('http') ? (
                    <Image
                      source={{ uri: bloco.url }}
                      style={{ height: 160, resizeMode: 'cover' }}
                      className="w-full rounded-xl mb-3"
                    />
                  ) : (
                    <View className="w-full h-[140px] rounded-xl mb-4 bg-transparent justify-center items-center border border-dashed border-[#3C3C3C]">
                      <Ionicons name="image-outline" size={28} color="#FFFFFF" />
                      <Text className="text-white text-[12px] mt-2 font-medium">Upload Imagem de Capa</Text>
                    </View>
                  )}
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="Cole o link da imagem..."
                    placeholderTextColor="#6B5E80"
                    autoCapitalize="none"
                    keyboardType="url"
                    className="bg-transparent rounded-lg p-3 text-[13px] text-white mb-3 border border-[#3C3C3C]"
                  />
                  <Text className="text-white text-[13px] mb-1">Legenda da imagem (opcional)</Text>
                  <TextInput
                    value={bloco.alt}
                    onChangeText={(v) => updateBloco(bloco.id, 'alt', v)}
                    placeholder="Descrição da imagem"
                    placeholderTextColor="#6B5E80"
                    className="bg-transparent rounded-lg p-3 text-[13px] text-white border border-[#3C3C3C]"
                  />
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Botões Flutuantes: Adicionar Bloco em Horizontal ── */}
      <View className="absolute bottom-0 left-0 right-0 bg-primary border-t border-white/20">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        >
          <TouchableOpacity
            onPress={addBlocoTexto}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-[#2D1B50] mr-3"
          >
            <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">CONTEÚDO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoImagem}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-[#2D1B50] mr-3"
          >
            <Ionicons name="image-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">IMAGEM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoVideo}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-[#2D1B50] mr-3"
          >
            <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">YT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={addBlocoSubtitulo}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-[#2D1B50] mr-3"
          >
            <Ionicons name="text-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">SUBTÍTULO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoSeparador}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-[#2D1B50]"
          >
            <Ionicons name="remove-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">SEPARADOR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
