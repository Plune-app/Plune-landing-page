import { EllipsisVertical, LogOut, type LucideIcon, SunMoon, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarMenuButton } from "./ui/sidebar";
import { DragEventHandler, type MouseEvent } from "react";
import { TypographyMuted, TypographySmall } from "./ui/Typography";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User } from "@/@types/user";
import { useUser } from "@/hooks/use-user";
import { useUserStore } from "@/store/user";
import { useTheme } from "./ThemeProvider";
export function NativeUserDropdown() {
  const user = useUserStore(state => state.user)
  const { toggleTheme } = useTheme()
  const { logout } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserSidebarButton user={user} />
      </DropdownMenuTrigger>
      <CustomDropwdownMenuContent>
        <DropdownMenuLabel >
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CustomDropdownMenuItem icon={SunMoon} onClick={() => toggleTheme()} title="Theme" />
        <CustomDropdownMenuItem icon={UserIcon} onClick={() => console.log("Perfil")} title={user ? user.email! : ""} />
        <DropdownMenuSeparator />
        <CustomDropdownMenuItem icon={LogOut} onClick={logout} title="Logout" />
      </CustomDropwdownMenuContent>
    </DropdownMenu>

  );
}
interface Props {
  title: string;
  icon: LucideIcon;
  onClick?: (e: MouseEvent) => void;
  variant?: "default" | "destructive"
  active?: boolean
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLDivElement>
}
export function CustomDropdownMenuItem({
  onDragStart,
  draggable,
  icon: Icon,
  onClick,
  title,
  variant = "default",
  active
}: Props) {
  return (
    <DropdownMenuItem
      draggable={draggable}
      onClick={onClick}
      variant={variant}
      onDragStart={onDragStart}
      className={`px-2 py-2  hover:bg-zinc-200 flex items-center gap-2 dark:hover:bg-zinc-700 ${active ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
    >
      <Icon size={15} />
      <TypographySmall
        content={title}
      />
    </DropdownMenuItem>
  )
}

export function CustomDropwdownMenuContent({ children }: { children?: React.ReactNode }) {
  return (
    <DropdownMenuContent
      align="end"
      side={"right"}
      className=" bg-zinc-50 border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 rounded-lg"
    >
      {children}
    </DropdownMenuContent>
  )
}
interface UserSidebarButtonProps {
  user: User | null
}
export function UserSidebarButton({ user }: UserSidebarButtonProps) {
  return (
    <SidebarMenuButton size={"lg"} className="no-drag bg-zinc-100 dark:bg-transparent  p-2 rounded-lg hover:bg-zinc-200  dark:hover:bg-zinc-700/80 flex justify-between items-center w-full">
      <aside className="flex gap-1.5 items-center" >
        <Avatar>
          <AvatarImage className="rounded-full h-10 w-10" src={user ? user?.avatar : ""} />
          <AvatarFallback>{user ? user?.name.charAt(0) : ""} </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 items-start">
          <TypographySmall content={user ? user!.name : ""} />
          <TypographyMuted className="max-w-[130px] overflow-hidden overflow-ellipsis" content={user ? user.email! : ""} />
        </div>
      </aside>
      <EllipsisVertical size={20} />
    </SidebarMenuButton>
  )
}
