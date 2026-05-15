import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useFontSize } from '../../hooks/useFontSize';

export default function TelaConfiguracoes() {
  const router = useRouter();
  const { logout, isAdmin } = useAuth();
  const { userFontFactor, increase, decrease, canIncrease, canDecrease } = useFontSize();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ScreenLayout
      title="Configurações"
      titleAlign="right"
      onBack={() => router.back()}
      currentRoute="menu"
    >
      <View className="flex-1 px-6 pt-10 pb-[150px]">

        {/* ── Seção de fonte: só para usuários comuns ── */}
        {!isAdmin && (
          <View className="mb-8">
            <Text className="text-primary text-[14px] font-bold mb-3 uppercase tracking-widest opacity-60 ml-2">
              Acessibilidade
            </Text>
            <View className="bg-white rounded-[24px] p-6 shadow-sm shadow-black/5 elevation-2">
              <View className="flex-row items-center mb-5 gap-3">
                <View className="w-10 h-10 bg-[#EBE5F1] rounded-full items-center justify-center">
                  <Ionicons name="text" size={20} color="#391A65" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-dark text-[16px] font-semibold">
                    Tamanho da letra
                  </Text>
                  <Text className="text-text-muted text-[13px]">
                    Ajuste nas aulas e dúvidas
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between bg-surface-muted rounded-2xl p-2">
                {/* Botão diminuir */}
                <TouchableOpacity
                  onPress={decrease}
                  disabled={!canDecrease}
                  activeOpacity={0.7}
                  accessibilityLabel="Diminuir tamanho da letra"
                  className="w-14 h-14 items-center justify-center bg-white rounded-xl shadow-sm"
                  style={{ opacity: canDecrease ? 1 : 0.35 }}
                >
                  <Text className="text-primary text-[22px] font-bold">A-</Text>
                </TouchableOpacity>

                {/* Indicador */}
                <View className="items-center">
                  <Text className="text-primary text-[26px] font-extrabold">
                    {Math.round(userFontFactor * 100)}%
                  </Text>
                  <Text className="text-text-muted text-[11px] font-bold uppercase tracking-wider">
                    Tamanho
                  </Text>
                </View>

                {/* Botão aumentar */}
                <TouchableOpacity
                  onPress={increase}
                  disabled={!canIncrease}
                  activeOpacity={0.7}
                  accessibilityLabel="Aumentar tamanho da letra"
                  className="w-14 h-14 items-center justify-center bg-primary rounded-xl shadow-sm"
                  style={{ opacity: canIncrease ? 1 : 0.35 }}
                >
                  <Text className="text-white text-[22px] font-bold">A+</Text>
                </TouchableOpacity>
              </View>

              {/* Preview de texto */}
              <View className="mt-5 bg-surface-muted rounded-xl px-4 py-3">
                <Text
                  className="text-text-dark text-center"
                  style={{ fontSize: 15 * userFontFactor, lineHeight: 15 * userFontFactor * 1.5 }}
                >
                  Exemplo de texto com este tamanho
                </Text>
              </View>
            </View>
          </View>
        )}

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
