import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modal: {
    width: 200,
    height: 200,
    zIndex: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#242424",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: "100%",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 30,
    backgroundColor: "#ffffff",
  },
  textStyle: {
    color: "#000000",
    fontWeight: "normal",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  checkIcon: {
    color: "#0fff00",
  },
});

export default styles;
