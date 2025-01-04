import { useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../components/CustomText";

export default function AddAlarm() {
  const [selectedHours, setSelectedHours] = useState(12);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedAmPm, setSelectedAmPm] = useState("오전");

  const hourScrollView = useRef(null);
  const minuteScrollView = useRef(null);
  const amPmScrollView = useRef(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const amPm = ["오전", "오후"];

  const ITEM_HEIGHT = 40;

  const onScrollHour = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedHours(hours[index % hours.length]);
  };

  const onScrollMinute = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedMinutes(minutes[index % minutes.length]);
  };

  const onScrollAmPm = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedAmPm(amPm[index % amPm.length]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.amPmPicker}>
          <ScrollView
            ref={amPmScrollView}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScroll={onScrollAmPm}
          >
            <View style={{ height: ITEM_HEIGHT }} />
            {amPm.map((value, index) => (
              <View key={index} style={styles.item}>
                <CustomText
                  text={value}
                  size={23}
                  textColor={value === selectedAmPm ? "#ffffff" : "#B0B0B0"}
                />
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT }} />
          </ScrollView>
        </View>

        <View style={styles.picker}>
          <ScrollView
            ref={hourScrollView}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScroll={onScrollHour}
          >
            <View style={{ height: ITEM_HEIGHT }} />
            {hours.map((hour, index) => (
              <View key={index} style={styles.item}>
                <CustomText
                  text={String(hour).padStart(2, "0")}
                  size={24}
                  textColor={hour === selectedHours ? "#ffffff" : "#B0B0B0"}
                />
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT }} />
          </ScrollView>
        </View>

        <CustomText text=":" size={40} />

        <View style={styles.picker}>
          <ScrollView
            ref={minuteScrollView}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScroll={onScrollMinute}
          >
            <View style={{ height: ITEM_HEIGHT }} />
            {minutes.map((minute, index) => (
              <View key={index} style={styles.item}>
                <CustomText
                  text={String(minute).padStart(2, "0")}
                  size={24}
                  textColor={minute === selectedMinutes ? "#ffffff" : "#B0B0B0"}
                />
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT }} />
          </ScrollView>
        </View>
      </View>

      <View style={styles.buttonBox}>
        <TouchableOpacity style={styles.button}>
          <CustomText text="요일" size={20} />
          <CustomText text=">" size={20} />
        </TouchableOpacity>
        <View style={styles.buttonBorder}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    height: 130,
    width: 80,
    overflow: "hidden",
    borderRadius: 12,
  },
  amPmPicker: {
    height: 130,
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
  buttonBox: {
    width: "65%",
    backgroundColor: "#909090",
    padding: 10,
    borderRadius: 10,
  },
  button: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
  },
});
