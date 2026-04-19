import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#391A65]">
      <View className="flex-1 relative items-center">
        {/*login superior*/}
        <View className="absolute top-6 right-6">
          <Image
            source={require("../assets/images/login.svg")}
            style={{ width: 35, height: 35 }}
            contentFit="contain"
          />
        </View>

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
          <Link href="/menu" asChild>
            <TouchableOpacity
              className="w-[291px] h-[80px] bg-[#E8E5ED] rounded-[16px] border-[5px] border-[#CF96D5] items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-[#391A65] text-[25px] font-semibold">
                Entrar
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
