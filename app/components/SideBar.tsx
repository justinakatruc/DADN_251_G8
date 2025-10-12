"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  id: string;
  icon: string;
  href: string;
}

interface SideBarProps {
  onAuthClick?: (mode: "login" | "signup") => void;
}

export default function SideBar({ onAuthClick }: SideBarProps) {
  const pathname = usePathname();
  const menuItems: MenuItem[] = [
    { id: "Reports", icon: "/icons/arrow-up.svg", href: "./" },
    { id: "History", icon: "/icons/history.svg", href: "/History" },
  ];

  const getActiveItem = () => {
    const activeMenuItem = menuItems.find((item) => item.href == pathname);
    return activeMenuItem ? activeMenuItem.id : "Reports";
  };

  const activeItem = getActiveItem();

  return (
    <div className="flex flex-col items-center w-64 h-screen rounded-3xl bg-white border-r border-gray-300">
      {/* YoloHome Icon
       <div
        className="w-[130px] h-[100px] bg-cover bg-center rounded"
        style={{
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAt1BMVEX////25HHurQDvsRjurAD0yXL25nT4363wti3ywUb243X205T55MD///3vsBD32Z343qf87s/vsQDxu0T43bD65rz14GvxuTf13mj242n20on54rP9+Nv+/vH++vL779T99ebywlL9897354X001j1zn346Y70xmj21pfzxF357KDwtST77M/xuz70zHb315L676z9+N746pb78r/11H3yxkH14mH778b79L3xvTH57aL36X/ywle6KyzTAAAJs0lEQVR4nO2c/WOauhqA6UtU7gYRYZaJK0Z7qDK/1vauPefU///vugkhECjauuLQ3ff5oS1IYx7z9QZDDANBEARBEARBEARBEARBEARBEARBEARBEARBEARBkD8Y1nYGTgzrkA1rOxMnxFlQMMHsO21n5FTYFpgcCsGg7aycBLYDakoozFnb2WmcaAtpAYInf8H2D6uqw2VWQWMWy6KEYNh2phpklkgrspvwo4lPpG0yaztjDeHEWQUFVWpjdSJsNWNNMfZe6+TS3ri9jDXEviqZV9zppKWcNUOkuhXrdbcyVKNjHLWQs4ZwzayCLuqGhnwAWfZ+e86aYRWkBUjJ3uGd7Uh6BawvsaryGFvmPrAPXDUMZFUlm0urqk6fyhr4VpidBuPiQnpZ8bitiqbD3rw2L+z15cTjLMka4DvnEAPVq84vo6o6YdZFmu67/8elhzrdMyOPsY/qO6KNGjgP9UvnQBaqUDg6VFlNVVU953g8r6C/FG6qAJaGZ1tVx6o1xb+WxTzGM89z6shjbPrRad9sl/XC0/Orqodi7GMYn2s87i7V7ZePZozH4/T84vGJn1WuhDWQ2myaVXf/XOLxaJ7lqLGxTN1YPY943HG998XYRyW6VfG42/rIYa/fH2MfQxaPm+C3G4+zeXa3JVg1nnYRj7PG034vTn4f+/0x9jH01V26xUmSfxv7l2LsY4g6rcbj46wHnTZfQQtWahxqQ7EHaQ964lu6Ti/tVaENwy/AP9pfjLGPIdrwytKOIYHdq/jY6X8+jLN644KaOGY2hXZqad0cx1nDYaIeOfg6+VL3XmOvjfkUq+tBHV99z1uP56TNdz9Qa2hE7KQuRyAMKZB6qDIsLkh7Ef1oj+H5wA2p9TyoZcLtU0NY5Ke2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')",
        }}
      /> */}
      <h1 className="text-black text-3xl font-bold my-6">Yolo:Home</h1>
      <div className="mt-auto w-[80%] border-t border-gray-400" />
      <nav className="flex-1 p-4 w-full">
        <ul className="w-full">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`mb-2 py-2 rounded-lg ${
                item.id == activeItem
                  ? "bg-blue-300 text-blue-500"
                  : "text-black font-medium"
              }`}
            >
              <a
                href={item.href}
                className="flex flex-row items-center justify-center"
              >
                <Image
                  src={item.icon}
                  alt={item.id}
                  width={20}
                  height={20}
                  className="mr-2"
                ></Image>
                <span className="text-black font-medium">{item.id}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-6 w-[80%] border-t border-gray-400">
        <div className="space-y-3 max-w-[200px] mx-auto">
          <button
            onClick={() => onAuthClick?.("login")}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-2xl hover:bg-blue-600 border-2 border-blue-600 font-medium text-lg shadow-xl"
          >
            Login
          </button>
          <button
            onClick={() => onAuthClick?.("signup")}
            className="w-full bg-gray-200 text-[#4D4D4D] py-3 px-6 rounded-2xl hover:bg-gray-300 border-2 border-gray-400 font-medium text-lg shadow-md"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
