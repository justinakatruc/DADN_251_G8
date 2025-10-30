"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AppLayout from "@/app/components/AppLayout";
import TopBar from "@/app/components/TopBar";

// ===== Demo data (thay bằng fetch API của bạn) =====
type Metric = "Temperature" | "Humidity" | "Light" | "PIR";
type Row = { id: string; device: string; sensor: Metric; value: string | number; date: string; ts: number };

const seed: Row[] = [
  { id: "1", device: "Device A", sensor: "Temperature", value: 27.6, date: "2025-09-30T08:58:00", ts: Date.parse("2025-09-30T08:58:00") },
  { id: "2", device: "Device A", sensor: "Humidity",    value: 63,   date: "2025-09-30T08:59:00", ts: Date.parse("2025-09-30T08:59:00") },
  { id: "3", device: "Device B", sensor: "Light",        value: 312,  date: "2025-09-30T09:00:00", ts: Date.parse("2025-09-30T09:00:00") },
  { id: "4", device: "Device B", sensor: "PIR",          value: "motion", date:"2025-09-30T09:01:00", ts: Date.parse("2025-09-30T09:01:00") },
  { id: "5", device: "Device A", sensor: "Temperature", value: 27.9, date: "2025-09-30T09:02:00", ts: Date.parse("2025-09-30T09:02:00") },
]; //thay data fetch vào đây

const metrics: Metric[] = ["Temperature", "Humidity", "Light", "PIR"];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<Metric>("Temperature");
  const [timestampFilter, setTimestampFilter] = useState<"All" | "5" | "10" | "15">("All");
  const [deviceFilter, setDeviceFilter] = useState<"All" | "Device A" | "Device B">("All");
  const [editing, setEditing] = useState(false);

  const data = useMemo(() => {
    let rows = seed.filter(r => r.sensor === activeTab);
    if (deviceFilter !== "All") rows = rows.filter(r => r.device === deviceFilter);
    // nếu cần lọc theo mốc thời gian (giả lập “N phút trước” quanh 09:00)
    const baseline = Date.parse("2025-09-30T09:00:00");
    if (timestampFilter !== "All") {
      const n = Number(timestampFilter) * 60 * 1000;
      rows = rows.filter(r => r.ts >= baseline - n && r.ts <= baseline);
    }
    return rows.sort((a,b) => b.ts - a.ts);
  }, [activeTab, deviceFilter, timestampFilter]);

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

  return (
    <AppLayout>
      <div className="p-8 w-full">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-5 border-b border-black/10">
          <h1 className="text-2xl font-bold">History</h1>
          <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
            <Image src="/icons/download.png" alt="Download" width={20} height={20} />
            <span className="font-semibold text-[#4D4D4D] text-[13px]">Download</span>
          </button>
        </div>

        {/* TopBar */}
        <div className="mt-4">
          <TopBar
            timestampItems={["All", "5 min ago", "10 min ago", "15 min ago"]}
            deviceItems={["All", "Device A", "Device B"]}
            showAddButton={false}
            onChangeTimestamp={(label) => setTimestampFilter(label.startsWith("A") ? "All" : (label.split(" ")[0] as "5"|"10"|"15"))}
            onChangeDevice={(v: string) => setDeviceFilter(v as "All" | "Device A" | "Device B")}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex gap-6 border-b border-gray-200">
            {metrics.map(m => (
              <button
                key={m}
                onClick={() => setActiveTab(m)}
                className={`pb-2 -mb-px text-sm font-medium ${
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
              <button
                onClick={() => setEditing(v => !v)}
                className="px-4 py-2 text-sm font-semibold bg-[#4C6FFF] text-white rounded-lg hover:opacity-90"
              >
                {editing ? "Done" : "Edit"}
              </button>
            </div>

            <div className="mt-3 rounded-2xl border border-gray-200 overflow-hidden">
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
                    data.map(r => (
                      <tr key={r.id} className="text-sm">
                        <td className="px-6 py-3 border">{r.device}</td>
                        <td className="px-6 py-3 border">{r.sensor}</td>
                        <td className="px-6 py-3 border">
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
                        <td className="px-6 py-3 border">{new Date(r.date).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
