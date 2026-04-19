import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface SpeechButtonProps {
  textToRead: string;
}

export default function SpeechButton({ textToRead }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(textToRead, {
        language: 'pt-BR',
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // Parar a leitura se o componente for desmontado (se o usuário sair da tela)
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={toggleSpeech}
      className={`p-3 rounded-full shadow-lg items-center justify-center ${
        isSpeaking ? 'bg-[#CF96D5]' : 'bg-[#391A65]'
      }`}
      activeOpacity={0.8}
    >
      <Ionicons
        name={isSpeaking ? 'stop-circle' : 'volume-medium'}
        size={28}
        color="white"
      />
    </TouchableOpacity>
  );
}
