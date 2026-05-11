import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import * as ImagePicker from 'expo-image-picker';

import { useMaterialForm } from '../../hooks/useMaterialForm';

interface MaterialFormTemplateProps {
  id?: string;
  isEdit?: boolean;
}

export default function MaterialFormTemplate({ id, isEdit = false }: MaterialFormTemplateProps) {
  const router = useRouter();
  
  const {
    titulo, setTitulo,
    imagemCapa, setImagemCapa,
    blocos,
    salvando,
    uploadProgress,
    carregandoDados,
    acoesBloco,
    salvarMaterial
  } = useMaterialForm(id);

  const handleSave = async () => {
    const res = await salvarMaterial();
    if (res.success) {
      const successMessage = isEdit ? 'Edições salvas com sucesso!' : 'Material salvo com sucesso!';
      if (Platform.OS === 'web') {
        window.alert(`Sucesso! 🎉 ${successMessage}`);
        router.back();
      } else {
        Alert.alert('Sucesso! 🎉', successMessage, [
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

  const { addBlocoTexto, addBlocoImagem, addBlocoVideo, addBlocoAlerta, removeBloco, updateBloco, moverBloco } = acoesBloco;

  const pickImageForCapa = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagemCapa(result.assets[0].uri);
    }
  };

  const pickImageForBlock = async (id: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      updateBloco(id, 'url', result.assets[0].uri);
    }
  };

  if (carregandoDados) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white mt-4 text-base font-semibold">Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
      {/* ── Cabeçalho ── */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel={isEdit ? "Cancelar edições" : "Cancelar criação"}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-bold flex-1 text-center">
          {isEdit ? 'Editar material' : 'Novo Material'}
        </Text>
        
        {/* Botão Salvar no cabeçalho */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={salvando}
          className="min-h-[44px] justify-center ml-2"
          accessible={true}
          accessibilityLabel={isEdit ? "Salvar edições" : "Salvar material"}
          accessibilityRole="button"
        >
          {salvando
            ? <ActivityIndicator color="#CF96D5" size="small" />
            : <Text className="text-accent text-[16px] font-bold">Salvar</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Barra de Progresso de Upload ── */}
      {salvando && uploadProgress > 0 && (
        <View className="px-5 pb-3 bg-primary">
          <View className="flex-row justify-between mb-1">
            <Text className="text-white text-[12px] font-semibold">Enviando imagens...</Text>
            <Text className="text-accent text-[12px] font-bold">{uploadProgress}%</Text>
          </View>
          <View className="h-[4px] w-full bg-white/20 rounded-full overflow-hidden">
            <View
              className="h-full bg-accent rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </View>
        </View>
      )}

      {/* ── Corpo ── */}
      <View className="flex-1 bg-admin-dark rounded-t-[20px]">
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
            placeholder={isEdit ? "Introdução à História da Arte" : "Digite o titulo principal..."}
            placeholderTextColor="#6B5E80"
            className="bg-transparent rounded-xl p-4 text-[15px] mb-6 border border-admin-border text-white"
            accessible={true}
            accessibilityLabel={isEdit ? "Edite o título da aula" : "Digite o título da aula"}
          />

          {/* ─ Campo Fixo: Imagem de Capa ─ */}
          {imagemCapa && (imagemCapa.startsWith('http') || imagemCapa.startsWith('file')) ? (
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
              <TouchableOpacity
                onPress={pickImageForCapa}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
              >
                <Ionicons name="pencil" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImageForCapa} className="w-full h-[180px] rounded-xl mb-6 bg-transparent justify-center items-center border border-dashed border-admin-border relative">
              <Ionicons name="image-outline" size={32} color="#FFFFFF" />
              <Text className="text-white text-[13px] mt-2 font-medium">Upload Imagem de Capa</Text>
              <TextInput
                value={imagemCapa}
                onChangeText={setImagemCapa}
                placeholder="Ou cole o link da imagem..."
                placeholderTextColor="#6B5E80"
                autoCapitalize="none"
                keyboardType="url"
                className="absolute bottom-2 left-2 right-2 bg-transparent text-[12px] text-white px-2 py-1 border-b border-admin-border"
              />
            </TouchableOpacity>
          )}

          {/* Blocos de Conteúdo */}
          {!isEdit && blocos.length > 0 && (
            <Text className="text-white text-[15px] font-bold mb-3">
              Conteúdo da Aula
            </Text>
          )}

          {blocos.map((bloco, idx) => (
            <View
              key={bloco.id}
              className={`bg-transparent rounded-xl p-4 mb-4 border ${
                bloco.tipo === 'imagem' ? 'border-accent' : 'border-admin-border'
              }`}
            >
              {/* Cabeçalho do Bloco */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-white font-bold text-[14px]">
                    {bloco.tipo === 'imagem' ? 'Imagem' :
                     bloco.tipo === 'video' ? 'Link do YT' :
                     bloco.tipo === 'alerta' ? 'Alerta' :
                     bloco.tipo === 'subtitulo' ? 'Subtítulo' :
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
                <View className="gap-3">
                  <TextInput
                    value={bloco.titulo}
                    onChangeText={(v) => updateBloco(bloco.id, 'titulo', v)}
                    placeholder="Título (opcional)..."
                    placeholderTextColor="#6B5E80"
                    className="bg-transparent rounded-lg p-3 text-[14px] text-white border border-admin-border"
                  />
                  <TextInput
                    value={bloco.conteudo}
                    onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                    placeholder="Digite o texto da aula aqui..."
                    placeholderTextColor="#6B5E80"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="bg-transparent rounded-lg p-3 text-[14px] text-white min-h-[100px] border border-admin-border"
                    accessible={true}
                    accessibilityLabel="Campo de entrada de texto longo para a aula"
                  />
                </View>
              )}

              {/* Conteúdo do Bloco: Alerta */}
              {bloco.tipo === 'alerta' && (
                <View className="flex-row items-start gap-3">
                  <View className="w-10 h-10 rounded-lg bg-red-500/20 items-center justify-center mt-1">
                     <Ionicons name="warning-outline" size={20} color="#EF4444" />
                  </View>
                  <TextInput
                    value={bloco.conteudo}
                    onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                    placeholder="Digite o aviso/alerta aqui..."
                    placeholderTextColor="#6B5E80"
                    multiline
                    className="flex-1 bg-transparent rounded-lg p-3 text-[13px] text-white border border-admin-border min-h-[80px]"
                    textAlignVertical="top"
                  />
                </View>
              )}

              {/* Conteúdo do Bloco: Subtítulo (Retrocompatibilidade) */}
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
                  <View className="w-10 h-10 rounded-lg bg-primary-deep items-center justify-center">
                     <Ionicons name="play-outline" size={20} color="#FFFFFF" />
                  </View>
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="https://youtube.com/watch?v="
                    placeholderTextColor="#6B5E80"
                    autoCapitalize="none"
                    keyboardType="url"
                    className="flex-1 bg-transparent rounded-lg p-3 text-[13px] text-white border border-admin-border"
                  />
                </View>
              )}

              {/* Conteúdo do Bloco: Separador (Retrocompatibilidade) */}
              {bloco.tipo === 'separador' && (
                <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '80%', height: 2, backgroundColor: '#3C3C3C', borderRadius: 2 }} />
                </View>
              )}

              {/* Conteúdo do Bloco: Imagem */}
              {bloco.tipo === 'imagem' && (
                <>
                  {bloco.url && (bloco.url.startsWith('http') || bloco.url.startsWith('file')) ? (
                    <View className="relative">
                      <Image
                        source={{ uri: bloco.url }}
                        style={{ height: 160, resizeMode: 'cover' }}
                        className="w-full rounded-xl mb-3"
                      />
                      <TouchableOpacity
                        onPress={() => pickImageForBlock(bloco.id)}
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
                      >
                        <Ionicons name="pencil" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => pickImageForBlock(bloco.id)} className="w-full h-[140px] rounded-xl mb-4 bg-transparent justify-center items-center border border-dashed border-admin-border">
                      <Ionicons name="image-outline" size={28} color="#FFFFFF" />
                      <Text className="text-white text-[12px] mt-2 font-medium">Upload Imagem</Text>
                    </TouchableOpacity>
                  )}
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="Ou cole o link da imagem..."
                    placeholderTextColor="#6B5E80"
                    autoCapitalize="none"
                    keyboardType="url"
                    className="bg-transparent rounded-lg p-3 text-[13px] text-white mb-3 border border-admin-border"
                  />
                  <Text className="text-white text-[13px] mb-1">Legenda da imagem (opcional)</Text>
                  <TextInput
                    value={bloco.alt}
                    onChangeText={(v) => updateBloco(bloco.id, 'alt', v)}
                    placeholder="Descrição da imagem"
                    placeholderTextColor="#6B5E80"
                    className="bg-transparent rounded-lg p-3 text-[13px] text-white border border-admin-border"
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
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-primary-deep mr-3"
          >
            <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">CONTEÚDO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoImagem}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-primary-deep mr-3"
          >
            <Ionicons name="image-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">IMAGEM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoVideo}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-primary-deep mr-3"
          >
            <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">YT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={addBlocoAlerta}
            className="w-[76px] h-[76px] rounded-xl border border-white/20 items-center justify-center bg-primary-deep"
          >
            <Ionicons name="warning-outline" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-[10px] mt-2 tracking-wider">ALERTA</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
