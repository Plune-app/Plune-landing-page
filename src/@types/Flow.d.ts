import type { Node } from "reactflow";
import type { Form } from "./Form";

export type FlowNodeStatus = "pending" | "completed" | "failed" | "skipped"

export type FlowNodeType = "stage" | "form" | "approval" | "webhook" | "condition";

type ConditionOperator =
  "equals" |
  "not_equals" |
  "contains" |
  "greater_than" |
  "less_than" |
  "greater_than_or_equals" |
  "less_than_or_equals" |
  "is_empty" |
  "is_not_empty";

export interface ConditionRule {
  id: string;
  fieldName: string;
  operator: ConditionOperator;
  value?: string | number | boolean;
  targetNodeId?: string;
  logicalOperatorForNextRule?: "AND" | "OR"
}
export interface Approver {
  id: string;
  userId?: number;
  email?: string;
}
export interface FlowNodeData {
  label: string;
  description?: string;
  organizationId: number;
  rules?: ConditionRule[];  // se type === 'condition'
  status: FlowNodeStatus;
  createdBy: string;
  sourceNodeId?: string;
  form?: Form;              // se type === 'form'
  approvers?: Approver[];   // se type === 'approval'
  webhook?: Webhook;      // se type === 'webhook'
}
export type Header = { property: string; value : string }
export interface Webhook { 
  url : string;
  // o que será enviado no request BODY
  payload?: string[];
  headers?: Header[];
  token?: string;
  method?: "GET" | "POST" | "DELETE" | "OPTIONS" | "HEAD" | "PUT" | "PATCH";
}

export interface FlowNode {
  id: string;               // UUID, compatível com React Flow
  type: FlowNodeType;
  position: Position;
  data: FlowNodeData;
}
export interface Position {
  x: number;
  y: number
}

export interface FlowEdge {
  id: number;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface Flow {
  id: number;
  name: string;
  description?: string;
  currentStage: string;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  createdBy: string; // userId
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export type FlowNode = Node<Flow> & { _id: string };