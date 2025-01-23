import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../components/CustomText";
import {
  deleteAlarmData,
  getAlarmData,
  getReposCodeData,
} from "../firebaseConfig.mjs";
import alarmStore from "../store/alarmStore";
import userStore from "../store/userStore";
import { fetchFileContent } from "../utils/api";
import { convertingStringDay } from "../utils/convertingDay";
import { makeQuizFunction } from "../utils/makeQuizFunction";
import Header from "./components/Header/Header";

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
  const { userUid, userRepoCodeData, setUserRepoCodeData } = userStore();
  const [deletedAlarms, setDeletedAlarms] = useState([]);

  useEffect(() => {
    if (userRepoCodeData) {
      Object.keys(userRepoCodeData).map((repoName) => {
        const repoFiles = userRepoCodeData[repoName];

        repoFiles.map(async (data) => {
          const path = data.path;

          if (path === "utils/convertingDay.js") {
            const codeString = await fetchFileContent(data.download_url);
            const funcQuiz = makeQuizFunction(codeString, data.path);

            setAlarmQuiz(funcQuiz);
          }
        });
      });
    }
  }, [userRepoCodeData]);

  useEffect(() => {
    if (userRepoCodeData) {
      const getCodeData = async () => {
        const codeData = await getReposCodeData(userUid);
        const newCodeData = {};

        Object.keys(codeData).map((key) => {
          const newCodeDataArray = codeData[key].filter((data) => data);

          newCodeData[key] = newCodeDataArray;
        });

        setUserRepoCodeData(newCodeData);
      };

      getCodeData();
    }
  }, []);

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
              styles.buttonBox,
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
            <View style={styles.slectedTimeBox}>
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
              <View style={styles.dayItemsBox}>{dayItems}</View>
            </View>
          </TouchableOpacity>
        );
      });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          deletedAlarms={deletedAlarms}
          setDeletedAlarms={setDeletedAlarms}
        />
      </View>
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
            size={20}
            textColor="#C4C4C4"
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
    gap: 2,
  },
  headerContainer: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
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
  buttonBox: {
    height: 90,
    borderRadius: 10,
    shadowColor: "#242424",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 10,
    padding: 10,
  },
  slectedTimeBox: {
    width: "70%",
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginLeft: 5,
    marginTop: 2,
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
