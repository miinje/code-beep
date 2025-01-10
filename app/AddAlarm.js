import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";
import { auth, getAlarmData, saveAlarmData } from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";
import { convertingStringDay } from "../utils/convertingDay";
import onScroll from "../utils/onScroll";
import SelectedDays from "./components/SelectedDays";

export default function AddAlarm() {
  const { setAllAlarmData } = alarmStore();
  const [selectedHours, setSelectedHours] = useState(new Date().getHours());
  const [selectedMinutes, setSelectedMinutes] = useState(
    new Date().getMinutes()
  );
  const [selectedDays, setSelectedDays] = useState([
    convertingStringDay(new Date().getDay()),
  ]);
  const [selectedAmPm, setSelectedAmPm] = useState(
    new Date().getHours() < 12 ? "오전" : "오후"
  );
  const [isOpenDayModal, setIsOpenDayModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("알람");
  const [saveAlarm, setSaveAlarm] = useState(null);
  const hourScrollView = useRef(null);
  const minuteScrollView = useRef(null);
  const amPmScrollView = useRef(null);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const amPm = ["오전", "오후"];
  const ITEM_HEIGHT = 40;

  const clickhandleDayModal = () => {
    setIsOpenDayModal(true);
  };

  const handleClickSaveData = () => {
    const newSetTime = new Date();

    if (selectedAmPm === "오후") {
      newSetTime.setHours(
        selectedHours === 12 ? 12 : selectedHours + 12,
        selectedMinutes
      );
    } else {
      newSetTime.setHours(
        selectedHours === 12 ? 0 : selectedHours,
        selectedMinutes
      );
    }

    setSaveAlarm({
      selectedTime: newSetTime,
      selectedDays:
        selectedDays.length === 0
          ? [convertingStringDay(newSetTime.getDay())]
          : selectedDays,
      selectedTitle: selectedTitle,
    });
  };

  useEffect(() => {
    if (saveAlarm) {
      onAuthStateChanged(auth, async (user) => {
        saveAlarmData(user.uid, saveAlarm);

        const getAllalarmData = await getAlarmData(user.uid);

        setAllAlarmData(getAllalarmData);
      });

      router.replace("/AlarmList");
    }
  }, [saveAlarm]);

  const selecteDaysList = selectedDays.map((day) => {
    return <CustomText key={day} text={day} size={14} textColor="#ffffff" />;
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleAddText}>
        <CustomText text="알람 설정" size={25} />
      </View>
      <View style={styles.pickerContainer}>
        <View style={styles.amPmPicker}>
          <ScrollView
            ref={amPmScrollView}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="normal"
            showsVerticalScrollIndicator={false}
            onScroll={(event) => onScroll(event, amPm, setSelectedAmPm)}
            contentOffset={{
              y: amPm.indexOf(selectedAmPm) * ITEM_HEIGHT,
            }}
          >
            <View style={{ height: ITEM_HEIGHT * 2 }} />
            {amPm.map((value, index) => (
              <View key={index} style={styles.item}>
                <CustomText
                  text={value}
                  size={23}
                  textColor={value === selectedAmPm ? "#ffffff" : "#B0B0B0"}
                />
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT * 2 }} />
          </ScrollView>
        </View>

        <View style={styles.picker}>
          <ScrollView
            ref={hourScrollView}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScroll={(event) => onScroll(event, hours, setSelectedHours)}
            contentOffset={{
              y:
                (selectedHours % 12 === 0 ? 11 : (selectedHours % 12) - 1) *
                ITEM_HEIGHT,
            }}
          >
            <View style={{ height: ITEM_HEIGHT * 2 }} />
            {hours.map((hour, index) => (
              <View key={index} style={styles.item}>
                <CustomText
                  text={String(hour).padStart(2, "0")}
                  size={25}
                  textColor={hour === selectedHours ? "#ffffff" : "#B0B0B0"}
                />
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT * 2 }} />
          </ScrollView>
        </View>

        <View style={styles.timeStamp}>
          <CustomText text=":" size={35} />
        </View>

        <View style={styles.picker}>
          <ScrollView
            ref={minuteScrollView}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="normal"
            showsVerticalScrollIndicator={false}
            onScroll={(event) => onScroll(event, minutes, setSelectedMinutes)}
            contentOffset={{
              y: minutes.indexOf(selectedMinutes) * ITEM_HEIGHT,
            }}
          >
            <View style={{ height: ITEM_HEIGHT * 2 }} />
            {minutes.map((minute, index) => (
              <View key={index} style={styles.item}>
                <CustomText
                  text={String(minute).padStart(2, "0")}
                  size={25}
                  textColor={minute === selectedMinutes ? "#ffffff" : "#B0B0B0"}
                />
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT * 2 }} />
          </ScrollView>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button} onPress={clickhandleDayModal}>
            <CustomText text="요일" size={13} />
            <View
              style={{
                position: "absolute",
                flexGrow: 1,
                flexDirection: "row",
                gap: 5,
                right: 30,
              }}
            >
              {selecteDaysList}
            </View>
            <CustomText text=">" size={13} />
          </TouchableOpacity>
          <View style={styles.buttonBorder}></View>
          <View style={styles.button} pointerEvents="auto">
            <CustomText text="이름" size={13} />
            <TextInput
              value={selectedTitle}
              onChangeText={setSelectedTitle}
              style={{
                color: "#ffffff",
                width: 200,
                flex: 0,
                justifyContent: "flex-end",
                textAlign: "right",
                fontSize: 14,
              }}
            />
          </View>
        </View>
        <View style={styles.saveButtonContainer}>
          <CustomButton title="저장하기" onPress={handleClickSaveData} />
        </View>
      </View>

      {isOpenDayModal && (
        <SelectedDays
          isOpenDayModal={isOpenDayModal}
          setIsOpenDayModal={setIsOpenDayModal}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#404040",
    width: "100%",
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    paddingTop: 20,
    gap: 10,
  },
  titleAddText: {
    width: "80%",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  pickerContainer: {
    width: 300,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
    borderTopColor: "#ffffff",
    borderTopWidth: 1,
  },
  picker: {
    height: 200,
    width: 100,
    overflow: "hidden",
    borderRadius: 12,
  },
  amPmPicker: {
    height: 200,
    width: 100,
    overflow: "hidden",
    borderRadius: 12,
    marginRight: -20,
  },
  item: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  timeStamp: {
    marginBottom: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 0,
    width: "80%",
  },
  buttonBox: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#909090",
    borderRadius: 10,
  },
  button: {
    flex: 0,
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  buttonBorder: {
    width: "95%",
    flex: 0,
    textAlign: "center",
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
  },
  saveButtonContainer: {
    height: "58%",
    flex: 0,
    justifyContent: "flex-end",
  },
});
