"use client";

import Image from "next/image";
import { Activity, Lightbulb } from 'lucide-react'

function Bar({ state }: { state: boolean }) {
  return (
    <div
      className={`w-[95%] h-4 rounded-full transition-all ${
        state
          ? "from-[#2FEA9B] to-[#7FDD53] bg-gradient-to-r"
          : "bg-[#FF383C]/50"
      }`}
    ></div>
  );
}

type StatusProps = {
  sensorvalues: {
    temperatureC: string | number,
    temperatureF: string | number,
    humidity: string | number,
    lightIntensity: string | number,
    pir: string | number,
  }
}

export default function Status({ sensorvalues }: StatusProps) {
  const statuses = {
    temperature: sensorvalues.temperatureC !== '-',
    humidity: sensorvalues.humidity !== '-',
    light: sensorvalues.lightIntensity !== '-',
    pir: sensorvalues.pir !== '-',
  }

  return (
    <div className="lg:mt-[30px] w-full flex flex-col gap-y-[30px]">
      <div className="w-full p-2 bg-white rounded-[19px] shadow-md border">
        <h2 className="mx-4 my-1 font-bold">Current Status</h2>
        <div className="flex flex-row w-full font-semibold p-2">
          <Image
            src={"./icons/temp-three-quarters.svg"}
            alt="Temperature Icon"
            width={24}
            height={24}
            className="m-2"
          />
          <div className="w-full">
            <span>Temperature Sensor</span>
            <Bar state={statuses.temperature} />
          </div>
        </div>
        <div className="flex flex-row w-full font-semibold p-2">
          <Image
            src={"./icons/humidity.svg"}
            alt="Temperature Icon"
            width={24}
            height={24}
            className="m-2"
          />
          <div className="w-full">
            <span>Humidity Sensor</span>
            <Bar state={statuses.humidity} />
          </div>
        </div>
        <div className="flex flex-row w-full font-semibold p-2">
          <Image
            src={"./icons/temp-three-quarters.svg"}
            alt="Temperature Icon"
            width={24}
            height={24}
            className="m-2"
          />
          <div className="w-full">
            <span>Light Sensor</span>
            <Bar state={statuses.light} />
          </div>
        </div>
      </div>
      <div className="w-full p-2 bg-white rounded-[19px] shadow-md border">
        <h2 className="mx-4 my-1 font-bold">Current Status</h2>
        <div className="flex flex-row w-full font-semibold p-2">
          <Activity className="m-2" size={24} />
          <div className="w-full">
            <span>PIR Sensor</span>
            <Bar state={statuses.pir} />
          </div>
        </div>
        <div className="flex flex-row w-full font-semibold p-2">
          <Lightbulb className="m-2" size={24} />
          <div className="w-full">
            <span>Light</span>
            <Bar state={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
