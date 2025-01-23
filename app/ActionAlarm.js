import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import alarmStore from "../store/alarmStore";
import { stopAudio } from "../utils/audioPlayer";
import CustomText from "./components/CustomText/CustomText";
import { actionAlarmStyles } from "./styles";

export default function ActionAlarm() {
  const { currentTime, alarmQuiz, setCurrentTime, setIsTimeMatched } =
    alarmStore();
  const [inputValue, setInputValue] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [checkResult, setCheckResult] = useState(true);
  const [isFontsLoaded] = useFonts({
    CONSOLA: require("../assets/fonts/CONSOLA.ttf"),
  });

  if (!isFontsLoaded) {
    return null;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleClickDone = async () => {
    Keyboard.dismiss();

    if (inputValue !== alarmQuiz[0].returnValues[0]) {
      setCheckResult("");

      Alert.alert("오답입니다!", "다시 생각해 보세요", [
        {
          text: "OK",
          onPress: () => {
            setInputValue(false);
            setCheckResult(false);
          },
        },
      ]);
    } else {
      await stopAudio();
      setCheckResult("");

      Alert.alert("정답입니다!", "", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/AlarmList");
            setIsTimeMatched(false);
          },
        },
      ]);
    }
  };

  const alarmQuizItems = alarmQuiz[0].functionBody.map((text, index) => {
    const returnValue = alarmQuiz[0].returnValues[0];
    const returnBlankSpace = Array.from(returnValue)
      .map((text) => {
        if (text === "[" || text === "]") {
          return text;
        } else {
          return "_";
        }
      })
      .join(" ");

    text = text.includes("return")
      ? text.slice(0, text.length - returnValue.length - 1) +
        " " +
        returnBlankSpace
      : text;

    return (
      <CodeHighlighter
        key={index}
        hljsStyle={atomOneDarkReasonable}
        containerStyle={{
          width: "100%",
          height: "100%",
          padding: 2,
        }}
        textStyle={[
          actionAlarmStyles.quizText,
          {
            fontFamily: "CONSOLA",
            fontSize: 12,
            width: text.includes("return") && 350,
            backgroundColor: text.includes("return") && "#2e5c90",
            padding: text.includes("return") && 2,
            marginLeft: text.includes("return") && -2,
          },
        ]}
        language="javascript"
      >
        {text}
      </CodeHighlighter>
    );
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={actionAlarmStyles.container}>
        <View style={actionAlarmStyles.topBox}>
          <View style={actionAlarmStyles.currentTimeBox}>
            <CustomText
              text={
                String(currentTime.getHours()).length < 2
                  ? "0" + currentTime.getHours()
                  : currentTime.getHours()
              }
              size={80}
            />
            <CustomText text=":" size={80} />
            <CustomText
              text={
                String(currentTime.getMinutes()).length < 2
                  ? "0" + currentTime.getMinutes()
                  : currentTime.getMinutes()
              }
              size={80}
            />
            <CustomText text=":" size={80} />
            <CustomText
              text={
                String(currentTime.getSeconds()).length < 2
                  ? "0" + currentTime.getSeconds()
                  : currentTime.getSeconds()
              }
              size={80}
            />
          </View>
          <CustomText text="일어날 시간이에요!" size={15} />
        </View>
        <View
          style={[
            actionAlarmStyles.quizTextContainer,
            { marginBottom: isKeyboardVisible ? 150 : 0 },
          ]}
        >
          <View
            style={[
              actionAlarmStyles.quizTextBox,
              {
                borderColor:
                  checkResult === ""
                    ? "#383838"
                    : checkResult === true
                      ? "#76ff0d"
                      : "#ff0d0d",
              },
            ]}
          >
            <View style={actionAlarmStyles.fileRootText}>
              <Text
                style={[actionAlarmStyles.rootText, { fontFamily: "CONSOLA" }]}
              >
                {alarmQuiz[0].filesRoot}
              </Text>
              <Text
                style={[actionAlarmStyles.rootText, { fontFamily: "CONSOLA" }]}
              >
                JavaScript
              </Text>
            </View>
            <View style={{ flex: 0, marginTop: 10 }}>{alarmQuizItems}</View>
          </View>
          <TextInput
            style={[actionAlarmStyles.textInput, { fontFamily: "CONSOLA" }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="위 코드 내 빈칸에 들어갈 알맞은 답을 쓰세요"
            placeholderTextColor="#C0C0C0"
          />
        </View>
        {!isKeyboardVisible ? (
          <TouchableOpacity
            style={[
              actionAlarmStyles.button,
              {
                backgroundColor: !inputValue ? "#C0C0C0" : "#ffffff",
              },
            ]}
            onPress={handleClickDone}
            disabled={!inputValue}
          >
            <View style={actionAlarmStyles.buttonInnerBox}>
              <CustomText
                text="완료!"
                textColor={!inputValue ? "#242424" : "#000000"}
                size={21}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}
