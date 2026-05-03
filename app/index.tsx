import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function TelaInicial() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#4C1D95', '#2D1B50']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 relative items-center justify-center px-8">
            {/* Ícone de configuração / login */}
            <TouchableOpacity
              className="absolute top-6 right-6 z-10"
              onPress={() => router.push('/login')}
              activeOpacity={0.75}
            >
              <View className="bg-white/10 p-2 rounded-full border border-white/20">
                <Image
                  source={require("../assets/images/login.svg")}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                  tintColor="#FFFFFF"
                />
              </View>
            </TouchableOpacity>

            {/* texto central*/}
            <View className="items-center mb-12">
              <View className="bg-white/5 p-8 rounded-[40px] border border-white/10 mb-8 shadow-2xl">
                <Image
                  source={require("../assets/images/Logo.png")}
                  style={{ width: 180, height: 180 }}
                  contentFit="contain"
                />
              </View>

              <View className="items-center">
                <Text className="text-white text-[56px] font-bold tracking-tighter leading-[56px]">
                  TECER
                </Text>
                <Text className="text-accent text-[44px] font-light tracking-[10px] leading-[44px] -mt-1">
                  MULHER
                </Text>
                <View className="h-1 w-12 bg-accent mt-4 rounded-full" />
              </View>
            </View>

            {/*botao de entra*/}
            <View className="w-full max-w-[300px] mt-8">
              <Link href="/menu" asChild>
                <TouchableOpacity
                  className="w-full h-[72px] bg-white rounded-2xl items-center justify-center shadow-xl shadow-black/40"
                  activeOpacity={0.9}
                >
                  <Text className="text-primary text-[22px] font-bold uppercase tracking-widest">
                    Entrar
                  </Text>
                </TouchableOpacity>
              </Link>
              <Text className="text-white/50 text-center mt-6 text-sm font-medium italic">
                Empoderando através do conhecimento
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
