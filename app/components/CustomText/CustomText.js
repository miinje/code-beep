import { useFonts } from "expo-font";
import { Text, View } from "react-native";

export default function CustomText({ text, textColor = "white", size = 15 }) {
  const [isFontsLoaded] = useFonts({
    "Pretendard-Medium": require("../../../assets/fonts/Pretendard-Medium.otf"),
  });

  if (!isFontsLoaded) {
    return null;
  }

  return (
    <View>
      <Text
        style={{
          fontFamily: "Pretendard-Medium",
          color: textColor,
          fontSize: size,
        }}
      >{`${text}`}</Text>
    </View>
  );
}
