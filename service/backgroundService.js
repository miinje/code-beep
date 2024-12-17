import { router } from "expo-router";
import BackgroundService from "react-native-background-actions";
import { convertingDay } from "../utils/convertingDay";

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const checkTimeInBackground = async (taskDataArguments) => {
  const { allAlarmData, delay } = taskDataArguments;

  const checkingAlarm = {};

  try {
    while (true) {
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentDays = currentTime.getDay();

      for (const key in allAlarmData) {
        const { selectedTime, selectedDays, selectedTitle } = allAlarmData[key];
        const convertedSelectedTime = new Date(selectedTime);
        const convertedDays = [...selectedDays].filter(
          (value) => value !== ","
        );

        convertedDays.forEach((day, index) => {
          const dayToNumberValue = convertingDay(day);
          convertedDays[index] = dayToNumberValue;
        });
        if (
          convertedDays.includes(currentDays) &&
          convertedSelectedTime.getHours() === currentHours &&
          convertedSelectedTime.getMinutes() === currentMinutes
        ) {
          checkingAlarm[selectedTime] = selectedTime;
          checkingAlarm[selectedDays] = selectedDays;
          checkingAlarm[selectedTitle] = selectedTitle;

          router.replace("/ActionAlarm");
        }
      }

      await sleep(delay);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const startBackgroundTask = async (allAlarmData) => {
  if (allAlarmData !== null) {
    const options = {
      taskName: "Wake Up!!!",
      taskTitle: "일어날 시간이에요!",
      taskDesc: "어쩌구",
      taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
      },
      color: "#404040",
      linkURL: "codebeep://ActionAlarm",
      parameters: { allAlarmData: allAlarmData, delay: 1000 },
      startForeground: true,
      allowExecutionInForeground: true,
    };

    try {
      await BackgroundService.start(checkTimeInBackground, options);
    } catch (error) {
      console.error(error.message);
    }
  }
};

export const stopBackgroundTask = async () => {
  try {
    await BackgroundService.stop();
  } catch {
    console.error(error.message);
  }
};

export const isBackgroundTaskRunning = () => {
  return BackgroundService.isRunning();
};
