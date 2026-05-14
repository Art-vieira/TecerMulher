import React from 'react';
import { Text } from 'react-native';

/**
 * Renderiza um texto aplicando formatação básica:
 * **texto** -> Negrito
 * __texto__ ou _texto_ -> Itálico
 */
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
