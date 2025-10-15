import AppLayout from "@/app/components/AppLayout"
import Image from "next/image"
import TopBar from "@/app/components/TopBar";

export default function HistoryPage() {
  return (
    <AppLayout>
      <div className="p-8 w-full">
        <div className="w-full flex items-center justify-between pb-5 border-b border-[rgba(0,0,0,0.1)]">
          <h1 className="text-2xl font-bold">History</h1>
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
            timestampItems={["All", "5 min ago", "10 min ago", "15 min ago"]}
            deviceItems={["All", "Device A", "Device B"]}
            showAddButton={false}
          />
        </div>
      </div>
    </AppLayout>
  );
}
