import { FormProvider, useForm } from "react-hook-form";
import { FormWrapper } from "../ui/FormWrapper";
import { FlowDTO, SaveFlowDTO } from "@/lib/DTO/flow.dto";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { FormInput } from "../ui/FormInput";
import { SubmitButton } from "../ui/SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flow } from "@/@types/Flow";
import { useUserStore } from "@/store/user";
import { useCallback } from "react";
import { toast } from "sonner";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFlow } from "@/hooks/use-flow";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { GetFlowReturn } from "@/@types/req-return";
import { Switch } from "../ui/switch";

interface Props {
  flowTemplateToEdit?: Flow;
  flowQueryKey: QueryKey;
  setOpen: (open: boolean) => void;
}
export function FlowForm({ flowTemplateToEdit, flowQueryKey, setOpen }: Props) {
  const queryClient = useQueryClient();
  const { saveOrganizationTemplateFlow } = useFlow();
  const treatErr = useError();

  const selectedOrganization = useUserStore(state => state.selectedOrganization)
  const methods = useForm<SaveFlowDTO>({
    resolver: zodResolver(FlowDTO.saveFlowDTO),
    defaultValues: {
      description: flowTemplateToEdit ? flowTemplateToEdit.description : "",
      name: flowTemplateToEdit ? flowTemplateToEdit.name : "",
    }
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: saveOrganizationTemplateFlow,
    mutationKey: ["save-flow-template"],
    onError: (err: AppAxiosError) => {
      treatErr(err);
    },
    onSuccess: (response, variables) => {
      if (variables.id) {
        queryClient.setQueryData(
          flowQueryKey,
          (prev: GetFlowReturn) => ({
            ...prev,
            data: prev.data.map((item) => {
              if (item.id! == variables.id!) {
                return response.data;
              }
              return item;
            })
          })
        )
        setOpen(false);
        return;
      }
      queryClient.setQueryData(
        flowQueryKey,
        (prev: GetFlowReturn) => {
          if (prev.data.length >= 10) {
            prev.data.pop();
          }
          return { ...prev, data: [response.data, ...prev.data] } satisfies GetFlowReturn
        }
      );
      setOpen(false);
    },

  });

  const handleSubmit = useCallback(async (data: SaveFlowDTO) => {
    if (selectedOrganization) {
      const payload: SaveFlowDTO = {
        ...data,
        id: flowTemplateToEdit ? flowTemplateToEdit.id! : undefined,
        organizationId: selectedOrganization!.id!,
        type: 'template'
      }
      return await mutateAsync(payload);
    }
    toast("Select a organization before", { dismissible: true })
  }, [selectedOrganization, flowTemplateToEdit]);
  return (
    <FormProvider {...methods}>
      <FormWrapper<SaveFlowDTO> handleSubmitForm={handleSubmit}>
        <FormItem>
          <FormLabel htmlFor="name" >
            Name
          </FormLabel>
          <FormInput<keyof SaveFlowDTO> name="name" id="name" placeholder="ex: Workflow ..." />
          <FormDescription >
            How it will be called, is unique by organization
          </FormDescription>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="description" >
            Description
          </FormLabel>
          <FormInput<keyof SaveFlowDTO> name="description" id="name" placeholder="ex: This workflow ..." />
          <FormDescription >
            Describe here what this flow gonna do or something about it
          </FormDescription>
        </FormItem>
        <FormField
          control={methods.control}
          name="isPublished"
          render={({ field }) => {
            return (
              <FormItem >
                <header className="flex items-center gap-2">
                  <FormLabel>
                    Its a published flow
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </header>

                <FormDescription>
                  Once published it means that this flow its already to run
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <SubmitButton isPending={isPending} />
      </FormWrapper>
    </FormProvider>
  )
}