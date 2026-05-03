import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
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
import { useAuth } from '../hooks/useAuth';

export default function TelaLogin() {
  const router = useRouter();
  const { loginLocal } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleEntrar = async () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setErro('');
    setCarregando(true);
    
    // Simulação de login local
    setTimeout(async () => {
      try {
        // Aceita qualquer login para facilitar localmente, ou um específico
        if (email.trim() === 'facilitador@gmail.com' && senha === '123456') {
          await loginLocal(email.trim());
          router.replace('/menu');
        } else {
          setErro('E-mail ou senha incorretos (Local).');
        }
      } catch (e) {
        setErro('Erro ao entrar localmente.');
      } finally {
        setCarregando(false);
      }
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
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
          {/* ───── CABEÇALHO ROXO ───── */}
          <View className="bg-primary">
            {/* Botão Voltar */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              className="flex-row items-center px-6 pt-4 pb-2"
              accessible={true}
              accessibilityLabel="Voltar para a tela anterior"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
              <Text className="text-white text-lg font-semibold ml-2">
                Voltar
              </Text>
            </TouchableOpacity>

            {/* Logo e Título */}
            <View className="items-center py-7">
              <Image
                source={require('../assets/images/Logo.png')}
                style={{ width: 130, height: 130 }}
                contentFit="contain"
                accessible={true}
                accessibilityLabel="Logo Tecer Mulher"
              />
              <Text className="text-white text-[42px] font-extrabold tracking-widest mt-2 leading-[44px]">
                TECER
              </Text>
              <Text className="text-white text-[30px] font-normal tracking-[6px] leading-[34px]">
                MULHER
              </Text>
            </View>
          </View>

          {/* ───── PAINEL BRANCO ───── */}
          <View className="flex-1 bg-background rounded-t-[30px] px-7 pt-9 pb-10">
            {/* Campo Email */}
            <Text className="text-text-dark text-lg font-semibold mb-2">
              Email :
            </Text>
            <View className="bg-white rounded-xl border border-border-light mb-6">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="facilitador@gmail.com"
                placeholderTextColor="#6B5E80"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="px-4 py-4 text-lg text-text-dark"
                accessible={true}
                accessibilityLabel="Campo de entrada de email"
              />
            </View>

            {/* Campo Senha */}
            <Text className="text-text-dark text-lg font-semibold mb-2">
              Senha :
            </Text>
            <View className="bg-white rounded-xl border border-border-light flex-row items-center mb-3">
              <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••••••"
                placeholderTextColor="#6B5E80"
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 px-4 py-4 text-lg text-text-dark"
                accessible={true}
                accessibilityLabel="Campo de entrada de senha"
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                activeOpacity={0.7}
                className="px-4 py-4"
                accessible={true}
                accessibilityLabel={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                accessibilityRole="button"
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color="#7A6E8A"
                />
              </TouchableOpacity>
            </View>

            {/* Mensagem de erro */}
            {erro !== '' && (
              <Text className="text-error text-sm mb-2 text-center font-medium">
                {erro}
              </Text>
            )}

            <View className="mb-5" />

            {/* Botão ENTRAR */}
            <TouchableOpacity
              onPress={handleEntrar}
              activeOpacity={0.85}
              disabled={carregando}
              className="bg-primary rounded-xl py-4 items-center justify-center shadow-md shadow-primary/40 min-h-[58px]"
              accessible={true}
              accessibilityLabel="Botão de Entrar"
              accessibilityRole="button"
            >
              {carregando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-[18px] font-extrabold tracking-widest">
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
