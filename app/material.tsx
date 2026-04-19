import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase.config';

// ─── Tipo do Material ───
type Material = {
  id: string;
  title: string;
  imagemCapa?: string;
};

export default function TelaMateriais() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [menuAberto, setMenuAberto] = useState<string | null>(null); // ID do card com menu aberto
  const isAdmin = !!auth.currentUser;

  // ── Listener em tempo real ──
  useEffect(() => {
    const q = query(collection(db, 'materiais'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dados: Material[] = snapshot.docs.map((d) => ({
          id: d.id,
          title: d.data().title ?? 'Sem título',
          imagemCapa: d.data().imagemCapa ?? '',
        }));
        setMateriais(dados);
        setCarregando(false);
      },
      (err) => {
        console.error('Erro ao buscar materiais:', err);
        setCarregando(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ── Apagar material ──
  const handleApagar = (id: string, titulo: string) => {
    setMenuAberto(null);
    Alert.alert(
      'Apagar Material',
      `Tem certeza que deseja apagar "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Apagando material com ID:', id);
              await deleteDoc(doc(db, 'materiais', id));
              console.log('Material apagado com sucesso!');
              Alert.alert('✅ Apagado', `"${titulo}" foi removido com sucesso.`);
            } catch (e: any) {
              console.error('Erro ao apagar:', e.code, e.message);
              Alert.alert('Erro', `Não foi possível apagar.\n\nDetalhe: ${e.message}`);
            }
          },
        },
      ]
    );
  };

  // ── Editar material ──
  const handleEditar = (id: string) => {
    setMenuAberto(null);
    router.push({ pathname: '/admin/edit-material', params: { id } });
  };

  const materiaisFiltrados = materiais.filter((item) =>
    item.title.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fechar menu ao tocar fora */}
      {menuAberto && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} />
        </TouchableWithoutFeedback>
      )}

      {/* ── Cabeçalho ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Voltar</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            width: '65%',
          }}
        >
          <Ionicons name="search" size={20} color="#000000" style={{ opacity: 0.3 }} />
          <TextInput
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Procurar..."
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={{ marginLeft: 8, fontSize: 15, flex: 1, color: '#000000', paddingVertical: 0 }}
          />
        </View>
      </View>

      {/* ── Corpo ── */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#E8E5ED',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
      >
        {carregando ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#391A65" />
            <Text style={{ color: '#391A65', marginTop: 12 }}>Carregando materiais...</Text>
          </View>
        ) : materiaisFiltrados.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="book-outline" size={60} color="#C5BFD0" />
            <Text style={{ color: '#7A6E8A', marginTop: 16, fontSize: 16, textAlign: 'center' }}>
              {pesquisa ? 'Nenhum material encontrado.' : 'Nenhum material disponível ainda.'}
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {materiaisFiltrados.map((item) => (
              <View key={item.id} style={{ marginBottom: 24 }}>
                {/* Card */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    if (menuAberto) { setMenuAberto(null); return; }
                    router.push({ pathname: '/aula', params: { id: item.id } });
                  }}
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: 30,
                    paddingTop: 7,
                    paddingHorizontal: 7,
                    height: 215,
                    elevation: 4,
                    shadowColor: '#3C3C3C',
                    shadowOffset: { width: 4, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                  }}
                >
                  {/* Imagem de Capa */}
                  {item.imagemCapa ? (
                    <Image
                      source={{ uri: item.imagemCapa }}
                      style={{
                        width: '100%',
                        height: 146,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        resizeMode: 'cover',
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: 146,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        backgroundColor: '#EDE9F5',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="image-outline" size={40} color="#C5BFD0" />
                    </View>
                  )}

                  {/* Título */}
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text
                      style={{
                        color: '#391A65',
                        fontSize: 18,
                        fontWeight: '600',
                        lineHeight: 22,
                        textAlign: 'center',
                      }}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </View>

                  {/* Três pontinhos (só para admin) */}
                  {isAdmin && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setMenuAberto(menuAberto === item.id ? null : item.id);
                      }}
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 16,
                        backgroundColor: 'transparent',
                        borderRadius: 20,
                        width: 36,
                        height: 36,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 20,
                      }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={22} color="#391A65" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                {/* Dropdown do menu (aparece abaixo do card) */}
                {menuAberto === item.id && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 14,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 14,
                      paddingVertical: 6,
                      zIndex: 30,
                      elevation: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      minWidth: 150,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleEditar(item.id)}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}
                    >
                      <Ionicons name="create-outline" size={20} color="#391A65" />
                      <Text style={{ color: '#391A65', fontSize: 15, fontWeight: '600' }}>Editar</Text>
                    </TouchableOpacity>

                    <View style={{ height: 1, backgroundColor: '#F0EDF5', marginHorizontal: 12 }} />

                    <TouchableOpacity
                      onPress={() => handleApagar(item.id, item.title)}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                      <Text style={{ color: '#E74C3C', fontSize: 15, fontWeight: '600' }}>Apagar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Botão + (admin) */}
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => router.push('/admin/add-material')}
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            backgroundColor: '#CF96D5',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
        >
          <Ionicons name="add" size={36} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}
