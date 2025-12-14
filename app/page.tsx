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

type SensorData = {
  value: number | string;
  time: string | undefined;
};

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

  const blankData: SensorData = {
    value: "-",
    time: undefined,
  };
  const [updatedTemperature, setUpdatedTemperature] =
    useState<SensorData>(blankData);
  const [updatedHumidity, setUpdatedHumidity] = useState<SensorData>(blankData);
  const [updatedLight, setUpdatedLight] = useState<SensorData>(blankData);
  // const [updatedPir, setUpdatedPir] = useState<number | string>("-");
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

        const sortedTemperatureData = historyTemperatureData.sort(
          (a: HistoryDataItem, b: HistoryDataItem) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const sortedHumidityData = historyHumidityData.sort(
          (a: HistoryDataItem, b: HistoryDataItem) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const sortedLightData = historyLightData.sort(
          (a: HistoryDataItem, b: HistoryDataItem) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setUpdatedTemperature(
          sortedTemperatureData.length > 0
            ? {
                value: sortedTemperatureData[0].value,
                time: sortedTemperatureData[0].timestamp_local,
              }
            : blankData
        );
        setUpdatedHumidity(
          sortedHumidityData.length > 0
            ? {
                value: sortedHumidityData[0].value,
                time: sortedHumidityData[0].timestamp_local,
              }
            : blankData
        );
        setUpdatedLight(
          sortedLightData.length > 0
            ? {
                value: sortedLightData[0].value,
                time: sortedLightData[0].timestamp_local,
              }
            : blankData
        );

        const combinedHistoryData: Row[] = [];

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
      ? updatedTemperature.value !== "-"
        ? updatedTemperature.value + " °C"
        : "-"
      : "-",
    temperatureF: user
      ? updatedTemperature.value !== "-"
        ? `${((Number(updatedTemperature.value) * 9) / 5 + 32).toFixed(1)} °F`
        : "-"
      : "-",
    temperatureTime: user
      ? updatedTemperature.time !== undefined
        ? new Date(updatedTemperature.time)
        : undefined
      : undefined,
    humidity: user
      ? updatedHumidity.value !== "-"
        ? updatedHumidity.value + "%"
        : "-"
      : "-",
    humidityTime: user
      ? updatedHumidity.time !== undefined
        ? new Date(updatedHumidity.time)
        : undefined
      : undefined,
    lightIntensity: user
      ? updatedLight.value !== "-"
        ? updatedLight.value + " lux"
        : "-"
      : "-",
    lightTime: user
      ? updatedLight.time !== undefined
        ? new Date(updatedLight.time)
        : undefined
      : undefined,
    // pir: user ? (updatedPir !== "-" ? updatedPir : "-") : "-",
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
          <button
            disabled={isLoading || latestData.length === 0}
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
