"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/admin/data-table";

export type DestinationType = "country" | "state" | "city";

export interface DestinationImage {
    id: string;
    url: string;
    type: string;
    isPrimary: boolean;
    position: number;
}

export interface Destination {
    id: string;
    name: string;
    slug: string;
    type: DestinationType;
    parentId: string | null;
    country: string | null;
    state: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    images: DestinationImage[];
}

export interface DestinationDetail extends Destination {
    description: string | null;
    shortDescription: string | null;
    bestTimeStartMonth: number | null;
    bestTimeEndMonth: number | null;
    bestTimeNote: string | null;
    avgBudgetPerDay: number | null;
    parent: { id: string; name: string; type: string } | null;
    children: { id: string; name: string; type: string }[];
}

const TYPE_STYLES: Record<DestinationType, string> = {
    country: "bg-blue-100 text-blue-700 border-blue-200",
    state: "bg-green-100 text-green-700 border-green-200",
    city: "bg-orange-100 text-orange-700 border-orange-200",
};

interface ColumnActions {
    onDelete: (dest: Destination) => void;
}

export function getDestinationColumns({ onDelete }: ColumnActions): ColumnDef<Destination>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => (
                <Link
                    href={`/admin/destinations/${row.original.id}`}
                    className="font-medium hover:underline"
                >
                    {row.getValue("name")}
                </Link>
            ),
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => {
                const type = row.getValue<DestinationType>("type");
                return (
                    <Badge variant="outline" className={TYPE_STYLES[type]}>
                        {type}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => !value || row.getValue(id) === value,
        },
        {
            id: "location",
            header: "Location",
            cell: ({ row }) => {
                const { type, country, state } = row.original;
                if (type === "country") return <span className="text-muted-foreground text-sm">—</span>;
                if (type === "state") return <span className="text-sm">{country}</span>;
                return (
                    <span className="text-sm">
                        {[state, country].filter(Boolean).join(", ")}
                    </span>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) =>
                row.getValue("isActive") ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                ) : (
                    <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Inactive</Badge>
                ),
            filterFn: (row, id, value) => {
                if (value === "") return true;
                return String(row.getValue(id)) === value;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) =>
                new Date(row.getValue("createdAt")).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                }),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const dest = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/destinations/${dest.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/destinations/${dest.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(dest)}
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
