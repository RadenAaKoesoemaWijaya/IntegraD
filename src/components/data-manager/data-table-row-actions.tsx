"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HealthData } from "./schema"
import { DataEditorDialog } from "./data-editor-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const healthData = row.original as HealthData

  return (
    <div className="flex items-center space-x-2">
      <DataEditorDialog
        variant="edit"
        initialData={healthData}
        onSave={(updatedRow) => row.table.options.meta?.updateRow?.(row.index, updatedRow)}
      >
        <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Edit</span>
            Edit
        </Button>
      </DataEditorDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                <span className="sr-only">Delete</span>
                Delete
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              record from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => row.table.options.meta?.removeRow?.(row.index)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
