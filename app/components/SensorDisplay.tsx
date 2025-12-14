import Image from "next/image";

type SensorDisplayProps = {
  sensorvalues: {
    temperatureC: string | number;
    temperatureF: string | number;
    humidity: string | number;
    lightIntensity: string | number;
    handleRefresh: () => void;
  };
};

export default function SensorDisplay({ sensorvalues }: SensorDisplayProps) {
  return (
    <div className="w-full flex flex-col gap-y-[30px]">
      <div className="flex flex-col gap-y-2.5 w-full">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-bold">Temperature</div>
          <div
            onClick={sensorvalues.handleRefresh}
            className="size-8 rounded-full bg-[rgba(249,249,249,0.1)] hover:bg-[rgba(249,249,249,0.8)] border border-[rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/icons/refresh.png"
              alt="Refresh Icon"
              width={19}
              height={19}
              className="select-none"
            />
          </div>
        </div>
        <div className="w-full bg-white h-[124px] rounded-[19px] gap-x-1 shadow-md px-4 py-5 grid grid-cols-2 border">
          <div className="flex flex-col gap-y-5 items-center">
            <div className="text-[16px] lg:text-[17px] font-medium text-[#4D4D4D]">
              Degree Celsius
            </div>
            <div className="text-[18px] lg:text-[22px] font-bold text-[#4D4D4D]">
              {sensorvalues.temperatureC}
            </div>
          </div>
          <div className="flex flex-col gap-y-5 items-center">
            <div className="text-[16px] lg:text-[17px] font-medium text-[#4D4D4D]">
              Degree Fahrenheit
            </div>
            <div className="text-[18px] lg:text-[22px] font-bold text-[#4D4D4D]">
              {sensorvalues.temperatureF}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-6 w-full">
        <div className="flex flex-col gap-y-2.5 w-1/2">
          <div className="text-[15px] font-bold">Humidity</div>
          <div className="flex flex-col items-center gap-y-2.5 bg-white h-[124px] rounded-[19px] shadow-md px-4 py-5 border">
            <div className="text-[16px] lg:text-[17px] font-medium text-[#4D4D4D]">
              Relative Humidity
            </div>
            <div className="text-[18px] lg:text-[22px] font-bold text-[#4D4D4D]">
              {sensorvalues.humidity}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2.5 w-1/2">
          <div className="text-[15px] font-bold">Light</div>
          <div className="flex flex-col items-center gap-y-2.5 bg-white h-[124px] rounded-[19px] shadow-md px-4 py-5 border">
            <div className="text-[16px] lg:text-[17px] font-medium text-[#4D4D4D]">
              Light Intensity
            </div>
            <div className="text-[18px] lg:text-[22px] font-bold text-[#4D4D4D]">
              {sensorvalues.lightIntensity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
