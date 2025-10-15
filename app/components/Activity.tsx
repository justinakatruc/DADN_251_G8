"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

export default function Activity() {
    const [selectedSensor, setSelectedSensor] = useState("temp")
    const [selectedTime, setSelectedTime] = useState("Month")

    const sensors = [
        { id: 1, name: "Temperature", value: "temp", ranges: [
            "0", "10", "20", "25", "30", "40"
        ] },
        { id: 2, name: "Humidity", value: "humidity", ranges: [
            "0", "20", "40", "60", "80", "100"
        ] },
        { id: 3, name: "Light", value: "light", ranges: [
            "0", "100", "250", "500", "10000", "100000"
        ] },
    ]

    const times = [
        { 
            id: 1, 
            name: "Month", 
            values: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
        },
        { 
            id: 2, 
            name: "Day", 
            values: [
                "0", "2", "4", "6", "8", "10",
                "12", "14", "16", "18", "20", "22"
            ]
        },
        { 
            id: 3, 
            name: "Week", 
            values: [
                "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
            ]
        },
    ]

    return (
        <div className="w-full p-5 flex flex-col gap-y-5 bg-white rounded-[19px] shadow-md border">
            <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.1)] pb-2.5">
                <div className="text-[15px] font-medium text-[#4D4D4D]">Activity</div>
                <div className="flex gap-x-3">
                    <Select
                        value={selectedSensor}
                        onValueChange={(value) => setSelectedSensor(value)}
                    >
                        <SelectTrigger className="w-[100px] xl:w-[140px] cursor-pointer hover:border-[#CFCFCF]">
                            <SelectValue placeholder="Temperature" />
                        </SelectTrigger>
                        <SelectContent>
                            {sensors.map((sensor) => (
                                <SelectItem key={sensor.id} value={sensor.value} className="cursor-pointer">
                                    {sensor.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedTime}
                        onValueChange={(value) => setSelectedTime(value)}
                    >
                        <SelectTrigger className="w-[100px] xl:w-[140px] cursor-pointer hover:border-[#CFCFCF]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {times.map((time) => (
                                <SelectItem key={time.id} value={time.name} className="cursor-pointer">
                                    {time.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>   
            <div className="flex gap-x-5">
                <div className="flex flex-col justify-end gap-y-5 h-[216px]">
                    {sensors.find(t => t.value === selectedSensor)?.ranges.slice().reverse().map((val, index) => (
                        <div key={index} className="flex justify-end gap-x-2">
                            <div className="text-[13px] text-gray-500">{val}</div>
                        </div>
                    ))}
                </div>
                <div className={`flex-1 grid ${selectedTime === "Week" ? "grid-cols-7" : "grid-cols-12"} gap-x-2`}>
                    {times.find(t => t.name === selectedTime)?.values.map((val, index) => (
                        <div key={index} className="flex flex-col items-center gap-y-1.5">
                            <div className="h-[216px] w-[10px] bg-[rgb(242,247,255)] rounded-[10px]">

                            </div>
                            <div className="text-[13px] lg:text-[10px] xl:text-[13px] text-[#838383] text-center">
                                {val}
                            </div>
                        </div>
                    ))}
                </div>
            </div>   
            {/* <div className="w-full h-full flex items-center justify-center">
                <Image src="/icons/yolohome.png" alt="Yolo Home" width={225} height={225} className="" />
            </div> */}
        </div>
    )
}
