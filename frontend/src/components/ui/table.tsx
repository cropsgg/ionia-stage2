import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  className,
  onRowClick,
  isLoading = false,
  emptyState,
}: TableProps<T>) {
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor] as React.ReactNode;
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge('border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  className={twMerge(
                    'px-4 py-3 text-sm font-medium text-left text-muted-foreground', 
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className={twMerge(
                  'border-b last:border-0 hover:bg-muted/50 transition-colors',
                  onRowClick ? 'cursor-pointer' : ''
                )}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={twMerge('px-4 py-3 text-sm', column.className)}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
