import { useSharedQueryKeys } from "@/hooks/use-shared-querykeys"
import { useQuery } from "@tanstack/react-query"
import { Panel } from "reactflow";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { useForm } from "@/hooks/use-form";
import { ClipboardType, FormInput, Play, User, Webhook, Workflow } from "lucide-react";
import { useDroppable } from "@/hooks/use-droppable";

export function FlowPanel() {
  const { formsQueryKey } = useSharedQueryKeys();
  const { getOrganiztionForms } = useForm();
  const { onDragStartNewNode } = useDroppable();
  const { data: response } = useQuery({
    queryKey: formsQueryKey,
    queryFn: getOrganiztionForms,
  });

  return (
    <Panel position="top-right" className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md dark:backdrop-blur-lg flex flex-col gap- items-center p-2 rounded-lg ">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Button
            onDragStart={(e) => onDragStartNewNode(e, "approval")}
            className="w-full gap-2 flex justify-start  items-center"
            variant={"ghost"}
          >
            <FormInput size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent alignOffset={440} sideOffset={-42} align="end">
          <DropdownMenuLabel>Forms</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea
            className="max-h-[600px] flex flex-col gap-1 "
          >
            {response && response.data && response.data.map((form) => (
              <div key={form.id} className="block w-full">
                <Button
                  className="justify-start w-full"
                  draggable
                  variant={"ghost"}
                  size={"sm"}
                  title={form.name}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/reactflow",
                      JSON.stringify({ type: "form", data: form })
                    );
                  }}
                >
                  <ClipboardType size={15} />{form.name}
                </Button>
              </div>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenuSeparator />
      <Button
        onDragStart={(e) => onDragStartNewNode(e, "condition")}
        className="w-full gap-2 justify-start  flex items-center"
        variant={"ghost"}
        draggable
      >
        <Workflow />
      </Button>
      <DropdownMenuSeparator />
      <Button
        onDragStart={(e) => onDragStartNewNode(e, "approval")}
        className="w-full gap-2 flex justify-start  items-center"
        variant={"ghost"}
        draggable
      >
        <User />
      </Button>
      <DropdownMenuSeparator />
      <Button
        onDragStart={(e) => onDragStartNewNode(e, "webhook")}
        className="w-full gap-2 flex justify-start  items-center"
        variant={"ghost"}
        draggable
      >
        <Webhook />
      </Button>
      <DropdownMenuSeparator />
      <Button
        onDragStart={(e) => onDragStartNewNode(e, "stage")}
        className="w-full gap-2 flex justify-start  items-center"
        variant={"ghost"}
        draggable
      >
        <Play />
      </Button>
    </Panel>
  )
}