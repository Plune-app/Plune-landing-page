import type { Form } from "@/@types/Form";
import { BaseRequestsReturn } from "@/@types/req-return";
import { GenericTable } from "@/components/custom/GenericTable";
import { DynamicFlowForm } from "@/components/DynamicFlowForm";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationAlertDialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { useFormColumns } from "@/hooks/use-form-columns";
import { useSharedQueryKeys } from "@/hooks/use-shared-querykeys";
import { useForm } from "@/hooks/use-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function Forms() {
  const { getOrganiztionForms, deleteForm, restoreForm } = useForm();
  const { formsQueryKey } = useSharedQueryKeys();
  const queryClient = useQueryClient();
  const treatErr = useError();

  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [detailedForm, setDetailedForm] = useState<Form>();
  const [formToDelete, setFormToDelete] = useState<Form>();
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutateAsync: restoreAsync, isPending: isPendingRestoring } = useMutation({
    mutationFn: restoreForm,
    mutationKey: ["restore-form"],
    onSuccess: (data, variable) => {
      queryClient.setQueryData(formsQueryKey, (prev: BaseRequestsReturn<Form[]>) => {
        return {
          ...prev,
          data: prev.data.map((item) => {
            if (item.id == variable) {
              return { ...item, deleted: false }
            }
            return item;
          })
        }
      })
      toast(data.message);
    },
    onError: (err: AppAxiosError) => {
      treatErr(err);
    }
  })
  const { mutateAsync: deleteAsync, isPending } = useMutation({
    mutationFn: deleteForm,
    onSuccess: (response, variable) => {
      queryClient.setQueryData(
        formsQueryKey,
        (prev: BaseRequestsReturn<Form[]>) => {
          return {
            ...prev,
            data: prev.data.map(form => {
              if (form.id == variable) {
                return { ...form, deleted: true };
              }
              return form;
            })
          } satisfies BaseRequestsReturn<Form[]>
        }
      );
      toast(
        response.message,
        {
          duration: 5000,
          className: 'flex items-center justify-between',
          action: (
            <Button
              size={'sm'}
              className="self-end text-sm"
              onClick={() => restoreAsync(variable)}
            >
              Undo {isPendingRestoring && <Loader2 size={15} className="animate-spin" />}
            </Button>
          ),
        }
      )
      setAlertOpen(false);
    },
    mutationKey: ["delete-form"]
  })

  const { data: response, isLoading } = useQuery({
    queryFn: getOrganiztionForms,
    queryKey: formsQueryKey,
    refetchOnWindowFocus: false,
  });
  const getFormColumns = useFormColumns({ response, setDetailedForm, setOpen: setIsOpen });

  const handleDeleteForm = useCallback(async (id: number) => {
    await deleteAsync(id);
  }, [])

  return (
    <ScreenWrapper>
      {!isLoading && response && response.data && (
        <GenericTable<Form>
          newItem={{
            dialog: (
              <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                  setDetailedForm(undefined);
                }
                setIsOpen(open)
              }}>
                <DialogTrigger asChild>
                  <Button variant={"outline"} >
                    <Plus size={15} />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col h-full min-w-[85%] min-h-[80%] max-h-[85%]">
                  <DialogTitle>
                    Forms
                  </DialogTitle>
                  <DialogDescription>
                    Update, add or remve fields and their orders in the flow form
                  </DialogDescription>
                  <DynamicFlowForm
                    setDetailedForm={setDetailedForm}
                    setIsOpen={setIsOpen}
                    form={detailedForm}
                  />
                </DialogContent>
              </Dialog>
            )
          }}
          setPageIndex={(newPage) => setPage(newPage)}
          pageIndex={page}
          selectable={true}
          searchFilterColumnInput={{ accssorKey: "name", placelholder: "Form name..." }}
          data={response.data.filter(data => !data.deleted)}
          manualPagination={true}
          columns={
            getFormColumns({
              setDataToDelete: (form) => {
                setFormToDelete(form as Form);
                setAlertOpen(true);
              }
            })
          }
          pageCount={response.data.length}
        />
      )}
      {isLoading && (
        <TableSkeleton />
      )}
      {formToDelete && (
        <Dialog
          modal={false}
          open={alertOpen}
          onOpenChange={(open) => {
            setAlertOpen(open);
            if (!open) {
              setFormToDelete(undefined);
            }
          }}>
          <ConfirmationDialogContent
            action={() => handleDeleteForm(formToDelete.id)}
            confirmationName={formToDelete.name}
            isPending={isPending}
            subject="Form"
          />
        </Dialog>
      )}
    </ScreenWrapper>
  );
}