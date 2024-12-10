import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";

export default function CustomText({ text, style }) {
  const [isFontsLoaded] = useFonts({
    Neo_Dunggeunmo: require("../assets/NeoDunggeunmoPro-Regular.ttf"),
  });

  if (!isFontsLoaded) {
    return null;
  }

  return (
    <View>
      <Text style={[styles.text, style]}>{`${text}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Neo_Dunggeunmo",
    fontSize: 15,
  },
});
