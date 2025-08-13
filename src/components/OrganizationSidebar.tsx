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
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/service/api";
import { footerItems } from "@/lib/sidebar-nav";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { NativeUserDropdown } from "./UserDropdown";

export function OrganizationSidebar() {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      //rota validada por token, necessário passar para sempre validar se o usuario que faz requisição faz parte da organização no hostname
      const response = await api.get("organization-forms");
      return response.data;
    },
    queryKey: ["organization-pages"],
    // READ ME: NOT ENABLED CUZ ROUTE ISNT IN API, PAPI    
    enabled: false
  });
  return (
    <Sidebar collapsible="icon" variant="inset"  >
      <SidebarHeader className=" title-bar-drag-region">
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent className="p-2 flex flex-col justify-between dark:bg-zinc-900" >
        <SidebarGroupContent>
          <SidebarMenu>
            {/* will be rendered when getting in api */}
            {/* {headerItems.map((item) => (
              <SidebarMenuItem key={item.url + item.title} className=" no-drag">
                <SidebarMenuButton tooltip={item.title} className="flex gap-2 items-center" asChild>
                  <Link to={item.url}>
                    <item.icon size={20} />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))} */}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* SETTINGS, HELP AND OTHER */}
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

