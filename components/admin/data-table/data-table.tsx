"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";

interface FilterOption {
    key: string;
    label: string;
    options: { label: string; value: string }[];
}

export interface ServerSideConfig {
    pageCount: number;
    pagination: { pageIndex: number; pageSize: number };
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
    search: string;
    onSearchChange: (value: string) => void;
    filterValues: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    filterOptions?: FilterOption[];
    isLoading?: boolean;
    emptyMessage?: string;
    serverSide?: ServerSideConfig;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    filterOptions,
    isLoading = false,
    emptyMessage = "No results found.",
    serverSide,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [clientPagination, setClientPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    const isServerSide = !!serverSide;

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: isServerSide ? serverSide.pagination : clientPagination,
        },
        manualPagination: isServerSide,
        manualFiltering: isServerSide,
        pageCount: isServerSide ? serverSide.pageCount : undefined,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: isServerSide
            ? (updater) => {
                  const next =
                      typeof updater === "function" ? updater(serverSide.pagination) : updater;
                  serverSide.onPaginationChange(next.pageIndex, next.pageSize);
              }
            : setClientPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    const toolbarServerSide = isServerSide
        ? {
              search: serverSide.search,
              onSearchChange: serverSide.onSearchChange,
              filterValues: serverSide.filterValues,
              onFilterChange: serverSide.onFilterChange,
          }
        : undefined;

    return (
        <div className="space-y-2">
            <DataTableToolbar
                table={table}
                searchKey={searchKey}
                filterOptions={filterOptions}
                serverSide={toolbarServerSide}
            />
            <div className="rounded-xl border border-border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-4 w-3/4" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Inbox className="h-8 w-8 opacity-40" />
                                        <span className="text-sm">{emptyMessage}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
