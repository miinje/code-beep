import { create } from "zustand";

const userStore = create((set) => ({
  userUid: null,
  userToken: null,
  userId: null,
  userRepoCodeData: {},
  setUserUid: (state) => set({ userUid: state }),
  setUserToken: (state) => set({ userToken: state }),
  setUserId: (state) => set({ userId: state }),
  setUserRepoCodeData: (state) => set({ userRepoCodeData: state }),
}));

export default userStore;
