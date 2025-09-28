"use client";

import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-start px-2 mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Fetched {table.getFilteredRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} total rows
      </div>
    </div>
  );
}
