import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/CustomText";

export default function Header() {
  const router = useRouter();

  return (
    <>
      <View style={styles.headerContainer}>
        <CustomText size={40} text="알람" />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/AddAlarm")}
        >
          <CustomText size={40} text="+" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "top",
    pointerEvents: "auto",
  },
  addButton: {
    width: 40,
    height: 40,
    textAlign: "center",
  },
});
