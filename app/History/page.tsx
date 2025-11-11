"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from 'lucide-react';
import TopBar from "@/app/components/TopBar";
import { useUserStore } from "../store/useUserStore";
import { baseData } from "../store/mockData";
import { Metric, Row } from "../model";
import { useDevicesStore } from "../store/useDevicesStore";

//thay data fetch vào đây

const metrics: Metric[] = ["Temperature", "Humidity", "Light", "PIR"];

export default function HistoryPage() {
  const { user, userDevices } = useUserStore();
  const [seed, setSeed] = useState<Row[]>([]);
  const [activeTab, setActiveTab] = useState<Metric>("Temperature");
  const [timestampFilter, setTimestampFilter] = useState<"All" | "Month" | "Week" | "Day">("Month");
  const [editing, setEditing] = useState(false);
  const { devices } = useDevicesStore();
  const deviceList = user ? [
    "All",
    ...devices
    .filter(device => device.ownerId === user.id)
    .map(device => device.name)
  ] : ['All'];
  
  const [deviceFilter, setDeviceFilter] = useState<string>("All");

  useEffect(() => {
    if (user) {
      setSeed([]);

      if (userDevices.length > 0) {
        userDevices.forEach(deviceName => {
          baseData.forEach(dataRow => {
            if (dataRow.device === deviceName) {
              setSeed(prev => [...prev, dataRow]);
            }
          });
        })
      }
    }
  }, [user, userDevices]);

  const data = useMemo(() => {
    let rows = seed.filter(r => r.sensor === activeTab);
    if (deviceFilter !== "All") rows = rows.filter(r => r.device === deviceFilter);
    // nếu cần lọc theo mốc thời gian (giả lập “N phút trước” quanh 09:00)
    const baseline = Date.parse("2025-09-30T09:00:00");
    if (timestampFilter !== "All") {
      const n =
        timestampFilter === "Day" ? 1 :
        timestampFilter === "Week" ? 7 :
        30;
        const range = n * 24 * 60 * 60 * 1000;
        rows = rows.filter(r => r.ts >= baseline - range);
      }
    return rows.sort((a,b) => b.ts - a.ts);
  }, [activeTab, deviceFilter, timestampFilter, seed]);

  const handleDownloadCSV = () => {
    const header = "Device,Sensor,Value,Date\n";
    const body = data.map(r => [r.device, r.sensor, r.value, new Date(r.date).toLocaleString()].join(",")).join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history_${activeTab.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleData = (id: string) => {
    setSeed(prev => prev.filter(r => r.id !== id));
  }

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-5 border-b border-black/10">
        <h1 className="text-2xl font-bold">History</h1>
        <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <Image src="/icons/download.png" alt="Download" width={20} height={20} />
          <span className="font-semibold text-[#4D4D4D] text-[13px]">Download</span>
        </button>
      </div>

      {/* TopBar */}
      <TopBar
        timestampItems={["All", "Month", "Week", "Day"]}
        deviceItems={deviceList}
        showAddButton={false}
        onChangeTimestamp={(label) => setTimestampFilter(label.startsWith("A") ? "All" : (label.split(" ")[0] as "Month"|"Week"|"Day"))}
        onChangeDevice={(v: string) => setDeviceFilter(v)}
      />

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex gap-6 border-b border-gray-200">
          {metrics.map(m => (
            <button
              key={m}
              onClick={() => setActiveTab(m)}
              className={`pb-2 -mb-px text-sm font-medium cursor-pointer ${
                activeTab === m ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Table + Edit */}
        <div className="mt-4">
          <div className="flex justify-end">
            {
              user && (
                <button
                  onClick={() => setEditing(v => !v)}
                  className="px-4 py-2 text-sm font-semibold cursor-pointer bg-[#4C6FFF] text-white rounded-lg hover:opacity-90"
                >
                  {editing ? "Done" : "Edit"}
                </button>
              )
            }
          </div>

          {
            !user && (
              <div className="w-full h-[500px] flex items-center justify-center">
                <Image src="/icons/yolohome.png" alt="Yolo Home" width={225} height={225} />
              </div>
            )
          }

          {
            user && (
              <div className="mt-3 rounded-2xl border border-gray-200 max-h-[500px] overflow-y-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 text-left text-sm">
                    <tr>
                      <th className="px-6 py-3 w-[25%] border">Device</th>
                      <th className="px-6 py-3 w-[25%] border">Sensor</th>
                      <th className="px-6 py-3 w-[25%] border">Value</th>
                      <th className="px-6 py-3 w-[25%] border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td className="px-6 py-6 text-center text-gray-400 border" colSpan={4}>No data</td>
                      </tr>
                    ) : (
                      data.map((r, index) => (
                        <tr key={index} className="text-sm">
                          <td className="px-2 md:px-4 lg:px-6 py-3 border">
                            <div className="flex flex-wrap gap-x-2">
                              <div className="font-medium">
                                {r.device}
                              </div>
                              {
                                editing && (
                                  <button
                                    className="size-[20px] rounded-full border flex items-center justify-center bg-[#FF5C5C] hover:opacity-90 cursor-pointer"
                                    onClick={() => {
                                      handleData(r.id);
                                    }}
                                  >
                                    <X className="text-white" size={16} />
                                  </button>
                                )
                              }
                            </div>
                          </td>
                          <td className="px-2 md:px-4 lg:px-6 py-3 border">{r.sensor}</td>
                          <td className="px-2 md:px-4 lg:px-6 py-3 border">
                            {editing ? (
                              <input
                                className="w-24 rounded-md border px-2 py-1"
                                defaultValue={String(r.value)}
                                onBlur={(e) => { r.value = e.target.value; /* TODO: gọi API cập nhật */ }}
                              />
                            ) : (
                              r.value
                            )}
                          </td>
                          <td className="px-2 md:px-4 lg:px-6 py-3 border">{new Date(r.date).toISOString().replace("T", " ").slice(0, 19)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
