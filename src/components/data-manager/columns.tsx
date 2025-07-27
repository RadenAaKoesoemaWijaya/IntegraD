"use client"

import { ColumnDef } from "@tanstack/react-table"
import { HealthData } from "./schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<HealthData>[] = [
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => <div>{row.getValue("region")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
  },
  {
    accessorKey: "cases",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cases" />
    ),
    cell: ({ row }) => <span>{row.original.cases.toLocaleString()}</span>,
  },
  {
    accessorKey: "vaccinations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vaccinations" />
    ),
    cell: ({ row }) => <span>{row.original.vaccinations.toLocaleString()}</span>,
  },
  {
    accessorKey: "patients",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patients" />
    ),
    cell: ({ row }) => <span>{row.original.patients.toLocaleString()}</span>,
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} dictionary={table.options.meta?.dictionary} />,
  },
]
