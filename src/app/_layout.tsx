import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { 
  useFonts as useMontserrat, 
  Montserrat_400Regular, 
  Montserrat_500Medium, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold,
  Montserrat_800ExtraBold 
} from '@expo-google-fonts/montserrat';
import { 
  useFonts as usePoppins, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { ConfigProvider } from "../context/ConfigContext";
import { ToastProvider } from "../context/ToastContext";

SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [montserratLoaded, montserratError] = useMontserrat({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  const [poppinsLoaded, poppinsError] = usePoppins({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const loaded = montserratLoaded && poppinsLoaded;
  const error = montserratError || poppinsError;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ConfigProvider>
      <ToastProvider>
        <Stack>
          {/* Tela inicial pública */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* Grupo de autenticação: /login */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Grupo protegido: /menu, /material, /duvidas, /aula, /admin/... */}
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ToastProvider>
    </ConfigProvider>
  );
}
