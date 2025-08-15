"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export interface SearchFilterColumnInputProps {
  accssorKey: string;
  placelholder: string;
}
interface Props<T extends RowData> {
  columns: ColumnDef<T>[];
  data: unknown[];
  pageCount?: number;
  manualPagination?: boolean;
  searchFilterColumnInput?: SearchFilterColumnInputProps;
  selectable?: boolean;
  pageIndex: number;
  setPageIndex?: (newPageIndex: number) => void;
  newItem?: { action?: () => void; dialog?: React.ReactNode; buttonTitle?: string; }
}

export function GenericTable<T extends RowData>({
  columns,
  data,
  manualPagination,
  pageCount,
  searchFilterColumnInput,
  selectable = true,
  pageIndex,
  newItem,
  setPageIndex
}: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const pages = React.useRef(Math.ceil(Number(pageCount) / 10));

  const tableColumns: ColumnDef<T>[] = React.useMemo(() => {
    if (selectable) {
      return [{
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }, ...columns,];
    }
    return columns
  }, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns as unknown as ColumnDef<unknown>[],
    pageCount,
    manualPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageSize : 10, pageIndex}
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <aside className="flex items-center gap-2">
          {searchFilterColumnInput && (
            <Input
              placeholder={searchFilterColumnInput.placelholder}
              value={(table.getColumn(searchFilterColumnInput.accssorKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchFilterColumnInput.accssorKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          {newItem && newItem.dialog && (newItem.dialog)}
          {newItem && newItem.action && !newItem.dialog && (
            <Button variant={"outline"} size={"icon"}>
              {newItem.buttonTitle ? newItem.buttonTitle : (<><Plus size={15} /> New</>)}
            </Button>
          )}
        </aside>

        <DropdownMenu>
          <DropdownMenuTrigger className="self-end">
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {pageIndex && (
          <div className="text-muted-foreground space-x-2 flex-1 text-sm flex mt-4 items-center justify-end">
            Page {pageIndex} of {pages.current}
          </div>
        )}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              if (pageIndex && setPageIndex) {
                setPageIndex(pageIndex - 1)
              }
            }}
            disabled={!(pageIndex ? pageIndex > 1 : table.getCanPreviousPage())}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage()
              if (pageIndex && setPageIndex) {
                setPageIndex(pageIndex + 1)
              }
            }}
            disabled={!table.getCanNextPage() || ((pageIndex != undefined && pageCount != undefined) && (pageIndex >= pages.current))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
