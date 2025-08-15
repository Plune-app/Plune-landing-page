import { Form } from "@/@types/Form";
import { BaseRequestsReturn } from "@/@types/req-return";
import { SaveFormDTO } from "@/lib/DTO/flow.dto";
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

  const saveForm = useCallback(async (payload: SaveFormDTO) => {
    if (payload.id) {
      const response = await api.put(`${BASE_PATH}/`, payload);
      return response.data;
    }
    const response = await api.post(`${BASE_PATH}/`, payload);
    return response.data;
  }, [])

  const deleteForm = useCallback(async (id: number) => {
    const response = await api.delete(`${BASE_PATH}/${id}`);
    return response.data;
  }, []);

  const restoreForm = useCallback(async(id: number) => {
    const response = await api.put(`${BASE_PATH}/restore/${id}`);
    return response.data;
  }, [])
  return {
    getOrganiztionForms,
    restoreForm,
    deleteForm,
    saveForm
  }
}

