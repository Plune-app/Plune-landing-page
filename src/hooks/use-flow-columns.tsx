import { DeleteDataTableProps } from "@/@types/Columns";
import type { Flow } from "@/@types/Flow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CustomDropdownMenuItem } from "@/components/UserDropdown";
import { useUserStore } from "@/store/user";
import type { ColumnDef, Getter } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ArrowRight, ArrowUpDown, EllipsisVertical, LucideBox, Pencil, Trash } from "lucide-react";
import { memo, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function useFlowColumns(url: string, setTemplateToEdit?: (template: Flow) => void) {
  const navigate = useNavigate();
  const selectedOrganization = useUserStore((state) => state.selectedOrganization);
  const TooltipCell = memo(({ maxWidth = 200, getValue }: { maxWidth?: number, getValue: Getter<unknown> }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div style={{ maxWidth: maxWidth }} className={`overflow-ellipsis overflow-hidden`}>
          {getValue() as string}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[500px] text-wrap">
        {getValue() as string}
      </TooltipContent>
    </Tooltip>
  ))
  const getTemplateColumns = useCallback(({ setDataToDelete }: DeleteDataTableProps) => [
    {
      accessorKey: "id",
      enableHiding: false,
      header: () => <div></div>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size={"sm"} variant={"ghost"}>
              <EllipsisVertical size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CustomDropdownMenuItem
              icon={LucideBox}
              title="Open"
              onClick={() => navigate(url + row.getValue("id"))}
            />

            {selectedOrganization && selectedOrganization.role == "Admin" && (
              <>
                <CustomDropdownMenuItem
                  icon={Pencil}
                  title="Edit"
                  onClick={() => setTemplateToEdit && setTemplateToEdit(row.original)}
                />
                <DropdownMenuSeparator />
                <CustomDropdownMenuItem
                  icon={Trash}
                  title="Delete"
                  variant="destructive"
                  onClick={() => setDataToDelete(row.original)}
                />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant={"ghost"}
          >
            Name
            <ArrowUpDown />
          </Button>
        )
      }
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            className="text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant={"ghost"}
          >
            Created at
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-left">{formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true })}</div>
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => <TooltipCell getValue={getValue} maxWidth={200}/>
    },
    {
      accessorKey: "isPublished",
      header: "status",
      cell: ({ row }) => <Badge>{row.getValue("isPublished") == true ? "published" : "not published"}</Badge>
    },
  ] satisfies ColumnDef<Flow>[], [navigate, url]);
  const instanceColumns = useMemo(() => [
    {
      accessorKey: "id",
      header: () => <div>Flow data</div>,
      id: "id",
      cell: ({ row }) => (
        <Button onClick={() => navigate(url + row.getValue("id"))} size={"sm"} variant={"ghost"}>
          Go to flow<ArrowRight size={15} />
        </Button>
      )
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant={"ghost"}
          >
            Name
            <ArrowUpDown />
          </Button>
        )
      }
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => {
        return (
          <Button
            className="text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant={"ghost"}
          >
            Created By
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-left">{row.getValue("createdBy")}</div>
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            className="text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant={"ghost"}
          >
            Created at
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-left">{formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true })}</div>
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>
    },
    {
      accessorKey: "isPublished",
      header: "status",
      cell: ({ row }) => <Badge>{row.getValue("isPublished") == true ? "published" : "not published"}</Badge>
    },
  ] satisfies ColumnDef<Flow>[], [navigate, url]);

  return {
    instanceColumns,
    getTemplateColumns
  }
}