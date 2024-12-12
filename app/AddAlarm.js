import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";
import { auth, saveAlarmData } from "../firebaseConfig.mjs";

export default function AddAlarm() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedHours, setSelectedHours] = useState(1);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedDayAndNight, setSelectedDayAndNight] = useState(null);
  const [saveAlarm, setSaveAlarm] = useState(null);
  const [alarmTitle, setAlarmTitle] = useState("알람");
  const [isFontsLoaded] = useFonts({
    Neo_Dunggeunmo: require("../assets/NeoDunggeunmoPro-Regular.ttf"),
  });
  const dayArray = ["일", "월", "화", "수", "목", "금", "토"];

  if (!isFontsLoaded) {
    return null;
  }

  SystemUI.setBackgroundColorAsync("#404040");

  useEffect(() => {
    const currentTime = new Date();

    if (currentTime && currentTime.getHours() >= 12) {
      setSelectedDayAndNight("오후");
      if (currentTime.getHours() === 12) {
        setSelectedHours(currentTime.getHours());
      } else {
        setSelectedHours(currentTime.getHours() - 12);
      }
    } else {
      setSelectedDayAndNight("오전");
      setSelectedHours(currentTime.getHours());
    }

    setSelectedMinutes(currentTime.getMinutes());
  }, []);

  const handleSelectedDayAndNight = () => {
    if (selectedDayAndNight === "오전") {
      setSelectedDayAndNight("오후");
    } else {
      setSelectedDayAndNight("오전");
    }
  };

  const handleHour = (upDown) => {
    if (selectedHours) {
      if (upDown === "up" && selectedHours < 12) {
        setSelectedHours(selectedHours + 1);
      } else if (upDown === "up" && selectedHours >= 12) {
        setSelectedHours(1);
      } else if (upDown === "down" && selectedHours > 1) {
        setSelectedHours(selectedHours - 1);
      } else if (upDown === "down" && selectedHours <= 1) {
        setSelectedHours(12);
      }
    }
  };

  const handleMinute = (upDown) => {
    if (selectedMinutes !== undefined) {
      if (upDown === "up" && selectedMinutes < 59) {
        setSelectedMinutes(selectedMinutes + 1);
      } else if (upDown === "up" && selectedMinutes >= 59) {
        setSelectedMinutes(0);
      } else if (upDown === "down" && selectedMinutes > 0) {
        setSelectedMinutes(selectedMinutes - 1);
      } else if (upDown === "down" && selectedMinutes <= 0) {
        setSelectedMinutes(59);
      }
    }
  };

  const saveAlarmTime = () => {
    const newSetTime = new Date();

    if (selectedDayAndNight === "오후") {
      newSetTime.setUTCHours(
        selectedHours === 12 ? 12 : selectedHours + 12,
        selectedMinutes
      );
    } else {
      newSetTime.setUTCHours(selectedHours, selectedMinutes);
    }

    setSaveAlarm({
      selectedTime: newSetTime,
      selectedDays: selectedDays,
      selectedTitle: alarmTitle,
    });
  };

  useEffect(() => {
    if (saveAlarm) {
      onAuthStateChanged(auth, (user) => {
        saveAlarmData(user.uid, saveAlarm);
      });

      router.replace("/AlarmList");
    }
  }, [saveAlarm]);

  const dayItems = dayArray.map((day) => {
    const isSelected = selectedDays.includes(day);

    const handleClickDay = () => {
      if (!selectedDays.includes(day)) {
        setSelectedDays([...selectedDays, day]);
      } else {
        const newSelectedDays = selectedDays.filter(
          (selectedDay) => selectedDay !== day
        );

        setSelectedDays(newSelectedDays);
      }
    };

    return (
      <TouchableOpacity key={day} onPress={handleClickDay}>
        <CustomText
          text={day}
          style={{ fontSize: 25, color: isSelected ? "#ffffff" : "#808080" }}
        />
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/AlarmList")}>
          <CustomText text="<" style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <CustomText
          text="알람 울릴 시간을 정해 주세요!"
          style={{ fontSize: 15 }}
        />
      </View>
      <View style={styles.alarmSettingBox}>
        <View style={styles.selectedTimeBox}>
          <TouchableOpacity
            onPress={handleSelectedDayAndNight}
            disabled={selectedDayAndNight === "오전"}
          >
            <CustomText
              text="△"
              textColor={selectedDayAndNight === "오전" ? "#808080" : "#ffffff"}
              style={{ fontSize: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleHour("down")}>
            <CustomText text="△" style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMinute("down")}>
            <CustomText text="△" style={{ fontSize: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.timeChange}>
          <CustomText
            text={selectedDayAndNight}
            style={{ fontSize: 25, marginLeft: 10 }}
          />
          <CustomText
            text={
              String(selectedHours).length !== 2
                ? `0${selectedHours}`
                : selectedHours
            }
            style={{ fontSize: 40, marginLeft: 15 }}
          />
          <CustomText text=":" style={{ fontSize: 40 }} />
          <CustomText
            text={
              String(selectedMinutes).length < 2
                ? `0${selectedMinutes}`
                : selectedMinutes
            }
            style={{ fontSize: 40 }}
          />
        </View>
        <View style={styles.selectedTimeBox}>
          <TouchableOpacity
            onPress={handleSelectedDayAndNight}
            disabled={selectedDayAndNight === "오후"}
          >
            <CustomText
              text="▽"
              textColor={selectedDayAndNight === "오후" ? "#808080" : "#ffffff"}
              style={{ fontSize: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleHour("up")}>
            <CustomText text="▽" style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMinute("up")}>
            <CustomText text="▽" style={{ fontSize: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedDayBox}>
          <CustomText text="요일" style={styles.selectedDayText} />
          <View style={styles.selectedDayItems}>{dayItems}</View>
        </View>
        <View style={styles.alarmTitleBox}>
          <CustomText text="알람 이름" style={styles.alarmTitleText} />
          <TextInput
            defaultValue={alarmTitle}
            placeholder="알람 이름을 입력해 주세요!"
            placeholderTextColor="#808080"
            style={styles.alarmTitleInput}
            onChangeText={(textValue) => setAlarmTitle(textValue)}
          />
        </View>
      </View>
      <CustomButton title="저장" onPress={saveAlarmTime} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    width: "85%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  alarmSettingBox: {
    flex: 20,
    width: "85%",
  },
  selectedTimeBox: {
    flex: 0.7,
    height: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 60,
    marginBottom: 10,
    marginLeft: 5,
  },
  timeChange: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    borderTopWidth: 2,
    borderTopColor: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
  },
  selectedDayBox: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  selectedDayText: {
    width: 320,
    textAlign: "center",
    padding: 10,
    fontSize: 25,
    borderBottomWidth: 2,
    borderColor: "#ffffff",
  },
  selectedDayItems: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  alarmTitleBox: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
  },
  alarmTitleText: {
    width: 320,
    textAlign: "center",
    padding: 10,
    fontSize: 25,
    borderBottomWidth: 2,
    borderColor: "#ffffff",
  },
  alarmTitleInput: {
    textAlign: "center",
    borderWidth: 0.5,
    borderColor: "#ffffff",
    width: "100%",
    height: 50,
    fontFamily: "Neo_Dunggeunmo",
    color: "#ffffff",
  },
});
