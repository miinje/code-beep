import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";
import alarmStore from "../store/alarmStore";

export default function ActionAlarm() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [audio, setAudio] = useState(null);
  const { isTimeMatched, setIsTimeMatched } = alarmStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      setCurrentTime(now);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/K.K.House.mp3"),
        {
          shouldPlay: true,
          isLooping: true,
        }
      );

      setAudio(sound);

      await audio.playAsync();
    };

    if (isTimeMatched) {
      playSound();
    }
  }, [isTimeMatched]);

  const handleClickDone = async () => {
    setIsTimeMatched(false);
    setAudio(null);

    await audio.unloadAsync();

    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <View style={styles.currentTimeBox}>
          <CustomText
            text={
              String(currentTime.getHours()).length < 2
                ? "0" + currentTime.getHours()
                : currentTime.getHours()
            }
            style={styles.titleText}
          />
          <CustomText text=":" style={styles.titleText} />
          <CustomText
            text={
              String(currentTime.getMinutes()).length < 2
                ? "0" + currentTime.getMinutes()
                : currentTime.getMinutes()
            }
            style={styles.titleText}
          />
          <CustomText text=":" style={styles.titleText} />
          <CustomText
            text={
              String(currentTime.getSeconds()).length < 2
                ? "0" + currentTime.getSeconds()
                : currentTime.getSeconds()
            }
            style={styles.titleText}
          />
        </View>
        <CustomText text="일어날 시간이에요!" style={{ fontSize: 15 }} />
      </View>
      <View style={styles.buttonBox}>
        <CustomButton title="완료!" onPress={handleClickDone} />
      </View>
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
    fontSize: 80,
  },
  currentTimeBox: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  topBox: {
    flex: 3,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBox: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
});
