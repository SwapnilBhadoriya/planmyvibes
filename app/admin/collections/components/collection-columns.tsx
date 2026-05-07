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

export interface CollectionPlace {
    id: string;
    name: string;
    type: string | null;
    position: number | null;
    cover: { url: string } | null;
}

export interface Collection {
    id: string;
    title: string | null;
    description: string | null;
    type: string | null;
    destination: { id: string; name: string } | null;
    places: CollectionPlace[];
}

export interface CollectionDetail extends Collection {
    places: (CollectionPlace & {
        gallery: { url: string }[];
        address: string | null;
        rating: number | null;
    })[];
}

interface ColumnActions {
    onDelete: (collection: Collection) => void;
}

export function getCollectionColumns({ onDelete }: ColumnActions): ColumnDef<Collection>[] {
    return [
        {
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
            cell: ({ row }) => (
                <Link href={`/admin/collections/${row.original.id}`} className="font-medium hover:underline">
                    {row.getValue("title") || <span className="text-muted-foreground italic">Untitled</span>}
                </Link>
            ),
        },
        {
            id: "destination",
            header: "Destination",
            cell: ({ row }) => {
                const dest = row.original.destination;
                if (!dest) return <span className="text-muted-foreground text-sm">—</span>;
                return (
                    <Link href={`/admin/destinations/${dest.id}`} className="text-sm text-muted-foreground hover:underline">
                        {dest.name}
                    </Link>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue<string | null>("type");
                if (!type) return <span className="text-muted-foreground text-sm">—</span>;
                return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">{type}</Badge>;
            },
            filterFn: (row, id, value) => {
                if (!value) return true;
                const type = row.getValue<string | null>(id);
                return !!type && type.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            id: "places",
            header: "Places",
            cell: ({ row }) => {
                const count = row.original.places.length;
                return <span className="text-sm text-muted-foreground">{count} place{count !== 1 ? "s" : ""}</span>;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => {
                const val = row.getValue<string>("createdAt");
                if (!val) return <span className="text-muted-foreground text-sm">—</span>;
                return new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const collection = row.original;
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
                                <Link href={`/admin/collections/${collection.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/collections/${collection.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(collection)}
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
