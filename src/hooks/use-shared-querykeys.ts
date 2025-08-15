import { useUserStore } from "@/store/user";
import { useMemo } from "react";

export function useSharedQueryKeys() {
  const selectedOrganization = useUserStore(state => state.selectedOrganization);

  const flowInstanceQueryKey = useMemo(() => ["get-org-instance-flows", selectedOrganization!.id], []);
  const flowModelQueryKey = useMemo(() => ["get-org-instance-flows", selectedOrganization!.id], []);
  const formsQueryKey = useMemo(() => ['get-org-forms', selectedOrganization!.id], [selectedOrganization!.id])
  return {
    flowInstanceQueryKey,
    flowModelQueryKey,
    formsQueryKey
  }
}