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
        {/* Ícone de configuração / login */}
        <TouchableOpacity
          className="absolute top-6 right-6"
          onPress={() => router.push('/login')}
          activeOpacity={0.75}
        >
          <Image
            source={require("../assets/images/login.svg")}
            style={{ width: 35, height: 35 }}
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* texto central*/}
        <View className="items-center mt-[120px]">
          <Image
            source={require("../assets/images/Logo.png")}
            style={{ width: 200, height: 200 }}
            contentFit="contain"
          />

          <View className="items-center">
            <Text className="text-white text-[50px] font-bold leading-[50px]">
              TECER
            </Text>
            <Text className="text-white text-[40px] font-normal leading-[40px]">
              MULHER
            </Text>
          </View>
        </View>

        {/*botao de entra*/}
        <View className="absolute bottom-[100px]">
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
      </View>
    </SafeAreaView>
  );
}
