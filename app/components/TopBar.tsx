import React from "react";
import { Calendar, Clock, Plus } from "lucide-react";
import PillButton from "./PillButton";

interface TopBarProps {
  timestampItems?: string[];
  deviceItems?: string[];
  rightComponents?: React.ReactNode;
  showAddButton?: boolean;
}

/**
 * TopBar — SSR-safe component showing current date/time
 * and optional timestamp/device dropdowns.
 */
export default function TopBar({
  timestampItems,
  deviceItems,
  rightComponents,
  showAddButton,
}: TopBarProps) {
  // SSR-safe date/time (runs on server)
  const now = new Date();
  const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex flex-wrap items-center justify-between w-full p-4">
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
      <div className="flex items-center gap-3">
        {timestampItems && timestampItems.length > 0 && (
          <PillButton label="Timestamp" items={timestampItems} />
        )}

        {deviceItems && deviceItems.length > 0 && (
          <PillButton label="Device" items={deviceItems} />
        )}

        {rightComponents}

        {showAddButton && (
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-(--bg-button) text-white cursor-pointer hover:bg-(--bg-button-hover)">
            <Plus className="w-6 h-6" strokeWidth={4} />
          </div>
        )}
      </div>
    </div>
  );
}
