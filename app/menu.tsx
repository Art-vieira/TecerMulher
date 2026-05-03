import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase.config';

export default function TelaMenu() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Cabeçalho Voltar */}
      <View className="flex-row items-center px-8 py-6">
        <TouchableOpacity 
          onPress={async () => {
            if (auth.currentUser) {
              await signOut(auth);
            }
            router.back();
          }}
          activeOpacity={0.7}
          className="flex-row items-center min-h-[44px]"
          accessible={true}
          accessibilityLabel="Deslogar e voltar"
          accessibilityRole="button"
        >
          <View className="bg-primary/10 p-2 rounded-full mr-3">
            <Ionicons name="arrow-back" size={24} color="#4C1D95" />
          </View>
          <Text className="text-primary text-lg font-bold">
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Container Principal */}
      <View className="flex-1 px-8 pt-4 pb-8 items-center">
        
        <View className="w-full mb-10">
          <Text className="text-text-dark text-4xl font-bold mb-2">Bem-vinda!</Text>
          <Text className="text-text-muted text-lg">O que vamos aprender hoje?</Text>
        </View>

        <View className="w-full flex-1">
          {/* Botão Materiais */}
          <Link href="/material" asChild>
            <TouchableOpacity 
              className="w-full bg-surface rounded-[32px] p-8 mb-6 shadow-xl shadow-primary/10 flex-row items-center border border-primary/5"
              activeOpacity={0.9}
              accessible={true}
              accessibilityLabel="Acessar sessão de Materiais"
              accessibilityRole="button"
            >
              <View className="bg-primary/10 p-5 rounded-3xl mr-6">
                <Image
                  source={require("../assets/images/aula.svg")}
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                  tintColor="#4C1D95"
                />
              </View>
              <View>
                <Text className="text-text-dark text-2xl font-bold">Materiais</Text>
                <Text className="text-text-muted text-sm mt-1">Acesse suas aulas</Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Botão Dúvidas */}
          <Link href="/duvidas" asChild>
            <TouchableOpacity 
              className="w-full bg-surface rounded-[32px] p-8 shadow-xl shadow-primary/10 flex-row items-center border border-primary/5"
              activeOpacity={0.9}
              accessible={true}
              accessibilityLabel="Acessar sessão de Dúvidas"
              accessibilityRole="button"
            >
              <View className="bg-accent/10 p-5 rounded-3xl mr-6">
                <Image
                  source={require("../assets/images/duvidas.svg")}
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                  tintColor="#EC4899"
                />
              </View>
              <View>
                <Text className="text-text-dark text-2xl font-bold">Dúvidas</Text>
                <Text className="text-text-muted text-sm mt-1">Suporte e ajuda</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Logo Tecer-C */}
        <View className="opacity-40">
          <Image
            source={require("../assets/images/Tecer-C.png")}
            style={{ width: 200, height: 120 }}
            contentFit="contain"
            accessible={true}
            accessibilityLabel="Logo Unifesspa Tecer"
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
