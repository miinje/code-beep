import { StyleSheet, View } from "react-native";
import CustomText from "./components/CustomText";
import { useEffect, useState } from "react";
import CustomButton from "../components/Custombutton";

export default function ActionAlarm() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const currentTimeInterval = setInterval(() => {
      const now = new Date();

      setCurrentTime(now);
    }, 1000);

    return () => {
      clearInterval(currentTimeInterval);
    };
  });

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
        <CustomButton title="완료!" />
      </View>
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
