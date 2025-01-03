import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";
import { auth, saveAlarmData } from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";

export default function AddAlarm() {
  const { allAlarmData, setAllAlarmData } = alarmStore();
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedHours, setSelectedHours] = useState(null);
  const [selectedMinutes, setSelectedMinutes] = useState(null);
  const [selectedDayAndNight, setSelectedDayAndNight] = useState(null);
  const [saveAlarm, setSaveAlarm] = useState(null);
  const [alarmTitle, setAlarmTitle] = useState("알람");
  const dayArray = ["일", "월", "화", "수", "목", "금", "토"];

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
    if (selectedHours !== undefined) {
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
      newSetTime.setHours(
        selectedHours === 12 ? 12 : selectedHours + 12,
        selectedMinutes
      );
    } else {
      newSetTime.setHours(selectedHours, selectedMinutes);
    }

    const newData = {
      selectedTime: newSetTime,
      selectedDays: selectedDays,
      selectedTitle: alarmTitle,
    };

    setSaveAlarm(newData);
  };

  useEffect(() => {
    if (saveAlarm) {
      onAuthStateChanged(auth, async (user) => {
        saveAlarmData(user.uid, saveAlarm);
      });

      setAllAlarmData({ ...allAlarmData, saveAlarm });

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
          size={25}
          textColor={isSelected ? "#ffffff" : "#808080"}
        />
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/AlarmList")}>
          <CustomText text="<" size={30} />
        </TouchableOpacity>
        <CustomText text="알람 울릴 시간을 정해 주세요!" />
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
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleHour("down")}>
            <CustomText text="△" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMinute("down")}>
            <CustomText text="△" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.timeChange}>
          <CustomText
            text={selectedDayAndNight}
            size={25}
            style={{ fontSize: 25, marginLeft: 10 }}
          />
          <CustomText
            text={
              String(selectedHours).length !== 2
                ? `0${selectedHours}`
                : selectedHours
            }
            size={40}
            // style={{ fontSize: 40, marginLeft: 15 }}
          />
          <CustomText text=":" size={40} />
          <CustomText
            text={
              String(selectedMinutes).length < 2
                ? `0${selectedMinutes}`
                : selectedMinutes
            }
            size={40}
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
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleHour("up")}>
            <CustomText text="▽" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMinute("up")}>
            <CustomText text="▽" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedDayBox}>
          <View style={styles.selectedDayItems}>{dayItems}</View>
        </View>
        <View style={styles.alarmTitleBox}>
          <TextInput
            defaultValue={alarmTitle}
            placeholder="알람 이름을 입력해 주세요!"
            placeholderTextColor="#808080"
            style={styles.alarmTitleInput}
            onChangeText={(textValue) => setAlarmTitle(textValue)}
          />
        </View>
      </View>
      <CustomButton
        title="저장"
        onPress={saveAlarmTime}
        disabled={selectedDays.length === 0}
      />
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
  alarmTitleInput: {
    width: 320,
    textAlign: "center",
    padding: 10,
    fontSize: 25,
    borderBottomWidth: 2,
    borderColor: "#ffffff",
  },
});
