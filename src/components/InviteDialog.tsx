"use client"
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react"
import { CheckIcon, CopyIcon, EllipsisVertical, Loader2, UserRoundPlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Organization } from "@/@types/Organization"
import { DialogClose } from "@radix-ui/react-dialog"
import { Roles, User } from "@/@types/user"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import MultipleSelector, { Option } from "./ui/multiselect"
import { TypographySmall } from "./ui/Typography"
import { useUser } from "@/hooks/use-user"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/user"

const roles: Roles[] = ["Admin", "Approver", "Editor", "Viewer"];

export interface UsersOrgPayload extends User {
  role?: Roles
}
interface InviteDialogProps {
  usersOrg: UsersOrgPayload[];
  setUsersOrg: Dispatch<SetStateAction<UsersOrgPayload[]>>
  organization?: Organization;
}
export function InviteDialog({ organization, usersOrg, setUsersOrg }: InviteDialogProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastInputRef = useRef<HTMLInputElement>(null);
  const { getUsersByEmail } = useUser();
  const appUser = useUserStore(state => state.user);

  const handleCopy = useCallback(() => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [inputRef]);

  const onSearch = useCallback(async (value: string) => {
    const { data } = await getUsersByEmail(value);
    if (data) {
      return data
        .filter((user) => user.id != appUser?.id)
        .map((user) => ({
          label: user.email,
          value: user.id?.toString()!,
          avatar: user.avatar,
          role: "Viewer"
        } satisfies Option))
    }
    return []
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">Invite members</Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90%]"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          lastInputRef.current?.focus()
        }}
      >
        <div className="flex flex-row gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UserRoundPlusIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Invite team members</DialogTitle>
            <DialogDescription className="text-left">
              Invite teammates to earn free components.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label>Invite via email</Label>
              <MultipleSelector
                //TODO : DEFINE MAX USERS SELECTED ACCORDING PLAN IN FUTURE
                value={
                  usersOrg.map(
                    (user) => ({
                      label: user.email,
                      value: user.id!.toString(),
                      role: user.role
                    } satisfies Option)
                  )
                }
                maxSelected={20}
                DropdownMenuRole={({ option, selectedOptions, setSelectedOptions }) => {
                  const handleSelectRole = (role: Roles) => {
                    const newOptions = selectedOptions.map((opt) => {
                      if (opt.value == option.value) {
                        return { ...option, role: role }
                      }
                      return opt;
                    })
                    setUsersOrg(
                      usersOrg.map((user) => {
                        if (user.id!.toString() == option.value) {
                          return { ...user, role: role}
                        }
                        return user;
                      })
                    )
                    setSelectedOptions(newOptions);
                  }
                  return (
                    <DropdownMenu >
                      <DropdownMenuTrigger className="flex items-center px-2 rounded-full">
                        {option.role ? (option.role as string).charAt(0) : "V"}
                        <EllipsisVertical size={15} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-50">
                        <DropdownMenuLabel>
                          Roles
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {roles.map((role) => (
                          <DropdownMenuItem onClick={() => handleSelectRole(role)} key={role}>
                            {role}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }}
                emptyIndicator={<div className="text-muted-foreground">No results found</div>}
                onChange={
                  (val) => setUsersOrg(
                    val.map((opt) => ({
                      id: Number(opt.value),
                      email: opt.label,
                      role: opt.role,
                      name: opt.label,

                    } as UsersOrgPayload))
                  )
                }
                loadingIndicator={<Loader2 className="animate-spin m-auto" />}
                onSearch={onSearch}
                OptionItem={
                  ({ label, avatar }) =>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage className="rounded-full h-10 w-10" src={avatar ? avatar : ""} />
                        <AvatarFallback className="dark:bg-zinc-900">{label ? label.charAt(0) : ""} </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1 items-start">
                        <TypographySmall content={label ? label : ""} />
                      </div>
                    </div>
                }
              />
            </div>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={usersOrg.length == 0}
              className="w-full"
            >
              Save
            </Button>
          </DialogClose>
        </form>
        {organization?.id && (
          <>
            <hr className="my-1 border-t" />
            <div className="*:not-first:mt-2">
              <Label>Invite via magic link</Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  className="pe-9"
                  type="text"
                  defaultValue="https://originui.com/refer/87689"
                  readOnly
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={copied ? "Copied" : "Copy to clipboard"}
                        disabled={copied}
                      >
                        <div
                          className={cn(
                            "transition-all",
                            copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                          )}
                        >
                          <CheckIcon
                            className="stroke-emerald-500"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            "absolute transition-all",
                            copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                          )}
                        >
                          <CopyIcon size={16} aria-hidden="true" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy to clipboard
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
