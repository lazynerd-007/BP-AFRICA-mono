"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Row,
} from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconGripVertical,
  IconCircleCheckFilled,
  IconLoader,
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react"

export const schema = z.object({
  id: z.number(),
  merchant: z.string(),
  date: z.string(),
  tid: z.string(),
  scheme: z.string(),
  amount: z.string(),
  status: z.string(),
  count: z.number().optional(),
  volume: z.number().optional(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Add a checkbox column for row selection
const getSelectionColumn = (): ColumnDef<z.infer<typeof schema>> => {
  return {
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
  }
}

// Update the getColumns function to handle different table types
const getColumns = (currentTab: string, tableType: string = "transaction"): ColumnDef<z.infer<typeof schema>>[] => {
  // Merchant status table columns
  if (tableType === "merchant") {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.merchant}</div>
        },
        enableHiding: false,
      },
      {
        accessorKey: "date",
        header: "Date Registered",
        cell: ({ row }) => {
          const date = new Date(row.original.date);
          return <div>{date.toLocaleDateString()}</div>
        },
      },
      {
        accessorKey: "tid",
        header: "MID",
        cell: ({ row }) => <div>{row.original.tid}</div>,
      },
      {
        accessorKey: "scheme",
        header: "BDM",
        cell: ({ row }) => {
          // Generate BDM ID using the format: initials-number
          // For demo purposes, we'll create different IDs based on the scheme
          const scheme = row.original.scheme;
          let bdmId = "";
          
          // Generate different IDs based on the scheme
          switch(scheme) {
            case "Credit Card":
              bdmId = "JD-001"; // John Doe
              break;
            case "Debit Card":
              bdmId = "MS-002"; // Mary Smith
              break;
            case "PayPal":
              bdmId = "RJ-003"; // Robert Johnson
              break;
            case "Bank Transfer":
              bdmId = "AB-004"; // Alice Brown
              break;
            default:
              // Generate a random ID if scheme doesn't match
              const initials = scheme.split(' ').map(word => word[0]).join('').substring(0, 2);
              bdmId = `${initials}-${Math.floor(Math.random() * 900) + 100}`;
          }
          
          return (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {bdmId}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Total Collections</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.original.amount}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          
          // Determine status display based on current tab
          let displayStatus = status;
          let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "default";
          
          if (currentTab === "active" || currentTab === "") {
            displayStatus = "Active";
            badgeVariant = "secondary";
          } else if (currentTab === "new") {
            displayStatus = "Active";
            badgeVariant = "secondary";
          } else if (currentTab === "inactive") {
            displayStatus = "Inactive";
            badgeVariant = "outline";
          } else if (currentTab === "suspended") {
            displayStatus = "Suspended";
            badgeVariant = "destructive";
          }
          
          return (
            <Badge 
              variant={badgeVariant}
              className="px-1.5"
            >
              {displayStatus === "Active" ? (
                <IconCircleCheckFilled className="size-3 mr-1" />
              ) : displayStatus === "Inactive" ? (
                <IconLoader className="size-3 mr-1" />
              ) : (
                <IconDotsVertical className="size-3 mr-1" />
              )}
              {displayStatus}
            </Badge>
          )
        },
      },
    ];
  }
  
  // For top-merchants tab
  if (currentTab === "top-merchants") {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue("merchant")}</div>
        },
        enableHiding: false,
      },
      {
        accessorKey: "tid",
        header: "MID",
        cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("tid")}</div>,
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Total Amount</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue("amount")}</div>,
      },
    ];
  }
  
  // For top-products tab
  if (currentTab === "top-products") {
    return [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: "scheme",
        header: "Processor",
        cell: ({ row }) => {
          const scheme = row.getValue("scheme") as string;
          let schemeColor = "";
          let textColor = "";
          
          // Apply individual colors for each telco network
          if (scheme === "mtn" || scheme === "MTN") {
            schemeColor = "#fc0"; // MTN Yellow
            textColor = "#000"; // Black text for better contrast
          } else if (scheme === "airteltigo" || scheme === "AirtelTigo") {
            schemeColor = "#01377a"; // AirtelTigo Blue
            textColor = "#fff"; // White text for better contrast
          } else if (scheme === "vodafone" || scheme === "Vodafone") {
            schemeColor = "#e32526"; // Vodafone Red
            textColor = "#fff"; // White text for better contrast
          } else if (scheme === "telecel" || scheme === "Telecel") {
            schemeColor = "#e32526"; // Telecel Red
            textColor = "#fff"; // White text for better contrast
          }
          
          return (
            <Badge 
              variant="outline" 
              className="px-2 py-1 border-none font-medium uppercase text-xs"
              style={{
                backgroundColor: schemeColor || "#f3f4f6",
                color: textColor || "#6b7280"
              }}
            >
              {scheme}
            </Badge>
          );
        },
        enableHiding: false,
      },
      {
        accessorKey: "count",
        header: () => <div className="text-center">Count</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm font-medium">{(row.original as z.infer<typeof schema>).count || 0}</span>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Volume</div>,
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue("amount")}</div>,
      },
    ];
  }
  
  // Default transaction table columns (recent tab)
  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      accessorKey: "merchant",
      header: "Merchant",
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.merchant}</div>
      },
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        // Format date with time: May 23, 2024, 1:34:45 PM
        return <div>{date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
        }) + ', ' + date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        })}</div>
      },
    },
    {
      accessorKey: "tid",
      header: "Reference",
      cell: ({ row }) => <div>{row.original.tid}</div>,
    },
    {
      accessorKey: "scheme",
      header: "Scheme",
      cell: ({ row }) => {
        const scheme = row.original.scheme;
        let schemeColor = "";
        let textColor = "";
        
        // Apply individual colors for each telco network
        if (scheme === "mtn" || scheme === "MTN") {
          schemeColor = "#fc0"; // MTN Yellow
          textColor = "#000"; // Black text for better contrast
        } else if (scheme === "airteltigo" || scheme === "AirtelTigo") {
          schemeColor = "#01377a"; // AirtelTigo Blue
          textColor = "#fff"; // White text for better contrast
        } else if (scheme === "vodafone" || scheme === "Vodafone") {
          schemeColor = "#e32526"; // Vodafone Red
          textColor = "#fff"; // White text for better contrast
        } else if (scheme === "telecel" || scheme === "Telecel") {
          schemeColor = "#e32526"; // Telecel Red
          textColor = "#fff"; // White text for better contrast
        }
        
        return (
          <Badge 
            variant="outline" 
            className="px-2 py-1 border-none font-medium uppercase text-xs"
            style={{
              backgroundColor: schemeColor || "#f3f4f6",
              color: textColor || "#6b7280"
            }}
          >
            {scheme}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => <div className="text-right font-medium">{row.original.amount}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "default";
        let statusClassName = "px-1.5";
        
        // Apply green scheme for successful/completed statuses
        if (status === "Completed" || status === "completed" || status === "SUCCESS" || status === "Successful") {
          badgeVariant = "secondary";
          statusClassName = "px-1.5 bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
        } else if (status === "Pending" || status === "pending") {
          badgeVariant = "outline";
        } else if (status === "Failed" || status === "failed" || status === "FAILED") {
          badgeVariant = "destructive";
        }
        
        return (
          <Badge 
            variant={badgeVariant}
            className={statusClassName}
          >
            {(status === "Completed" || status === "completed" || status === "SUCCESS" || status === "Successful") ? (
              <IconCircleCheckFilled className="size-3 mr-1" />
            ) : (status === "Pending" || status === "pending") ? (
              <IconLoader className="size-3 mr-1" />
            ) : (
              <IconDotsVertical className="size-3 mr-1" />
            )}
            {status}
          </Badge>
        )
      },
    },
  ];
};

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
  currentTab = "",
  tableType = "transaction",
  enablePagination = false,
  enableRowSelection = false,
}: {
  data: z.infer<typeof schema>[]
  currentTab?: string
  tableType?: string
  enablePagination?: boolean
  enableRowSelection?: boolean
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Get columns with the current tab and table type
  let columns = React.useMemo(() => getColumns(currentTab, tableType), [currentTab, tableType])
  
  // Add selection column if row selection is enabled
  if (enableRowSelection) {
    const selectionColumn = getSelectionColumn();
    columns = [selectionColumn, ...columns];
  }

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full flex-col justify-start">
      <div className="relative flex flex-col overflow-auto">
        <div className="overflow-hidden rounded-lg border w-full">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className="w-full">
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
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
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
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
          </DndContext>
        </div>
      </div>
      
      {enablePagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
