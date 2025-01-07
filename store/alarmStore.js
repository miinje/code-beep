import { create } from "zustand";

const alarmStore = create((set) => ({
  allAlarmData: null,
  isTimeMatched: false,
  currentTime: new Date(),
  alarmQuiz: null,
  setAllAlarmData: (state) => set({ allAlarmData: state }),
  setIsTimeMatched: (state) => set({ isTimeMatched: state }),
  setCurrentTime: (state) => set({ currentTime: state }),
  setAlarmQuiz: (state) => set({ alarmQuiz: state }),
}));

export default alarmStore;
