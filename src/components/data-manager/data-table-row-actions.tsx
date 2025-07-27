'use client';

import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { HealthData } from './schema';
import { DataEditorDialog } from './data-editor-dialog';
import { useToast } from '@/hooks/use-toast';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast();
  const healthData = row.original as HealthData;

  const onSave = (updatedData: HealthData | Omit<HealthData, 'id'>) => {
    if ('id' in updatedData) {
        row.table.options.meta?.updateRow?.(updatedData);
    }
  };

  const onDelete = () => {
    row.table.options.meta?.removeRow?.(healthData.id);
  };


  return (
    <div className="flex items-center space-x-2">
      <DataEditorDialog
        variant="edit"
        initialData={healthData}
        onSave={onSave}
      >
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DataEditorDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
