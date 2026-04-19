import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase.config';

export default function TelaMateriais() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const isAdmin = !!auth.currentUser;

  // Mock de materiais da lista
  const materiais = [
    {
      id: '1',
      title: 'Aplicativos de transporte',
      image: require('../assets/images/aplicativo-transporte.png'),
    },
    {
      id: '2',
      title: 'Segurança Digital',
      image: require('../assets/images/seguranca-digital.png'),
    },
  ];

  // Filtra os materiais de acordo com o texto digitado na pesquisa
  const materiaisFiltrados = materiais.filter((item) =>
    item.title.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ───── CABEÇALHO ROXO ───── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#391A65',
        }}
      >
        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            Voltar
          </Text>
        </TouchableOpacity>

        {/* Barra de Pesquisa */}
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
            style={{
              marginLeft: 8,
              fontSize: 15,
              fontFamily: 'Poppins',
              flex: 1,
              color: '#000000',
              paddingVertical: 0,
            }}
          />
        </View>
      </View>

      {/* ───── CORPO DA LISTA (Fundo Cinza Claro) ───── */}
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {materiaisFiltrados.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#F8F8F8',
                borderRadius: 30,
                marginBottom: 24,
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
              {/* Parte Superior do Card (Imagem) */}
              <Image
                source={item.image}
                style={{ 
                  width: '100%', 
                  height: 146, 
                  borderTopLeftRadius: 30, 
                  borderTopRightRadius: 30,
                  resizeMode: 'cover' 
                }}
              />

              {/* Parte Inferior do Card (Texto) */}
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                <Text style={{ color: '#391A65', fontSize: 18, fontFamily: 'Poppins', fontWeight: '600', lineHeight: 18, textAlign: 'center' }}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Botão flutuante Adicionar (Admin) */}
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
