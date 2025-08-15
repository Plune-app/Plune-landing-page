import type { Form, FormSections } from "@/@types/Form";
import { Reorder } from "framer-motion";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { FormItem, FormLabel } from "./ui/form";
import { FormInput } from "./ui/FormInput";
import { useForm as useFormHook } from "@/hooks/use-form"
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { FlowDTO, FormSectionsSchema, SaveFormDTO } from "@/lib/DTO/flow.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "./ui/SubmitButton";
import { FormWrapper } from "./ui/FormWrapper";
import { useUserStore } from "@/store/user";
import { useSharedQueryKeys } from "@/hooks/use-shared-querykeys";
import { BaseRequestsReturn } from "@/@types/req-return";
import { toast } from "sonner";
import { SectionSlot } from "./forms/SectionSlot";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
  form?: Form;
  isEditable?: boolean;
  setIsOpen: (open: boolean) => void;
  setDetailedForm: (form? : Form) => void;
}
export function DynamicFlowForm({ form, setIsOpen, setDetailedForm }: Props) {
  const methods = useForm<SaveFormDTO>({
    resolver: zodResolver(FlowDTO.form),
    defaultValues: {
      name: form ? form.name : "",
    }
  });
  const { saveForm } = useFormHook();
  const treatErr = useError();
  const selectedOrganization = useUserStore(state => state.selectedOrganization);
  const user = useUserStore(state => state.user);
  const queryClient = useQueryClient();
  const { formsQueryKey } = useSharedQueryKeys();
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: saveForm,
    mutationKey: ["save-org-form"],
    onSuccess: (response, variable) => {
      toast(response.message);
      queryClient.setQueryData(
        formsQueryKey,
        (prev: BaseRequestsReturn<Form[]>): BaseRequestsReturn<Form[]> => {
          if (variable.id) {
            return {
              ...prev,
              data: prev.data.map((prevForm) => {
                if (prevForm.id! == variable.id!) {
                  return { ...form, ...variable } as unknown as Form;
                }
                return prevForm;
              })
            }
          }
          return {
            ...prev,
            data: [
              ...prev.data,
              {
                ...response.data,
                ...variable as unknown as Form,
                id: response.data.id,
                createdBy: {
                  name: user?.name,
                  email: user?.email,
                  avatar: user?.avatar
                }
              }
            ]
          }
        }
      )
      setDetailedForm(undefined);
      setIsOpen(false);
    },
    onError: (err: AppAxiosError) => treatErr(err)
  });

  const [sectionsIds, setSectionsIds] = useState(
    form && form.sections ? form.sections.map((section) => section.id) : []
  );

  const [sectionsSlots, setSectionsSlots] = useState<FormSections[]>(
    form && form.sections ? form.sections : []
  );

  const onReorderSections = useCallback((newOrder: (string | number)[]) => {
    const newOrderForSections = newOrder.map(
      (order) => sectionsSlots.find(
        (section) => section.id == order)!
    );

    setSectionsSlots(newOrderForSections.map((section, i) => ({ ...section, order: i })))
  }, [sectionsSlots])

  const onReorderFields = useCallback((newOrder: (string | number)[], sectionId: string) => {
    const sectionUpdated = sectionsSlots.find((section) => section.id == sectionId)
    if (sectionUpdated) {
      setSectionsSlots(
        sectionsSlots.map((sec) => {
          if (sec.id == sectionUpdated.id) {
            const newOrderForFields = newOrder.map(
              order => sec.fields.find((fieldSlot) => fieldSlot.id == order)!
            );
            return {
              ...sec,
              fields: newOrderForFields,
            }
          }
          return sec;
        })
      )
    }
  }, [sectionsSlots]);

  const handleAddNewField = useCallback((sectionId: string) => {
    const newFieldId = crypto.randomUUID()
    setSectionsSlots(
      sectionsSlots.map((section) => {
        if (section.id == sectionId) {
          return {
            ...section,
            fields: [
              ...section.fields,
              {
                id: newFieldId,
                label: "Doubleclick me!",
                description: "Example description",
                placeholder: "change placeholder",
                name: "name - " + crypto.randomUUID().split('-')[0],
                type: "text",
              }
            ]
          }
        }
        return section
      })
    );
  }, [sectionsSlots, sectionsIds]);

  const handleAddNewSection = useCallback(() => {
    const newSectionId = crypto.randomUUID();
    setSectionsSlots([...sectionsSlots, { fields: [], id: newSectionId, layout: "cols-3" }]);
    setSectionsIds([...sectionsIds, newSectionId]);
  }, [sectionsIds, sectionsSlots])

  const handleDeleteField = useCallback((id: (string | number), sectionId: string) => {
    setSectionsSlots(
      sectionsSlots.map((section) => {
        if (section.id == sectionId) {
          return {
            ...section,
            fields: section.fields.filter(field => field.id != id)
          }
        }
        return section;
      })
    )
  }, [sectionsSlots]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    setSectionsSlots(
      sectionsSlots.filter((section) => section.id != sectionId)
    );
  }, [sectionsSlots]);

  const handleSubmit = useCallback(async (payload: SaveFormDTO) => {
    const payloadToSend: SaveFormDTO = {
      ...payload,
      sections: sectionsSlots as FormSectionsSchema[],
      organizationId: selectedOrganization!.id,
      id: form ? Number(form.id) : undefined
    }
    return await mutateAsync(payloadToSend);
  }, [mutateAsync, selectedOrganization, form, sectionsSlots]);

  return (
    <>
      <FormProvider {...methods}>
        <FormWrapper className="h-full flex flex-col" handleSubmitForm={handleSubmit}>
          <header className="flex items-end gap-4 pb-5 border-b w-full">
            <FormItem>
              <FormLabel htmlFor="name">
                Name
              </FormLabel>
              <FormInput<keyof SaveFormDTO> id="name" name="name" placeholder="Form name" />
            </FormItem>
            <Button onClick={handleAddNewSection} variant={"outline"} type="button">
              Add section <Plus size={15} />
            </Button>
            <SubmitButton isPending={isPending} />
          </header>
          <ScrollArea className="max-h-full overflow-hidden overflow-y-auto mb-14">
            {sectionsSlots.length > 0 && (
              <Reorder.Group
                onReorder={onReorderSections}
                values={sectionsIds}
                axis="y"
                className="flex flex-col gap-4 "
              >
                {sectionsSlots.map((section) => (
                  <SectionSlot
                    canManipulate={true}
                    sectionsSlots={sectionsSlots}
                    setSectionsSlots={setSectionsSlots}
                    handleAddField={handleAddNewField}
                    onFieldsReorder={onReorderFields}
                    handleDeleteSection={() => handleDeleteSection(section.id)}
                    section={section}
                    handleDeleteField={handleDeleteField}
                    key={section.id}
                  />
                ))}
              </Reorder.Group>
            )}
          </ScrollArea>
        </FormWrapper>
      </FormProvider>
    </>
  );
}

