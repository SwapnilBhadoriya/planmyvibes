"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/admin/data-table";

export interface PlaceImage {
    id: number;
    url: string;
    type: string;
    isPrimary: boolean;
    position: number;
}

export interface Place {
    id: string;
    name: string;
    destinationId: string;
    type: string | null;
    description: string | null;
    priceMin: number | null;
    priceMax: number | null;
    durationMinutes: number | null;
    rating: number | null;
    address: string | null;
    googleMapsLink: string | null;
    createdAt: string;
    updatedAt: string;
    cover: PlaceImage | null;
    gallery: PlaceImage[];
    destination?: { id: string; name: string; type: string };
}

export interface PlaceDetail extends Place {
    destination: { id: string; name: string; type: string };
}

interface ColumnActions {
    onDelete: (place: Place) => void;
}

export function getPlaceColumns({ onDelete }: ColumnActions): ColumnDef<Place>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => (
                <Link href={`/admin/places/${row.original.id}`} className="font-medium hover:underline">
                    {row.getValue("name")}
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
                    <Link href={`/admin/destinations/${dest.id}`} className="text-sm hover:underline text-muted-foreground">
                        {dest.name}
                    </Link>
                );
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
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
            accessorKey: "rating",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
            cell: ({ row }) => {
                const rating = row.getValue<number | null>("rating");
                if (!rating) return <span className="text-muted-foreground text-sm">—</span>;
                return (
                    <span className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {rating}
                    </span>
                );
            },
        },
        {
            id: "price",
            header: "Price",
            cell: ({ row }) => {
                const { priceMin, priceMax } = row.original;
                if (!priceMin && !priceMax) return <span className="text-muted-foreground text-sm">—</span>;
                if (priceMin && priceMax) return <span className="text-sm">₹{priceMin.toLocaleString("en-IN")} – ₹{priceMax.toLocaleString("en-IN")}</span>;
                return <span className="text-sm">₹{(priceMin ?? priceMax)?.toLocaleString("en-IN")}</span>;
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
                const place = row.original;
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
                                <Link href={`/admin/places/${place.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/places/${place.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(place)}
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
