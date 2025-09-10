"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-react";

const themeOptions = [
  { value: "light", label: "Light", icon: <SunIcon/> },
  { value: "dark", label: "Dark", icon: <MoonStarIcon/> },
  { value: "system", label: "System", icon: <MonitorIcon/> },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const current = themeOptions.find((opt) => opt.value === theme) || themeOptions[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`font-semibold flex items-center border-none rounded-lg transition-colors
            ${current.value === "light"
              ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900"
              : "bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800 hover:text-white"}
          `}
        >
          {current.icon}
          <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 transition-colors duration-300">
        {themeOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-2 cursor-pointer px-3 py-2 transition-colors
              hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white
            `}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
