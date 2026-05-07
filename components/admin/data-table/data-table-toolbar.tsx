"use client";

import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTableViewOptions } from "./data-table-view-options";
import { useDebounce } from "@/hooks/use-debounce";

interface FilterOption {
    key: string;
    label: string;
    options: { label: string; value: string }[];
}

interface ServerSideOptions {
    search: string;
    onSearchChange: (value: string) => void;
    filterValues: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchKey?: string;
    filterOptions?: FilterOption[];
    serverSide?: ServerSideOptions;
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    filterOptions,
    serverSide,
}: DataTableToolbarProps<TData>) {
    // Client-side: local search state + debounce into TanStack filter
    const [localSearch, setLocalSearch] = useState(
        !serverSide && searchKey ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? "" : ""
    );
    const debouncedSearch = useDebounce(localSearch, 300);

    useEffect(() => {
        if (!serverSide && searchKey) {
            table.getColumn(searchKey)?.setFilterValue(debouncedSearch);
        }
    }, [debouncedSearch, searchKey, serverSide, table]);

    const isFiltered = serverSide
        ? !!(serverSide.search || Object.values(serverSide.filterValues).some((v) => v))
        : table.getState().columnFilters.length > 0 ||
          !!(searchKey && (table.getColumn(searchKey)?.getFilterValue() as string));

    function resetFilters() {
        if (serverSide) {
            serverSide.onSearchChange("");
            filterOptions?.forEach((f) => serverSide.onFilterChange(f.key, ""));
        } else {
            table.resetColumnFilters();
            setLocalSearch("");
        }
    }

    const searchValue = serverSide ? serverSide.search : localSearch;
    function handleSearchChange(value: string) {
        if (serverSide) {
            serverSide.onSearchChange(value);
        } else {
            setLocalSearch(value);
        }
    }

    function getFilterValue(key: string): string {
        if (serverSide) return serverSide.filterValues[key] ?? "";
        return (table.getColumn(key)?.getFilterValue() as string) ?? "";
    }

    function setFilterValue(key: string, value: string) {
        if (serverSide) {
            serverSide.onFilterChange(key, value === "__all__" ? "" : value);
        } else {
            table.getColumn(key)?.setFilterValue(value === "__all__" ? "" : value);
        }
    }

    return (
        <div className="flex items-center justify-between gap-2 py-4">
            <div className="flex flex-1 items-center gap-2 flex-wrap">
                {searchKey && (
                    <Input
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="h-8 w-[200px] lg:w-[300px]"
                    />
                )}
                {filterOptions?.map((filter) => (
                    <Select
                        key={filter.key}
                        value={getFilterValue(filter.key) || "__all__"}
                        onValueChange={(value) => setFilterValue(filter.key, value)}
                    >
                        <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">All {filter.label}</SelectItem>
                            {filter.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}
                {isFiltered && (
                    <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
