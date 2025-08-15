import type { Flow } from "@/@types/Flow";
import { GenericTable } from "@/components/custom/GenericTable";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useFlow } from "@/hooks/use-flow";
import { useSeo } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { useFlowColumns } from "@/hooks/use-flow-columns";
import { useSharedQueryKeys } from "@/hooks/use-shared-querykeys";
import { useState } from "react";

export function FlowInstances() {
  const [page, setPage] = useState(1);
  useSeo({
    title: "Flows - instances",
    description: "Visualizar flows executados pelos colaboradores",
    ogDescription: "Aqui você pode visualizar, criar fluxos de trabalho e monitorá-los"
  })
  const { flowInstanceQueryKey } = useSharedQueryKeys();  
  const { instanceColumns } = useFlowColumns("/flows/diagram/instances/");
  const { getOrganizationInstancesFlows } = useFlow();

  const { data, isLoading } = useQuery({
    queryFn: async () => getOrganizationInstancesFlows({ page }),
    queryKey: flowInstanceQueryKey,
    refetchOnWindowFocus: false,
  });

  return (
    <ScreenWrapper>
      {!isLoading && data && (
        <GenericTable<Flow>
          searchFilterColumnInput={{ accssorKey : "name", placelholder : "Flow name..."}}
          data={data.data}
          setPageIndex={(newPage) => setPage(newPage)}
          pageIndex={page}
          pageCount={data.count}
          // newItem={}
          manualPagination={true}
          columns={instanceColumns}
        />
      )}
    </ScreenWrapper>
  )
}