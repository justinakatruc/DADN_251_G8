"use client";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import Image from "next/image";
import { useUserStore } from "../store/useUserStore";

type WeatherData = {
  time?: Date | null;
  temperature_2m?: number | null;
  weather?: string | null;
  weatherCode?: number | null;
  icon?: string | null;
};

type AQData = {
  pm2_5?: number | null;
  category?: string | null;
  color?: string | null;
};

async function LoadWeather(): Promise<WeatherData> {
  const weatherCodeMap: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  function WeatherCodeToIcon(code?: number) {
    if (code == null) return "❓";
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤️";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌦️";
    if (code >= 71 && code <= 86) return "❄️";
    if (code >= 95) return "⛈️";
    return "🌡️";
  }

  const params = {
    latitude: 10.762622,
    longitude: 13.41,
    current: ["temperature_2m", "weather_code", "relative_humidity_2m"],
    forecast_days: 1,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const current = response.current()!;
  const utcOffsetSeconds = response.utcOffsetSeconds();

  return {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature_2m: Math.round(current.variables(0)!.value()),
    weather: weatherCodeMap[current.variables(1)!.value()],
    icon: WeatherCodeToIcon(current.variables(1)!.value()),
  };
}

async function LoadAirQualityCategory(): Promise<AQData> {
  const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
  const params = {
    latitude: 10.762622,
    longitude: 13.41,
    current: ["pm2_5"],
    timezone: "auto",
  };

  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const current = response.current()!;
  const pm2_5 = Math.round(current.variables(0)!.value());

  let category = "";
  let color = "";
  if (pm2_5 <= 50) {
    category = "Good";
    color = "#61B846";
  } else if (pm2_5 <= 100) {
    category = "Moderate";
    color = "#EEE957";
  } else if (pm2_5 <= 150) {
    category = "Unhealthy for Sensitive Groups";
    color = "#fbbf24";
  } else if (pm2_5 <= 200) {
    category = "Unhealthy";
    color = "#ED7771";
  } else if (pm2_5 <= 300) {
    category = "Very Unhealthy";
    color = "#a21caf";
  } else {
    category = "Hazardous";
    color = "#6b7280";
  }

  return { pm2_5, category, color };
}

function CategoryToIcon(category?: string): string {
  if (category === "Good") return "/icons/smile-circle.svg";
  if (category === "Moderate") return "/icons/neutral-face.svg";
  if (
    category === "Unhealthy for Sensitive Groups" ||
    category === "Unhealthy" ||
    category === "Very Unhealthy" ||
    category === "Hazardous"
  )
    return "/icons/sad-circle.svg";
  return "/icons/neutral-face.svg";
}

export default function Weather() {
  const { user } = useUserStore();
  const [curWeather, setCurWeather] = useState<WeatherData | null>(null);
  const [curAQ, setCurAQ] = useState<AQData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [weather, aq] = await Promise.all([
        LoadWeather(),
        LoadAirQualityCategory(),
      ]);
      setCurWeather(weather);
      setCurAQ(aq);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4 m-10">Loading weather data...</div>;
  }

  return (
    <div className="lg:mt-[30px] w-full h-full flex flex-col gap-6 font-bold">
      <div className="w-full flex flex-col gap-y-3">
        <h2 className="mb-2">Indoor Air</h2>
        <div className="flex justify-center h-20">
          {user ? (
            <div
              className={`relative flex w-[80%] lg:w-[60%] items-center rounded-4xl border-[2px] overflow-hidden ${"border-[curAQ?.color]"} shadow-md`}
              style={{ borderColor: curAQ?.color ?? "#FFFFFF" }}
            >
              <div
                className={
                  "flex-1 rounded-4xl bg-white pl-6 pr-6 md:pr-1 xl:pr-6 py-4 flex items-start" +
                  (curAQ?.category !== "Unhealthy for Sensitive Groups"
                    ? "lg:flex-row items-center gap-1 lg:gap-2"
                    : "flex-col")
                }
              >
                <span>Air Quality: </span>
                {curAQ?.category ?? "-"}
              </div>
              <div
                className={`absolute right-0 top-0 ${"bg-[curAQ?.color]"} w-[25%] lg:w-[23%] h-full rounded-l-[30px] text-white flex items-center justify-center gap-2`}
                style={{ backgroundColor: curAQ?.color ?? "#FFFFFF" }}
              >
                <Image
                  src={CategoryToIcon(curAQ?.category || "")}
                  alt="Air quality icon"
                  width={24}
                  height={24}
                />
                {curAQ?.pm2_5 ?? "-"}
              </div>
            </div>
          ) : (
            <div className="relative flex w-[80%] lg:w-[60%] items-center justify-center rounded-4xl border-[2px] overflow-hidden shadow-md bg-[#FFFFFF]">
              <h1 className="text-2xl font-bold">-</h1>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col gap-y-3">
        <h2 className="mb-2">Outdoor Weather</h2>
        <div className="flex justify-center h-20">
          <div className="flex h-20 w-[80%] lg:w-[60%] items-center bg-[#4E7EF9] rounded-4xl shadow-md text-white">
            <div className="flex-1 rounded-4xl pl-6 pr-6 md:pr-1 xl:pr-6 py-4 flex items-center gap-x-0.5">
              <span>{curWeather?.icon ?? "❓"}</span>
              <span>{curWeather?.weather ?? "-"}</span>
            </div>
            <div className="pr-6 pl-6 md:pl-1 xl:pl-6 py-4">
              <span>
                {curWeather?.temperature_2m == null
                  ? "-"
                  : `${curWeather.temperature_2m}°C`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/icons/weather.png"
        alt="Weather icon"
        width={128}
        height={128}
        className="self-center md:self-end select-none lg:-mt-2"
      />
    </div>
  );
}
