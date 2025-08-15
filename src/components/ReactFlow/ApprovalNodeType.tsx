import React, { useCallback, useMemo } from "react";
import { DefaultNodeComponents } from "./DefaultNodeComponents";
import { useReactFlow, type NodeProps } from "reactflow";
import type { Approver, FlowNode, FlowNodeData } from "@/@types/Flow";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { FlowCard } from "../ui/FlowCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetAllowedUsersReturn, userOrganizations } from "@/hooks/use-organization";
import { SelectInput } from "../ui/SelectInput";
import { Tag } from "emblor";
import { useFlow } from "@/hooks/use-flow";
import { useParams } from "react-router-dom";

export const ApprovalNodeType = React.memo((nodeProps: NodeProps<FlowNodeData>) => {
  const params = useParams<{ id: string; type: "template" | "instance" }>();
  const flow = useMemo(() => ({ id: parseInt(params.id!), type: params.type! }), [params]);
  const { getNodes, setNodes } = useReactFlow();
  const { replaceNodeById } = useFlow();
  const { getAllowedUsersToApprove } = userOrganizations();
  const { data: response } = useQuery({
    queryKey: ["allowed-users"],
    queryFn: getAllowedUsersToApprove,
    enabled: false
  }) as UseQueryResult<GetAllowedUsersReturn>;

  const { mutateAsync } = useMutation({
    mutationFn: replaceNodeById,
    mutationKey: ['save-approvers'],
  });
 const onChangeApprover = useCallback((id: string, userId: number) => {
  const user = response?.data.find(item => item.user.id === userId)?.user;
  if (!user) return;

  const updatedNodes = (getNodes() as FlowNode[]).map((node) => {
    if (node.id === nodeProps.id) {
      const newApprovers = (node.data.approvers ?? []).map((approver) =>
        approver.id === id
          ? { ...approver, userId: user.id, email: user.email }
          : approver
      );

      const newNode: FlowNode = {
        ...node,
        data: {
          ...node.data,
          approvers: newApprovers,
        },
      };

      mutateAsync({ flow, node: newNode });
      return newNode;
    }
    return node;
  });

  setNodes(updatedNodes);
}, [response, nodeProps.id, flow, getNodes, setNodes]);

  const handleAddApproverField = useCallback(() => {
    let nodeToReplace = {} as FlowNode;
    const nodesUpdated = (getNodes() as FlowNode[]).map((node) => {
      if (node.id == nodeProps.id) {
        nodeToReplace = {
          ...node,
          data: {
            ...node.data,
            approvers: [...(node.data.approvers ?? []), { id: crypto.randomUUID() } as Approver]
          }
        }
        return nodeToReplace;
      }
      return node;
    })
    setNodes(nodesUpdated);
  }, [nodeProps, flow]);
  const handleDeleteApproverField = useCallback((id: string) => {
    let nodeToReplace: FlowNode = {} as FlowNode;
    const nodesUpdated = (getNodes() as FlowNode[]).map((node) => {
      if (node.id == nodeProps.id) {
        nodeToReplace = { ...node, data: { ...node.data, approvers: node.data.approvers?.filter(app => app.id != id) } }
        return nodeToReplace;
      }
      return node;
    });
    setNodes(nodesUpdated);
    mutateAsync({ flow, node: nodeToReplace })

  }, [nodeProps]);

  return (
    <FlowCard
      headerAction={
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={handleAddApproverField} variant={"ghost"}>
              <Plus size={15} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Add approver
          </TooltipContent>
        </Tooltip>
      }
      status={nodeProps.data.status ?? "pending"}
      title="Approvers"
    >
      {nodeProps.data.approvers && nodeProps.data.approvers.length > 0 && response && response.data && (
        nodeProps.data.approvers.map((approver) => (
          <div className="flex items-center gap-2" key={approver.id}>
            <SelectInput
              label="Organization users"
              placeholder="Set approver"
              onChangeValue={(value) => onChangeApprover(approver.id, Number(value))}
              options={response.data.map((item) => ({ id: item.user.id!.toString(), text: item.user.email } satisfies Tag))}
              className="cursor-text"
              value={approver.userId}
            />
            <Button
              onClick={() => handleDeleteApproverField(approver.id)}
              variant={"destructive"}>
              <Trash size={15} />
            </Button>
          </div>
        ))
      )}
      <DefaultNodeComponents nodeProps={nodeProps} />
    </FlowCard>
  )
}) 
