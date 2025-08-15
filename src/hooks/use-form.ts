import { Form } from "@/@types/Form";
import { BaseRequestsReturn } from "@/@types/req-return";
import { api } from "@/service/api";
import { useUserStore } from "@/store/user";
import { useCallback } from "react"

export function useForm() {
  const BASE_PATH = "/forms"
  const selectedOrganization = useUserStore((state) => state.selectedOrganization);

  const getOrganiztionForms = useCallback(async () => {
    const response = await api.get(`${BASE_PATH}/${selectedOrganization?.id}`);
    return response.data as BaseRequestsReturn<Form[]>;
  }, [selectedOrganization]);
  
  return {
    getOrganiztionForms
  }
}