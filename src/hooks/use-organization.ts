import { Organization } from "@/@types/Organization";
import { Roles, User } from "@/@types/user";
import { SaveOrgDTO } from "@/lib/DTO/organization.dto";
import { api } from "@/service/api";
import { useUserStore } from "@/store/user";
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
  const selectedOrganization = useUserStore((state) => state.selectedOrganization)
  const restoreOrganization = useCallback(async (id: number) => {
    const response = await api.put(`${BASE_PATH}/restore/${id}`);
    return response.data;
  }, [])

  const deleteOrganization = useCallback(async (id: number) => {
    const response = await api.delete(`${BASE_PATH}/${id}`);
    return response.data;
  }, [])

  const getUserOrganizations = useCallback(async () => {
    const response = await api.get(BASE_PATH);
    return response.data.data as UserOrganizationsReturn[];
  }, []);

  const saveOrganization = useCallback(async (data: SaveOrgDTO) => {
    if (data.id) {
      const response = await api.put(BASE_PATH, data);
      return response.data;
    }
    const response = await api.post(BASE_PATH, data);
    return response.data as { data: Organization };
  }, [])

  const getAllowedUsersToApprove = useCallback(async () => {
    const response = await api.get(`${BASE_PATH}/approvers/${selectedOrganization!.id}`);
    return response.data as GetAllowedUsersReturn;
  }, [selectedOrganization])
  return {
    restoreOrganization,
    getAllowedUsersToApprove,
    deleteOrganization,
    getUserOrganizations,
    saveOrganization
  }
}