import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenLayout from "../../components/layout/ScreenLayout";
import SearchBar from "../../components/ui/SearchBar";
import { useAuth } from "../../hooks/useAuth";

import { useDuvidasList } from "../../hooks/useDuvidas";

import FloatingFontControl from "../../components/ui/FloatingFontControl";
import { useConfig } from "../../context/ConfigContext";
import { useToast } from "../../context/ToastContext";
import { useFontSize } from "../../hooks/useFontSize";
import { cleanTextForSpeech, renderFormattedText } from "../../utils/textUtils";

export default function DuvidasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fabBottom = 100 + insets.bottom + 10;
  const fontBottom = 100 + insets.bottom + 16;
  const fontPanelBottom = fontBottom + 70;
  const [pesquisa, setPesquisa] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { config } = useConfig();
  const { showToast, showConfirm } = useToast();
  const { duvidas, apagarDuvida } = useDuvidasList();
  const { userFontFactor } = useFontSize();

  // Admin usa o fator global (Firestore); usuário comum usa o fator local (AsyncStorage)
  const effectiveFactor = isAdmin
    ? config.fontSizeFactor || 1.0
    : (config.fontSizeFactor || 1.0) * userFontFactor;

  const fs = (size: number) => size * effectiveFactor;
  const lh = (size: number) => size * 1.5;

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const lerDuvida = async (titulo: string, resposta: string) => {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      Speech.stop();
    } else if (resposta) {
      const textoLimpo = cleanTextForSpeech(`${titulo}. ${resposta}`);
      Speech.speak(textoLimpo, { language: "pt-BR" });
    }
  };

  const duvidasFiltradas = duvidas.filter((item) =>
    item.title.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  const handleApagar = async (id: string, titulo: string) => {
    const confirmado = await showConfirm({
      title: "Apagar Dúvida",
      message: `Tem certeza que deseja apagar "${titulo}"?`,
      confirmText: "Apagar",
      cancelText: "Cancelar",
      destructive: true,
    });
    if (confirmado) {
      const { success, error } = await apagarDuvida(id);
      if (success) {
        showToast({ message: "Dúvida removida com sucesso.", type: "success" });
      } else {
        showToast({
          message: `Não foi possível apagar: ${error?.message}`,
          type: "error",
        });
      }
    }
  };

  const toggleAccordion = (item: any) => {
    if (item.tipoResposta === "expandida") {
      router.push({
        pathname: "/duvida-expandida",
        params: { id: item.id },
      } as any);
      return;
    }

    // Toggle for 'curta'
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
    }
  };

  const renderAdminDuvida = (item: any) => {
    const isExpanded = expandedId === item.id;
    const respostaText =
      item.tipoResposta === "expandida"
        ? item.respostaExpandida
        : item.respostaCurta || item.resposta || "";

    return (
      <View
        key={item.id}
        className={`bg-white rounded-[16px] p-5 mb-4 shadow-sm shadow-black/10 elevation-2 ${isExpanded ? "border border-primary" : ""}`}
      >
        <View className="flex-row items-start justify-between mb-4 gap-2">
          <TouchableOpacity
            onPress={() => toggleAccordion(item)}
            activeOpacity={0.8}
            className="flex-1"
          >
            <Text
              className="font-bold text-primary mb-2"
              style={{ fontSize: fs(17), lineHeight: lh(17) }}
            >
              {renderFormattedText(item.title)}
            </Text>

            <Text
              className="text-text-dark leading-[22px]"
              style={{ fontSize: fs(14), lineHeight: lh(14) }}
              numberOfLines={isExpanded ? undefined : 2}
            >
              <Text className="font-semibold text-text-dark">Resposta: </Text>
              {renderFormattedText(respostaText)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => lerDuvida(item.title, respostaText)}
            className="w-10 h-10 bg-surface-muted rounded-full items-center justify-center"
            accessible={true}
            accessibilityLabel="Ouvir resposta"
          >
            <Ionicons name="volume-high" size={20} color="#391A65" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/admin/edit-duvida",
                params: { id: item.id },
              } as any)
            }
            className="w-10 h-10 border border-surface-muted rounded-xl items-center justify-center bg-white"
          >
            <Ionicons name="pencil" size={18} color="#6B5E80" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleApagar(item.id, item.title)}
            className="w-10 h-10 border border-surface-muted rounded-xl items-center justify-center bg-white"
          >
            <Ionicons name="trash" size={18} color="#6B5E80" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderUserDuvida = (item: any) => {
    const isExpanded = expandedId === item.id;
    const isExpandidaType = item.tipoResposta === "expandida";
    const respostaTexto = item.respostaCurta || item.resposta || "";

    return (
      <View
        key={item.id}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          borderWidth: isExpanded ? 1 : 0,
          borderColor: isExpanded ? "#391A65" : "transparent",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => toggleAccordion(item)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "#391A65",
                flex: 1,
                paddingRight: 16,
                fontSize: fs(16),
                lineHeight: lh(16),
              }}
            >
              {renderFormattedText(item.title)}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#391A65"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              lerDuvida(
                item.title,
                isExpandidaType ? item.respostaExpandida : respostaTexto,
              )
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F3F0F7",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 8,
            }}
            accessible={true}
            accessibilityLabel="Ouvir resposta"
          >
            <Ionicons name="volume-high" size={20} color="#391A65" />
          </TouchableOpacity>
        </View>

        {/* Resposta — renderizada sempre, mas visível só quando expandida */}
        {!isExpandidaType && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: isExpanded ? 20 : 0,
              height: isExpanded ? undefined : 0,
              overflow: "hidden",
            }}
          >
            <Text
              style={{ color: "#3C3C3C", fontSize: fs(15), lineHeight: lh(15) }}
            >
              {renderFormattedText(respostaTexto)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenLayout
      title="Dúvidas"
      currentRoute="duvidas"
      onBack={() => router.replace("/menu")}
      overlay={
        <>
          {isAdmin && (
            <TouchableOpacity
              onPress={() => router.push("/admin/add-duvida")}
              className="absolute right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-black/50 elevation-5"
              style={{ bottom: fabBottom }}
              accessible={true}
              accessibilityLabel="Adicionar nova dúvida"
            >
              <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>
          )}

          {!isAdmin && (
            <FloatingFontControl
              bottomPosition={fontBottom}
              panelBottomPosition={fontPanelBottom}
            />
          )}
        </>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 220,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
      >
        {isAdmin && (
          <SearchBar
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Buscar dúvidas..."
          />
        )}

        {!isAdmin && (
          <>
            <Text className="text-[20px] font-bold text-primary mb-1">
              Dúvidas Frequentes
            </Text>
            <Text className="text-[14px] text-text-muted mb-4">
              Toque em uma pergunta para ver a resposta.
            </Text>
            <SearchBar
              value={pesquisa}
              onChangeText={setPesquisa}
              placeholder="Buscar dúvidas..."
            />
          </>
        )}

        {duvidasFiltradas.length === 0 ? (
          <Text className="text-center text-text-subtle mt-10">
            Nenhuma dúvida encontrada.
          </Text>
        ) : (
          duvidasFiltradas.map((item) =>
            isAdmin ? renderAdminDuvida(item) : renderUserDuvida(item),
          )
        )}

        {/* Botão de contato via WhatsApp (apenas alunos) */}
        {/* Mude o numero aqui */}
        {!isAdmin && (
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://wa.me/NUMERO?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida",
              )
            }
            activeOpacity={0.8}
            className="mt-8 mb-4 bg-[#25D366] rounded-2xl py-4 px-5 flex-row items-center justify-center gap-3 shadow-sm shadow-black/10 elevation-2"
            accessible={true}
            accessibilityLabel="Enviar dúvida pelo WhatsApp"
            accessibilityRole="button"
          >
            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
            <View className="flex-1">
              <Text className="text-white font-bold text-[15px]">
                Tem outra dúvida?
              </Text>
              <Text className="text-white/80 text-[13px]">
                Toque aqui para perguntar
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
