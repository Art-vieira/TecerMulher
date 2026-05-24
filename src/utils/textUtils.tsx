import React from 'react';
import { Text } from 'react-native';

export const renderFormattedText = (text: string = '') => {
  if (!text) return null;

  // Divide o texto com base nos delimitadores, mantendo os delimitadores no array resultante
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|_.*?_)/g);

  return parts.map((part, index) => {
    // Negrito: **texto**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    
    // Itálico: __texto__ ou _texto_
    if (part.startsWith('__') && part.endsWith('__')) {
      return (
        <Text key={index} style={{ fontStyle: 'italic' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }

    if (part.startsWith('_') && part.endsWith('_')) {
      return (
        <Text key={index} style={{ fontStyle: 'italic' }}>
          {part.slice(1, -1)}
        </Text>
      );
    }

    // Texto normal
    return part;
  });
};

/**
 * Limpa o texto para leitura em voz alta, removendo caracteres especiais (asteriscos, sublinhados)
 * e substituindo hifens por espaço para evitar que a voz atropele as palavras.
 */
export const cleanTextForSpeech = (text: string = '') => {
  if (!text) return '';
  return text
    // Remove emojis e seus modificadores (tons de pele, junções, etc)
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}\uFE0F\u200D]/gu, '')
    // Remove asteriscos, sublinhados, hashtags, crases, tils e marcadores (bullets)
    .replace(/[*_#~`•]/g, '')
    // Substitui hifens por espaço
    .replace(/-/g, ' ');
};
