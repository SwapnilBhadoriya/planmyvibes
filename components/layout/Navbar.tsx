"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { NAV_LINKS } from "@/config/navigation";
import NavLink from "@/components/common/NavLink";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Navbar() {
    const [search, setSearch] = useState("");
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="mx-auto px-10">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <span className="text-[1.35rem] font-bold text-gray-900 tracking-tight">
                            TripVibee
                        </span>
                        <span className="text-[1.35rem] font-bold text-purple-600">+</span>
                        <span className="ml-1.5 text-base">✈️</span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                    </nav>

                    {/* Search */}
                    <div className="hidden lg:flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 w-72 shrink-0 focus-within:border-purple-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all duration-200">
                        <HugeiconsIcon
                            icon={Search01Icon}
                            size={16}
                            strokeWidth={1.8}
                            className="text-gray-400 shrink-0"
                        />
                        <input
                            type="text"
                            placeholder="Search destinations, trips..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none placeholder:text-gray-400 text-gray-800 flex-1 min-w-0 text-sm"
                        />
                    </div>

                    {/* User section */}
                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 transition-colors focus:outline-none">
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name ?? "User"}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold">
                                            {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                                        {session.user.name ?? session.user.email}
                                    </span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400" aria-hidden="true">
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <p className="font-medium text-sm text-gray-900 truncate">{session.user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {session.user.role === "admin" && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/tags" className="cursor-pointer">
                                            Admin Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                        >
                            Sign in
                        </Link>
                    )}

                </div>
            </div>
        </header>
    );
}
