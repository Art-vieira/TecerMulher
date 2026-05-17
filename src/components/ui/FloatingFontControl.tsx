import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFontSize } from '../../hooks/useFontSize';

interface FloatingFontControlProps {
  bottomPosition?: number;
  panelBottomPosition?: number;
}

export default function FloatingFontControl({ 
  bottomPosition = 60, 
  panelBottomPosition = 140 
}: FloatingFontControlProps) {
  const [mostrarPainelFonte, setMostrarPainelFonte] = useState(false);
  const { userFontFactor, increase, decrease, canIncrease, canDecrease } = useFontSize();

  return (
    <>
      {mostrarPainelFonte && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMostrarPainelFonte(false)}
            style={{ position: 'absolute', top: -500, bottom: -500, left: -500, right: -500, zIndex: 50 }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: panelBottomPosition,
              left: 20,
              right: 20,
              backgroundColor: '#1E1028',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: '#3A2550',
              zIndex: 60,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 15,
            }}
          >
            <Text style={{ color: '#B39DCC', fontSize: 13, fontWeight: '600', marginBottom: 16, textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' }}>
              Tamanho da letra
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={decrease}
                disabled={!canDecrease}
                activeOpacity={0.7}
                accessibilityLabel="Diminuir letra"
                style={{
                  width: 64, height: 64,
                  borderRadius: 16,
                  backgroundColor: canDecrease ? '#2A1A3A' : '#1A1028',
                  borderWidth: 1, borderColor: '#3A2550',
                  alignItems: 'center', justifyContent: 'center',
                  opacity: canDecrease ? 1 : 0.4,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800' }}>A-</Text>
              </TouchableOpacity>

              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '900' }}>
                  {Math.round(userFontFactor * 100)}%
                </Text>
                <Text style={{ color: '#B39DCC', fontSize: 11, fontWeight: '600', letterSpacing: 1 }}>TAMANHO</Text>
              </View>

              <TouchableOpacity
                onPress={increase}
                disabled={!canIncrease}
                activeOpacity={0.7}
                accessibilityLabel="Aumentar letra"
                style={{
                  width: 64, height: 64,
                  borderRadius: 16,
                  backgroundColor: canIncrease ? '#391A65' : '#1A1028',
                  alignItems: 'center', justifyContent: 'center',
                  opacity: canIncrease ? 1 : 0.4,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Botão Aa flutuante */}
      <TouchableOpacity
        onPress={() => setMostrarPainelFonte(v => !v)}
        activeOpacity={0.8}
        accessibilityLabel="Ajustar tamanho da letra"
        accessibilityRole="button"
        style={{ bottom: bottomPosition }}
        className="absolute left-8 bg-primary w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg shadow-black/30 elevation-5 z-50"
      >
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900' }}>Aa</Text>
      </TouchableOpacity>
    </>
  );
}
