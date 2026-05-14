import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Material } from '../../types';

interface MaterialCardProps {
  material: Material;
  isAdmin: boolean;
  onPress: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, title: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  isAdmin,
  onPress,
  onEdit,
  onDelete,
  isMenuOpen,
  toggleMenu,
}) => {
  return (
    <View className={`mb-6 relative ${isMenuOpen ? 'z-50 elevation-5' : 'z-1'}`}>
      {/* Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (isMenuOpen) {
            toggleMenu();
            return;
          }
          onPress();
        }}
        className="bg-white rounded-[24px] pt-1.5 px-1.5 h-[215px] shadow-sm shadow-[#3C3C3C]/10 elevation-3"
        accessible={true}
        accessibilityLabel={`Material: ${material.title}`}
        accessibilityRole="button"
      >
        {/* Imagem de Capa */}
        {material.imagemCapa ? (
          <Image
            source={{ uri: material.imagemCapa }}
            style={{ width: '100%', height: 146, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            resizeMode="cover"
            className="w-full"
          />
        ) : (
          <View 
            style={{ height: 146, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} 
            className="w-full bg-surface-card justify-center items-center"
          >
            <Ionicons name="image-outline" size={40} color="#C5BFD0" />
          </View>
        )}

        {/* Título */}
        <View className={`flex-1 flex-row items-center px-4 ${isAdmin ? 'justify-between' : 'justify-center'}`}>
          <Text
            className={`text-primary text-[16px] font-bold leading-[20px] ${isAdmin ? 'text-left flex-1 mr-4' : 'text-center'}`}
            numberOfLines={2}
          >
            {material.title}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Três pontinhos (só para admin) */}
      {isAdmin && (
        <TouchableOpacity
          onPress={toggleMenu}
          className="absolute bottom-2 right-2 bg-transparent rounded-full w-12 h-12 justify-center items-center z-20"
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#391A65" />
        </TouchableOpacity>
      )}

      {/* Dropdown do menu */}
      {isMenuOpen && (
        <View 
          style={{ position: 'absolute', top: 160, right: 30, zIndex: 999, elevation: 10 }}
          className="bg-white rounded-2xl py-2 shadow-xl min-w-[160px] border border-gray-100"
        >
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              onEdit?.(material.id);
            }}
            className="flex-row items-center px-4 py-3 gap-2 bg-white"
            accessible={true}
            accessibilityLabel="Editar Material"
          >
            <Ionicons name="create-outline" size={20} color="#391A65" />
            <Text className="text-primary text-base font-semibold">Editar</Text>
          </TouchableOpacity>

          <View className="h-[1px] bg-surface-divider mx-3" />

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              onDelete?.(material.id, material.title);
            }}
            className="flex-row items-center px-4 py-3 gap-2 bg-white"
            accessible={true}
            accessibilityLabel="Apagar Material"
          >
            <Ionicons name="trash-outline" size={20} color="#E74C3C" />
            <Text className="text-error text-base font-semibold">Apagar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MaterialCard;
