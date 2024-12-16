import { create } from "zustand";

const alarmStore = create((set) => ({
  allAlarmData: null,
  isTimeMatched: false,
  currentTime: new Date(),
  setAllAlarmData: (state) => set({ allAlarmData: state }),
  setIsTimeMatched: (state) => set({ isTimeMatched: state }),
  setCurrentTime: (state) => set({ currentTime: state }),
}));

export default alarmStore;
