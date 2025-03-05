import { create } from "zustand";

const alarmStore = create((set) => ({
  allAlarmData: null,
  isTimeMatched: false,
  currentTime: new Date(),
  isActivateEdit: false,
  isDeleteAlarm: false,
  setAllAlarmData: (state) => set({ allAlarmData: state }),
  setIsTimeMatched: (state) => set({ isTimeMatched: state }),
  setCurrentTime: (state) => set({ currentTime: state }),
  setIsActivateEdit: (state) => set({ isActivateEdit: state }),
  setIsDeleteAlarm: (state) => set({ isDeleteAlarm: state }),
}));

export default alarmStore;
