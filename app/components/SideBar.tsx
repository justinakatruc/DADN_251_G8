"use client"
import Link from "next/link";
import { usePathname } from "next/navigation"
import { useState } from "react";
import { useUserStore } from "../store/useUserStore";

interface MenuItem {
  id: string;
  icon: string;
  href: string;
}

interface SideBarProps {
  onAuthClick?: (mode: "login" | "signup") => void;
}

export default function SideBar({ onAuthClick }: SideBarProps) {
  const { user, clear } = useUserStore();
  const pathname = usePathname()
  const [showLabel, setShowLabel] = useState<number | null>(null)
  const menuItems: MenuItem[] = user?.role !== "admin" ? [
    { id: "Reports", icon: "fa fa-line-chart", href: "/" },
    { id: "History", icon: "fa fa-history", href: "/history" },
  ] : [
    { id: "Reports", icon: "fa fa-line-chart", href: "/" },
    { id: "History", icon: "fa fa-history", href: "/history" },
    { id: "Users", icon: "fa fa-users", href: "/users" },
  ];

  const getActiveItem = () => {
    const activeMenuItem = menuItems.find((item) => item.href === pathname);
    return activeMenuItem ? activeMenuItem.id : "Reports";
  }

  const activeItem = getActiveItem()

  return (
    <>
      <div className="hidden lg:flex sticky left-0 top-0 flex-col items-center w-64 h-screen rounded-3xl bg-white border-r border-gray-300">
        <Link className="text-black text-3xl font-bold my-6 cursor-pointer" href="/">Yolo:Home</Link>
        <div className="mt-auto w-[80%] border-gray-400" />
        <nav className="flex-1 w-full flex flex-col items-center">
          <ul className="w-3/4">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`mb-2 py-2 rounded-lg ${
                  item.id == activeItem
                    ? "bg-[#E0E7FF]"
                    : "text-black font-medium"
                }`}
              >
                <Link
                  href={item.href}
                  className="flex flex-row items-center pl-6"
                >
                  <i className={`${item.icon} mr-2 ${item.id == activeItem ? "text-[#1B59F8]" : "text-black"}`} aria-hidden="true"></i>
                  <span className={`${item.id == activeItem ? "text-[#1B59F8]" : "text-black"} font-medium`}>{item.id}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-2 pb-6 px-6 w-[80%] border-t border-[rgba(0,0,0,0.1)]">
          <div className="space-y-3 max-w-[200px] mx-auto">
            {
              !user ? (
                <>
                  <button
                    onClick={() => onAuthClick?.("login")}
                    className="w-full bg-[#4E7EF9] hover:bg-[rgba(78,126,249,0.9)] text-[#FBFDFF] text-[24px] font-semibold py-3 px-6 rounded-[20px] shadow-md cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onAuthClick?.("signup")}
                    className="w-full bg-[rgba(249,249,249,0.1)] hover:bg-[rgba(249,249,249,0.8)] text-[#4D4D4D] text-[24px] font-semibold py-3 px-6 rounded-[20px] border-[0.2px] border-[rgba(0,0,0,0.1)] shadow-md cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div className="w-full flex gap-x-1 flex-wrap">
                      <div className="font-semibold">
                        {user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)}
                      </div>
                      <div>
                        -
                      </div>
                      <div className="text-[#4D4D4D]">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </div>
                    <div className="text-[#4D4D4D] text-[14px]">
                      {user.email}
                    </div>
                  </div>
                  <button
                    className="w-full bg-[#EB6A63] hover:bg-[rgba(235,106,99,0.8)] text-[#FBFDFF] text-[24px] font-semibold py-3 px-6 rounded-[20px] border-[0.2px] border-[rgba(0,0,0,0.1)] shadow-md cursor-pointer"
                    onClick={() => clear()}
                  >
                    Log out
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>
      <div className="px-3 md:px-7 lg:hidden flex items-center justify-between">
        <div className="my-6 flex flex-col gap-y-2">
          <Link className="text-black text-2xl md:text-3xl font-bold " href="/">Yolo:Home</Link>
          {
            user && (
              <div className="w-full flex gap-x-1 flex-wrap">
                <div className="font-semibold">
                  {user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)}
                </div>
                <div>
                  -
                </div>
                <div className="text-[#4D4D4D]">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <div>
                  -
                </div>
                <div className="text-[#4D4D4D] text-[14px]">
                  {user.email}
                </div>
              </div>
            )
          }
        </div>
        <div className="flex gap-x-[10px] md:gap-x-[20px] items-center">
          {
            !user && (
              <>
                <button
                  onClick={() => onAuthClick?.("login")}
                  className="bg-[#4E7EF9] hover:bg-[rgba(78,126,249,0.9)] text-[#FBFDFF] text-[15px] font-semibold py-3 px-6 rounded-[20px] shadow-md cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onAuthClick?.("signup")}
                  className="bg-[rgba(249,249,249,0.1)] hover:bg-[rgba(249,249,249,0.8)] text-[#4D4D4D] text-[15px] font-semibold py-3 px-6 rounded-[20px] border-[0.2px] border-[rgba(0,0,0,0.1)] shadow-md cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          {
            menuItems.map((item, index) => (
              <div key={index} className="relative">
                <div 
                  key={item.id} className="size-[40px] md:size-[50px] flex items-center justify-center cursor-pointer bg-[rgba(226,229,233,0.5)] hover:bg-[rgba(226,229,233,0.8)] rounded-full relative"
                  onMouseEnter={() => setShowLabel(index)}
                  onMouseLeave={() => setShowLabel(null)}
                >
                  <Link href={item.href} className="flex items-center justify-center">
                    <i className={`text-[18px] ${item.icon} ${item.id == activeItem ? "text-[#1B59F8]" : "text-black"}`} aria-hidden="true"></i>
                  </Link>
                </div>
                {showLabel === index && (
                  <div className='absolute top-[55px] left-[-13px] md:left-[-5px] w-[65px] flex items-center justify-center text-[11px] font-semibold bg-[rgba(226,229,233,0.5)] text-[#4D4D4D] py-1.5 px-2 rounded-[25px] z-[11]'>
                    {item.id}
                  </div>
                )}
              </div>
            ))
          }
          {
            user && (
              <button
                className="bg-[#EB6A63] hover:bg-[rgba(235,106,99,0.8)] text-[#FBFDFF] text-[15px] font-semibold py-3 px-6 rounded-[20px] border-[0.2px] border-[rgba(0,0,0,0.1)] shadow-md cursor-pointer"
                onClick={() => clear()}
              >
                Log out
              </button>
            )
          }
        </div>
      </div>
    </>
  );
}
