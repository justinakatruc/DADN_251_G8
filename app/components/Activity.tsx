"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useUserStore } from "../store/useUserStore";
import Image from "next/image";
import { Row } from "../model";

type ActivityProps = {
  data: Row[];
};

export default function Activity({ data }: ActivityProps) {
  const { user } = useUserStore();
  const [selectedSensor, setSelectedSensor] = useState("Temperature");
  const [selectedTime, setSelectedTime] = useState<string>("Month");

  const dataBelongsToAttribute = useMemo(() => {
    return data.filter((d) => d.sensor === selectedSensor);
  }, [data, selectedSensor]);

  const dataGroupedByTime = useMemo(() => {
    let rows = dataBelongsToAttribute;
    if (rows.length === 0) return {};

    const timestamps = rows.map((r) => r.ts).sort((a, b) => a - b);
    const earliestDate = new Date(timestamps[0]);

    // Set baseline to start of the day for the earliest timestamp
    const baseline = new Date(
      earliestDate.getFullYear(),
      earliestDate.getMonth(),
      earliestDate.getDate()
    ).getTime();

    const n = selectedTime === "Day" ? 1 : selectedTime === "Week" ? 7 : 30;
    const range = n * 24 * 60 * 60 * 1000;
    rows = rows.filter((r) => r.ts >= baseline && r.ts < baseline + range);

    const grouped: { [key: string]: Row[] } = {};

    rows.forEach((r) => {
      const date = new Date(r.ts);

      let key = "";
      if (selectedTime === "Day") {
        // group by hour
        key = `${date.getHours()}h`;
      } else if (selectedTime === "Week") {
        // group by day of week
        key = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
      } else {
        // group by month
        key = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][date.getMonth()];
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    });

    return grouped;
  }, [dataBelongsToAttribute, selectedTime]);

  const sensors = [
    {
      id: 1,
      name: "Temperature",
      value: "Temperature",
      ranges: ["0", "10", "20", "25", "30", "40"],
    },
    {
      id: 2,
      name: "Humidity",
      value: "Humidity",
      ranges: ["0", "20", "40", "60", "80", "100"],
    },
    {
      id: 3,
      name: "Light",
      value: "Light",
      ranges: ["0", "100", "250", "500", "1000", "100000"],
    },
  ];

  const times = [
    {
      id: 1,
      name: "Month",
      values: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    {
      id: 2,
      name: "Day",
      values: [
        "0h",
        "2h",
        "4h",
        "6h",
        "8h",
        "10h",
        "12h",
        "14h",
        "16h",
        "18h",
        "20h",
        "22h",
      ],
    },
    {
      id: 3,
      name: "Week",
      values: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  ];

  return (
    <div className="w-full p-5 flex flex-col gap-y-5 bg-white rounded-[19px] shadow-md border">
      {user ? (
        <>
          <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.1)] pb-2.5">
            <div className="text-[15px] font-medium text-[#4D4D4D]">
              Activity
            </div>
            <div className="flex gap-x-3">
              <Select
                value={selectedSensor}
                onValueChange={(value) => setSelectedSensor(value)}
              >
                <SelectTrigger className="w-[130px] xl:w-[140px] cursor-pointer hover:border-[#CFCFCF]">
                  <SelectValue placeholder="Temperature" />
                </SelectTrigger>
                <SelectContent>
                  {sensors.map((sensor) => (
                    <SelectItem
                      key={sensor.id}
                      value={sensor.value}
                      className="cursor-pointer"
                    >
                      {sensor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedTime}
                onValueChange={(value) => setSelectedTime(value)}
              >
                <SelectTrigger className="w-[80px] xl:w-[140px] cursor-pointer hover:border-[#CFCFCF]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem
                      key={time.id}
                      value={time.name}
                      className="cursor-pointer"
                    >
                      {time.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-x-5">
            <div className="flex flex-col justify-end gap-y-5 h-[216px]">
              {sensors
                .find((t) => t.value === selectedSensor)
                ?.ranges.slice()
                .reverse()
                .map((val, index) => (
                  <div key={index} className="flex justify-end gap-x-2">
                    <div className="text-[13px] text-gray-500">{val}</div>
                  </div>
                ))}
            </div>
            <div
              className={`flex-1 grid ${
                selectedTime === "Week" ? "grid-cols-7" : "grid-cols-12"
              } gap-x-2`}
            >
              {times
                .find((t) => t.name === selectedTime)
                ?.values.map((val, index) => {
                  const group = dataGroupedByTime[val] || [];
                  const avgValue =
                    group.length > 0
                      ? (
                          group.reduce(
                            (sum, r) =>
                              sum + (typeof r.value === "number" ? r.value : 0),
                            0
                          ) / group.length
                        ).toFixed(1)
                      : null;

                  let heightPx = "0px";

                  if (selectedSensor === "Temperature") {
                    if (Number(avgValue) <= 0) heightPx = "0px";
                    else if (Number(avgValue) <= 10) {
                      heightPx = Number(avgValue) * 5.3 + "px";
                    } else if (Number(avgValue) <= 20) {
                      heightPx = (Number(avgValue) * 86.4) / 20 + "px";
                    } else if (Number(avgValue) <= 25) {
                      heightPx = (Number(avgValue) * 129.6) / 25 + "px";
                    } else if (Number(avgValue) <= 30) {
                      heightPx = (Number(avgValue) * 172.8) / 30 + "px";
                    } else if (Number(avgValue) <= 40) {
                      heightPx = (Number(avgValue) * 216) / 40 + "px";
                    } else heightPx = "216px";
                  }

                  if (selectedSensor === "Humidity") {
                    if (Number(avgValue) <= 0) heightPx = "0px";
                    else if (Number(avgValue) <= 20) {
                      heightPx = (Number(avgValue) * 43.2) / 20 + "px";
                    } else if (Number(avgValue) <= 40) {
                      heightPx = (Number(avgValue) * 86.4) / 40 + "px";
                    } else if (Number(avgValue) <= 60) {
                      heightPx = (Number(avgValue) * 129.6) / 60 + "px";
                    } else if (Number(avgValue) <= 80) {
                      heightPx = (Number(avgValue) * 172.8) / 80 + "px";
                    } else if (Number(avgValue) <= 100) {
                      heightPx = (Number(avgValue) * 216) / 100 + "px";
                    } else heightPx = "216px";
                  }

                  if (selectedSensor === "Light") {
                    if (Number(avgValue) <= 0) heightPx = "0px";
                    else if (Number(avgValue) <= 100) {
                      heightPx = (Number(avgValue) * 43.2) / 100 + "px";
                    } else if (Number(avgValue) <= 250) {
                      heightPx = (Number(avgValue) * 86.4) / 250 + "px";
                    } else if (Number(avgValue) <= 500) {
                      heightPx = (Number(avgValue) * 129.6) / 500 + "px";
                    } else if (Number(avgValue) <= 1000) {
                      heightPx = (Number(avgValue) * 172.8) / 1000 + "px";
                    } else if (Number(avgValue) <= 1500) {
                      heightPx = (Number(avgValue) * 216) / 1500 + "px";
                    } else heightPx = "216px";
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-y-1.5"
                    >
                      <div
                        className="h-[216px] w-[10px] rounded-[10px] flex flex-col justify-end"
                        style={{
                          backgroundColor: "rgb(242,247,255)",
                          height: "216px",
                        }}
                      >
                        <div
                          className="rounded-[10px]"
                          style={{
                            backgroundColor:
                              group.length > 0 ? "rgba(73,130,255,0.8)" : "",
                            height: heightPx,
                            transition: "height 0.3s ease",
                          }}
                        ></div>
                      </div>
                      <div className="text-[13px] lg:text-[10px] xl:text-[13px] text-[#838383] text-center">
                        {val}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src="/icons/yolohome.png"
            alt="Yolo Home"
            width={225}
            height={225}
          />
        </div>
      )}
    </div>
  );
}
