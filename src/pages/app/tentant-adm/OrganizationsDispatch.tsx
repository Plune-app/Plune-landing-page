import { Organization } from "@/@types/Organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/Typography";
import { userOrganizations, UserOrganizationsReturn } from "@/hooks/use-organization";
import { useUserStore } from "@/store/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, EllipsisVertical, Loader2, Pencil } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/hooks/use-user";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { CustomDropdownMenuItem } from "@/components/UserDropdown";
import { useLocation } from "react-router-dom";
import { NewOrganizationCard } from "@/components/NewOrganizationCard";
import ConfirmationDialog from "@/components/ui/ConfirmationAlertDialog";
import { toast } from "sonner";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { DeleteTrigger } from "@/components/ui/DeleteTrigger";
import Skeleton from "react-loading-skeleton";
import { SkeletonThemeProvider } from "@/components/TableSkeleton";

export const OrganizationDispatch = memo(() => {
  const path = useLocation();
  const [organizationEdition, setOrganizationEdition] = useState<Organization | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const { logout } = useUser()
  const queryClient = useQueryClient();
  const {
    getUserOrganizations,
    deleteOrganization,
    restoreOrganization
  } = userOrganizations();
  const user = useUserStore(state => state.user);
  const treatErr = useError();
  const organizationQueryKey = useMemo(() => ["user-organizations", user?.email], [user])
  const setSelectedOrganization = useUserStore(state => state.setSelectedOrganization);
  const selectedOrganization = useUserStore(state => state.selectedOrganization);

  const { data, isLoading } = useQuery({
    queryFn: getUserOrganizations,
    queryKey: organizationQueryKey,
    refetchOnWindowFocus: false,
    retry: 2
  });

  const { mutateAsync: restoreAsync, isPending: isPendingRestoring } = useMutation({
    mutationFn: restoreOrganization,
    mutationKey: ["restore-organization"],
    onSuccess: (_, variable) => {
      queryClient.setQueryData(organizationQueryKey, (prev: UserOrganizationsReturn[]) => {
        return prev.map((item) => {
          if (item.organization.id == variable) {
            return { ...item, deleted: false }
          }
          return item;
        })
      })
      toast("Organization restored!");
    },
    onError: (err: AppAxiosError) => {
      treatErr(err);
    }
  })
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteOrganization,
    mutationKey: ["delete-organization"],
    onSuccess: (_, variable) => {
      queryClient.setQueryData(organizationQueryKey, (prev: UserOrganizationsReturn[]) => {
        return prev.map((item) => {
          if (item.organization.id == variable) {
            return { ...item, deleted: true }
          }
          return item;
        })
      })
      toast(
        "Organization deleted",
        {
          duration: 5000,
          className: 'flex items-center justify-between',
          action: (
            <Button
              size={'sm'}
              className="self-end"
              onClick={() => restoreAsync(variable)}
            >
              Undo {isPendingRestoring && <Loader2 size={15} className="animate-spin" />}
            </Button>
          ),
        }
      )
    }
  })
  const handleDeleteOrganization = useCallback(async (id: number) => {
    await mutateAsync(id);
    setAlertOpen(false);
  }, [])

  useEffect(() => {
    if (!open) {
      setOrganizationEdition(undefined);
    }
  }, [open])
  return (
    <main className="flex flex-col gap-3 p-3">
   
      {!path.pathname.includes("/organizations") && (
        <TypographyH2 content={`${data && data?.length >= 0 ? "Your organizations" : "Create an new organization"}`} />
      )}
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center ">
        {!isLoading && data && data.filter(item => !item.deleted).map((item, idx) => (
          <Card key={idx}>
            <CardHeader className="flex justify-between ">
              <main className="space-y-2">
                <CardTitle>
                  {item.organization.name}
                </CardTitle>
                <CardDescription>
                  Your role - {item.role}
                </CardDescription>
                <CardDescription className="self-end">
                  {formatDistanceToNow(item.organization.createdAt, { addSuffix: true })}
                </CardDescription>
              </main>
              <aside>
                <DropdownMenu>
                  <DropdownMenuTrigger >
                    <Button variant={"ghost"}>
                      <EllipsisVertical size={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <CustomDropdownMenuItem
                      icon={ArrowLeft}
                      title="Exit" onClick={() => { }}
                    />
                    {/* only admins can delete or edit one organization */}
                    {item.role == "Admin" && (
                      <>
                        <CustomDropdownMenuItem
                          icon={Pencil}
                          onClick={() => {
                            setOrganizationEdition(item.organization)
                            setOpen(!open);
                          }} title="Edit"
                        />
                        <DropdownMenuSeparator />
                        <ConfirmationDialog
                          open={alertOpen}
                          setOpen={setAlertOpen}
                          isPending={isPending}
                          action={() => handleDeleteOrganization(item.organization.id!)}
                          alertDialogTrigger={<DeleteTrigger onClick={() => setAlertOpen(true)} />}
                          confirmationName={item.organization.name}
                          subject="organization"
                        />
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </aside>
            </CardHeader>
            <CardContent>
              <Button
                className={"w-full group"}
                variant={'outline'}
                onClick={() => setSelectedOrganization({
                  id: item.organization.id!,
                  name: item.organization.name,
                  logo: item.organization.logo ?? "",
                  role: item.role,
                })}
              >
                {selectedOrganization?.id == item.organization.id ? "Already in" : "Join"}
                <ArrowRight className="group-hover:translate-x-2 transition duration-200" size={20} />
              </Button>
            </CardContent>
          </Card>
        ))}
        {isLoading && (
          <SkeletonThemeProvider>
            {[1, 2, 3].map(() => (
              <Skeleton height={182} className="w-full" />
            ))}
          </SkeletonThemeProvider>
        )}
        <NewOrganizationCard
          open={open}
          setOpen={setOpen}
          organization={organizationEdition}
        />
      </div>
      {!path.pathname.includes("/organizations") && (
        <Button onClick={logout} className="absolute bottom-10 left-10 flex items-center">
          <ArrowLeft size={15} /> Logout
        </Button>
      )}
    </main>
  )
})

