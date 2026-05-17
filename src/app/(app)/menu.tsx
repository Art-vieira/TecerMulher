import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, ScrollView, useWindowDimensions } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useMateriaisList } from '../../hooks/useMateriais';
import { useDuvidasList } from '../../hooks/useDuvidas';
import ScreenLayout from '../../components/layout/ScreenLayout';

export default function TelaMenu() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { materiais } = useMateriaisList();
  const { duvidas } = useDuvidasList();
  
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const handleBack = async () => {
    // Estudantes voltam para a tela inicial
    router.replace('/');
  };

  const settingsButton = (
    <TouchableOpacity
      onPress={() => router.push('/configuracoes')}
      activeOpacity={0.8}
      className="justify-center pl-4"
      accessible={true}
      accessibilityLabel="Configurações"
      accessibilityRole="button"
    >
      <Ionicons name="settings-sharp" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout
      onBack={handleBack}
      rightElement={isAdmin ? settingsButton : null}
      currentRoute="menu"
      hideBack={isAdmin}
    >
      {isAdmin ? (
        /* ── Layout Admin ── */
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            <Text className="text-[19px] font-bold text-admin-dark mb-5">
              Acompanhamento
            </Text>

            <View className="flex-row justify-between w-full mb-6">
              <View className="bg-primary rounded-[16px] p-5 w-[48%] min-h-[110px] justify-center shadow-sm">
                <Text className="text-white text-[32px] font-bold">{materiais.length}</Text>
                <Text className="text-white text-base font-normal">Materiais</Text>
              </View>
              <View className="bg-primary rounded-[16px] p-5 w-[48%] min-h-[110px] justify-center shadow-sm">
                <Text className="text-white text-[32px] font-bold">{duvidas.length}</Text>
                <Text className="text-white text-base font-normal">Dúvidas</Text>
              </View>
            </View>

            <Link href="/material" asChild>
              <TouchableOpacity className="bg-white w-full rounded-[20px] p-5 flex-row items-center mb-4 shadow-sm elevation-2" activeOpacity={0.8}>
                <View className="w-14 h-14 bg-primary rounded-[14px] items-center justify-center mr-4">
                  <Ionicons name="book" size={28} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary text-[17px] font-bold mb-0.5">Gerenciar Materiais</Text>
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
                  <Text className="text-primary text-[17px] font-bold mb-0.5">Gerenciar Dúvidas</Text>
                  <Text className="text-primary text-[13px] opacity-70">Edite ou crie novas dúvidas</Text>
                </View>
              </TouchableOpacity>
            </Link>

            <View className="flex-1 items-center justify-end pb-2">
              <Image
                source={require("../../assets/images/LogoTecerP.svg")}
                style={{ width: 160, height: 80 }}
                contentFit="contain"
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        /* ── Layout Estudante ── */
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingHorizontal: isTablet ? 64 : 32, 
            paddingTop: isTablet ? 64 : 32, 
            paddingBottom: 100, 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ width: '100%', flexDirection: isTablet ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: isTablet ? 32 : 20 }}>
            <Link href="/material" asChild>
              <TouchableOpacity
                style={{ width: '100%', maxWidth: isTablet ? 400 : 300, height: isTablet ? 220 : 160, flex: isTablet ? 1 : undefined }}
                className="bg-primary rounded-[30px] items-center justify-center shadow-md shadow-primary/30"
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Acessar sessão de Materiais"
                accessibilityRole="button"
              >
                <Image
                  source={require("../../assets/images/aula.svg")}
                  style={{ width: isTablet ? 60 : 45, height: isTablet ? 65 : 50, marginBottom: isTablet ? 16 : 12 }}
                  contentFit="contain"
                />
                <Text className={`text-white font-bold ${isTablet ? 'text-[32px]' : 'text-[26px]'}`}>Materiais</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/duvidas" asChild>
              <TouchableOpacity
                style={{ width: '100%', maxWidth: isTablet ? 400 : 300, height: isTablet ? 220 : 160, flex: isTablet ? 1 : undefined }}
                className="bg-primary rounded-[30px] items-center justify-center shadow-md shadow-primary/30"
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Acessar sessão de Dúvidas"
                accessibilityRole="button"
              >
                <Image
                  source={require("../../assets/images/duvidas.svg")}
                  style={{ width: isTablet ? 65 : 50, height: isTablet ? 60 : 45, marginBottom: isTablet ? 16 : 12 }}
                  contentFit="contain"
                />
                <Text className={`text-white font-bold ${isTablet ? 'text-[32px]' : 'text-[26px]'}`}>Dúvidas</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Image
            source={require("../../assets/images/Tecer-C.png")}
            style={{ width: isTablet ? 350 : 250, height: isTablet ? 250 : 180, marginBottom: 9, marginTop: isTablet ? 40 : 20 }}
            contentFit="contain"
            accessible={true}
            accessibilityLabel="Logo Unifesspa Tecer"
          />
        </ScrollView>
      )}
    </ScreenLayout>
  );
}




