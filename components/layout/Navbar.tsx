"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { NAV_LINKS } from "@/config/navigation";
import NavLink from "@/components/common/NavLink";

export default function Navbar() {
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <span className="text-[1.35rem] font-bold text-gray-900 tracking-tight">
                            TripVibee
                        </span>
                        <span className="text-[1.35rem] font-bold text-purple-600">+</span>
                        <span className="ml-1.5 text-base">✈️</span>
                    </Link>

                    {/* Nav Links — hidden on mobile */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                    </nav>

                    {/* Search — desktop only */}
                    <div className="hidden xl:flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 w-72 shrink-0 focus-within:border-purple-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all duration-200">
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

                    {/* Hamburger — mobile only */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={22} strokeWidth={1.8} />
                    </button>

                </div>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
                    {/* Mobile search */}
                    <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 mb-2 focus-within:border-purple-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all duration-200">
                        <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search destinations, trips..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none placeholder:text-gray-400 text-gray-800 flex-1 min-w-0 text-sm"
                        />
                    </div>

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
    );
}
