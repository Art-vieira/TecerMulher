import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@tecer_user_font_factor';
const MIN = 0.8;
const MAX = 2.0;
const STEP = 0.1;

/**
 * Hook de tamanho de fonte local do usuário.
 * Persiste no AsyncStorage do dispositivo (não afeta o Firestore/admin).
 * 
 * Retorna:
 * - `userFontFactor` — fator atual (default 1.0)
 * - `increase` / `decrease` — funções para ajustar
 * - `canIncrease` / `canDecrease` — booleanos de limite
 */
export function useFontSize() {
  const [userFontFactor, setUserFontFactor] = useState(1.0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val !== null) {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) setUserFontFactor(parsed);
      }
    });
  }, []);

  const save = useCallback(async (factor: number) => {
    setUserFontFactor(factor);
    await AsyncStorage.setItem(STORAGE_KEY, factor.toString());
  }, []);

  const increase = useCallback(() => {
    setUserFontFactor((prev) => {
      const next = parseFloat(Math.min(MAX, prev + STEP).toFixed(1));
      AsyncStorage.setItem(STORAGE_KEY, next.toString());
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setUserFontFactor((prev) => {
      const next = parseFloat(Math.max(MIN, prev - STEP).toFixed(1));
      AsyncStorage.setItem(STORAGE_KEY, next.toString());
      return next;
    });
  }, []);

  const canIncrease = userFontFactor < MAX;
  const canDecrease = userFontFactor > MIN;

  return { userFontFactor, increase, decrease, canIncrease, canDecrease, save };
}
