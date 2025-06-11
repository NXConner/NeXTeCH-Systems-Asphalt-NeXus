import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Input } from './input';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: any[];
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  className,
  onRowClick,
  searchable = true,
  sortable = true,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    enableRowSelection: selectable,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { rows } = table.getRowModel();

  const parentRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setParentRef(node);
    }
  }, []);

  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 35,
    overscan: 5,
  });

  const selectedRows = useMemo(() => {
    return Object.keys(rowSelection).map((index) => data[parseInt(index)]);
  }, [rowSelection, data]);

  const handleSelectionChange = useCallback(() => {
    onSelectionChange?.(selectedRows);
  }, [selectedRows, onSelectionChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {searchable && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <div
          ref={parentRef}
          className="h-[400px] overflow-auto"
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'h-10 px-4 text-left align-middle font-medium text-muted-foreground',
                        sortable && header.column.getCanSort() && 'cursor-pointer select-none',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b transition-colors hover:bg-muted/50',
                      onRowClick && 'cursor-pointer',
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-4 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((old) => old - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((old) => old + 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 