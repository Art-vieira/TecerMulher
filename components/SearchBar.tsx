import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Buscar...' 
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-6 shadow-sm shadow-black/5 elevation-2">
      <Ionicons name="search" size={22} color="#A39BB0" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A39BB0"
        className="ml-3 text-base flex-1 text-black"
        accessible={true}
        accessibilityLabel="Campo de pesquisa"
      />
    </View>
  );
}
