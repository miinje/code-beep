import { Image, TouchableOpacity, View } from "react-native";
import CustomText from "../../../components/CustomText";
import styles from "./styles";

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
