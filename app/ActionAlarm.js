import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../components/CustomText";
import alarmStore from "../store/alarmStore";
import { stopAudio } from "../utils/audioPlayer";

export default function ActionAlarm() {
  const { currentTime, setIsTimeMatched, setCurrentTime } = alarmStore();
  const router = useRouter();

  const handleClickDone = async () => {
    setIsTimeMatched(false);

    await stopAudio();

    router.replace("/AlarmList");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  });

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
      <TouchableOpacity style={styles.button} onPress={handleClickDone}>
        <View style={styles.buttonInnerBox}>
          <CustomText text="완료!" textColor="#000000" size={21} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#404040",
    gap: 10,
  },
  titleText: {
    fontSize: 80,
  },
  currentTimeBox: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  topBox: {
    flex: 3,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 0,
    width: "85%",
    marginBottom: "10%",
    height: 55,
    borderRadius: 50,
    backgroundColor: "#ffffff",
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
});
