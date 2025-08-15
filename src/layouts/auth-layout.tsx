import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { SunMoon } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  const { toggleTheme } = useTheme();
  return (
    <main
      className={`w-full h-screen relative flex items-center justify-center bg-white dark:bg-zinc-950 `}
    >
      <div className="w-[400px] mt-7 2xl:h-[70%]">
        <Outlet />
      </div>
      <Button variant={"outline"} className="absolute bottom-10 left-10" size={"icon"} onClick={toggleTheme}>
        <SunMoon size={15} />
      </Button>
    </main>
  )
}