import { Flow, FlowNode } from "@/@types/Flow";
import { GetFlowReturn, PostFlowReturn } from "@/@types/req-return";
import { SaveFlowDTO } from "@/lib/DTO/flow.dto";
import { api } from "@/service/api"
import { useUserStore } from "@/store/user";
import { useCallback } from "react"
import { Edge } from "reactflow";
export interface TableParams {
  page: number;
}
export type ManipulationType = "template" | "instance"
interface ManipulateFlows {
  type: ManipulationType,
  id: number
}

interface updateFlowPayload {
  flow: ManipulateFlows
  nodes: FlowNode[];
  edges: Edge[]
}

interface UpdateNodePosition {
  flow: ManipulateFlows;
  nodeId: string;
  position: { x: number; y: number };
}
interface ReplaceNodeById { 
  node : FlowNode;
  flow: ManipulateFlows;
}

export function useFlow() {
  const BASE_PATH = "/flows";
  const selectedOrganization = useUserStore(state => state.selectedOrganization);

  const getOrganizationInstancesFlows = useCallback(async (payload: TableParams) => {
    if (selectedOrganization) {
      const params = new URLSearchParams();

      params.append("page", payload.page.toString());
      params.append("limit", (10).toString());
      params.append("orgId", selectedOrganization.id!.toString());

      const response = await api.get(BASE_PATH + "/instance", { params });
      return response.data as GetFlowReturn;
    }
  }, [selectedOrganization]);

  const getOrganizationTemplateFlows = useCallback(async (payload: TableParams) => {
    if (selectedOrganization) {
      const params = new URLSearchParams();

      params.append("page", payload.page.toString());
      params.append("pageSize", (10).toString());
      params.append("orgId", selectedOrganization.id!.toString());

      const response = await api.get(BASE_PATH + "/template", { params });
      return response.data as GetFlowReturn;
    }
    return []
  }, [selectedOrganization]);

  const saveOrganizationTemplateFlow = useCallback(async (data: SaveFlowDTO) => {
    if (data.id) {
      const response = await api.put(BASE_PATH + "/template", data);
      return response.data as PostFlowReturn;
    }
    const response = await api.post(BASE_PATH + "/template", data);
    return response.data as PostFlowReturn;
  }, []);

  const deleteFlow = useCallback(async (payload: ManipulateFlows) => {
    const response = await api.delete(`${BASE_PATH}/${payload.type}/${payload.id}`);
    return response.data;
  }, []);

  const restoreFlow = useCallback(async (payload: ManipulateFlows) => {
    const response = await api.put(`${BASE_PATH}/${payload.type}/restore/${payload.id}`);
    return response.data;
  }, []);

  const updateFlowNodesAndEdges = useCallback(async (payload: updateFlowPayload) => {
    const load = { ...payload, id: payload.flow.id }
    const response = await api.put(`${BASE_PATH}/${payload.flow.type}/nodes-edges`, load);
    return response.data
  }, []);

  const getFlowByOrgIdAndFlowId = useCallback(async ({ id, type }: ManipulateFlows) => {
    const response = await api.get(`${BASE_PATH}/${type}/flow-by-id/${selectedOrganization?.id}/${id}`);
    return response.data as { data: Flow };
  }, [selectedOrganization]);

  const updateNodePosition = useCallback(async(payload: UpdateNodePosition) => {
    const load = { ...payload, id: payload.flow.id }
    const response = await api.put(`${BASE_PATH}/${payload.flow.type}/node-position`, load);
    return response.data
  }, []);

  const replaceNodeById = useCallback(async(payload: ReplaceNodeById) => {
    const load = { ...payload, id: payload.flow.id }
    const response = await api.put(`${BASE_PATH}/${payload.flow.type}/replace-by-id`, load);
    return response.data
  }, []);

  const addNodeToFlow = useCallback(async(payload: ReplaceNodeById) => {
    const load = { ...payload, id: payload.flow.id }
    const response = await api.post(`${BASE_PATH}/${payload.flow.type}/add-node`, load);
    return response.data
  }, []);

  return {
    saveOrganizationTemplateFlow,
    getOrganizationInstancesFlows,
    getOrganizationTemplateFlows,
    getFlowByOrgIdAndFlowId,
    updateFlowNodesAndEdges,
    updateNodePosition,
    replaceNodeById,
    addNodeToFlow,
    deleteFlow,
    restoreFlow
  }
}