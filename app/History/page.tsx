"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import TopBar from "@/app/components/TopBar";
import { useUserStore } from "../store/useUserStore";
import { Metric, Row } from "../model";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
// import { useDevicesStore } from "../store/useDevicesStore";

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-2 md:px-4 lg:px-6 py-3 border">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
    </tr>
  );
}

const metrics: Metric[] = ["Temperature", "Humidity", "Light"];

export default function HistoryPage() {
  const { user } = useUserStore();
  const [seed, setSeed] = useState<Row[]>([]);
  const [activeTab, setActiveTab] = useState<Metric>("Temperature");
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  const [timestampFilter, setTimestampFilter] = useState<
    "All" | "Month" | "Week" | "Day"
  >("Month");
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistoryData = useCallback(
    async (timestampFilter: "All" | "Month" | "Week" | "Day") => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await userAPI.getHistoryData(
          user.id,
          localStorage.getItem("token") || "",
          timestampFilter
        );

        if (response.success) {
          const {
            historyTemperatureData,
            historyHumidityData,
            historyLightData,
          } = response;

          const combinedData: Row[] = [
            ...historyTemperatureData.map(
              (item: {
                id: string;
                timestamp: string;
                value: number;
                timestamp_local: Date;
              }) => ({
                id: item.id,
                sensor: "Temperature" as Metric,
                value: item.value,
                date: item.timestamp_local,
                ts: new Date(item.timestamp).getTime(),
              })
            ),
            ...historyHumidityData.map(
              (item: {
                id: string;
                timestamp: string;
                value: number;
                timestamp_local: Date;
              }) => ({
                id: item.id,
                sensor: "Humidity" as Metric,
                value: item.value,
                date: item.timestamp_local,
                ts: new Date(item.timestamp).getTime(),
              })
            ),
            ...historyLightData.map(
              (item: {
                id: string;
                timestamp: string;
                value: number;
                timestamp_local: Date;
              }) => ({
                id: item.id,
                sensor: "Light" as Metric,
                value: item.value,
                date: item.timestamp_local,
                ts: new Date(item.timestamp).getTime(),
              })
            ),
          ];
          setSeed(combinedData);
        }

        return true;
      } catch (error) {
        console.error("Error fetching history data:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const handleUpdateData = async (updatedRow: Row, value: number) => {
    setLoadingRowId(updatedRow.id);

    const result = await userAPI.updateData(
      user!.id,
      localStorage.getItem("token") || "",
      updatedRow.id,
      value,
      updatedRow.sensor
    );
    if (result.success) {
      await fetchHistoryData(timestampFilter);
      toast.success("Data updated successfully");
    } else {
      toast.error("Failed to update data");
    }
    setTimeout(() => {
      setLoadingRowId(null);
    }, 2000);
  };

  useEffect(() => {
    fetchHistoryData(timestampFilter);
  }, [timestampFilter, fetchHistoryData]);

  const data = useMemo(() => {
    let rows = seed.filter((r) => r.sensor === activeTab);
    // if (deviceFilter !== "All")
    //   rows = rows.filter((r) => r.device === deviceFilter);
    // nếu cần lọc theo mốc thời gian (giả lập “N phút trước” quanh 09:00)
    const baseline = Date.now();
    if (timestampFilter !== "All") {
      const n =
        timestampFilter === "Day" ? 1 : timestampFilter === "Week" ? 7 : 30;
      const range = n * 24 * 60 * 60 * 1000;
      rows = rows.filter((r) => r.ts >= baseline - range);
    }
    return rows.sort((a, b) => b.ts - a.ts);
  }, [activeTab, timestampFilter, seed]);

  const handleDownloadCSV = () => {
    const header = "Device,Sensor,Value,Date\n";
    const body = data
      .map((r) =>
        [r.device, r.sensor, r.value, new Date(r.date).toLocaleString()].join(
          ","
        )
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history_${activeTab.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-5 border-b border-black/10">
        <h1 className="text-2xl font-bold">History</h1>
        <button
          disabled={isLoading || data.length === 0}
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <Image
            src="/icons/download.png"
            alt="Download"
            width={20}
            height={20}
          />
          <span className="font-semibold text-[#4D4D4D] text-[13px]">
            Download
          </span>
        </button>
      </div>

      {/* TopBar */}
      <TopBar
        timestampItems={["All", "Month", "Week", "Day"]}
        // deviceItems={deviceList}
        showAddButton={false}
        onChangeTimestamp={(label) =>
          setTimestampFilter(
            label.startsWith("A")
              ? "All"
              : (label.split(" ")[0] as "Month" | "Week" | "Day")
          )
        }
        // onChangeDevice={(v: string) => setDeviceFilter(v)}
      />

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex gap-6 border-b border-gray-200">
          {metrics.map((m) => (
            <button
              key={m}
              onClick={() => setActiveTab(m)}
              className={`pb-2 -mb-px text-sm font-medium cursor-pointer ${
                activeTab === m
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Table + Edit */}
        <div className="mt-4">
          <div className="flex justify-end">
            {user && (
              <button
                onClick={() => {
                  setEditing((v) => !v);
                  if (editing) {
                  }
                }}
                className="px-4 py-2 text-sm font-semibold cursor-pointer bg-[#4C6FFF] text-white rounded-lg hover:opacity-90"
              >
                {editing ? "Done" : "Edit"}
              </button>
            )}
          </div>

          {!user && (
            <div className="w-full h-[500px] flex flex-col items-center justify-center">
              <Image
                src="/icons/yolohome.png"
                alt="Yolo Home"
                width={225}
                height={225}
              />
              <p className="mt-4 text-gray-500">
                Please log in to view your history.
              </p>
            </div>
          )}

          {user && (
            <div className="mt-3 rounded-2xl border border-gray-200 max-h-[500px] overflow-y-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 text-left text-sm">
                  <tr>
                    <th className="px-6 py-3 w-[25%] border">Sensor</th>
                    <th className="px-6 py-3 w-[25%] border">Value</th>
                    <th className="px-6 py-3 w-[25%] border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // Show loading skeleton rows
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : data.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-6 text-center text-gray-400 border"
                        colSpan={3}
                      >
                        No data
                      </td>
                    </tr>
                  ) : (
                    data.map((r, index) => (
                      <tr key={index} className="text-sm">
                        <td className="px-2 md:px-4 lg:px-6 py-3 border">
                          <div className="font-medium">{r.sensor}</div>
                        </td>
                        <td className="px-2 md:px-4 lg:px-6 py-3 border">
                          {editing ? (
                            loadingRowId === r.id ? (
                              <span className="text-blue-500">Updating...</span>
                            ) : (
                              <input
                                className="w-24 rounded-md border px-2 py-1"
                                defaultValue={String(r.value)}
                                onBlur={(e) =>
                                  handleUpdateData(r, Number(e.target.value))
                                }
                              />
                            )
                          ) : (
                            r.value
                          )}
                        </td>
                        <td className="px-2 md:px-4 lg:px-6 py-3 border">
                          {new Date(r.date).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
