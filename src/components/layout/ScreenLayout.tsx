import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import BottomNav from './BottomNav';

type Route = 'menu' | 'material' | 'duvidas';

interface ScreenLayoutProps {
  /** Conteúdo principal renderizado dentro do container arredondado */
  children: ReactNode;
  /** Título exibido no cabeçalho */
  title?: string;
  /** Alinhamento do título: 'right' (padrão) ou 'center' */
  titleAlign?: 'center' | 'right';
  /** Classes extras para o texto do título (ex: 'font-bold') */
  titleClassName?: string;
  /** Ação personalizada do botão Voltar. Padrão: router.back() */
  onBack?: () => void;
  /** Elemento exibido à direita do cabeçalho (ex: botão de settings) */
  rightElement?: ReactNode;
  /** Força exibição da label "Voltar". Padrão automático: true para alunos, false para admin */
  showBackLabel?: boolean;
  /** Se informado, renderiza o BottomNav com a rota ativa */
  currentRoute?: Route;
  /** Elementos fora do container principal (ex: FABs com position absolute) */
  overlay?: ReactNode;
  /** Classes do container de conteúdo, incluindo a cor de fundo. Padrão: 'bg-surface' */
  containerClassName?: string;
}

export default function ScreenLayout({
  children,
  title,
  titleAlign = 'right',
  titleClassName = 'font-semibold',
  onBack,
  rightElement,
  showBackLabel,
  currentRoute,
  overlay,
  containerClassName = 'bg-surface',
}: ScreenLayoutProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const handleBack = onBack ?? (() => router.back());
  // Por padrão: exibe "Voltar" para alunos, oculta para admin
  const shouldShowLabel = showBackLabel !== undefined ? showBackLabel : !isAdmin;

  return (
    <SafeAreaView className={`flex-1 ${isAdmin ? 'bg-admin-dark' : 'bg-primary'}`} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Cabeçalho ── */}
      <View className={`flex-row items-center justify-between px-5 h-[88px] ${isAdmin ? 'bg-admin-dark' : 'bg-primary'}`}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.8}
          className="flex-row items-center min-h-[50px]"
          accessible={true}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          {shouldShowLabel && (
            <Text className="text-white text-lg font-semibold ml-2 mr-3">Voltar</Text>
          )}
        </TouchableOpacity>

        {title ? (
          <Text
            className={`text-white text-lg flex-1 ${titleClassName} ${
              titleAlign === 'center' ? 'text-center' : 'text-right'
            }`}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : null}

        {rightElement ?? null}
      </View>

      {/* ── Container Principal ── */}
      <View className={`flex-1 rounded-t-[24px] overflow-hidden ${containerClassName}`}>
        {children}
      </View>

      {overlay}

      {currentRoute && <BottomNav currentRoute={currentRoute} />}
    </SafeAreaView>
  );
}
