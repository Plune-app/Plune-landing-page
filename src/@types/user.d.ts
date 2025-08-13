import { Organization } from "./Organization";

export type Roles = 'Admin' | 'Editor' | 'Approver' | 'Viewer';
export interface OrganizationRole extends Partial<Organization> {
  role: Roles
}

export interface User {
  name: string
  email: string
  id?: number
  status?: 'Active' | 'Inative'
  lastAccess?: string
  avatar?: string
}

export interface SignInResponse {
  message: string;
  payload: { token: string; userCommonData: { name: string; email: string; } }
  statusCode: 200
}