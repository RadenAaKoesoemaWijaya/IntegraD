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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  dictionary: any;
}

export function DataTableRowActions<TData>({
  row,
  dictionary,
}: DataTableRowActionsProps<TData>) {
  const healthData = row.original as HealthData;
  const { admin: tAdmin, deleteDialog: tDelete } = dictionary;


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
        dictionary={dictionary}
      >
        <Button variant="outline" size="sm">
          {tAdmin.edit}
        </Button>
      </DataEditorDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            {tAdmin.delete}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tDelete.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {tDelete.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tDelete.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              {tDelete.continue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
