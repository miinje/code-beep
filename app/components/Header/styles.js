import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "top",
    pointerEvents: "auto",
    marginTop: 10,
  },
  editButton: {
    width: 50,
    height: 40,
  },
  addButton: {
    width: 50,
    height: 50,
    textAlign: "auto",
    marginTop: -15,
    marginRight: -15,
  },
});

export default styles;
