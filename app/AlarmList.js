import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CustomText from "../components/CustomText";
import alarmStore from "../store/alarmStore";
import Header from "./components/Header";

export default function AlarmList() {
  const { allAlarmData } = alarmStore();

  const alarmItems =
    allAlarmData &&
    Object.keys(allAlarmData).map((key) => {
      const { selectedDays, selectedTime, selectedTitle } = allAlarmData[key];
      const currentTime = new Date(selectedTime);
      const alarmHour = currentTime.getHours() % 12 || 12;
      const alarmMinute = currentTime.getMinutes();
      const alarmDayNight = currentTime.getHours() < 12 ? "오전" : "오후";
      const allDay = ["일", "월", "화", "수", "목", "금", "토"];

      const dayItems = allDay.map((day) => {
        const isSelected = selectedDays.includes(day);

        return (
          <CustomText
            key={day}
            text={day}
            style={{ color: isSelected ? "#fff" : "#808080", fontSize: 10 }}
          />
        );
      });

      return (
        <Pressable key={`${selectedTime}`} style={styles.buttonBorder}>
          <CustomText
            text={selectedTitle}
            style={{ fontSize: 14, color: "#C5C5C5", margin: 5 }}
          />
          <View style={styles.slectedTimeBox}>
            <CustomText text={alarmDayNight} style={{ fontSize: 20 }} />
            <CustomText
              text={String(alarmHour).length < 2 ? "0" + alarmHour : alarmHour}
              style={{ fontSize: 30 }}
            />
            <CustomText text=":" style={{ fontSize: 30 }} />
            <CustomText
              text={
                String(alarmMinute).length < 2 ? "0" + alarmMinute : alarmMinute
              }
              style={{ fontSize: 30 }}
            />
            <View style={styles.dayItemsBox}>{dayItems}</View>
          </View>
        </Pressable>
      );
    });

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.alarmListBox}>
        {allAlarmData ? (
          <>
            <ScrollView
              style={{
                width: "95%",
                marginTop: 10,
              }}
            >
              {alarmItems}
            </ScrollView>
          </>
        ) : (
          <CustomText
            text="설정된 알람이 없습니다."
            style={{ fontSize: 20, color: "#C4C4C4" }}
          />
        )}
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
    margin: 40,
    gap: 10,
  },
  alarmListBox: {
    width: 340,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto",
  },
  alarmListTitleBox: {
    width: "100%",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
  },
  alarmListTitle: {
    width: 320,
    fontSize: 35,
    borderTopWidth: 3,
    borderColor: "#ffffff",
    padding: 10,
    textAlign: "center",
  },
  buttonBorder: {
    borderTopWidth: 1,
    borderTopColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 10,
    padding: 10,
  },
  slectedTimeBox: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 5,
    marginTop: 5,
  },
  dayItemsBox: {
    flex: 0.5,
    flexDirection: "row",
    gap: 7,
    marginLeft: 10,
  },
  addButton: {
    zIndex: 10,
    width: 10,
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonImg: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    flex: 0.1,
    left: 110,
    bottom: -50,
  },
});
