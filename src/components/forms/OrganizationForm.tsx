import { FormProvider, useForm } from "react-hook-form";
import { FormWrapper } from "../ui/FormWrapper";
import { FormDescription, FormItem, FormLabel } from "../ui/form";
import { InviteDialog, UsersOrgPayload } from "../InviteDialog";
import { SubmitButton } from "../ui/SubmitButton";
import { memo, useCallback, useState } from "react";
import { Organization } from "@/@types/Organization";
import { useUserStore } from "@/store/user";
import { userOrganizations, UserOrganizationsReturn } from "@/hooks/use-organization";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrganizationDto, SaveOrgDTO } from "@/lib/DTO/organization.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormInput } from "../ui/FormInput";
import { AppAxiosError, useError } from "@/hooks/use-error";

export const OrganizationForm = memo(({ organization }: { organization?: Organization }) => {
  const user = useUserStore(state => state.user);
  const [usersOrg, setUsersOrg] = useState<UsersOrgPayload[]>([]);
  const { saveOrganization } = userOrganizations();
  const queryClient = useQueryClient();
  const treatError = useError();
  const methods = useForm<SaveOrgDTO>({
    resolver: zodResolver(OrganizationDto.SaveOrgDto),
    defaultValues: {
      name: organization && organization.name ? organization.name : "",
    }
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: saveOrganization,
    mutationKey: ["save-org"],
    onSuccess: (response, variable) => {
      toast("Organization saved");

      queryClient.setQueryData(
        ["user-organizations", user?.email],
        (prev: UserOrganizationsReturn[]) => {
          if (variable.id) {
            return prev.map((data) => {
              if (data.organization.id === variable.id) {
                return {
                  organization: response.data as Organization,
                  id: response.data.id,
                  role: "Admin"
                } as UserOrganizationsReturn
              }
              return data;
            })
          }
          return [...prev, {
            organization: response.data as Organization,
            id: response.data.id,
            role: "Admin"
          }]
        }
      )
    },
    onError: (err: AppAxiosError) => {
      treatError(err)
    }
  })
  const handleSubmit = useCallback(async (data: SaveOrgDTO) => {
    const payload: SaveOrgDTO = {
      id: organization ? organization.id : undefined,
      name: data.name,
      users: usersOrg.map((userOrg) => ({ id: userOrg.id!, role: userOrg.role! }))
    }
    await mutateAsync(payload);
  }, [organization, usersOrg])
  return (
    <FormProvider {...methods}>
      <FormWrapper handleSubmitForm={handleSubmit}>
        <FormItem>
          <FormLabel htmlFor="name">
            Name
          </FormLabel>
          <FormInput<keyof SaveOrgDTO>
            id="name"
            name="name"
          />
          <FormDescription>
            How the organization will be called
          </FormDescription>
        </FormItem>
        <InviteDialog
          setUsersOrg={setUsersOrg}
          usersOrg={usersOrg}
          organization={organization}
        />
        <SubmitButton isPending={isPending} />
      </FormWrapper>
    </FormProvider>

  )
})