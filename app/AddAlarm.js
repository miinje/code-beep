import { useFonts } from "expo-font";
import * as SystemUI from "expo-system-ui";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/Custombutton";
import CustomText from "../components/CustomText";

export default function AddAlarm() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [alarmTitle, setAlarmTitle] = useState("알람");
  const [isFontsLoaded] = useFonts({
    Neo_Dunggeunmo: require("../assets/NeoDunggeunmoPro-Regular.ttf"),
  });
  const dayArray = ["일", "월", "화", "수", "목", "금", "토"];

  if (!isFontsLoaded) {
    return null;
  }

  SystemUI.setBackgroundColorAsync("#404040");

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

  const handlePlusHour = () => {
    if (selectedTime && selectedTime.getHours() < 23) {
      const newTimeDate = new Date();
      const hour = selectedTime.getHours();

      newTimeDate.setHours(hour + 1);

      setSelectedTime(newTimeDate);
    } else {
      const newTimeDate = new Date();

      newTimeDate.setHours(1);

      setSelectedTime(newTimeDate);
    }
  };

  const handleMinusHour = () => {
    if (selectedTime && selectedTime.getHours() > 1) {
      const newTimeDate = new Date();
      const hour = selectedTime.getHours();

      newTimeDate.setHours(hour - 1);

      setSelectedTime(newTimeDate);
    } else {
      const newTimeDate = new Date();

      newTimeDate.setHours(23);

      setSelectedTime(newTimeDate);
    }
  };

  const handlePlusMinute = () => {
    if (selectedTime && selectedTime.getMinutes() < 59) {
      const newTimeDate = new Date();
      const hour = selectedTime.getMinutes();

      newTimeDate.setMinutes(hour + 1);

      setSelectedTime(newTimeDate);
    } else {
      const newTimeDate = new Date();

      newTimeDate.setMinutes(0);

      setSelectedTime(newTimeDate);
    }
  };

  const handleMinusMinute = () => {
    if (selectedTime && selectedTime.getMinutes() > 0) {
      const newTimeDate = new Date();
      const hour = selectedTime.getMinutes();

      newTimeDate.setMinutes(hour - 1);

      setSelectedTime(newTimeDate);
    } else {
      const newTimeDate = new Date();

      newTimeDate.setMinutes(59);

      setSelectedTime(newTimeDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <CustomText text="<" style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <CustomText
          text="알람 울릴 시간을 정해 주세요!"
          style={{ fontSize: 15 }}
        />
      </View>
      <View style={styles.alarmSettingBox}>
        <View style={styles.selectedTimeBox}>
          <TouchableOpacity onPress={handlePlusHour}>
            <CustomText text="△" style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlusMinute}>
            <CustomText text="△" style={{ fontSize: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.timeChange}>
          <CustomText
            text={
              String(selectedTime.getHours()).length !== 2
                ? `0${selectedTime.getHours()}`
                : selectedTime.getHours()
            }
            style={{ fontSize: 40, marginLeft: 15 }}
          />
          <CustomText text=":" style={{ fontSize: 40 }} />
          <CustomText
            text={
              String(selectedTime.getMinutes()).length < 2
                ? `0${selectedTime.getMinutes()}`
                : selectedTime.getMinutes()
            }
            style={{ fontSize: 40 }}
          />
        </View>
        <View style={styles.selectedTimeBox}>
          <TouchableOpacity onPress={handleMinusHour}>
            <CustomText text="▽" style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMinusMinute}>
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
      <CustomButton title="저장" />
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
    marginLeft: 10,
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
