import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as webBrowser from "expo-web-browser";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";
import { auth } from "../firebaseConfig.mjs";
import { createTokenWithCode } from "../utils/createTokenWithCode";

webBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function Login() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      scopes: ["repo", "identity", "user:email"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {
    if (response.type === "success") {
      const { code } = response.params;
      const { token_type, scope, access_token } =
        await createTokenWithCode(code);

      if (!access_token) return;

      const credential = GithubAuthProvider.credential(access_token);
      const data = await signInWithCredential(auth, credential);

      setUserInfo(data);
    }
  }

  return (
    <View style={styles.container}>
      <CustomText
        text="Code Beep에 오신 것을 환영합니다!"
        style={styles.titleText}
      />
      <ImageBackground
        source={require("../assets/code-beep-bubbles.png")}
        style={styles.bubbles}
      >
        <View style={styles.bubblesBox}>
          <CustomText text="구글 로그인은" textColor="#000000" />
          <CustomText text="깃헙이 가입된" textColor="#000000" />
          <CustomText text="구글 계정만" textColor="#000000" />
          <CustomText text="가능해요! >_" textColor="#000000" />
        </View>
      </ImageBackground>
      <Image
        source={require("../assets/code-beep-icon.png")}
        style={styles.icon}
      />
      <CustomButton
        title="Github Login"
        source={require("../assets/github-logo.png")}
        onPress={() => promptAsync()}
      />
      <View style={styles.googleLoginBox}>
        <Image
          style={styles.googleLoginImg}
          source={require("../assets/android_light_rd.png")}
        />
      </View>
      <CustomText
        text="로그인 후 이용하실 수 있습니다"
        style={styles.guideText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#404040",
    gap: 15,
  },
  titleText: {
    fontSize: 20,
    margin: 20,
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
  googleLoginBox: { width: 250, height: 55 },
  googleLoginImg: { width: "100%", height: "100%" },
  guideText: {
    fontSize: 14,
    margin: 10,
    color: "#808080",
  },
});
