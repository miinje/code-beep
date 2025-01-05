import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { router } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as webBrowser from "expo-web-browser";
import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../components/CustomText";
import { auth, getAlarmData } from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";
import { createTokenWithCode } from "../utils/createTokenWithCode";

SystemUI.setBackgroundColorAsync("#404040");

webBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function Login() {
  const { setAllAlarmData } = alarmStore();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      scopes: ["repo", "identity", "user:email"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {
    if (response.type === "success") {
      const { code } = response.params;
      const { access_token } = await createTokenWithCode(code);

      if (!access_token) return;

      const credential = GithubAuthProvider.credential(access_token);
      await signInWithCredential(auth, credential);

      onAuthStateChanged(auth, async (user) => {
        const allAlarmData = await getAlarmData(user.uid);

        setAllAlarmData(allAlarmData[user.uid]);
      });

      router.replace("/AlarmList");
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAllAlarmData(await getAlarmData(user.uid));

        router.replace("/AlarmList");
      }
    });
  });

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../assets/code-beep-icon.png")}
          style={styles.icon}
        />
      </View>
      <View style={styles.loginButtonWarpper}>
        <TouchableOpacity style={styles.Button} onPress={() => promptAsync()}>
          <View style={styles.buttonInnerBox}>
            <Image
              style={styles.buttonInnerLogo}
              source={require("../assets/github-logo.png")}
            />
            <CustomText
              text="Github 로그인하고 CODE BEEP 사용하기"
              textColor="#000000"
              size={14}
            />
          </View>
        </TouchableOpacity>
      </View>
      <CustomText
        text="로그인 후 이용하 실 수 있습니다"
        size={15}
        textColor="#808080"
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
    gap: 20,
  },
  icon: {
    resizeMode: "center",
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  loginButtonWarpper: {
    width: 300,
  },
  Button: {
    padding: 10,
    flex: 0,
    width: "100%",
    height: 55,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    gap: 10,
  },
  buttonInnerBox: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonInnerLogo: {
    flex: 1,
    resizeMode: "center",
    width: 30,
    height: 30,
  },
  buttonInnerText: {
    fontSize: 21,
  },
});
