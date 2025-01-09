import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomText from "../components/CustomText";
import alarmStore from "../store/alarmStore";
import { stopAudio } from "../utils/audioPlayer";

export default function ActionAlarm() {
  const { currentTime, alarmQuiz, setCurrentTime, setIsTimeMatched } =
    alarmStore();
  const [inputValue, setInputValue] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [checkResult, setCheckResult] = useState(true);
  const [isFontsLoaded] = useFonts({
    CONSOLA: require("../assets/fonts/CONSOLA.ttf"),
  });

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

    if (inputValue !== "Hi") {
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

  const alarmQuizItems = alarmQuiz[0].functionBody.map((text) => {
    const returnValue = alarmQuiz[0].returnValues[0];
    const returnBlankSpace = [];

    if (text.includes(returnValue)) {
      text = text.slice(0, text.length - returnValue.length - 1);
      Array.from(returnValue).map((text) => {
        if (text === "[" || text === "]") {
          returnBlankSpace.push(text);
        } else {
          returnBlankSpace.push(" ");
        }
      });
    }

    return (
      <View
        key={text}
        style={{ flex: 0, flexDirection: "row", width: "100%", gap: 10 }}
      >
        <Text style={styles.quizText}>{text}</Text>
        {returnBlankSpace.length !== 0 ? (
          <View
            style={{
              height: 23,
              flex: 0,
              flexDirection: "row",
              marginTop: -5,
              marginBottom: 5,
              gap: 5,
            }}
          >
            {returnBlankSpace.map((blank, index) => {
              const borderWidth = blank === " " ? 1 : 0;

              return (
                <Text
                  key={index}
                  style={{
                    width: 6,
                    borderBottomColor: "#ffffff",
                    borderBottomWidth: borderWidth,
                    color: "#ffffff",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {blank}
                </Text>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.topBox}>
          <View style={styles.currentTimeBox}>
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
            styles.quizTextContainer,
            { marginBottom: isKeyboardVisible ? 150 : 0 },
          ]}
        >
          <View
            style={[
              styles.quizTextBox,
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
            <View style={styles.fileRootText}>
              <Text style={styles.rootText}>{alarmQuiz[0].filesRoot}</Text>
              <Text style={styles.rootText}>JavaScript</Text>
            </View>
            <View style={{ flex: 0, gap: 3, marginTop: 10 }}>
              {alarmQuizItems}
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="위 코드 내 빈칸에 들어갈 알맞은 답을 쓰세요"
            placeholderTextColor="#C0C0C0"
          />
        </View>
        {!isKeyboardVisible ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: !inputValue ? "#C0C0C0" : "#ffffff",
              },
            ]}
            onPress={handleClickDone}
            disabled={!inputValue}
          >
            <View style={styles.buttonInnerBox}>
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

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#404040",
    paddingTop: 30,
    paddingBottom: 30,
  },
  topBox: {
    flex: 0,
    width: 400,
    height: 150,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  currentTimeBox: {
    flex: 0,
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  quizTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 370,
    height: 100,
    gap: 15,
  },
  fileRootText: {
    minWidth: 350,
    maxWidth: 370,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: -12,
    marginTop: -10,
    marginBottom: 10,
  },
  quizTextBox: {
    minWidth: 370,
    maxWidth: 380,
    minHeight: 350,
    maxHeight: 370,
    borderWidth: 3,
    backgroundColor: "#383838",
    padding: 20,
    borderRadius: 15,
  },
  rootText: {
    fontFamily: "CONSOLA",
    color: "#C0C0C0",
    fontSize: 9,
  },
  quizText: {
    fontFamily: "CONSOLA",
    color: "#ffffff",
    fontSize: 13,
  },
  textInput: {
    backgroundColor: "#ffffff",
    fontFamily: "CONSOLA",
    textAlign: "center",
    width: 350,
    height: 50,
    borderRadius: 10,
    fontSize: 13,
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
  button: {
    width: "85%",
    height: 55,
    borderRadius: 50,
    backgroundColor: "#ffffff",
  },
});
