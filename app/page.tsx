"use client";

import Image from "next/image";
import SensorDisplay from "@/app/components/SensorDisplay";
import Activity from "@/app/components/Activity";
import TopBar from "@/app/components/TopBar";
import Status from "./components/Status";
import Weather from "./components/Weather";
import { useUserStore } from "./store/useUserStore";
import { baseData } from "./store/mockData";
import { useEffect, useMemo, useState } from "react";
import { Row } from "./model";
import { useDevicesStore } from "./store/useDevicesStore";

export default function Home() {
  const { user } = useUserStore();
  const { devices } = useDevicesStore();
  const deviceList = useMemo(() => {
    if (!user) return ['None'];
    return devices
      .filter(device => device.ownerId === user.id)
      .map(device => device.name);
  }, [user, devices]);
  const [deviceFilter, setDeviceFilter] = useState<string>(deviceList[0]);

  const [latestData, setLatestData] = useState<Row[]>([]);
  const [updatedTemperature, setUpdatedTemperature] = useState<number | string>('-');
  const [updatedHumidity, setUpdatedHumidity] = useState<number | string>('-');
  const [updatedLight, setUpdatedLight] = useState<number | string>('-');
  const [updatedPir, setUpdatedPir] = useState<number | string>('-');
  
  useEffect(() => {
    if (user && deviceFilter !== 'None') {
      const latestData = baseData.filter(row => 
        row.device === deviceFilter
      );

      setLatestData(latestData);

      setUpdatedTemperature(() => {
        const tempData = latestData
            .filter(d => d.sensor === "Temperature")
            .sort((a, b) => b.ts - a.ts);

        return tempData.length > 0 ? tempData[0].value : '-';
      })

      setUpdatedHumidity(() => {
        const humidityData = latestData
            .filter(d => d.sensor === "Humidity")
            .sort((a, b) => b.ts - a.ts);

        return humidityData.length > 0 ? humidityData[0].value : '-';
      })

      setUpdatedLight(() => {
        const lightData = latestData
            .filter(d => d.sensor === "Light")
            .sort((a, b) => b.ts - a.ts);

        return lightData.length > 0 ? lightData[0].value : '-';
      })

      setUpdatedPir(() => {
        const pirData = latestData
            .filter(d => d.sensor === "PIR")
            .sort((a, b) => b.ts - a.ts);
        return pirData.length > 0 ? pirData[0].value : '-';
      })
    }
  }, [deviceFilter, user]);

  const sensorValues = {
    temperatureC: user ? updatedTemperature + " °C" : '-',
    temperatureF: user ? updatedTemperature !== '-' ? `${(Number(updatedTemperature) * 9/5 + 32).toFixed(1)} °F` : '-' : '-',
    humidity: user ? updatedHumidity + "%" : '-',
    lightIntensity: user ? updatedLight + " lux" : '-',
    pir: user ? updatedPir : 'no motion',
  }

  useEffect(() => {
    setDeviceFilter(deviceList[0]);
  }, [deviceList]);

  return (
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
          <div className="font-semibold text-[#4D4D4D] text-[13px]">
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
  );
}
