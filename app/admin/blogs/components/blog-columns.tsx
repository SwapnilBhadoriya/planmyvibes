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

export interface Blog {
    id: string;
    title: string | null;
    slug: string | null;
    content: string | null;
    coverImage?: string | null;
    entityType: string;
    entityId: string | null;
    type: string | null;
    status: "DRAFT" | "PUBLISHED";
    createdAt: string;
}

interface ColumnActions {
    onDelete: (blog: Blog) => void;
}

export function getBlogColumns({ onDelete }: ColumnActions): ColumnDef<Blog>[] {
    return [
        {
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
            cell: ({ row }) => (
                <Link href={`/admin/blogs/${row.original.id}`} className="font-medium hover:underline">
                    {row.getValue("title") || <span className="italic text-muted-foreground">Untitled</span>}
                </Link>
            ),
        },
        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => {
                const slug = row.getValue<string | null>("slug");
                if (!slug) return <span className="text-muted-foreground text-sm">—</span>;
                return <span className="font-mono text-xs text-muted-foreground">{slug}</span>;
            },
        },
        {
            accessorKey: "entityType",
            header: "Entity",
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 font-mono text-xs">
                    {row.getValue<string>("entityType")}
                </Badge>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue<string | null>("type");
                if (!type) return <span className="text-muted-foreground text-sm">—</span>;
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{type}</Badge>;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const s = row.getValue<string>("status");
                return s === "PUBLISHED"
                    ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Published</Badge>
                    : <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Draft</Badge>;
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
                const blog = row.original;
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
                                <Link href={`/admin/blogs/${blog.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(blog)}
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
