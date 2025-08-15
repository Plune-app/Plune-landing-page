import { NodeToolbar, Position, type NodeProps } from "reactflow";
import React from "react";
import "@reactflow/node-resizer/dist/style.css"
import type { FlowNodeData } from "@/@types/Flow";
import { Button } from "../ui/button";
import { FlowCard } from "../ui/FlowCard";
import { Pencil, Trash } from "lucide-react";
import { DefaultNodeComponents } from "./DefaultNodeComponents";
import { useParams } from "react-router-dom";
import { useUserStore } from "@/store/user";
import { useRoles } from "@/hooks/use-roles";
import { CustomDropdownMenuItem } from "../UserDropdown";
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { FormProvider, useForm } from "react-hook-form";
import { FormSectionSlot } from "../forms/ClientFormRenders";

export const FormNodeType = React.memo((nodeProps: NodeProps<FlowNodeData>) => {
  const methods = useForm();
  const params = useParams<{ id: string; type: "template" | "instance" }>();
  const { canEdit } = useRoles();
  const selectedOrganization = useUserStore(state => state.selectedOrganization);

  const isTemplatesPage =  params.type == "template" 

  return (
    <FlowCard
      dropdownContent={
        isTemplatesPage && canEdit(selectedOrganization!) && (
          <DropdownMenuContent>
            <DropdownMenuLabel>Edition</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CustomDropdownMenuItem title="Edit Form" icon={Pencil} onClick={() => console.log("Edit Form")} />
            <CustomDropdownMenuItem title="Remove Form" icon={Pencil} onClick={() => console.log("Remove Form")} />
          </DropdownMenuContent>
        )
      }
      status={nodeProps.data.status ?? "pending"}
      title={nodeProps.data.form ? nodeProps.data.form.name : "Form"}
    >
      {nodeProps.data && nodeProps.data && (
        <FormProvider {...methods}>
          <div className="flex flex-col gap-1" >
            {nodeProps.data.form && nodeProps.data.form.sections.map((section) => (
              <FormSectionSlot
                canManipulate={false}
                sectionSlots={nodeProps.data.form!.sections ?? []}
                setSectionsSlots={undefined}
                section={section}
                key={section.id}
              />
            ))}
          </div>
        </FormProvider>
      )}
      <NodeToolbar
        className="bg-zinc-300/80 backdrop:blur-md dark:bg-zinc-900 p-1 shadow-md rounded-md flex gap-1 -top-3"
        isVisible={nodeProps.selected}
        position={Position.Top}
      >
        <div>
          <Button variant={"ghost"}>
            remove <Trash size={15} />
          </Button>
        </div>
      </NodeToolbar>
      <DefaultNodeComponents nodeProps={nodeProps} />
    </FlowCard>


  );
})