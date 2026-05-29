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
import { useAuth } from '../../hooks/useAuth';

export default function TelaLogin() {
  const router = useRouter();
  const { login, user, carregandoAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  React.useEffect(() => {
    if (!carregandoAuth && user) {
      router.replace('/menu');
    }
  }, [user, carregandoAuth, router]);

  const handleEntrar = async () => {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setErro('');
    setCarregando(true);

    try {
      await login(email.trim(), senha);
      router.replace('/menu');
    } catch (e: any) {
      const code: string = e?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setErro('E-mail ou senha incorretos.');
      } else if (code === 'auth/too-many-requests') {
        setErro('Muitas tentativas. Tente novamente mais tarde.');
      } else if (code === 'auth/network-request-failed') {
        setErro('Sem conexão com a internet. Verifique sua rede.');
      } else if (code === 'auth/user-disabled') {
        setErro('Esta conta foi desativada.');
      } else {
        setErro('Erro ao entrar. Tente novamente.');
      }
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
        keyboardVerticalOffset={Platform.OS === 'android' ? -100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ───── CABEÇALHO ROXO ───── */}
          <View style={{ backgroundColor: '#391A65' }}>
            {/* Botão Voltar */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}
              accessible={true}
              accessibilityLabel="Voltar para a tela anterior"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
                Voltar
              </Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 24 }}>
              <Image
                source={require('../../assets/images/Logo.png')}
                style={{ width: 180, height: 180 }}
                contentFit="contain"
                accessible={true}
                accessibilityLabel="Logo Tecer Mulher"
              />
            </View>
          </View>

          {/* ───── PAINEL BRANCO ───── */}
          <View style={{ flex: 1, backgroundColor: '#F5F0FA', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 28, paddingTop: 36, paddingBottom: 48 }}>

            {/* Campo Email */}
            <Text style={{ color: '#1A0B35', fontSize: 17, fontWeight: '600', marginBottom: 8 }}>
              Email :
            </Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0D8EA', marginBottom: 24 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="facilitador@gmail.com"
                placeholderTextColor="#6B5E80"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                style={{ paddingHorizontal: 16, paddingVertical: 16, fontSize: 17, color: '#1A0B35' }}
                accessible={true}
                accessibilityLabel="Campo de entrada de email"
              />
            </View>

            {/* Campo Senha */}
            <Text style={{ color: '#1A0B35', fontSize: 17, fontWeight: '600', marginBottom: 8 }}>
              Senha :
            </Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0D8EA', flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••••••"
                placeholderTextColor="#6B5E80"
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleEntrar}
                style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16, fontSize: 17, color: '#1A0B35' }}
                accessible={true}
                accessibilityLabel="Campo de entrada de senha"
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                activeOpacity={0.7}
                style={{ paddingHorizontal: 16, paddingVertical: 16 }}
                accessible={true}
                accessibilityLabel={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
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
              <Text style={{ color: '#D32F2F', fontSize: 14, marginBottom: 8, textAlign: 'center', fontWeight: '500' }}>
                {erro}
              </Text>
            )}

            <View style={{ height: 20 }} />

            {/* Botão ENTRAR */}
            <TouchableOpacity
              onPress={handleEntrar}
              activeOpacity={0.85}
              disabled={carregando}
              style={{
                backgroundColor: '#391A65',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 58,
              }}
              accessible={true}
              accessibilityLabel="Botão de Entrar"
              accessibilityRole="button"
            >
              {carregando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 2 }}>
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
