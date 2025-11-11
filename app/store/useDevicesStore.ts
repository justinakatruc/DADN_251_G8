import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockDevices } from "./mockData";

interface Device {
  id: number;
  name: string;
  ownerId: number;
}

interface DevicesState {
    devices: Device[];
    setDevices: (devices: DevicesState["devices"]) => void;
    clear: () => void;
}

export const useDevicesStore = create<DevicesState>()(
  persist(
    (set) => ({
      devices: mockDevices,
      setDevices: (devices) => set({ devices }),
      clear: () => set({ devices: [] }),
    }),
    {
      name: "device-storage",
    }
  )
);
