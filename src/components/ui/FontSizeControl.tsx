import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FontSizeControlProps {
  onDecrease: () => void;
  onIncrease: () => void;
  canDecrease: boolean;
  canIncrease: boolean;
}

/**
 * Controle compacto A- / A+ para o cabeçalho das telas de conteúdo.
 * Exibido para usuários comuns (não admin).
 */
export default function FontSizeControl({
  onDecrease,
  onIncrease,
  canDecrease,
  canIncrease,
}: FontSizeControlProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        paddingHorizontal: 4,
        paddingVertical: 4,
        gap: 2,
      }}
    >
      <TouchableOpacity
        onPress={onDecrease}
        disabled={!canDecrease}
        activeOpacity={0.7}
        accessibilityLabel="Diminuir tamanho da letra"
        accessibilityRole="button"
        style={{
          width: 36,
          height: 36,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: canDecrease ? 'rgba(255,255,255,0.2)' : 'transparent',
        }}
      >
        <Text
          style={{
            color: canDecrease ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
            fontSize: 13,
            fontWeight: '800',
            letterSpacing: 0.5,
          }}
        >
          A-
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onIncrease}
        disabled={!canIncrease}
        activeOpacity={0.7}
        accessibilityLabel="Aumentar tamanho da letra"
        accessibilityRole="button"
        style={{
          width: 36,
          height: 36,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: canIncrease ? 'rgba(255,255,255,0.2)' : 'transparent',
        }}
      >
        <Text
          style={{
            color: canIncrease ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
            fontSize: 16,
            fontWeight: '800',
            letterSpacing: 0.5,
          }}
        >
          A+
        </Text>
      </TouchableOpacity>
    </View>
  );
}
