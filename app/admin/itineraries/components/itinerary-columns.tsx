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
import { type ItineraryListItem } from "@/hooks/use-itineraries";

const TRIP_TYPE_COLORS: Record<string, string> = {
    solo: "bg-purple-50 text-purple-700 border-purple-200",
    couple: "bg-pink-50 text-pink-700 border-pink-200",
    family: "bg-orange-50 text-orange-700 border-orange-200",
    group: "bg-blue-50 text-blue-700 border-blue-200",
};

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: "bg-green-50 text-green-700 border-green-200",
    moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
};

interface ColumnActions {
    onDelete: (itinerary: ItineraryListItem) => void;
}

export function getItineraryColumns({ onDelete }: ColumnActions): ColumnDef<ItineraryListItem>[] {
    return [
        {
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
            cell: ({ row }) => (
                <Link href={`/admin/itineraries/${row.original.id}`} className="font-medium hover:underline">
                    {row.getValue("title") || <span className="italic text-muted-foreground">Untitled</span>}
                </Link>
            ),
        },
        {
            id: "destinations",
            header: "Destinations",
            cell: ({ row }) => {
                const dests = row.original.itineraryDestinations;
                if (!dests?.length) return <span className="text-muted-foreground text-sm">—</span>;
                return (
                    <span className="text-sm text-muted-foreground">
                        {dests.map((d) => d.destination.name).join(", ")}
                    </span>
                );
            },
        },
        {
            accessorKey: "durationDays",
            header: "Days",
            cell: ({ row }) => {
                const d = row.getValue<number | null>("durationDays");
                return d ? <span className="text-sm">{d}d</span> : <span className="text-muted-foreground text-sm">—</span>;
            },
        },
        {
            accessorKey: "tripType",
            header: "Trip Type",
            cell: ({ row }) => {
                const t = row.getValue<string | null>("tripType");
                if (!t) return <span className="text-muted-foreground text-sm">—</span>;
                return <Badge variant="outline" className={TRIP_TYPE_COLORS[t] ?? ""}>{t}</Badge>;
            },
        },
        {
            accessorKey: "difficulty",
            header: "Difficulty",
            cell: ({ row }) => {
                const d = row.getValue<string | null>("difficulty");
                if (!d) return <span className="text-muted-foreground text-sm">—</span>;
                return <Badge variant="outline" className={DIFFICULTY_COLORS[d] ?? ""}>{d}</Badge>;
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
                const itin = row.original;
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
                                <Link href={`/admin/itineraries/${itin.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/itineraries/${itin.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(itin)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
