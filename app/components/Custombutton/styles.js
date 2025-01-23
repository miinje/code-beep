import { StyleSheet } from "react-native";

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

export default styles;
