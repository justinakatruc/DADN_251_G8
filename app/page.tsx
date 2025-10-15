import AppLayout from "@/app/components/AppLayout"
import Image from "next/image"
import SensorDisplay from "@/app/components/SensorDisplay";
import Activity from "@/app/components/Activity";
import TopBar from "@/app/components/TopBar";

export default function Home() {
  return (
    <AppLayout>
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
        <div>
          <TopBar
            deviceItems={["All", "Device A", "Device B"]}
            showAddButton={true}
          />
        </div>
        <div className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-[45px] md:gap-y-0">
          <SensorDisplay />
          <Activity />
        </div>
      </div>
    </AppLayout>
  );
}
