import { create } from "zustand";

const userStore = create((set) => ({
  userToken: null,
  userId: null,
  setUserToken: (state) => set({ userToken: state }),
  setUserId: (state) => set({ userId: state }),
}));

export default userStore;
