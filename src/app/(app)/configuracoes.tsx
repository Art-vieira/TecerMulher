import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, TextInput, Modal } from 'react-native';
import { getWhatsAppNumber, updateWhatsAppNumber } from '../../services/DatabaseRepository';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { useFontSize } from '../../hooks/useFontSize';
import { OfflineService } from '../../services/OfflineService';
// Removed invalid toast import

export default function TelaConfiguracoes() {
  const { logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const { userFontFactor, increase, decrease, canIncrease, canDecrease } = useFontSize();
  
  // Logout handler used by the "Sair da Conta" button
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login'); // Adjust route as needed
    } catch (e) {
      showToast({ message: 'Erro ao sair da conta.', type: 'error' });
    }
  };

  const [whatsappNumber, setWhatsAppNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  useEffect(() => {
    const fetchNumber = async () => {
      const num = await getWhatsAppNumber();
      setWhatsAppNumber(num);
    };
    fetchNumber();
  }, []);

  const [hasOffline, setHasOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');

  useEffect(() => {
    async function checkOfflineStatus() {
      const status = await OfflineService.hasOfflineMateriais();
      setHasOffline(status);
    }
    checkOfflineStatus();
  }, []);

  const handleSyncOffline = async () => {
    setIsSyncing(true);
    setSyncProgress('Iniciando...');
    const success = await OfflineService.downloadAllMaterials((msg) => {
      setSyncProgress(msg);
    });
    if (success) {
      setHasOffline(true);
    }
    setIsSyncing(false);
  };

  const handleClearOffline = async () => {
    setIsSyncing(true);
    await OfflineService.clearOfflineMaterials();
    setHasOffline(false);
    setIsSyncing(false);
  };

  return (
    <ScreenLayout
      title="Configurações"
      titleAlign="right"
      onBack={() => router.back()}
      currentRoute="menu"
    >
      <View className="flex-1 px-6 pt-10 pb-[150px]">

        {/* Admin section: Change WhatsApp number */}
        {isAdmin && (
          <View className="mt-8 mb-4 bg-white rounded-[24px] p-6 shadow-sm">
            <Text className="text-primary text-[16px] font-bold mb-2">Número do WhatsApp de contato</Text>
            <TextInput
              value={whatsappNumber}
              onChangeText={setWhatsAppNumber}
              placeholder="Número com código do país, ex: 55..."
              className="bg-surface-muted rounded-xl p-3 mb-4"
            />
            <TouchableOpacity
              onPress={async () => {
                setSaving(true);
                try {
                  await updateWhatsAppNumber(whatsappNumber);
                  showToast({ message: 'Número atualizado com sucesso.', type: 'success' });
                } catch (e) {
                  showToast({ message: 'Erro ao atualizar número.', type: 'error' });
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="bg-primary rounded-xl py-3 items-center justify-center"
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="text-white font-bold text-[16px]">Salvar número</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        {!isAdmin && (
          <View className="mb-8">
            <Text className="text-primary text-[14px] font-bold mb-3 uppercase tracking-widest opacity-60 ml-2">
              Acessibilidade
            </Text>
            <View className="bg-white rounded-[24px] p-6 shadow-sm shadow-black/5 elevation-2">
              <View className="flex-row items-center mb-5 gap-3">
                <View className="w-10 h-10 bg-[#EBE5F1] rounded-full items-center justify-center">
                  <Ionicons name="text" size={20} color="#391A65" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-dark text-[16px] font-semibold">
                    Tamanho da letra
                  </Text>
                  <Text className="text-text-muted text-[13px]">
                    Ajuste nas aulas e dúvidas
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between bg-surface-muted rounded-2xl p-2">
                {/* Botão diminuir */}
                <TouchableOpacity
                  onPress={decrease}
                  disabled={!canDecrease}
                  activeOpacity={0.7}
                  accessibilityLabel="Diminuir tamanho da letra"
                  className="w-14 h-14 items-center justify-center bg-white rounded-xl shadow-sm"
                  style={{ opacity: canDecrease ? 1 : 0.35 }}
                >
                  <Text className="text-primary text-[22px] font-bold">A-</Text>
                </TouchableOpacity>

                {/* Indicador */}
                <View className="items-center">
                  <Text className="text-primary text-[26px] font-extrabold">
                    {Math.round(userFontFactor * 100)}%
                  </Text>
                  <Text className="text-text-muted text-[11px] font-bold uppercase tracking-wider">
                    Tamanho
                  </Text>
                </View>

                {/* Botão aumentar */}
                <TouchableOpacity
                  onPress={increase}
                  disabled={!canIncrease}
                  activeOpacity={0.7}
                  accessibilityLabel="Aumentar tamanho da letra"
                  className="w-14 h-14 items-center justify-center bg-primary rounded-xl shadow-sm"
                  style={{ opacity: canIncrease ? 1 : 0.35 }}
                >
                  <Text className="text-white text-[22px] font-bold">A+</Text>
                </TouchableOpacity>
              </View>

              {/* Preview de texto */}
              <View className="mt-5 bg-surface-muted rounded-xl px-4 py-3">
                <Text
                  className="text-text-dark text-center"
                  style={{ fontSize: 15 * userFontFactor, lineHeight: 15 * userFontFactor * 1.5 }}
                >
                  Exemplo de texto com este tamanho
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Offline Materials Management: só para estudantes ── */}
        {!isAdmin && (
          <View className="mb-6">
            <Text className="text-primary text-[14px] font-bold mb-3 uppercase tracking-widest opacity-60 ml-2">
              Armazenamento
            </Text>
            <View className="bg-white rounded-[24px] p-5 shadow-sm shadow-black/5 elevation-2">
              <View className="flex-row items-center mb-4 gap-3">
                <View className="w-10 h-10 bg-[#EBE5F1] rounded-full items-center justify-center">
                  <Ionicons name="cloud-download-outline" size={20} color="#391A65" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-dark text-[16px] font-semibold">
                    Aulas Offline
                  </Text>
                  <Text className="text-text-muted text-[13px]">
                    {hasOffline ? 'Aulas baixadas no seu dispositivo' : 'Baixe as aulas para estudar sem internet'}
                  </Text>
                </View>
              </View>

              {isSyncing ? (
                <View className="bg-surface-muted rounded-xl p-4 flex-row items-center justify-center gap-3">
                  <ActivityIndicator size="small" color="#391A65" />
                  <Text className="text-primary font-medium text-[14px]">
                    {syncProgress}
                  </Text>
                </View>
              ) : hasOffline ? (
                <TouchableOpacity
                  onPress={handleClearOffline}
                  activeOpacity={0.8}
                  className="bg-red-50 py-3.5 rounded-xl justify-center items-center border border-red-200/50"
                >
                  <Text className="text-red-600 font-bold text-[14px]">
                    Apagar downloads e liberar espaço
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSyncOffline}
                  activeOpacity={0.8}
                  className="bg-primary py-3.5 rounded-xl justify-center items-center shadow-sm"
                >
                  <Text className="text-white font-bold text-[14px]">
                    Baixar todas as aulas agora
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Card Alterar Senha */}
        <TouchableOpacity
          onPress={() => setShowDevModal(true)}
          className="bg-white rounded-[20px] p-5 flex-row items-center shadow-sm mb-6"
          activeOpacity={0.8}
        >
          <View className="w-[52px] h-[52px] bg-[#EBE5F1] rounded-full items-center justify-center mr-4">
            <Ionicons name="lock-closed-outline" size={26} color="#391A65" />
          </View>
          <Text className="flex-1 text-primary text-[17px] font-bold">Alterar Senha</Text>
          <Ionicons name="chevron-forward" size={24} color="#A39BB0" />
        </TouchableOpacity>

        <View className="flex-1" />

        {/* Botão Sair da Conta */}
        <TouchableOpacity
          onPress={handleLogout}
          className="border-[3px] border-[#3F3F3F] rounded-[20px] h-[72px] flex-row items-center justify-center bg-transparent"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={28} color="#3F3F3F" className="mr-3" />
          <Text className="text-[#3F3F3F] text-[18px] font-bold uppercase tracking-[1px]">
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Em Desenvolvimento */}
      <Modal
        visible={showDevModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDevModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-[24px] p-8 items-center shadow-lg w-full max-w-[320px]">
            <View className="w-16 h-16 bg-[#EBE5F1] rounded-full items-center justify-center mb-4">
              <Ionicons name="construct-outline" size={32} color="#391A65" />
            </View>
            <Text className="text-primary text-[20px] font-bold text-center mb-2">
              Em Desenvolvimento
            </Text>
            <Text className="text-text-muted text-[15px] text-center mb-6">
              Esta funcionalidade estará disponível nas próximas atualizações.
            </Text>
            <TouchableOpacity
              onPress={() => setShowDevModal(false)}
              className="bg-primary w-full py-3.5 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-[16px]">Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}
