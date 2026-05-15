import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  /** duração em ms (padrão 3000) */
  duration?: number;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}

// ─── Configurações visuais por tipo ──────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { bg: string; icon: string; color: string }> = {
  success: { bg: '#1A6545', icon: 'checkmark-circle', color: '#4ADE80' },
  error:   { bg: '#6B1A1A', icon: 'close-circle',     color: '#F87171' },
  info:    { bg: '#1A3565', icon: 'information-circle', color: '#60A5FA' },
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // ── Toast state ──
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Confirm state ──
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmOpts, setConfirmOpts] = useState<ConfirmOptions>({
    title: '',
    message: '',
  });
  const confirmResolve = useRef<((v: boolean) => void) | null>(null);

  // ── showToast ──
  const showToast = useCallback(({ message, type = 'success', duration = 3000 }: ToastOptions) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity,    { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 100, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0,   duration: 250, useNativeDriver: true }),
      ]).start(() => setToastVisible(false));
    }, duration);
  }, [translateY, opacity]);

  // ── showConfirm ──
  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolve.current = resolve;
      setConfirmOpts(options);
      setConfirmVisible(true);
    });
  }, []);

  const handleConfirmAction = (result: boolean) => {
    setConfirmVisible(false);
    confirmResolve.current?.(result);
    confirmResolve.current = null;
  };

  const cfg = TOAST_CONFIG[toastType];

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* ── Toast ── */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: cfg.bg, transform: [{ translateY }], opacity },
          ]}
          pointerEvents="none"
        >
          <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* ── Confirm Modal ── */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => handleConfirmAction(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Ícone de aviso */}
            <View style={[
              styles.iconCircle,
              confirmOpts.destructive ? styles.iconDestructive : styles.iconNormal,
            ]}>
              <Ionicons
                name={confirmOpts.destructive ? 'trash-outline' : 'help-circle-outline'}
                size={28}
                color={confirmOpts.destructive ? '#F87171' : '#C084FC'}
              />
            </View>

            <Text style={styles.modalTitle}>{confirmOpts.title}</Text>
            <Text style={styles.modalMessage}>{confirmOpts.message}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => handleConfirmAction(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnCancelText}>
                  {confirmOpts.cancelText ?? 'Cancelar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnConfirm,
                  confirmOpts.destructive && styles.btnDestructive,
                ]}
                onPress={() => handleConfirmAction(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnConfirmText}>
                  {confirmOpts.confirmText ?? 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ToastContext.Provider>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Toast
  toast: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1E1028',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A2550',
  },

  // Ícone do modal
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconNormal:      { backgroundColor: 'rgba(192,132,252,0.15)' },
  iconDestructive: { backgroundColor: 'rgba(248,113,113,0.15)' },

  // Textos do modal
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    color: '#B39DCC',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  // Botões
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2A1A3A',
    borderWidth: 1,
    borderColor: '#3A2550',
  },
  btnCancelText: {
    color: '#B39DCC',
    fontSize: 15,
    fontWeight: '600',
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#391A65',
  },
  btnDestructive: {
    backgroundColor: '#7F1D1D',
  },
  btnConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
