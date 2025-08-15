import type { Flow } from "@/@types/Flow";
import { GenericTable } from "@/components/custom/GenericTable";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useFlow } from "@/hooks/use-flow";
import { useSeo } from "@/hooks/use-seo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useFlowColumns } from "@/hooks/use-flow-columns";
import { useUserStore } from "@/store/user";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetFlowReturn } from "@/@types/req-return";
import { FlowForm } from "@/components/forms/FlowForm";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { ConfirmationDialogContent } from "@/components/ui/ConfirmationAlertDialog";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";

export function FlowTemplates() {
  const { getOrganizationTemplateFlows, deleteFlow, restoreFlow } = useFlow();
  const selectedOrganization = useUserStore((state) => state.selectedOrganization);
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);
  const [flowTemplateToEdit, setFlowTemplateToEdit] = useState<Flow>();
  const [flowTemplateToDelete, setFlowTemplateToDelete] = useState<Flow>();
  const [pageIndex, setPageIndex] = useState(1);
  const treatErr = useError();
  const { getTemplateColumns } = useFlowColumns(
    "/flows/diagram/template/",
    (template) => {
      setFlowTemplateToEdit(template)
      setOpen(true)
    }
  );
  useSeo({
    title: "Flows - templates",
    description: "Aqui você pode visualizar, criar fluxos de trabalho e monitorá-los",
    ogDescription: "Aqui você pode visualizar, criar fluxos de trabalho e monitorá-los"
  })
  const flowQueryKey = useMemo(() => ([
    "get-org-template-flows",
    selectedOrganization ? selectedOrganization.id : undefined,
    pageIndex
  ]), [selectedOrganization ? selectedOrganization.id : undefined, pageIndex]);

  const { data: response, isLoading } = useQuery({
    queryFn: async () => await getOrganizationTemplateFlows({ page: pageIndex }) as GetFlowReturn,
    queryKey: flowQueryKey,
    refetchOnWindowFocus: false,
    enabled: selectedOrganization != undefined
  });

  const { mutateAsync: restoreAsync, isPending: isPendingRestoring } = useMutation({
    mutationFn: restoreFlow,
    mutationKey: ["restore-flow"],
    onSuccess: (_, variable) => {
      queryClient.setQueryData(flowQueryKey, (prev: GetFlowReturn) => {
        return {
          count: prev.count,
          data: prev.data.map((item) => {
            if (item.id == variable.id) {
              return { ...item, deleted: false }
            }
            return item;
          }),
          statusCode: prev.statusCode,
        } satisfies GetFlowReturn
      })
      toast("Organization restored!");
    },
  })
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteFlow,
    mutationKey: ["delete-flow"],
    onSuccess: (data, variable) => {
      queryClient.setQueryData(
        flowQueryKey,
        (prev: GetFlowReturn) => {
          return {
            count: prev.count,
            data: prev.data.map((item) => {
              if (item.id == variable.id) {
                return { ...item, deleted: true }
              }
              return item;
            }),
            statusCode: prev.statusCode
          } satisfies GetFlowReturn
        }
      )
      toast(
        data.message,
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
      );
      setAlertOpen(false);
    },
    onError: (err: AppAxiosError) => {
      treatErr(err);
    }
  });
  const handleDeleteFlow = useCallback(async (id: number) => {
    await mutateAsync({ id, type: "template" });
  }, [])

  return (
    <ScreenWrapper>
      {!isLoading && response && (
        <GenericTable<Flow>
          newItem={{
            dialog: (
              <Dialog open={open} onOpenChange={(open) => {
                if (!open) {
                  setFlowTemplateToEdit(undefined);
                }
                setOpen(open);
              }}>
                <DialogTrigger>
                  <Button variant={"outline"}>
                    <Plus size={15} />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    New Flow Template
                  </DialogTitle>
                  <DialogDescription>
                    Create an new or update someone existing here
                  </DialogDescription>
                  <FlowForm
                    setOpen={(bool) => setOpen(bool)}
                    flowQueryKey={flowQueryKey}
                    flowTemplateToEdit={flowTemplateToEdit}
                  />
                </DialogContent>
              </Dialog>
            )
          }}
          searchFilterColumnInput={{ accssorKey: "name", placelholder: "Flow name..." }}
          data={response.data && response.data.filter(item => !item.deleted)}
          manualPagination
          columns={
            getTemplateColumns({
              setDataToDelete: (flow) => {
                setFlowTemplateToDelete(flow as Flow);
                setAlertOpen(true);
              }
            })
          }
          pageIndex={pageIndex}
          setPageIndex={(page) => setPageIndex(page)}
          pageCount={response.count}
        />
      )}
      {isLoading && (
        <TableSkeleton />
      )}
      {flowTemplateToDelete && (
        <Dialog
          modal={false}
          open={alertOpen}
          onOpenChange={(open) => {
            setAlertOpen(open);
            if (!open) {
              setFlowTemplateToDelete(undefined);
            }
          }}>
          <ConfirmationDialogContent
            action={() => handleDeleteFlow(flowTemplateToDelete.id)}
            confirmationName={flowTemplateToDelete.name}
            isPending={isPending}
            subject="flow template"
          />
        </Dialog>
      )}
    </ScreenWrapper>
  )
}