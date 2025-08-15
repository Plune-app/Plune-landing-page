import { Organization } from "@/@types/Organization";
import { Roles, User } from "@/@types/user";
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
export function useOrganizations() {
  const BASE_PATH = "/organizations";

  const getUserOrganizations = useCallback(async () => {
    const response = await api.get(BASE_PATH);
    return response.data.data as UserOrganizationsReturn[];
  }, []);

  return {
    getUserOrganizations,
  }
}