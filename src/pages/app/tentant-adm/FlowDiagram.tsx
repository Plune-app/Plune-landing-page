import ReactFlow, { useNodesState, useEdgesState, Controls, Background, MiniMap, BackgroundVariant, type Connection, ConnectionMode, MarkerType, NodeProps, useReactFlow, Edge, applyNodeChanges, NodeChange, applyEdgeChanges, EdgeChange, Panel, Node } from "reactflow"
import type { ConditionRule, FlowNode, FlowNodeData, FlowNodeType, Position } from "@/@types/Flow";
import { FloatingEdge } from "@/components/ReactFlow/FloatingEdge";
import { FormNodeType } from "@/components/ReactFlow/FormNodeType";
import { StageNodeType } from "@/components/ReactFlow/StageNodeType";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConditionNodeType } from "@/components/ReactFlow/ConditionNodeType";
import { ApprovalNodeType } from "@/components/ReactFlow/ApprovalNodeType";
import { WebhookNodeType } from "@/components/ReactFlow/WebhookNodeType";
import { FlowPanel } from "@/components/ReactFlow/FlowPanel";
import { Form } from "@/@types/Form";
import { useUserStore } from "@/store/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ManipulationType, useFlow } from "@/hooks/use-flow";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Cloud, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AppAxiosError, useError } from "@/hooks/use-error";
import { toast } from "sonner";
import { userOrganizations } from "@/hooks/use-organization";

export type AppNodeTypes = Record<FlowNodeType, React.MemoExoticComponent<(nodeProps: NodeProps<any>) => JSX.Element>>

export function FlowDiagram() {
  const params = useParams<{ id: string; type: "template" | "instance" }>();
  const [lastApiMessage, setLastApiMessage] = useState<string>("");
  const nodeTypes: AppNodeTypes = useMemo(() => ({
    form: FormNodeType,
    stage: StageNodeType,
    approval: ApprovalNodeType,
    condition: ConditionNodeType,
    webhook: WebhookNodeType,
  }), []);
  const EDGE_TYPES = useMemo(() => ({
    "floating": FloatingEdge
  }), []);
  const user = useUserStore((state) => state.user);
  const selectedOrganization = useUserStore((state) => state.selectedOrganization);

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { screenToFlowPosition, getNodes } = useReactFlow();
  const {
    updateFlowNodesAndEdges,
    getFlowByOrgIdAndFlowId,
    updateNodePosition,
    addNodeToFlow,
  } = useFlow();
  const { getAllowedUsersToApprove } = userOrganizations();
  const treatErr = useError();

  const { data, isLoading: isLoadingFlows } = useQuery({
    queryKey: [`org-flow-${params.type}`, selectedOrganization?.id, params.id],
    queryFn: async () => getFlowByOrgIdAndFlowId({
      id: parseInt(params.id!),
      type: params.type as ManipulationType
    }),
    enabled: params && params.id != undefined,
    refetchOnWindowFocus: false
  })
  useQuery({
    queryKey: ["allowed-users"],
    queryFn: getAllowedUsersToApprove,
    enabled: data != undefined
  })
  const { isPending: isPendingPos, mutateAsync: updateNodePositionAsync } = useMutation({
    mutationFn: updateNodePosition,
    mutationKey: ["update-node-position"],
    onSuccess: (data) => setLastApiMessage(data.message),
    onError: (err: AppAxiosError) => treatErr(err)
  })

  const { isPending: isPendingReplacement } = useMutation({
    mutationKey: ["replace-node", params.id],
    onSuccess: (data: any) => setLastApiMessage(data.message),
    onError: (err: AppAxiosError) => treatErr(err)
  });

  const { mutateAsync: addNewNodeAsync, isPending: isDropping } = useMutation({
    mutationFn: addNodeToFlow,
    mutationKey: ["add-new-node"],
    onSuccess: (data) => setLastApiMessage(data.message),
    onError: (err: AppAxiosError) => treatErr(err)
  })
  const {
    mutateAsync,
    isPending
  } = useMutation({
    mutationFn: updateFlowNodesAndEdges,
    mutationKey: ["update-flow-nodes-edges"],
    onSuccess: (data) => setLastApiMessage(data.message),
    onError: (err: AppAxiosError) => treatErr(err),
  })
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds))
  }, [setEdges]);


  const onConnect = useCallback(async (connection: Connection) => {
    if (connection.source === connection.target) return;

    const connected = edges.find(
      (edge) => (edge.target === connection.target && edge.source === connection.source)
    );
    if (connected) return;

    const targetNode = getNodes().find(node => node.id === connection.target) as FlowNode | undefined;

    let nodesUpdated = getNodes() as FlowNode[];

    if (targetNode) {
      const edgeAlreadyConnected = edges.find((edge) => edge.target === targetNode.id)
      if (edgeAlreadyConnected) {
        toast("Other node already connected to this node");
        return;
      }

      if (targetNode.type == "condition") {
        const sourceNode = nodesUpdated.find(nd => nd.id == connection.source);

        if (sourceNode && sourceNode.type == "form") {
          const rules: ConditionRule[] = [];

          sourceNode.data.form!.sections.forEach((section) => {
            section.fields.forEach((field) => {
              rules.push({
                id: crypto.randomUUID(),
                fieldName: field.name,
                operator: field.type == "checkbox" ? "contains" : "equals",
                value: "",
                targetNodeId: ""
              })
            })
          })

          const updatedTargetNode: FlowNode = {
            ...targetNode,
            data: {
              ...targetNode.data,
              sourceNodeId: connection.source!,
              rules,
            }
          }
          nodesUpdated = nodesUpdated.map((nd) => (nd.id === targetNode.id ? updatedTargetNode : nd))
          setNodes(nodesUpdated);
        }
      }
    }
    // realizar verificacao se o connection.target é um node de tipo condition,
    // seria interessante que as condições fossem criadas a partir da conexao source 
    // com um form e cada campo tivesse um ponto de validação no condition 
    // e com base no node que estiver conectado ao condition, os campos para validação s
    // se alteram para ficar fidedigno 

    if (connection.source && connection.target) {
      const newEdges = [...edges, {
        id: connection.source! + connection.target + Math.round((Math.random() * 10000)),
        source: connection.source,
        target: connection.target,
        animated: true,
        type: "floating",
        markerEnd: { type: MarkerType.Arrow },
      }]
      setEdges(newEdges);
      await mutateAsync({
        edges: newEdges,
        nodes: nodesUpdated,
        flow: {
          id: parseInt(params.id!),
          type: params.type as ManipulationType
        }
      });
    }
  }, [setEdges, edges, nodes, params, getNodes]);

  const createWebHookDispatch = useCallback((pos: Position) => {
    return {
      data: {
        label: "Webhook",
        webhook: {
          url: "https://",
          method: "GET",
          token: "Bearer ",
          headers: [{ property: "x-api-key", value: "sha", }],
        },
        createdBy: user!.email,
        organizationId: selectedOrganization!.id!,
        status: "pending"
      } satisfies FlowNodeData,
      id: crypto.randomUUID(),
      position: pos,
      type: "webhook",
    } as FlowNode;
  }, [selectedOrganization, user]);
  const createFormDispatch = useCallback((pos: Position, data: Form) => {
    return {
      data: {
        form: data,
        label: data.name,
        createdBy: user!.email,
        organizationId: selectedOrganization!.id!,
        status: "pending"
      } satisfies FlowNodeData,
      id: crypto.randomUUID(),
      position: pos,
      type: "form",
    } as FlowNode;
  }, [selectedOrganization]);

  const createConditionDispatch = useCallback((pos: Position) => {
    return {
      data: {
        createdBy: user?.email,
        organizationId: selectedOrganization!.id!,
        status: "pending",
        rules: [] as ConditionRule[]
      } as FlowNodeData,
      id: crypto.randomUUID(),
      position: pos,
      type: "condition"
    } as FlowNode;
  }, [selectedOrganization]);

  const createApproverDispatch = useCallback((pos: Position) => {
    return {
      data: {
        label: "Setup approvers",
        approvers: [],
        description: "Conditional approvers",
        createdBy: user!.email,
        organizationId: selectedOrganization!.id!,
        status: "pending"
      } satisfies FlowNodeData,
      id: crypto.randomUUID(),
      position: pos,
      type: "approval",
    } as FlowNode;
  }, [selectedOrganization])
  const onNodeDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    //obtencao do evento de transferencia de dados do proprio reactflow
    const type = event.dataTransfer.getData('application/reactflow') as keyof typeof nodeTypes;
    if (typeof type === 'undefined' || !type) return;

    const pos = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    let node: FlowNode = {} as FlowNode;

    try {
      const isForm = JSON.parse(type) as { type: string; data: Form } | undefined;
      if (isForm && typeof isForm == "object") {
        node = createFormDispatch(pos, isForm.data);
      }
    } catch (err) { /*silencia em caso de não for um json válido */ }

    switch (type) {
      case "approval":
        node = createApproverDispatch(pos);
        break;
      case "condition":
        node = createConditionDispatch(pos);
        break;
      case "webhook":
        node = createWebHookDispatch(pos);
        break;
      case "stage":
        break;
    }
    const nodesUpdated = [...nodes, node] as FlowNode[];
    setNodes(nodesUpdated);
    if (params.id) {
      await addNewNodeAsync({
        flow: { id: parseInt(params.id)!, type: params.type as ManipulationType },
        node
      });
    }
  }, [screenToFlowPosition, nodeTypes, nodes, params]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }, []);

  const onNodeDragStop = useCallback(async (e: React.MouseEvent, node: Node) => {
    if (e.isTrusted && node.id) {
      await updateNodePositionAsync({
        flow: { id: parseInt(params.id!), type: params.type as ManipulationType },
        nodeId: node.id,
        position: node.position
      });
    }
  }, [updateNodePositionAsync])

  useEffect(() => {
    if (data) {
      setNodes(data.data.nodes ?? [])
      setEdges(data.data.edges as any ?? []);
    }
  }, [data])

  return (
    <div className="w-full h-full">
      <ReactFlow
        onDragOver={onDragOver}
        minZoom={0.1}
        onNodeDragStop={onNodeDragStop}
        maxZoom={2}
        onConnect={onConnect}
        edgeTypes={EDGE_TYPES}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        onDrop={onNodeDrop}
        defaultEdgeOptions={{
          type: "floating",
          animated: true,
          markerEnd: { type: MarkerType.Arrow }
        }}
        // connectionLineComponent={FloatingConnectionLine}
        connectionMode={ConnectionMode.Loose}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        fitView
      >
        <Panel position="top-left">
          <Tooltip>
            <TooltipTrigger>
              <Badge >
                {
                  isPending ||
                    isLoadingFlows ||
                    isPendingPos ||
                    isPendingReplacement ||
                    isDropping
                    ? <Loader2 size={20} className="animate-spin" /> : <Cloud size={20} />}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {lastApiMessage ? lastApiMessage : "Data saved"}
            </TooltipContent>
          </Tooltip>

        </Panel>
        <FlowPanel />
        <Controls
          showFitView
          color="#121212"
          className="dark:bg-zinc-800 rounded-md"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
        />
        <MiniMap
          zoomable
          pannable
          nodeStrokeWidth={3}
          className="dark:bg-zinc-800 opacity-50 bg-zinc-400"
          position="bottom-right"
        />
      </ReactFlow>
    </div >

  )
}