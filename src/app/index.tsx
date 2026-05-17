import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

export default function TelaInicial() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleEntrarEstudante = async () => {
    // Garante que ao clicar em "Entrar", qualquer sessão de admin fique na tela de login
    // e o usuário entre exclusivamente como estudante.
    await logout();
    router.push('/menu');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 relative items-center">
        {/* texto central*/}
        <View className="flex-1 justify-center items-center w-full mb-[120px]" pointerEvents="box-none">
          <Image
            source={require("../assets/images/Logo.png")}
            style={{ width: 320, height: 320 }}
            contentFit="contain"
          />
        </View>

        {/*botao de entra*/}
        <View className="absolute bottom-[100px] z-10">
          <TouchableOpacity
            onPress={handleEntrarEstudante}
            className="w-[291px] h-[80px] bg-background rounded-[16px] items-center justify-center"
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="Entrar como estudante"
          >
            <Text className="text-primary text-[25px] font-semibold">
              Entrar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ícone de configuração / login */}
        <TouchableOpacity
          className="absolute top-6 right-6 z-50 p-2"
          onPress={() => router.push('/login')}
          activeOpacity={0.75}
          accessible={true}
          accessibilityLabel="Entrar como administrador"
        >
          <Image
            source={require("../assets/images/login.svg")}
            style={{ width: 35, height: 35 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
