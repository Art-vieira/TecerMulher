import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function TelaMenu() {
  const router = useRouter();
  const { logoutLocal } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Cabeçalho Voltar */}
      <View className="flex-row items-center px-6 py-4 mt-2">
        <TouchableOpacity 
          onPress={async () => {
            await logoutLocal();
            router.back();
          }}
          activeOpacity={0.8}
          className="flex-row items-center min-h-[50px] pr-4"
          accessible={true}
          accessibilityLabel="Deslogar e voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-3" style={{ fontFamily: 'Poppins' }}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Container Principal */}
      <View className="flex-1 bg-background rounded-t-[30px] mt-2 px-8 pt-10 pb-8 items-center justify-between">
        
        <View className="w-full items-center">
          {/* Botão Materiais */}
          <Link href="/material" asChild>
            <TouchableOpacity 
              className="w-full max-w-[300px] h-[190px] bg-primary rounded-[30px] items-center justify-center mb-8 shadow-md shadow-primary/30"
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Acessar sessão de Materiais"
              accessibilityRole="button"
            >
              <Image
                source={require("../assets/images/aula.svg")}
                style={{ width: 50, height: 60, marginBottom: 16 }}
                contentFit="contain"
              />
              <Text className="text-white text-[30px] font-bold" style={{ fontFamily: 'Poppins' }}>
                Materiais
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Botão Dúvidas */}
          <Link href="/duvidas" asChild>
            <TouchableOpacity 
              className="w-full max-w-[300px] h-[190px] bg-primary rounded-[30px] items-center justify-center shadow-md shadow-primary/30"
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Acessar sessão de Dúvidas"
              accessibilityRole="button"
            >
              <Image
                source={require("../assets/images/duvidas.svg")}
                style={{ width: 60, height: 50, marginBottom: 16 }}
                contentFit="contain"
              />
              <Text className="text-white text-[30px] font-bold" style={{ fontFamily: 'Poppins' }}>
                Dúvidas
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Logo Tecer-C */}
        <Image
          source={require("../assets/images/Tecer-C.png")}
          style={{ width: 250, height: 180, marginBottom: 10 }}
          contentFit="contain"
          accessible={true}
          accessibilityLabel="Logo Unifesspa Tecer"
        />

      </View>
    </SafeAreaView>
  );
}
