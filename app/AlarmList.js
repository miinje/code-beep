import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { deleteAlarmData, getAlarmData } from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";
import userStore from "../store/userStore";
import { convertingStringDay } from "../utils/convertingDay";
import parsingCode from "../utils/parsingCode";
import CustomText from "./components/CustomText/CustomText";
import Header from "./components/Header/Header";
import { alarmListStyles } from "./styles";

export default function AlarmList() {
  const {
    allAlarmData,
    isTimeMatched,
    currentTime,
    isActivateEdit,
    isDeleteAlarm,
    setAllAlarmData,
    setIsTimeMatched,
    setCurrentTime,
    setAlarmQuiz,
    setIsDeleteAlarm,
  } = alarmStore();
  const [isIncludedDay, setIncludedDay] = useState(false);
  const { userUid, userRepoCodeData } = userStore();
  const [deletedAlarms, setDeletedAlarms] = useState([]);

  useEffect(() => {
    const currentDay = convertingStringDay(new Date().getDay());

    for (const data in allAlarmData) {
      const { selectedDays } = allAlarmData[data];
      const convertedDays = [...selectedDays].filter((value) => value !== ",");

      if (convertedDays.includes(currentDay)) {
        setIncludedDay(true);
      }
    }
  }, [allAlarmData]);

  useEffect(() => {
    const code = userRepoCodeData.fileContent.split("\n");
    const funcStartIndex = code.findIndex(
      (str) => str.includes("function") || str.includes("=>")
    );
    let funcCode = code.slice(funcStartIndex).join("\n").trimEnd();

    if (funcCode.endsWith(";")) {
      funcCode = funcCode.slice(0, funcCode.length - 1);
    }

    if (
      !funcCode.startsWith("var") &&
      !funcCode.startsWith("let") &&
      !funcCode.startsWith("const") &&
      !funcCode.includes("=>")
    ) {
      funcCode = funcCode.slice(funcCode.indexOf("function"));
    }

    setAlarmQuiz(parsingCode(funcCode));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isIncludedDay) {
      for (const data in allAlarmData) {
        const { selectedTime } = allAlarmData[data];
        const convertedSelectedTime = new Date(selectedTime);

        if (
          convertedSelectedTime.getHours() === currentTime.getHours() &&
          convertedSelectedTime.getMinutes() === currentTime.getMinutes() &&
          currentTime.getSeconds() === 0
        ) {
          setIsTimeMatched(true);
        }
      }
    }
  }, [currentTime, allAlarmData, isIncludedDay]);

  useEffect(() => {
    if (isDeleteAlarm) {
      const deleteAlarmDatas = async () => {
        deletedAlarms.map(async (dataId) => {
          await deleteAlarmData(userUid, dataId);
        });

        const getAllalarmData = await getAlarmData(userUid);

        setAllAlarmData(getAllalarmData);
        setDeletedAlarms([]);
        setIsDeleteAlarm(false);
      };

      deleteAlarmDatas();
    }
  }, [isDeleteAlarm]);

  useEffect(() => {
    if (isTimeMatched) {
      router.replace("/ActionAlarm");
    }
  }, [isTimeMatched]);

  const alarmItems =
    allAlarmData &&
    Object.keys(allAlarmData)
      .sort((a, b) => a - b)
      .map((key) => {
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
              size={10}
              textColor={isSelected ? "#fff" : "#808080"}
            />
          );
        });

        return (
          <TouchableOpacity
            key={`${selectedTime}`}
            style={[
              alarmListStyles.buttonBox,
              {
                backgroundColor: !deletedAlarms.includes(selectedTime)
                  ? "#565656"
                  : "#373737",
              },
            ]}
            disabled={!isActivateEdit}
            onPress={() => {
              if (!deletedAlarms.includes(selectedTime)) {
                setDeletedAlarms([...deletedAlarms, selectedTime]);
              } else {
                const newDeletedAlarms = deletedAlarms.filter(
                  (data) => data !== selectedTime
                );

                setDeletedAlarms(newDeletedAlarms);
              }
            }}
          >
            <CustomText text={selectedTitle} size={12} textColor="#C5C5C5" />
            <View style={alarmListStyles.slectedTimeBox}>
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <View style={{ paddingBottom: 3, marginRight: -3 }}>
                  <CustomText
                    text={alarmDayNight}
                    size={16}
                    textColor={
                      !deletedAlarms.includes(selectedTime)
                        ? "#ffffff"
                        : "#C0C0C0"
                    }
                  />
                </View>
                <CustomText
                  text={
                    String(alarmHour).length < 2 ? "0" + alarmHour : alarmHour
                  }
                  size={30}
                  textColor={
                    !deletedAlarms.includes(selectedTime)
                      ? "#ffffff"
                      : "#C0C0C0"
                  }
                />
                <CustomText
                  text=":"
                  size={30}
                  textColor={
                    !deletedAlarms.includes(selectedTime)
                      ? "#ffffff"
                      : "#C0C0C0"
                  }
                />
                <CustomText
                  text={
                    String(alarmMinute).length < 2
                      ? "0" + alarmMinute
                      : alarmMinute
                  }
                  size={30}
                  textColor={
                    !deletedAlarms.includes(selectedTime)
                      ? "#ffffff"
                      : "#C0C0C0"
                  }
                />
              </View>
              <View style={alarmListStyles.dayItemsBox}>{dayItems}</View>
            </View>
          </TouchableOpacity>
        );
      });

  return (
    <View style={alarmListStyles.container}>
      <View style={alarmListStyles.headerContainer}>
        <Header
          deletedAlarms={deletedAlarms}
          setDeletedAlarms={setDeletedAlarms}
        />
      </View>
      <View style={alarmListStyles.alarmListBox}>
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
            size={20}
            textColor="#C4C4C4"
          />
        )}
      </View>
    </View>
  );
}
