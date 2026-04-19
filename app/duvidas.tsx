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

export default function DuvidasScreen() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState('');
  const isAdmin = !!auth.currentUser;

  // Mock
  const duvidas = [
    {
      id: '1',
      title: 'Como resetar a senha?',
    },
    {
      id: '2',
      title: 'Não consigo ver a imagem da aula',
    },
  ];

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
      </View>

      {/* ───── CORPO ───── */}
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#391A65', marginBottom: 20 }}>Dúvidas Frequentes</Text>
          {duvidas.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#2D1B50' }}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Botão flutuante Adicionar (Admin) */}
      {isAdmin ? (
        <TouchableOpacity
          onPress={() => alert('Em breve: Adicionar dúvida!')}
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
