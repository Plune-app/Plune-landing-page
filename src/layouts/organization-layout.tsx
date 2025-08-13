import { OrganizationHeader } from "@/components/OrganizationHeader";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function OrganizationLayout (){ 
  return (
    <div>
      <SidebarProvider>
        <OrganizationSidebar />
        <main
          className={`w-full h-screen relative bg-white dark:bg-zinc-950 `}
        >
          <OrganizationHeader />
          <main
            style={{ height: "calc(100% - 52px)" }}
            className=" flex-1 dark:bg-zinc-950 overflow-auto relative">
            <Outlet />
          </main>
        </main>
        <Outlet />
      </SidebarProvider>
    </div>
  )
}