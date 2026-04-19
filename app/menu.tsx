import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MenuScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#391A65]">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Cabeçalho Voltar */}
      <View className="flex-row items-center px-6 py-4 mt-2">
        <TouchableOpacity 
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={28} color="#F8F8F8" />
          <Text className="text-white text-[18px] font-semibold ml-3" style={{ fontFamily: 'Poppins' }}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Container Principal */}
      <View className="flex-1 bg-[#E8E5ED] rounded-t-[30px] mt-2 px-8 pt-10 pb-8 items-center justify-between">
        
        <View className="w-full items-center">
          {/* Botão Materiais */}
          <Link href="/material" asChild>
            <TouchableOpacity 
              className="w-full max-w-[300px] h-[190px] bg-[#391A65] rounded-[30px] items-center justify-center mb-8"
              activeOpacity={0.8}
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
          <TouchableOpacity 
            className="w-full max-w-[300px] h-[190px] bg-[#391A65] rounded-[30px] items-center justify-center"
            activeOpacity={0.8}
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
        </View>

        {/* Logo Tecer-C */}
        <Image
          source={require("../assets/images/Tecer-C.png")}
          style={{ width: 250, height: 180, marginBottom: 10 }}
          contentFit="contain"
        />

      </View>
    </SafeAreaView>
  );
}
