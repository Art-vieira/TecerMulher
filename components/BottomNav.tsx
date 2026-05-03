import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Route = 'menu' | 'material' | 'duvidas';

interface BottomNavProps {
  currentRoute: Route;
}

export default function BottomNav({ currentRoute }: BottomNavProps) {
  const router = useRouter();

  const handlePress = (route: Route) => {
    if (route === currentRoute) return;
    router.replace(`/${route}` as any);
  };

  const NavItem = ({ 
    route, 
    label, 
    iconName 
  }: { 
    route: Route; 
    label: string; 
    iconName: keyof typeof Ionicons.glyphMap;
  }) => {
    const isActive = currentRoute === route;

    return (
      <TouchableOpacity
        onPress={() => handlePress(route)}
        activeOpacity={0.8}
        className={`rounded-[16px] flex-col justify-center items-center ${
          isActive ? 'bg-[#F8F8F8]' : 'bg-transparent'
        }`}
        style={{ width: 110, height: 85 }}
      >
        <View className="mb-1 items-center justify-center">
          <Ionicons
            name={iconName}
            size={28}
            color={isActive ? '#391A65' : '#F8F8F8'}
          />
        </View>
        <Text
          className={`text-[14px] font-bold uppercase tracking-[0.35px] ${
            isActive ? 'text-primary' : 'text-[#F8F8F8]'
          }`}
          style={{ fontFamily: 'Montserrat' }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      className="bg-primary flex-row justify-center items-center gap-2"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.10)',
        zIndex: 50,
      }}
    >
      <NavItem route="menu" label="INÍCIO" iconName="home" />
      <NavItem route="material" label="MATERIAIS" iconName="library" />
      <NavItem route="duvidas" label="DÚVIDAS" iconName="chatbubbles" />
    </View>
  );
}
