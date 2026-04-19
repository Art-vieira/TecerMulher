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

export default function MaterialScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');

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
            paddingHorizontal: 12,
            paddingVertical: 6,
            width: '60%',
          }}
        >
          <Ionicons name="search" size={20} color="#A0A0A0" />
          <TextInput
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Search.."
            placeholderTextColor="#A0A0A0"
            style={{
              marginLeft: 8,
              fontSize: 14,
              flex: 1,
              color: '#333333',
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
                backgroundColor: '#D1A3D1', // Cor da barra inferior do card
                borderRadius: 24,
                marginBottom: 24,
                overflow: 'hidden',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              {/* Parte Superior do Card (Imagem) */}
              <View style={{ height: 140 }}>
                <Image
                  source={item.image}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>

              {/* Parte Inferior do Card (Barra Lilás) */}
              <View style={{ height: 45, backgroundColor: '#C893C8' }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
