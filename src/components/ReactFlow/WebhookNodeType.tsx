import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlowCard } from "../ui/FlowCard";
import { useReactFlow, type NodeProps } from "reactflow";
import type { FlowNode, FlowNodeData } from "@/@types/Flow";
import { TypographyMuted, TypographySmall } from "../ui/Typography";
import { DefaultNodeComponents } from "./DefaultNodeComponents";
import { DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { CustomDropdownMenuItem, CustomDropwdownMenuContent } from "../UserDropdown";
import { Workflow } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlowDTO, SaveWebhookDTO } from "@/lib/DTO/flow.dto";
import { FormWrapper } from "../ui/FormWrapper";
import { useMutation } from "@tanstack/react-query";
import { ManipulationType, useFlow } from "@/hooks/use-flow";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { FormDescription, FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { FormInput } from "../ui/FormInput";
import { FormSelect } from "../ui/FormSelect";
import { HTTP_METHODS } from "@/lib/constants/http-methods";
import { Tag } from "emblor";
import { SubmitButton } from "../ui/SubmitButton";
import MultiSelectControlled from "../ui/MultiSelectControlled";
import { FormField } from "@/@types/Form";
import { Editor } from "@monaco-editor/react";
import { useThemeStore } from "@/store/theme";
export const WebhookNodeType = React.memo((nodeProps: NodeProps<FlowNodeData>) => {
  const [fieldsFound, setFieldsFound] = useState<FormField[]>([]);
  const theme = useThemeStore((state) => state.theme);

  const params = useParams<{ id: string; type: ManipulationType }>();
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const { getNodes, setNodes, getEdges } = useReactFlow();
  const { replaceNodeById } = useFlow();
  const options = useMemo(
    () => HTTP_METHODS.map((method) => ({
      id: method,
      text: method
    } satisfies Tag)),
    []
  )
  const isWebhook = useMemo(() => nodeProps.data.webhook != undefined, [nodeProps]);

  const methods = useForm<SaveWebhookDTO>({
    resolver: zodResolver(FlowDTO.webhookSchema),
    defaultValues: {
      headers: isWebhook ? nodeProps.data.webhook!.headers ?? [] : [],
      method: isWebhook ? nodeProps.data.webhook!.method ?? "GET" : "GET",
      payload: isWebhook ? nodeProps.data.webhook!.payload ?? [] : [],
      token: isWebhook ? nodeProps.data.webhook!.token ?? "" : "",
      url: isWebhook ? nodeProps.data.webhook!.url ?? "" : "",
    }
  });
  const selectedFieldsInPayload = methods.watch("payload");
  const treatErr = useError();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: replaceNodeById,
    mutationKey: ["replace-node"],
    onSuccess: (data) => {
      toast(data.message)
    },
    onError: (err: AppAxiosError) => treatErr(err)
  });
  // setar um state que vai controlar todos os fields encontrados pela recursao...
  const getPreviousNodeForms = useCallback((fieldsFound: FormField[], nodeId?: string) => {
    if (nodeId) {
      const edgeTargetToActualNode = getEdges()
        .find((edge) => edge.target == nodeId
      );

      if (edgeTargetToActualNode && edgeTargetToActualNode.source) {
        
        const sourceNode = (getNodes() as FlowNode[])
        .find((node) => node.id == edgeTargetToActualNode.source)
        
        if (sourceNode) {
          if (sourceNode.type == "form") {
            let fields: FormField[] = [];
            sourceNode.data.form!.sections.forEach((section) => {
              fields = [...section.fields, ...fields];
            })
            fieldsFound = [...fieldsFound, ...fields]
            return getPreviousNodeForms(fieldsFound, sourceNode.id);
          } 
          return getPreviousNodeForms(fieldsFound, sourceNode.id);
        }
      }
    }
    return fieldsFound
  }, [getNodes]);

  const handleSaveWebHookData = useCallback(async (data: SaveWebhookDTO) => {
    // return;
    let nodeUpdated = {} as FlowNode;
    const nodesUpdated = (getNodes() as FlowNode[]).map((node) => {
      if (node.id == nodeProps.id) {
        nodeUpdated = {
          ...node,
          data: {
            ...node.data,
            webhook: data as SaveWebhookDTO,
          }
        } as FlowNode
        mutateAsync({
          flow: {
            id: parseInt(params.id!),
            type: params.type!
          },
          node: nodeUpdated
        });
        return nodeUpdated;
      }
      return node;
    })
    setNodes(nodesUpdated);
  }, [params, nodeProps, getNodes, setNodes]);
  useEffect(() => {
    const fieldsFound = getPreviousNodeForms([], nodeProps.id);
    setFieldsFound(fieldsFound)
  }, [nodeProps, getPreviousNodeForms])
  return (
    <FlowCard
      status={nodeProps.data.status ?? "pending"}
      title="Webhook"
      dropdownContent={
        <CustomDropwdownMenuContent>
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <CustomDropdownMenuItem title="Edit" icon={Workflow} onClick={() => setIsEditingOpen(true)} />
          <CustomDropdownMenuItem title="Set as trigger" icon={Workflow} />
        </CustomDropwdownMenuContent>
      }
    >
      <Dialog open={isEditingOpen} onOpenChange={setIsEditingOpen}>
        <DialogTrigger >
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Webhook settings</DialogTitle>
            <DialogDescription>Edit here webhook settings like url, body, token...</DialogDescription>
          </DialogHeader>
          <FormProvider {...methods}>
            <FormWrapper handleSubmitForm={handleSaveWebHookData}>
              <FormItem>
                <Label htmlFor="url">
                  URL
                </Label>
                <FormInput<keyof SaveWebhookDTO>
                  name="url"
                  id="url"
                  placeholder="Endpoint for requests"
                />
                <FormDescription >
                  Plune.app will make requests in this route
                </FormDescription>
              </FormItem>
              <FormItem>
                <Label htmlFor="token">
                  Token for auth
                </Label>
                <FormInput<keyof SaveWebhookDTO>
                  placeholder="URL endpoint"
                  name="token"
                  id="token"
                />
                <FormDescription>
                  In case of authenticated route
                </FormDescription>
              </FormItem>
              <FormItem>
                <Label htmlFor="method-http">
                  HTTP Method
                </Label>
                <FormSelect<keyof SaveWebhookDTO>
                  name="method"
                  options={options}
                />
              </FormItem>
              <FormItem>
                <Label htmlFor="">
                  Paylaod
                </Label>
                <MultiSelectControlled
                  placeholder="Payload fields"
                  options={fieldsFound ? fieldsFound.map((field) => ({ label: field.name, value: field.name })) : []}
                  selected={selectedFieldsInPayload ?? []}
                  // TODO finalizar selecao de itens para enviar dentro de payload de requisicao
                  setSelected={(newSelecteds) => methods.setValue("payload", newSelecteds)}
                />
                <FormDescription>
                  Set fields that becomes from others forms to send in request payload data
                </FormDescription>
              </FormItem>
              <SubmitButton isPending={isPending} />
            </FormWrapper>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-2">
        <TypographySmall content={nodeProps.data.label} />
        <TypographyMuted content={nodeProps.data.webhook?.url ?? "url"} />
        <TypographyMuted content={nodeProps.data.webhook?.token ?? "token"} />
        <TypographyMuted content={nodeProps.data.webhook?.method ?? "method"} />
        <footer className="flex flex-col gap-2">
          <Label>Preview request payload</Label>
          <Editor 
            options={{ minimap : { enabled : false }, renderLineHighlightOnlyWhenFocus : true }}
            className="rounded-lg"
            theme={theme == "dark" ? "vs-dark" : "vs-light"}
            defaultLanguage="javascript"
            defaultValue="// some content"
            height={"200px"}
          />
        </footer>
        {/* Adicionar visualizacao de payload em formato de json */}
      </div>
      <DefaultNodeComponents nodeProps={nodeProps} />
    </FlowCard>
  );
})