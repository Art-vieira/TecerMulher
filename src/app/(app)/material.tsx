import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import ScreenLayout from "../../components/layout/ScreenLayout";
import MaterialCard from "../../components/ui/MaterialCard";
import SearchBar from "../../components/ui/SearchBar";

import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../hooks/useAuth";
import { useMateriaisList } from "../../hooks/useMateriais";

export default function TelaMateriais() {
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState("");
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { showToast, showConfirm } = useToast();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const { materiais, carregando, apagarMaterial } = useMateriaisList();

  // ── Apagar material ──
  const handleApagar = async (id: string, titulo: string) => {
    setMenuAberto(null);
    const confirmado = await showConfirm({
      title: "Apagar Material",
      message: `Tem certeza que deseja apagar "${titulo}"?`,
      confirmText: "Apagar",
      cancelText: "Cancelar",
      destructive: true,
    });
    if (confirmado) {
      const { success, error } = await apagarMaterial(id);
      if (success) {
        showToast({
          message: `"${titulo}" foi removido com sucesso.`,
          type: "success",
        });
      } else {
        showToast({
          message: `Não foi possível apagar: ${error?.message}`,
          type: "error",
        });
      }
    }
  };

  // ── Editar material ──
  const handleEditar = (id: string) => {
    setMenuAberto(null);
    router.push({ pathname: "/admin/edit-material", params: { id } } as any);
  };

  const materiaisFiltrados = materiais.filter((item) =>
    item.title.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <ScreenLayout
      title="Materiais"
      currentRoute="material"
      onBack={() => router.replace("/menu")}
      overlay={
        isAdmin && (
          <TouchableOpacity
            onPress={() => router.push("/admin/add-material")}
            activeOpacity={0.8}
            className="absolute right-6 bottom-[140px] w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-black/50 elevation-5"
            accessible={true}
            accessibilityLabel="Adicionar nova aula"
          >
            <Ionicons name="add" size={32} color="#FFF" />
          </TouchableOpacity>
        )
      }
    >
      {carregando ? (
        <View className="flex-1 justify-center items-center pt-8">
          <ActivityIndicator size="large" color="#391A65" />
          <Text className="text-primary mt-3 text-base font-semibold">
            Carregando materiais...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 220,
            paddingHorizontal: 24,
            paddingTop: 32,
          }}
          onScroll={() => setMenuAberto(null)}
          scrollEventThrottle={16}
        >
          <SearchBar
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Buscar materiais..."
          />

          {materiaisFiltrados.length === 0 ? (
            <View className="items-center pt-8">
              <Ionicons name="book-outline" size={60} color="#C5BFD0" />
              <Text className="text-text-muted mt-4 text-base text-center font-medium">
                {pesquisa
                  ? "Nenhum material encontrado."
                  : "Nenhum material disponível ainda."}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: isTablet ? "row" : "column",
                flexWrap: isTablet ? "wrap" : "nowrap",
                justifyContent: "space-between",
              }}
            >
              {materiaisFiltrados.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: isTablet ? "48%" : "100%",
                    zIndex: menuAberto === item.id ? 50 : 1,
                    elevation: menuAberto === item.id ? 5 : 1,
                  }}
                >
                  <MaterialCard
                    material={item}
                    isAdmin={isAdmin}
                    onPress={() =>
                      router.push({
                        pathname: "/aula",
                        params: { id: item.id },
                      } as any)
                    }
                    onEdit={(id) => handleEditar(id)}
                    onDelete={(id, title) => handleApagar(id, title)}
                    isMenuOpen={menuAberto === item.id}
                    toggleMenu={() =>
                      setMenuAberto(menuAberto === item.id ? null : item.id)
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </ScreenLayout>
  );
}
