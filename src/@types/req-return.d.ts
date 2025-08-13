import { Flow } from "./Flow";

export interface BaseRequestsReturn <T extends object>{
  count: number;
  statusCode: number;
  data: T;
}
export interface GetFlowReturn extends BaseRequestsReturn <Flow[]> {}

export interface GetDefaulReturn extends BaseRequestsReturn {}

export interface PostFlowReturn extends BaseRequestsReturn<Flow> {}