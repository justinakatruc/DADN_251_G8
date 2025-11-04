"use client"; //thêm để nhận function props/callback từ page.tsx r truyền xuống PillButton

import React, { useState } from "react";
import { Calendar, Clock, Plus } from "lucide-react";
import PillButton from "./PillButton";
import { useUserStore } from "../store/useUserStore";
import { mockDevices } from "../store/mockData";
import { toast } from "sonner";
import { useDevicesStore } from "../store/useDevicesStore";

interface TopBarProps {
  timestampItems?: string[];
  deviceItems?: string[];
  rightComponents?: React.ReactNode;
  showAddButton?: boolean;
  onChangeTimestamp?: (label: string) => void; //callback
  onChangeDevice?: (value: string) => void; //callback
}

/**
 * TopBar — SSR-safe component showing current date/time
 * and optional timestamp/device dropdowns.
 */

type FormErrors = {
  [key: string]: string;
};

export default function TopBar({
  timestampItems,
  deviceItems,
  rightComponents,
  showAddButton,
  onChangeTimestamp,
  onChangeDevice,
}: TopBarProps) {
  // SSR-safe date/time (runs on server)
  const now = new Date();
  const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [showAddDeviceMenu, setShowAddDeviceMenu] = useState(false);
  const { setDevices } = useDevicesStore();
  const [newDeviceName, setNewDeviceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { user } = useUserStore();

  const handleAddDevice = async () => {
    const newErrors: FormErrors = {};
    const trimmed = newDeviceName.trim();
    if (!trimmed) {
      newErrors.deviceName = "Device name is required.";
    }
    else if (trimmed.length > 50) {
      newErrors.deviceName = "Device name must be less than 50 characters.";
    }
    else if (/\s/.test(trimmed)) {
      newErrors.deviceName = "Device name must be a single word (no spaces).";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const existingDevices = mockDevices.map((device) => device.name.toLowerCase());
      if (existingDevices.includes(trimmed.toLowerCase())) {
        setErrors({ deviceName: "Device name already exists." });
        setIsSubmitting(false);
        toast.error("Device name already exists.");
        return;
      }

      mockDevices.push({ 
        id: mockDevices.length + 1,
        name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
        ownerId: user?.id || 0,
      });
      setDevices([...mockDevices]);
      setIsSubmitting(false);
      setShowAddDeviceMenu(false);
      setNewDeviceName("");
      toast.success("Device added successfully!");
    }, 1000);
  }

  return (
    <div className="flex flex-wrap items-center justify-between w-full p-4 gap-x-2 gap-y-4">
      {/* Left side: Date and Time */}
      <div className="flex items-center gap-9 text-[#4D4D4D] text-lg font-bold">
        <div className="flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-8 h-8" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Right side: Dropdowns and Add button */}
      {
        user && (
          <div className="flex items-center gap-3">
            {timestampItems && timestampItems.length > 0 && (
              <PillButton 
                label="Timestamp" 
                items={timestampItems}
                onChange={(v) => onChangeTimestamp?.(v)}
              />
            )} 

            {deviceItems && deviceItems.length > 0 && (
              <PillButton label="Device" items={deviceItems} onChange={(v) => onChangeDevice?.(v)}/>
            )}

            {rightComponents}

            {showAddButton && (
              <div className="relative">
                <div 
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-(--bg-button) text-white cursor-pointer hover:bg-(--bg-button-hover)"
                  onClick={() => setShowAddDeviceMenu(true)}
                >
                  <Plus className="w-6 h-6" strokeWidth={4} />
                </div>
                {showAddDeviceMenu && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50"
                    onClick={() => setShowAddDeviceMenu(false)}
                  >
                    <div 
                      className="bg-white rounded-[20px] max-w-[400px] w-full p-6 flex flex-col items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-2xl font-bold mb-4">Add New Device</h2>
                      <input 
                        type="text" 
                        placeholder="Device Name"
                        className="border border-gray-300 rounded-md p-2 w-full mb-4"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                      />
                      {errors.deviceName && (
                        <p className="text-red-500 mb-4">{errors.deviceName}</p>
                      )}
                      <button
                        className="bg-(--bg-button) text-white rounded-md px-4 py-2 w-full hover:bg-(--bg-button-hover) cursor-pointer"
                        onClick={handleAddDevice}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add Device"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }
    </div>
  );
}
