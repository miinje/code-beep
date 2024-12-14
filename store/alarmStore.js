import { create } from "zustand";

const alarmStore = create((set) => ({
  isTimeMatched: false,
  setIsTimeMatched: (state) => set({ isTimeMatched: state }),
}));

export default alarmStore;
