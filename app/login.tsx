import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth } from '../firebase.config';

export default function TelaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const mensagemErro = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Sem conexão com a internet.';
      default:
        return 'Erro ao entrar. Verifique suas credenciais.';
    }
  };

  const handleEntrar = async () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      router.replace('/menu');
    } catch (e: any) {
      setErro(mensagemErro(e.code));
    } finally {
      setCarregando(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#391A65' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ───── CABEÇALHO ROXO ───── */}
          <View style={{ backgroundColor: '#391A65' }}>
            {/* Botão Voltar */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 8,
              }}
            >
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontWeight: '600',
                  marginLeft: 10,
                }}
              >
                Voltar
              </Text>
            </TouchableOpacity>

            {/* Logo e Título */}
            <View style={{ alignItems: 'center', paddingVertical: 28 }}>
              <Image
                source={require('../assets/images/Logo.png')}
                style={{ width: 130, height: 130 }}
                contentFit="contain"
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 42,
                  fontWeight: '800',
                  letterSpacing: 2,
                  marginTop: 8,
                  lineHeight: 44,
                }}
              >
                TECER
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 30,
                  fontWeight: '400',
                  letterSpacing: 6,
                  lineHeight: 34,
                }}
              >
                MULHER
              </Text>
            </View>
          </View>

          {/* ───── PAINEL BRANCO ───── */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#E8E5ED',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingHorizontal: 28,
              paddingTop: 36,
              paddingBottom: 40,
            }}
          >
            {/* Campo Email */}
            <Text
              style={{
                color: '#2D1B50',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Email :
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#C5BFD0',
                marginBottom: 22,
              }}
            >
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="facilitador@gmail.com"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: '#2D1B50',
                }}
              />
            </View>

            {/* Campo Senha */}
            <Text
              style={{
                color: '#2D1B50',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Senha :
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#C5BFD0',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••••••"
                placeholderTextColor="#AAAAAA"
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: '#2D1B50',
                }}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                activeOpacity={0.7}
                style={{ paddingHorizontal: 14 }}
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#7A6E8A"
                />
              </TouchableOpacity>
            </View>

            {/* Mensagem de erro */}
            {erro !== '' && (
              <Text
                style={{
                  color: '#C0392B',
                  fontSize: 13,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                {erro}
              </Text>
            )}

            <View style={{ marginBottom: 20 }} />

            {/* Botão ENTRAR */}
            <TouchableOpacity
              onPress={handleEntrar}
              activeOpacity={0.85}
              disabled={carregando}
              style={{
                backgroundColor: '#391A65',
                borderRadius: 12,
                paddingVertical: 18,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#391A65',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              {carregando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: '800',
                    letterSpacing: 3,
                  }}
                >
                  ENTRAR
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
