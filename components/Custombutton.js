import { Image, Pressable, StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

export default function CustomButton({ title, onPress, source }) {
  const margin = source ? 50 : 0;

  return (
    <Pressable style={styles.Button} onPress={onPress}>
      <View style={styles.box}>
        {source ? <Image style={styles.logo} source={source} /> : null}
        <CustomText
          text={`${title}`}
          textColor="#000000"
          style={[styles.text, { marginRight: margin }]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Button: {
    flex: 0,
    width: 250,
    height: 55,
    backgroundColor: "#ffffff",
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
