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
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import CustomText from "./components/CustomText/CustomText";

import { auth, getAlarmData } from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";
import userStore from "../store/userStore";
import { fetchCommitCode, getGithubUser } from "../utils/api";
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
  const { setAllAlarmData } = alarmStore();
  const { setUserUid, setUserRepoCodeData } = userStore();
  const [isAutoLoggedIn, setIsAutoLoggedIn] = useState(false);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      scopes: ["repo", "identity", "user:email"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  async function autoLogin() {
    const accessToken = await AsyncStorage.getItem("github_access_token");
    const credential = GithubAuthProvider.credential(accessToken);

    if (!accessToken) {
      setIsAutoLoggedIn(false);

      return;
    }

    try {
      await signInWithCredential(auth, credential);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const { login } = await getGithubUser(accessToken);

          setUserUid(user.uid);

          const dateObject = new Date();
          const STORAGE_KEY = `${dateObject.getFullYear()}.${dateObject.getMonth()}.${dateObject.getDate()}`;
          const storedData = await AsyncStorage.getItem(STORAGE_KEY);

          if (storedData === null) {
            try {
              const commitFile = await fetchCommitCode(accessToken, login);

              setUserRepoCodeData(commitFile);
            } catch (error) {
              console.error("파일 가져오기 실패:", error);
            }
          }

          setAllAlarmData(await getAlarmData(user.uid));
          setIsAutoLoggedIn(true);

          router.replace("/AlarmList");
        }
      });
    } catch (error) {
      console.error("자동 로그인 실패:", error);
    }
  }

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
          if (user) {
            const accessToken = await AsyncStorage.getItem(
              "github_access_token"
            );
            const { login } = await getGithubUser(accessToken);

            setUserUid(user.uid);

            const dateObject = new Date();
            const STORAGE_KEY = `${dateObject.getFullYear()}.${dateObject.getMonth()}.${dateObject.getDate()}`;
            const storedData = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedData === null) {
              try {
                const commitFile = await fetchCommitCode(accessToken, login);

                setUserRepoCodeData(commitFile);
              } catch (error) {
                console.error("파일 가져오기 실패:", error);
              }
            }

            setAllAlarmData(await getAlarmData(user.uid));

            router.replace("/AlarmList");
          }
        });
      } catch (error) {
        console.error(error);
      }

      router.replace("/AlarmList");
    }
  }

  useEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    if (!isAutoLoggedIn) {
      handleResponse();
    }
  }, [isAutoLoggedIn]);

  useEffect(() => {
    const deleteYesterdayData = async () => {
      const dateObject = new Date();
      const STORAGE_KEY = `${dateObject.getFullYear()}.${dateObject.getMonth()}.${dateObject.getDate() - 1}`;
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedData) {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } else {
        return;
      }
    };

    deleteYesterdayData();
  }, []);

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
