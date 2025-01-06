import { create } from "zustand";

const userStore = create((set) => ({
  userUid: null,
  userRepoCodeData: {},
  setUserUid: (state) => set({ userUid: state }),
  setUserRepoCodeData: (state) => set({ userRepoCodeData: state }),
}));

export default userStore;
