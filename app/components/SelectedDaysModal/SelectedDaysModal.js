import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import CustomText from "../CustomText/CustomText";
import {
  convertingNumberDay,
  convertingStringDay,
} from "../../../utils/convertingDay";
import styles from "./styles";

export default function SelectedDaysModal({
  isOpenDayModal,
  setIsOpenDayModal,
  selectedDays,
  setSelectedDays,
}) {
  const allDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handleSelectedDay = (day) => {
    if (!selectedDays.includes(day)) {
      selectedDays.push(day);

      const sortingSelectedList = selectedDays
        .map((day) => convertingNumberDay(day))
        .sort((a, b) => a - b)
        .map((day) => convertingStringDay(day));

      setSelectedDays([...sortingSelectedList]);
    } else {
      const spliceSelectedDays = selectedDays.filter((value) => value !== day);

      setSelectedDays(spliceSelectedDays);
    }
  };

  const daysItem = allDays.map((day) => {
    const isSelected = selectedDays.includes(day);

    return (
      <React.Fragment key={day}>
        <TouchableOpacity
          style={{
            width: 300,
            flex: 0,
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
          }}
          onPress={() => handleSelectedDay(day)}
        >
          <CustomText text={`${day}요일`} size={15} />
          {isSelected && <Text style={styles.checkIcon}>✓</Text>}
        </TouchableOpacity>
        <View
          style={{
            width: 300,
            borderBottomColor: "#6e6f6f",
            borderBottomWidth: 1,
          }}
        ></View>
      </React.Fragment>
    );
  });

  return (
    <Modal
      style={styles.modal}
      animationType="slide"
      transparent={true}
      visible={isOpenDayModal}
      onRequestClose={() => {
        setIsOpenDayModal(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CustomText text="요일 선택" size={20} />
          <View>{daysItem}</View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsOpenDayModal(false);
            }}
          >
            <Text style={styles.textStyle}>선택 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
