import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
<<<<<<< HEAD
  Image,
=======
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
<<<<<<< HEAD
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
=======
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebase.config';

// ─── Tipos de Blocos ──────────────────────────────────
type BlocoTexto = { id: string; tipo: 'texto'; conteudo: string };
type BlocoImagem = { id: string; tipo: 'imagem'; url: string; alt: string };
type BlocoSubtitulo = { id: string; tipo: 'subtitulo'; conteudo: string };
type BlocoVideo = { id: string; tipo: 'video'; url: string };
type BlocoSeparador = { id: string; tipo: 'separador' };
type Bloco = BlocoTexto | BlocoImagem | BlocoSubtitulo | BlocoVideo | BlocoSeparador;

// ─── Utilitário para gerar ID único ──────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function EditMaterialScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const materialId = typeof params.id === 'string' ? params.id : '';

  const [titulo, setTitulo] = useState('');
  const [imagemCapa, setImagemCapa] = useState('');
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // ── Buscar Material ──
  useEffect(() => {
    if (!materialId) {
      Alert.alert('Erro', 'ID do material inválido', [{ text: 'OK', onPress: () => router.back() }]);
      return;
    }

    const fetchMaterial = async () => {
      try {
        const docRef = doc(db, 'materiais', materialId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTitulo(data.title || '');
          setImagemCapa(data.imagemCapa || '');
          setBlocos(data.blocos || []);
        } else {
          Alert.alert('Erro', 'Material não encontrado');
          router.back();
        }
      } catch (error) {
        console.error('Erro ao buscar material:', error);
        Alert.alert('Erro', 'Não foi possível carregar o material.');
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchMaterial();
  }, [materialId]);

  // ── Adicionar blocos ──
  const addBlocoTexto = () => setBlocos((prev) => [...prev, { id: uid(), tipo: 'texto', conteudo: '' }]);
  const addBlocoImagem = () => setBlocos((prev) => [...prev, { id: uid(), tipo: 'imagem', url: '', alt: '' }]);
  const addBlocoSubtitulo = () => setBlocos((prev) => [...prev, { id: uid(), tipo: 'subtitulo', conteudo: '' }]);
  const addBlocoVideo = () => setBlocos((prev) => [...prev, { id: uid(), tipo: 'video', url: '' }]);
  const addBlocoSeparador = () => setBlocos((prev) => [...prev, { id: uid(), tipo: 'separador' }]);

  const removeBloco = (id: string) => setBlocos((prev) => prev.filter((b) => b.id !== id));
  const updateBloco = (id: string, campo: string, valor: string) =>
    setBlocos((prev) => prev.map((b) => (b.id === id ? { ...b, [campo]: valor } : b)));
  
  const moverBloco = (id: string, direcao: 'up' | 'down') => {
    setBlocos((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (direcao === 'up' && idx === 0) return prev;
      if (direcao === 'down' && idx === prev.length - 1) return prev;
      const nova = [...prev];
      const troca = direcao === 'up' ? idx - 1 : idx + 1;
      [nova[idx], nova[troca]] = [nova[troca], nova[idx]];
      return nova;
    });
  };

  const handleUpdate = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título da aula.');
      return;
    }
    if (blocos.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um bloco de conteúdo.');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'materiais', materialId);
      await updateDoc(docRef, {
        title: titulo.trim(),
        imagemCapa: imagemCapa.trim(),
        blocos: blocos,
        // Não atualiza createdAt
      });

      Alert.alert('Sucesso! 🎉', 'Material atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Erro ao atualizar:', err);
      Alert.alert('Erro', 'Não foi possível atualizar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FFFFFF" size="large" />
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
      </SafeAreaView>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Editar Material
        </Text>
        <TouchableOpacity onPress={handleUpdate} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#CF96D5" size="small" />
            : <Text style={{ color: '#CF96D5', fontSize: 16, fontWeight: 'bold' }}>Salvar</Text>
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
          }
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
      {/* ── Corpo ── */}
      <View className="flex-1 bg-background rounded-t-[30px]">
        <ScrollView
          contentContainerClassName="p-6 pb-36"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campo Título */}
          <Text className="text-text-dark text-lg font-bold mb-2">Título da Aula</Text>
=======
      <View style={{ flex: 1, backgroundColor: '#E8E5ED', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Título da Aula</Text>
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Aplicativos de Transporte"
<<<<<<< HEAD
            placeholderTextColor="#6B5E80"
            className="bg-white rounded-xl p-4 text-lg mb-5 border border-border-light text-text-dark"
            accessible={true}
            accessibilityLabel="Edite o título da aula"
          />

          {/* ─ Campo Fixo: Imagem de Capa ─ */}
          <Text className="text-text-dark text-lg font-bold mb-2">Imagem de Capa</Text>
=======
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#C5BFD0',
            }}
          />

          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Imagem de Capa</Text>
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
          <TextInput
            value={imagemCapa}
            onChangeText={setImagemCapa}
            placeholder="Cole o link da imagem de capa (https://...)"
<<<<<<< HEAD
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
=======
            autoCapitalize="none"
            keyboardType="url"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: '#2D1B50',
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#CF96D5',
            }}
          />
          {imagemCapa.startsWith('http') ? (
            <Image
              source={{ uri: imagemCapa }}
              style={{ width: '100%', height: 180, borderRadius: 14, marginBottom: 28, resizeMode: 'cover' }}
            />
          ) : (
             <View style={{
              width: '100%', height: 100, borderRadius: 14, marginBottom: 28,
              backgroundColor: '#EDE9F5', justifyContent: 'center', alignItems: 'center',
              borderWidth: 1, borderStyle: 'dashed', borderColor: '#CF96D5',
            }}>
              <Ionicons name="image-outline" size={36} color="#CF96D5" />
              <Text style={{ color: '#7A6E8A', fontSize: 13, marginTop: 6 }}>Prévia da capa aparecerá aqui</Text>
            </View>
          )}

          {blocos.length > 0 && (
            <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
              Conteúdo da Aula
            </Text>
          )}

          {blocos.map((bloco, idx) => (
            <View
              key={bloco.id}
<<<<<<< HEAD
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
=======
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: bloco.tipo === 'imagem' ? '#CF96D5' : '#C5BFD0',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons
                    name={
                      bloco.tipo === 'imagem' ? 'image-outline' :
                      bloco.tipo === 'subtitulo' ? 'text' :
                      bloco.tipo === 'video' ? 'videocam-outline' :
                      bloco.tipo === 'separador' ? 'remove-outline' :
                      'text-outline'
                    }
                    size={18}
                    color={bloco.tipo === 'imagem' || bloco.tipo === 'video' ? '#CF96D5' : '#391A65'}
                  />
                  <Text style={{ color: bloco.tipo === 'imagem' || bloco.tipo === 'video' ? '#CF96D5' : '#391A65', fontWeight: '700', fontSize: 14 }}>
                    {bloco.tipo === 'imagem' ? 'Bloco de Imagem' :
                     bloco.tipo === 'subtitulo' ? 'Bloco de Subtítulo' :
                     bloco.tipo === 'video' ? 'Bloco de Vídeo' :
                     bloco.tipo === 'separador' ? 'Separador Visual' :
                     'Bloco de Texto'}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TouchableOpacity onPress={() => moverBloco(bloco.id, 'up')} disabled={idx === 0}>
                    <Ionicons name="chevron-up-outline" size={22} color={idx === 0 ? '#CCCCCC' : '#391A65'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => moverBloco(bloco.id, 'down')} disabled={idx === blocos.length - 1}>
                    <Ionicons name="chevron-down-outline" size={22} color={idx === blocos.length - 1 ? '#CCCCCC' : '#391A65'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeBloco(bloco.id)} style={{ marginLeft: 4 }}>
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
                  </TouchableOpacity>
                </View>
              </View>

<<<<<<< HEAD
              {/* Conteúdo do Bloco: Texto */}
=======
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
              {bloco.tipo === 'texto' && (
                <TextInput
                  value={bloco.conteudo}
                  onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                  placeholder="Digite o texto da aula aqui..."
<<<<<<< HEAD
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
=======
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 15,
                    color: '#2D1B50',
                    minHeight: 100,
                    borderWidth: 1,
                    borderColor: '#E0DCE8',
                  }}
                />
              )}

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

              {bloco.tipo === 'separador' && (
                <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '80%', height: 2, backgroundColor: '#E0DCE8', borderRadius: 2 }} />
                </View>
              )}

>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
              {bloco.tipo === 'imagem' && (
                <>
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="Cole o link da imagem aqui (https://...)"
<<<<<<< HEAD
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
=======
                    autoCapitalize="none"
                    keyboardType="url"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14,
                      color: '#2D1B50',
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: '#CF96D5',
                    }}
                  />

                  {bloco.url.startsWith('http') && (
                    <Image
                      source={{ uri: bloco.url }}
                      style={{ width: '100%', height: 160, borderRadius: 10, marginBottom: 10, resizeMode: 'cover' }}
                    />
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
                  )}

                  <TextInput
                    value={bloco.alt}
                    onChangeText={(v) => updateBloco(bloco.id, 'alt', v)}
<<<<<<< HEAD
                    placeholder="Descrição da imagem (Acessibilidade ALT)"
                    placeholderTextColor="#6B5E80"
                    className="bg-[#F8F8F8] rounded-xl p-4 text-base text-text-dark border border-[#E0DCE8]"
=======
                    placeholder="Descrição da imagem para acessibilidade (ALT)"
                    style={{
                      backgroundColor: '#F8F8F8',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14,
                      color: '#2D1B50',
                      borderWidth: 1,
                      borderColor: '#E0DCE8',
                    }}
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
                  />
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

<<<<<<< HEAD
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
=======
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0DCE8',
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingBottom: 24,
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={addBlocoSubtitulo}
            style={{
              backgroundColor: '#ECE7F2',
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ionicons name="text" size={18} color="#391A65" />
            <Text style={{ color: '#391A65', fontWeight: '700', fontSize: 13 }}>+ Subtítulo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoTexto}
            style={{
              backgroundColor: '#391A65',
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>+ Texto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoImagem}
            style={{
              backgroundColor: '#CF96D5',
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ionicons name="image-outline" size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>+ Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoVideo}
            style={{
              backgroundColor: '#FF0000',
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ionicons name="logo-youtube" size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>+ Vídeo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={addBlocoSeparador}
            style={{
              backgroundColor: '#D1CDDA',
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Ionicons name="remove-outline" size={18} color="#391A65" />
            <Text style={{ color: '#391A65', fontWeight: '700', fontSize: 13 }}>+ Separador</Text>
          </TouchableOpacity>
        </ScrollView>
>>>>>>> 6f6d2b6b5fb0b77c3709a91d51a3e687edd9f389
      </View>
    </SafeAreaView>
  );
}
