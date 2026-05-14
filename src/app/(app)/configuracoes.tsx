import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useConfig } from '../../context/ConfigContext';

export default function TelaConfiguracoes() {
  const router = useRouter();
  const { logout, isAdmin } = useAuth();
  const { config, updateFontSize } = useConfig();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const adjustFontSize = async (increment: boolean) => {
    const current = config.fontSizeFactor || 1.0;
    const next = increment 
      ? Math.min(2.0, current + 0.1) 
      : Math.max(0.8, current - 0.1);
    await updateFontSize(parseFloat(next.toFixed(1)));
  };

  return (
    <ScreenLayout
      title="Configurações"
      titleAlign="right"
      onBack={() => router.back()}
      currentRoute="menu"
    >
      <View className="flex-1 px-6 pt-10 pb-[150px]">
        {/* Sessão de Acessibilidade (Sempre visível para admin configurar para todos) */}
        <View className="mb-8">
          <Text className="text-primary text-[14px] font-bold mb-3 uppercase tracking-widest opacity-60 ml-2">
            Acessibilidade (Aulas)
          </Text>
          <View className="bg-white rounded-[24px] p-6 shadow-sm shadow-black/5 elevation-2">
            <Text className="text-text-dark text-[16px] font-medium mb-5">
              Ajuste o tamanho da letra para as alunas:
            </Text>
            
            <View className="flex-row items-center justify-between bg-surface-muted rounded-2xl p-2">
              <TouchableOpacity 
                onPress={() => adjustFontSize(false)}
                className="w-14 h-14 items-center justify-center bg-white rounded-xl shadow-sm"
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={28} color="#391A65" />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-primary text-[22px] font-extrabold">
                  {Math.round((config.fontSizeFactor || 1.0) * 100)}%
                </Text>
                <Text className="text-text-muted text-[12px] font-bold uppercase">Tamanho</Text>
              </View>

              <TouchableOpacity 
                onPress={() => adjustFontSize(true)}
                className="w-14 h-14 items-center justify-center bg-primary rounded-xl shadow-sm"
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card Alterar Senha */}
        <TouchableOpacity 
          className="bg-white rounded-[20px] p-5 flex-row items-center shadow-sm mb-6"
          activeOpacity={0.8}
        >
          <View className="w-[52px] h-[52px] bg-[#EBE5F1] rounded-full items-center justify-center mr-4">
            <Ionicons name="lock-closed-outline" size={26} color="#391A65" />
          </View>
          <Text className="flex-1 text-primary text-[17px] font-bold">Alterar Senha</Text>
          <Ionicons name="chevron-forward" size={24} color="#A39BB0" />
        </TouchableOpacity>

        <View className="flex-1" />

        {/* Botão Sair da Conta */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="border-[3px] border-[#3F3F3F] rounded-[20px] h-[72px] flex-row items-center justify-center bg-transparent"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={28} color="#3F3F3F" className="mr-3" />
          <Text className="text-[#3F3F3F] text-[18px] font-bold uppercase tracking-[1px]">
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}
