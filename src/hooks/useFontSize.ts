import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@tecer_user_font_factor';
const MIN = 0.8;
const MAX = 2.0;
const STEP = 0.1;

let globalFactor = 1.0;
const listeners = new Set<(val: number) => void>();

/**
 * Hook de tamanho de fonte local do usuário.
 * Persiste no AsyncStorage do dispositivo e sincroniza o estado globalmente.
 */
export function useFontSize() {
  const [userFontFactor, setUserFontFactor] = useState(globalFactor);

  useEffect(() => {
    listeners.add(setUserFontFactor);
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val !== null) {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
          globalFactor = parsed;
          listeners.forEach(l => l(parsed));
        }
      }
    });
    return () => {
      listeners.delete(setUserFontFactor);
    };
  }, []);

  const save = useCallback(async (factor: number) => {
    globalFactor = factor;
    listeners.forEach(l => l(factor));
    await AsyncStorage.setItem(STORAGE_KEY, factor.toString());
  }, []);

  const increase = useCallback(() => {
    const next = parseFloat(Math.min(MAX, globalFactor + STEP).toFixed(1));
    globalFactor = next;
    listeners.forEach(l => l(next));
    AsyncStorage.setItem(STORAGE_KEY, next.toString());
  }, []);

  const decrease = useCallback(() => {
    const next = parseFloat(Math.max(MIN, globalFactor - STEP).toFixed(1));
    globalFactor = next;
    listeners.forEach(l => l(next));
    AsyncStorage.setItem(STORAGE_KEY, next.toString());
  }, []);

  const canIncrease = userFontFactor < MAX;
  const canDecrease = userFontFactor > MIN;

  return { userFontFactor, increase, decrease, canIncrease, canDecrease, save };
}
