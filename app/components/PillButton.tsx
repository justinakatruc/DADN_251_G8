"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface PillButtonProps {
  label: string;
  items: string[];
  onChange?: (value: string) => void;   
}

/**
 * PillButton — Reusable pill-style dropdown button
 * with subtle focus and hover styling.
 */
export default function PillButton({ label, items, onChange }: PillButtonProps) {
  const [selected, setSelected] = useState(label === "Timestamp" ? items[1] : items[0]);
  const hasDropdown = items.length > 1;

  return (
    <>
      {hasDropdown ? (
        <Select 
          value={selected} 
          onValueChange={(v) => {
            setSelected(v);
            onChange?.(v);              // <-- phát sự kiện
          }}
        >
          <SelectTrigger
            className="
              flex items-center justify-between
              rounded-xl
              border border-[#E9E9E9]
              bg-white
              text-[--text-soft]
              text-lg
              lg:min-w-[20rem]
              min-w-[13rem]
              px-4 py-5
              shadow-none
              hover:border-[#CFCFCF]
              transition
              cursor-pointer
            "
          >
            <div className="flex items-center">
              <span className="font-normal mr-1">{label}:</span>
              <SelectValue className="font-medium" />
            </div>
          </SelectTrigger>

          <SelectContent
            className="
              border border-gray-200
              bg-white
              rounded-md
              shadow-md
              text-sm
            "
          >
            {items.map((item) => (
              <SelectItem
                key={item}
                value={item}
                className="cursor-pointer hover:bg-gray-100"
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center rounded-xl border border-[#E9E9E9] bg-white text-[--text-soft] text-md min-w-[150px] px-3 py-1.5">
          <span className="font-normal mr-1">{label}:</span>
          <span className="font-medium">{selected}</span>
        </div>
      )}
    </>
  );
}
