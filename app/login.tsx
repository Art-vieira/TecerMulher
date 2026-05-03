import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ───── CABEÇALHO ───── */}
          <View className="px-8 pt-6 pb-10">
            {/* Botão Voltar */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="flex-row items-center mb-10"
              accessible={true}
              accessibilityLabel="Voltar"
              accessibilityRole="button"
            >
              <View className="bg-primary/10 p-2 rounded-full mr-3">
                <Ionicons name="arrow-back" size={24} color="#4C1D95" />
              </View>
              <Text className="text-primary text-lg font-bold">
                Voltar
              </Text>
            </TouchableOpacity>

            {/* Logo e Título */}
            <View className="items-center">
              <View className="bg-surface p-6 rounded-[40px] shadow-xl shadow-primary/10 border border-primary/5 mb-8">
                <Image
                  source={require('../assets/images/Logo.png')}
                  style={{ width: 100, height: 100 }}
                  contentFit="contain"
                />
              </View>
              <Text className="text-text-dark text-[48px] font-bold tracking-tighter leading-[48px]">
                TECER
              </Text>
              <Text className="text-accent text-[24px] font-light tracking-[12px] leading-[24px] -mt-1">
                MULHER
              </Text>
            </View>
          </View>

          {/* ───── FORMULÁRIO ───── */}
          <View className="flex-1 bg-surface rounded-t-[48px] px-8 pt-12 pb-12 shadow-2xl shadow-primary/20">
            <Text className="text-text-dark text-3xl font-bold mb-8">Login Administrativo</Text>
            
            {/* Campo Email */}
            <View className="mb-6">
              <Text className="text-text-dark text-base font-bold mb-3 ml-1">
                E-mail
              </Text>
              <View className="bg-background rounded-2xl border border-primary/5 flex-row items-center px-5">
                <Ionicons name="mail-outline" size={20} color="#4C1D95" style={{ opacity: 0.5 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="exemplo@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 py-5 ml-3 text-lg text-text-dark font-medium"
                />
              </View>
            </View>

            {/* Campo Senha */}
            <View className="mb-8">
              <Text className="text-text-dark text-base font-bold mb-3 ml-1">
                Senha
              </Text>
              <View className="bg-background rounded-2xl border border-primary/5 flex-row items-center px-5">
                <Ionicons name="lock-closed-outline" size={20} color="#4C1D95" style={{ opacity: 0.5 }} />
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 py-5 ml-3 text-lg text-text-dark font-medium"
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                  activeOpacity={0.7}
                  className="p-2"
                >
                  <Ionicons
                    name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color="#4C1D95"
                    style={{ opacity: 0.5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Mensagem de erro */}
            {erro !== '' && (
              <View className="bg-error/10 p-4 rounded-2xl mb-6 flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-error text-sm ml-2 font-bold flex-1">
                  {erro}
                </Text>
              </View>
            )}

            {/* Botão ENTRAR */}
            <TouchableOpacity
              onPress={handleEntrar}
              activeOpacity={0.9}
              disabled={carregando}
              className="bg-primary rounded-2xl py-6 items-center justify-center shadow-xl shadow-primary/30 min-h-[72px]"
            >
              {carregando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-xl font-bold tracking-widest uppercase">
                  Acessar Painel
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
