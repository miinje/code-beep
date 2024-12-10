import { Image, ImageBackground, StyleSheet, View } from "react-native";
import CustomButton from "./components/Custombutton";
import CustomText from "./components/CustomText";

export default function App() {
  return (
    <View style={styles.container}>
      <CustomText
        text="Code Beep에 오신 것을 환영합니다!"
        style={{
          fontSize: 20,
          margin: 20,
          color: "#fff",
        }}
      />
      <ImageBackground
        source={require("./assets/code-beep-bubbles.png")}
        style={styles.bubbles}
      >
        <View style={styles.bubblesBox}>
          <CustomText text="구글 로그인은" />
          <CustomText text="깃헙이 가입된" />
          <CustomText text="구글 계정만" />
          <CustomText text="가능해요! >_" />
        </View>
      </ImageBackground>
      <Image
        source={require("./assets/code-beep-icon.png")}
        style={styles.icon}
      />
      <CustomButton
        title="Github Login"
        source={require("./assets/github-logo.png")}
      />
      <View style={{ width: 250, height: 55 }}>
        <Image
          style={{ width: "100%", height: "100%" }}
          source={require("./assets/android_light_rd.png")}
        />
      </View>
      <CustomText
        text="로그인 후 이용하실 수 있습니다"
        style={{
          fontSize: 14,
          margin: 10,
          color: "#808080",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#404040",
    gap: 15,
  },
  icon: {
    resizeMode: "center",
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  bubbles: {
    flex: 0,
    width: 150,
    height: 150,
  },
  bubblesBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 20,
  },
});
