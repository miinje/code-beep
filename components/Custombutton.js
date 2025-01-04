import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  source,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.Button,
        { backgroundColor: disabled ? "#6A6C6C" : "#ffffff" },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.box}>
        {source ? <Image style={styles.logo} source={source} /> : null}
        <CustomText
          text={`${title}`}
          textColor={disabled ? "#c0c0c0" : "#000000"}
          size={21}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  Button: {
    flex: 0,
    width: "100%",
    height: 55,
    borderRadius: 50,
  },
  box: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  logo: {
    flex: 1,
    resizeMode: "center",
    width: 35,
    height: 35,
  },
  text: {
    fontSize: 21,
  },
});
