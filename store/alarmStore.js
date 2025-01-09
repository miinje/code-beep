import { create } from "zustand";

const alarmStore = create((set) => ({
  allAlarmData: null,
  isTimeMatched: false,
  isActivateEdit: false,
  isDeleteAlarm: false,
  currentTime: new Date(),
  alarmQuiz: null,
  setAllAlarmData: (state) => set({ allAlarmData: state }),
  setIsTimeMatched: (state) => set({ isTimeMatched: state }),
  setCurrentTime: (state) => set({ currentTime: state }),
  setAlarmQuiz: (state) => set({ alarmQuiz: state }),
  setIsActivateEdit: (state) => set({ isActivateEdit: state }),
  setIsDeleteAlarm: (state) => set({ isDeleteAlarm: state }),
}));

export default alarmStore;
