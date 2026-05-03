import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import BottomNav from '../components/BottomNav';
import { useMateriaisList } from '../hooks/useMateriais';

export default function TelaMenu() {
  const router = useRouter();
  const { logoutLocal, isAdmin } = useAuth();
  const { materiais } = useMateriaisList();

  return (
    <SafeAreaView className={`flex-1 ${isAdmin ? 'bg-[#1A1A1A]' : 'bg-primary'}`} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* ── Cabeçalho ── */}
      {isAdmin ? (
        <View className="flex-row items-center justify-between px-6 py-4 mt-2">
          <Text className="text-[#8E8E93] text-[14px] font-semibold" style={{ fontFamily: 'Poppins' }}>
            Menu principal - ADM
          </Text>
          <TouchableOpacity 
            onPress={async () => {
              await logoutLocal();
              router.back();
            }}
            activeOpacity={0.8}
            className="min-h-[44px] justify-center pl-4"
            accessible={true}
            accessibilityLabel="Configurações e Logout"
            accessibilityRole="button"
          >
            <Ionicons name="settings-sharp" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
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
      )}

      {/* ── Container Principal ── */}
      <View className="flex-1 bg-background rounded-t-[30px] mt-2 overflow-hidden">
        {isAdmin ? (
          /* ── Layout Admin ── */
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1">
              <Text className="text-[19px] font-bold text-[#1A1A1A] mb-5" style={{ fontFamily: 'Poppins' }}>
                Acompanhamento
              </Text>
              
              <View className="flex-row justify-between w-full mb-6">
                <View className="bg-primary rounded-[16px] p-5 w-[48%] min-h-[110px] justify-center shadow-sm">
                  <Text className="text-white text-[32px] font-bold" style={{ fontFamily: 'Poppins' }}>{materiais.length}</Text>
                  <Text className="text-white text-base font-normal">Materiais</Text>
                </View>
                <View className="bg-primary rounded-[16px] p-5 w-[48%] min-h-[110px] justify-center shadow-sm">
                  <Text className="text-white text-[32px] font-bold" style={{ fontFamily: 'Poppins' }}>24</Text>
                  <Text className="text-white text-base font-normal">Dúvidas</Text>
                </View>
              </View>

              <Link href="/material" asChild>
                <TouchableOpacity className="bg-white w-full rounded-[20px] p-5 flex-row items-center mb-4 shadow-sm elevation-2" activeOpacity={0.8}>
                  <View className="w-14 h-14 bg-primary rounded-[14px] items-center justify-center mr-4">
                    <Ionicons name="book" size={28} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-primary text-[17px] font-bold mb-0.5" style={{ fontFamily: 'Poppins' }}>Gerenciar Materiais</Text>
                    <Text className="text-primary text-[13px] opacity-70">Adicione ou edite aulas</Text>
                  </View>
                </TouchableOpacity>
              </Link>

              <Link href="/duvidas" asChild>
                <TouchableOpacity className="bg-white w-full rounded-[20px] p-5 flex-row items-center mb-4 shadow-sm elevation-2" activeOpacity={0.8}>
                  <View className="w-14 h-14 bg-primary rounded-[14px] items-center justify-center mr-4">
                    <Ionicons name="chatbubbles" size={28} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-primary text-[17px] font-bold mb-0.5" style={{ fontFamily: 'Poppins' }}>Gerenciar Dúvidas</Text>
                    <Text className="text-primary text-[13px] opacity-70">Edite ou crie novas dúvidas</Text>
                  </View>
                </TouchableOpacity>
              </Link>

              <View className="flex-1 items-center justify-end pb-2">
                <Image
                  source={require("../assets/images/Tecer-C.png")}
                  style={{ width: 160, height: 80 }}
                  contentFit="contain"
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          /* ── Layout Estudante ── */
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 140, alignItems: 'center', justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
          >
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

            <Image
              source={require("../assets/images/Tecer-C.png")}
              style={{ width: 250, height: 180, marginBottom: 10 }}
              contentFit="contain"
              accessible={true}
              accessibilityLabel="Logo Unifesspa Tecer"
            />
          </ScrollView>
        )}
      </View>
      <BottomNav currentRoute="menu" />
    </SafeAreaView>
  );
}
