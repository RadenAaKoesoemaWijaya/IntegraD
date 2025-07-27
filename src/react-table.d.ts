import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    addRow?: (newRow: Omit<TData, 'id'>) => void;
    updateRow?: (updatedRow: TData) => void;
    removeRow?: (id: string) => void;
    dictionary?: any;
  }
}
