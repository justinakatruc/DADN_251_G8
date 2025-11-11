import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../model";

interface UserState {
  user: User | null;
  userDevices: string[];
  setUser: (user: User) => void;
  setUserDevices: (devices: string[]) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      userDevices: [],
      setUser: (user: User) => set({ user }),
      setUserDevices: (devices: string[]) => set({ userDevices: devices }),
      clear: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
