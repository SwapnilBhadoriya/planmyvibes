"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/admin/data-table";

export interface Tag {
    id: number;
    name: string;
    type: string | null;
    createdAt: string;
}

const tagTypeStyles: Record<string, string> = {
    vibe: "bg-purple-100 text-purple-700 border-purple-200",
    budget: "bg-emerald-100 text-emerald-700 border-emerald-200",
    audience: "bg-blue-100 text-blue-700 border-blue-200",
    category: "bg-amber-100 text-amber-700 border-amber-200",
};

function TagTypeBadge({ type }: { type: string | null }) {
    if (!type) return <span className="text-muted-foreground text-sm">—</span>;
    const styles = tagTypeStyles[type] ?? "bg-slate-100 text-slate-600 border-slate-200";
    return (
        <Badge variant="outline" className={styles}>
            {type}
        </Badge>
    );
}

interface ColumnActions {
    onEdit: (tag: Tag) => void;
    onDelete: (tag: Tag) => void;
}

export function getTagColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<Tag>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">#{row.getValue("id")}</span>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => <TagTypeBadge type={row.getValue("type")} />,
            filterFn: (row, id, value) => {
                if (!value) return true;
                return row.getValue(id) === value;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => {
                const val = row.getValue<string>("createdAt");
                return new Date(val).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const tag = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(tag)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(tag)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
