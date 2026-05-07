"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tag, MapPin, Building2, BookOpen, FolderOpen, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Tags", href: "/admin/tags", icon: Tag },
    { label: "Destinations", href: "/admin/destinations", icon: MapPin },
    { label: "Places", href: "/admin/places", icon: Building2 },
    { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
    { label: "Collections", href: "/admin/collections", icon: FolderOpen },
    { label: "Itineraries", href: "/admin/itineraries", icon: Map },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-60 flex-col border-r border-border bg-white transition-transform duration-200 ease-in-out",
                // Always visible on large screens; slide in/out on mobile
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                active
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
