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
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
        <Stack.Screen name="material" options={{ headerShown: false }} />
        <Stack.Screen name="duvidas" options={{ headerShown: false }} />
        <Stack.Screen name="aula" options={{ headerShown: false }} />
        <Stack.Screen name="admin/add-material" options={{ headerShown: false }} />
        <Stack.Screen name="admin/edit-material" options={{ headerShown: false }} />
        <Stack.Screen name="admin/add-duvida" options={{ headerShown: false }} />
        <Stack.Screen name="admin/edit-duvida" options={{ headerShown: false }} />
        <Stack.Screen name="duvida-expandida" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
