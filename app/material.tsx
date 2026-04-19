import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import SpeechButton from '../components/SpeechButton';

// Mock de dados que viriam do Firebase
const firebaseMaterialMock = [
  { id: '1', type: 'title', content: 'Módulo 1: O que é Cidadania?' },
  { id: '2', type: 'text', content: 'A cidadania é o exercício dos direitos e deveres civis, políticos e sociais estabelecidos na Constituição. É a forma como o indivíduo se relaciona com o Estado e com a sociedade.' },
  { id: '3', type: 'image', url: require('../assets/images/Logo.png'), alt: 'Logotipo do Tecer Mulher com fios entrelaçados.' },
  { id: '4', type: 'text', content: 'Ser cidadão é ter direito à vida, à liberdade, à propriedade, à igualdade perante a lei. Mas também envolve deveres como respeitar as leis e o próximo.' },
];

export default function MaterialScreen() {
  // Constrói a string completa de leitura juntando textos e propriedades "alt" das imagens
  const textToRead = useMemo(() => {
    return firebaseMaterialMock
      .map((block) => {
        if (block.type === 'title' || block.type === 'text') {
          return block.content;
        }
        if (block.type === 'image' && block.alt) {
          // Adicionamos um pequeno contexto na fala para identificar que é uma imagem
          return `Imagem: ${block.alt}`;
        }
        return '';
      })
      .filter((text) => text.length > 0)
      .join('. '); // Adiciona uma pausa entre os blocos
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Material de Aula', headerBackTitle: 'Voltar' }} />
      
      <ScrollView className="flex-1 p-6 pb-24">
        {firebaseMaterialMock.map((block) => {
          if (block.type === 'title') {
            return (
              <Text key={block.id} className="text-[#391A65] text-3xl font-bold mb-6 mt-4">
                {block.content}
              </Text>
            );
          }
          if (block.type === 'text') {
            return (
              <Text key={block.id} className="text-gray-700 text-lg mb-6 leading-relaxed">
                {block.content}
              </Text>
            );
          }
          if (block.type === 'image') {
            return (
              <View key={block.id} className="items-center mb-6">
                <Image
                  source={block.url}
                  style={{ width: '100%', height: 200, borderRadius: 12 }}
                  contentFit="contain"
                  accessibilityLabel={block.alt} // Ajuda também leitores de tela nativos (TalkBack/VoiceOver)
                />
                <Text className="text-sm text-gray-400 mt-2 italic text-center">
                  {block.alt}
                </Text>
              </View>
            );
          }
          return null;
        })}
      </ScrollView>

      {/* Botão flutuante de Leitura de Tela */}
      <View className="absolute bottom-10 right-6 z-50">
        <SpeechButton textToRead={textToRead} />
      </View>
    </SafeAreaView>
  );
}
