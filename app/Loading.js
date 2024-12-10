import { Image, ImageBackground, StyleSheet, View } from "react-native";
import CustomText from "../components/CustomText";
import { useEffect, useState } from "react";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadingText === "Loading" + "..."
        ? setLoadingText("Loading")
        : setLoadingText((prev) => prev + ".");
    }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadingText]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/code-beep-bubbles.png")}
        style={styles.backgroundImg}
      >
        <View style={styles.bubblesBox}>
          <CustomText
            text={loadingText}
            textColor="#000000"
            style={styles.textInBubble}
          />
        </View>
      </ImageBackground>
      <Image
        source={require("../assets/code-beep-icon.png")}
        style={styles.iconImage}
      />
      <CustomText
        text="앱 종료 중..."
        textColor="#ffffff"
        style={styles.textInBubble}
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
  backgroundImg: {
    width: 100,
    height: 100,
  },
  bubblesBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 20,
  },
  textInBubble: {
    fontSize: 20,
  },
  iconImage: {
    resizeMode: "center",
    width: 120,
    height: 120,
  },
});
