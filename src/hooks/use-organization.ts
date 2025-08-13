import { Roles, User } from "@/@types/user";
import { Organization } from "@/Organization";
import { api } from "@/service/api";
import { useCallback } from "react";
export interface GetAllowedUsersReturn { 
  data : {
    user : User
  } [];
  id: number;
}
export interface UserOrganizationsReturn {
  id: number;
  role: Roles;
  organization: Organization
  deleted?: boolean;
}
export function userOrganizations() {
  const BASE_PATH = "/organizations";

  const getUserOrganizations = useCallback(async () => {
    const response = await api.get(BASE_PATH);
    return response.data.data as UserOrganizationsReturn[];
  }, []);

  return {
    getUserOrganizations,
  }
}