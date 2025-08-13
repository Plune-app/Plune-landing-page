import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { TypographyH4 } from "./ui/Typography";
import { ChevronLeft, ChevronRight, SunMoon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useTheme } from "./ThemeProvider";

export function OrganizationHeader() {
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const pathNameDictionary = useMemo(() => ({
    "": "Dashboard",
    "forms": "Forms",
    "approvals": "Approvals",
    "organizations": "Organizations",
    "flows": "Flows"
  }), []);
  const indexPath = location.pathname.split("/")[1] as keyof typeof pathNameDictionary;

  const flowRoute = location.pathname.split("/")[2] ? location.pathname.split("/")[2] + 's' : undefined

  return (
    <header
      className={` title-bar-drag-region backdrop-blur-lg z-[100000] fixed md:static py-2 px-4  h-fit flex items-center bg-white/80 gap-10  md:bg-zinc-50/80 dark:bg-zinc-900 dark:bg-[oklch(0.21 0.01 0)]  w-full `}
    >
      <aside className="flex items-center gap-1">
        <SidebarTrigger size={"lg"} className="no-drag" />
        <div className="h-full w-[1px] bg-zinc-100 dark:bg-zinc-800" />
        <TypographyH4 content={flowRoute ? pathNameDictionary[indexPath] + " " + flowRoute : pathNameDictionary[indexPath]} />
      </aside>
      <aside className="flex items-center gap-2 no-drag self-end">
        <div className="flex items-center gap-2">
          <Button size={"icon"} className="rounded-full " variant={'ghost'} onClick={() => navigate(-1)}>
            <ChevronLeft size={15} />
          </Button>
          <Button size={"icon"} className="rounded-full " variant={'ghost'} onClick={() => navigate(+1)}>
            <ChevronRight size={15} />
          </Button>
        </div>
        <Button
          onClick={toggleTheme}
          className="rounded-full "
          variant={"ghost"}
        >
          <SunMoon size={30} />
        </Button>
      </aside>
    </header>
  );
}