"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { NAV_LINKS } from "@/config/navigation";
import NavLink from "@/components/common/NavLink";
import SearchModal from "@/components/layout/SearchModal";
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
    const [searchOpen, setSearchOpen] = useState(false);
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
        <header className="fixed top-0 left-0 right-0 z-[150] w-full bg-white border-b border-gray-100">
            <div className="mx-auto px-4 sm:px-6 lg:px-10" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
                <div className="flex h-16 items-center gap-4">

                    {/* Logo — shrink-0 so it never compresses */}
                    <Link href="/" className="flex items-center shrink-0">
                        <span className="text-[1.35rem] font-bold text-gray-900 tracking-tight">TripVibee</span>
                        <span className="text-[1.35rem] font-bold text-purple-600">+</span>
                        <span className="ml-1.5 text-base">✈️</span>
                    </Link>

                    {/* Nav Links — centered in remaining space */}
                    <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                    </nav>

                    {/* Right side: search + auth */}
                    <div className="flex items-center gap-3 ml-auto md:ml-0 shrink-0">
                        {/* Search — visible from lg */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="hidden lg:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 w-56 xl:w-72 hover:border-purple-400 hover:bg-white transition-all duration-200"
                        >
                            <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-400 flex-1 text-left">Search destinations, trips...</span>
                        </button>

                        {/* Auth */}
                        {session?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 transition-colors focus:outline-none">
                                        {session.user.image ? (
                                            <Image src={session.user.image} alt={session.user.name ?? "User"} width={32} height={32} className="rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold">
                                                {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
                                            </div>
                                        )}
                                        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
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
                                            <Link href="/admin/tags" className="cursor-pointer">Admin Dashboard</Link>
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
                                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                            >
                                Sign in
                            </Link>
                        )}

                        {/* Hamburger — mobile only */}
                        <button
                            className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                            style={{ minWidth: 44, minHeight: 44 }}
                        >
                            <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={20} strokeWidth={1.8} className="text-gray-700" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
                    <button
                        onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 mb-2 w-full hover:border-purple-400 transition-all"
                    >
                        <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-400">Search destinations, trips...</span>
                    </button>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>

        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
