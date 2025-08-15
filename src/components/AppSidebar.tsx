import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { Workflow } from "lucide-react";
import { footerItems, headerItems } from "@/lib/routes";
import { NavMain } from "./ui/NavMain";
import { Link } from "react-router-dom";
import { NativeUserDropdown } from "./UserDropdown";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
export function AppSidebar() {

  return (
    <Sidebar collapsible="icon" variant="inset"  >
      <SidebarHeader className=" title-bar-drag-region">
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent className="p-2 flex flex-col justify-between dark:bg-zinc-900" >
        <SidebarGroupContent>
          <SidebarMenu>
            {headerItems.map((item) => (
              <SidebarMenuItem key={item.url + item.title} className=" no-drag">
                <SidebarMenuButton tooltip={item.title} className="flex gap-2 items-center" asChild>
                  <Link to={item.url}>
                    <item.icon size={20} />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <NavMain items={[
              {
                title: "Flows",
                url: "/",
                icon: Workflow,
                items: [
                  {
                    title: "Templates",
                    url: "/flows/template"
                  },
                  {
                    title: "Instances",
                    url: "/flows/instance"
                  }
                ]
              }
            ]} />
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.url + item.title}>
                <SidebarMenuButton className="flex gap-2 items-center" asChild>
                  <Link to={item.url}>
                    <item.icon size={20} />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <NativeUserDropdown />
      </SidebarFooter>
    </Sidebar>
  )
}

