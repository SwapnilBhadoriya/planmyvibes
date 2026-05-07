"use client";

import { Menu, X, Compass, User, LogOut, Settings } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Replace with real auth data when available
const MOCK_USER = { name: "Rajvi", email: "admin@planmyvibe.com" };

interface AdminNavbarProps {
    sidebarOpen: boolean;
    onMenuToggle: () => void;
}

export function AdminNavbar({ sidebarOpen, onMenuToggle }: AdminNavbarProps) {
    return (
        <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center gap-3 border-b border-border bg-white px-4">
            {/* Hamburger — mobile only */}
            <button
                onClick={onMenuToggle}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">PlanMyVibe</span>
                <span className="ml-1 hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:inline">
                    Admin
                </span>
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        )}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                {MOCK_USER.name[0]}
                            </div>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-medium leading-none">{MOCK_USER.name}</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <p className="font-medium">{MOCK_USER.name}</p>
                            <p className="text-xs font-normal text-muted-foreground">{MOCK_USER.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
