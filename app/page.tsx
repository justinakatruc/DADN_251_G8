"use client";

import Image from "next/image";
import SensorDisplay from "@/app/components/SensorDisplay";
import Activity from "@/app/components/Activity";
import TopBar from "@/app/components/TopBar";
import Status from "./components/Status";
import Weather from "./components/Weather";
import { useUserStore } from "./store/useUserStore";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Row, HistoryDataItem } from "./model";
import { useDevicesStore } from "./store/useDevicesStore";
import { userAPI } from "@/lib/api";

export default function Home() {
  const { user } = useUserStore();
  const { devices } = useDevicesStore();
  const deviceList = useMemo(() => {
    if (!user) return ["None"];
    return devices
      .filter((device) => String(device.ownerId) === user.id)
      .map((device) => device.name);
  }, [user, devices]);
  const [deviceFilter, setDeviceFilter] = useState<string>(deviceList[0]);

  const [latestData, setLatestData] = useState<Row[]>([]);
  const [updatedTemperature, setUpdatedTemperature] = useState<number | string>(
    "-"
  );
  const [updatedHumidity, setUpdatedHumidity] = useState<number | string>("-");
  const [updatedLight, setUpdatedLight] = useState<number | string>("-");
  const [updatedPir, setUpdatedPir] = useState<number | string>("-");
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistoryData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await userAPI.getHistoryData(
        user.id,
        localStorage.getItem("token") || "",
        "Year"
      );

      if (response.success) {
        const {
          historyTemperatureData,
          historyHumidityData,
          historyLightData,
        } = response;

        setUpdatedTemperature(
          historyTemperatureData.length > 0
            ? historyTemperatureData[0].value
            : "-"
        );
        setUpdatedHumidity(
          historyHumidityData.length > 0 ? historyHumidityData[0].value : "-"
        );
        setUpdatedLight(
          historyLightData.length > 0 ? historyLightData[0].value : "-"
        );

        const combinedHistoryData: Row[] = [];

        // Append temperature data
        historyTemperatureData.forEach((data: HistoryDataItem) => {
          combinedHistoryData.push({
            id: data.id,
            device: deviceFilter,
            sensor: "Temperature",
            value: data.value,
            date: data.timestamp_local,
            ts: new Date(data.timestamp).getTime(),
          });
        });

        // Append humidity data
        historyHumidityData.forEach((data: HistoryDataItem) => {
          combinedHistoryData.push({
            id: data.id,
            device: deviceFilter,
            sensor: "Humidity",
            value: data.value,
            date: data.timestamp_local,
            ts: new Date(data.timestamp).getTime(),
          });
        });

        // Append light data
        historyLightData.forEach((data: HistoryDataItem) => {
          combinedHistoryData.push({
            id: data.id,
            device: deviceFilter,
            sensor: "Light",
            value: data.value,
            date: data.timestamp_local,
            ts: new Date(data.timestamp).getTime(),
          });
        });
        setLatestData(combinedHistoryData);
      }
      return true;
    } catch (error) {
      console.error("Error fetching current data:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, deviceFilter]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  const sensorValues = {
    temperatureC: user
      ? updatedTemperature !== "-"
        ? updatedTemperature + " °C"
        : "-"
      : "-",
    temperatureF: user
      ? updatedTemperature !== "-"
        ? `${((Number(updatedTemperature) * 9) / 5 + 32).toFixed(1)} °F`
        : "-"
      : "-",
    humidity: user
      ? updatedHumidity !== "-"
        ? updatedHumidity + "%"
        : "-"
      : "-",
    lightIntensity: user
      ? updatedLight !== "-"
        ? updatedLight + " lux"
        : "-"
      : "-",
    pir: user ? (updatedPir !== "-" ? updatedPir : "-") : "-",
    handleRefresh: fetchHistoryData,
  };

  useEffect(() => {
    setDeviceFilter(deviceList[0]);
  }, [deviceList]);

  const handleDownloadCSV = () => {
    const header = "Device,Sensor,Value,Date\n";
    const body = latestData
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
    a.download = `reports.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-gray-700 font-medium">
              Loading sensor data...
            </div>
          </div>
        </div>
      )}
      <div className="p-8 w-full">
        <div className="w-full flex items-center justify-between pb-5 border-b border-[rgba(0,0,0,0.1)]">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex gap-x-2.5 items-center">
            <Image
              src="/icons/download.png"
              alt="Download Icon"
              width={24}
              height={24}
            />
            <div
              onClick={handleDownloadCSV}
              className="font-semibold text-[#4D4D4D] text-[13px]"
            >
              Downloads
            </div>
          </div>
        </div>
        <TopBar
          deviceItems={deviceList}
          showAddButton={true}
          onChangeDevice={(v: string) => setDeviceFilter(v)}
        />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-[45px] md:gap-y-[20px] lg:gap-y-0">
          <SensorDisplay sensorvalues={sensorValues} />
          <Activity data={latestData} />
          <Status sensorvalues={sensorValues} />
          <Weather />
        </div>
      </div>
    </div>
  );
}
