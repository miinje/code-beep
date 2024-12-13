import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";

export default function ActionAlarm() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sound, setSound] = useState(null);

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

      setSound(sound);
      await sound.playAsync();
    };

    playSound();
  }, []);

  const handleClickDone = async () => {
    setSound(null);
    await sound.unloadAsync();

    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <View style={styles.currentTimeBox}>
          <CustomText text={currentTime.getHours()} style={styles.titleText} />
          <CustomText text=":" style={styles.titleText} />
          <CustomText
            text={currentTime.getMinutes()}
            style={styles.titleText}
          />
          <CustomText text=":" style={styles.titleText} />
          <CustomText
            text={currentTime.getSeconds()}
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
    marginBottom: 30,
  },
});
