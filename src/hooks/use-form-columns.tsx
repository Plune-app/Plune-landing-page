import { DeleteDataTableProps } from "@/@types/Columns";
import { Form, FormSections } from "@/@types/Form";
import { BaseRequestsReturn } from "@/@types/req-return";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CustomDropdownMenuItem } from "@/components/UserDropdown";
import { useUserStore } from "@/store/user";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ArrowUpDown, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useCallback } from "react";

interface Props {
  response: BaseRequestsReturn<Form[]> | undefined;
  setDetailedForm: (form?: Form) => void;
  setOpen: (open: boolean) => void;
}
export function useFormColumns({
  setDetailedForm,
  response,
  setOpen
}: Props) {
 

  const selectedOrganization = useUserStore((state) => state.selectedOrganization);
  const getFormColumns = useCallback(({ setDataToDelete }: DeleteDataTableProps) => [
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

            {selectedOrganization && selectedOrganization.role == "Admin" && (
              <>
                <CustomDropdownMenuItem
                  icon={Pencil}
                  title="Edit"
                  onClick={() => {
                    const formFound = response?.data?.find((form) => form.id == row.original.id)
                    if (formFound) {
                      setDetailedForm(formFound);
                      setOpen(true);
                    }
                  }}
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
      header: ({ column }) => (
        <Button
          className="px-1 flex justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant={"ghost"}
        >
          Name
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (<div>{row.getValue("name")} </div>)
    },
    {
      accessorKey: "createdAt",
      header: () => <div>Created at</div>,
      cell: ({ row }) => <div>{formatDistanceToNow(row.getValue("createdAt"), { addSuffix: true })}</div>
    },
    {
      id: "createdBy",
      accessorFn: (row) => row.createdBy.name,
      header: () => <div>Created by</div>,
      cell: ({ row }) => <div>{row.getValue("createdBy")}</div>
    },
    {
      id: "fields",
      header: () => (<div>Fields</div>),
      cell: ({ row }) => {
        const sections = row.getValue("sections") as [];
        let len = 0
        sections.forEach((section: FormSections) => len += section.fields.length)
        return (
          <div>{len}</div>
        )
      }
    },
    {
      accessorKey: "sections",
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant={"ghost"}
        >
          Sections
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{(row.getValue("sections") as []).length}</div>
    },

  ] satisfies ColumnDef<Form>[], [response]);
  return getFormColumns
}