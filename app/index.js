import AsyncStorage from "@react-native-async-storage/async-storage";
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
import {
  Image,
  loginStylesLoginStylesheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "./components/CustomText/CustomText";

import { auth, getAlarmData, saveReposCodeData } from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";
import userStore from "../store/userStore";
import { fetchRecentRepo, getCodeFiles, getGithubUser } from "../utils/api";
import { createTokenWithCode } from "../utils/createTokenWithCode";
import { loginStyles } from "./styles";

SystemUI.setBackgroundColorAsync("#404040");

webBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function App() {
  const { allAlarmData, setAllAlarmData } = alarmStore();
  const { setUserUid } = userStore();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      scopes: ["repo", "identity", "user:email"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  async function handleResponse() {
    if (response.type === "success") {
      const { code } = response.params;
      const { access_token } = await createTokenWithCode(code);

      if (!access_token) console.error();

      await AsyncStorage.setItem("github_access_token", access_token);

      const credential = GithubAuthProvider.credential(access_token);
      await signInWithCredential(auth, credential);

      try {
        onAuthStateChanged(auth, async (user) => {
          const allAlarmData = await getAlarmData(user.uid);

          setAllAlarmData(allAlarmData);
        });
      } catch (error) {
        console.error(error);
      }

      router.replace("/AlarmList");
    }
  }

  useEffect(() => {
    handleResponse();
  }, [response]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const accessToken = await AsyncStorage.getItem("github_access_token");
        const { login } = await getGithubUser(accessToken);

        setUserUid(user.uid);

        try {
          const repoName = await fetchRecentRepo(accessToken, login);
          const files = await getCodeFiles(accessToken, login, repoName);
          const repoFilesData = {};

          Object.keys(files).map((key) => {
            const codeData = files[key];

            if (files && codeData.path.slice(-3) === ".js") {
              return (repoFilesData[key] = codeData);
            }
          });

          saveReposCodeData(user.uid, repoName, repoFilesData);
        } catch (error) {
          console.error("파일 가져오기 실패:", error);
        }

        setAllAlarmData(await getAlarmData(user.uid));

        router.replace("/AlarmList");
      }
    });
  }, [allAlarmData]);

  return (
    <View style={loginStyles.container}>
      <View>
        <Image
          source={require("../assets/code-beep-icon.png")}
          style={loginStyles.icon}
        />
      </View>
      <View style={loginStyles.loginButtonWarpper}>
        <TouchableOpacity
          style={loginStyles.button}
          onPress={() => promptAsync()}
        >
          <View style={loginStyles.buttonInnerBox}>
            <Image
              style={loginStyles.buttonInnerLogo}
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
