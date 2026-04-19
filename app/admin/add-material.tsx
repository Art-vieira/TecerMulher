import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
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

// ─── Tipos de Blocos ──────────────────────────────────
type BlocoTexto = { id: string; tipo: 'texto'; conteudo: string };
type BlocoImagem = { id: string; tipo: 'imagem'; url: string; alt: string };
type Bloco = BlocoTexto | BlocoImagem;

// ─── Utilitário para gerar ID único ──────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function AddMaterialScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [imagemCapa, setImagemCapa] = useState('');
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Adicionar blocos ──
  const addBlocoTexto = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: 'texto', conteudo: '' }]);

  const addBlocoImagem = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: 'imagem', url: '', alt: '' }]);

  // ── Remover bloco ──
  const removeBloco = (id: string) =>
    setBlocos((prev) => prev.filter((b) => b.id !== id));

  // ── Atualizar campo de bloco ──
  const updateBloco = (id: string, campo: string, valor: string) =>
    setBlocos((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [campo]: valor } : b))
    );

  // ── Mover bloco (cima/baixo) ──
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

  // ── Salvar no Firebase ──
  const handleSave = async () => {
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
      await addDoc(collection(db, 'materiais'), {
        title: titulo.trim(),
        imagemCapa: imagemCapa.trim(),
        blocos,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sucesso! 🎉', 'Material salvo com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      Alert.alert('Erro', 'Não foi possível salvar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Novo Material
        </Text>
        {/* Botão Salvar no cabeçalho */}
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#CF96D5" size="small" />
            : <Text style={{ color: '#CF96D5', fontSize: 16, fontWeight: 'bold' }}>Salvar</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Corpo ── */}
      <View style={{ flex: 1, backgroundColor: '#E8E5ED', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campo Título */}
          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Título da Aula</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Aplicativos de Transporte"
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

          {/* ─ Campo Fixo: Imagem de Capa ─ */}
          <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Imagem de Capa</Text>
          <TextInput
            value={imagemCapa}
            onChangeText={setImagemCapa}
            placeholder="Cole o link da imagem de capa (https://...)"
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

          {/* Blocos de Conteúdo */}
          {blocos.length > 0 && (
            <Text style={{ color: '#2D1B50', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
              Conteúdo da Aula
            </Text>
          )}

          {blocos.map((bloco, idx) => (
            <View
              key={bloco.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: bloco.tipo === 'imagem' ? '#CF96D5' : '#C5BFD0',
              }}
            >
              {/* Cabeçalho do Bloco */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons
                    name={bloco.tipo === 'imagem' ? 'image-outline' : 'text-outline'}
                    size={18}
                    color={bloco.tipo === 'imagem' ? '#CF96D5' : '#391A65'}
                  />
                  <Text style={{ color: bloco.tipo === 'imagem' ? '#CF96D5' : '#391A65', fontWeight: '700', fontSize: 14 }}>
                    {bloco.tipo === 'imagem' ? 'Bloco de Imagem' : 'Bloco de Texto'}
                  </Text>
                </View>

                {/* Controles */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TouchableOpacity onPress={() => moverBloco(bloco.id, 'up')} disabled={idx === 0}>
                    <Ionicons name="chevron-up-outline" size={22} color={idx === 0 ? '#CCCCCC' : '#391A65'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => moverBloco(bloco.id, 'down')} disabled={idx === blocos.length - 1}>
                    <Ionicons name="chevron-down-outline" size={22} color={idx === blocos.length - 1 ? '#CCCCCC' : '#391A65'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeBloco(bloco.id)} style={{ marginLeft: 4 }}>
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Conteúdo do Bloco: Texto */}
              {bloco.tipo === 'texto' && (
                <TextInput
                  value={bloco.conteudo}
                  onChangeText={(v) => updateBloco(bloco.id, 'conteudo', v)}
                  placeholder="Digite o texto da aula aqui..."
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

              {/* Conteúdo do Bloco: Imagem */}
              {bloco.tipo === 'imagem' && (
                <>
                  <TextInput
                    value={bloco.url}
                    onChangeText={(v) => updateBloco(bloco.id, 'url', v)}
                    placeholder="Cole o link da imagem aqui (https://...)"
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

                  {/* Preview da imagem se o link estiver preenchido */}
                  {bloco.url.startsWith('http') && (
                    <Image
                      source={{ uri: bloco.url }}
                      style={{ width: '100%', height: 160, borderRadius: 10, marginBottom: 10, resizeMode: 'cover' }}
                    />
                  )}

                  <TextInput
                    value={bloco.alt}
                    onChangeText={(v) => updateBloco(bloco.id, 'alt', v)}
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
                  />
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Botões Flutuantes: Adicionar Bloco ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 24,
          paddingVertical: 16,
          paddingBottom: 28,
          flexDirection: 'row',
          gap: 12,
          borderTopWidth: 1,
          borderTopColor: '#E0DCE8',
        }}
      >
        <TouchableOpacity
          onPress={addBlocoTexto}
          style={{
            flex: 1,
            backgroundColor: '#391A65',
            borderRadius: 14,
            paddingVertical: 14,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="text-outline" size={20} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>+ Texto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={addBlocoImagem}
          style={{
            flex: 1,
            backgroundColor: '#CF96D5',
            borderRadius: 14,
            paddingVertical: 14,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="image-outline" size={20} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>+ Imagem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
