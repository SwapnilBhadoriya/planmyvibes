"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { NAV_LINKS } from "@/config/navigation";
import NavLink from "@/components/common/NavLink";

export default function Navbar() {
    const [search, setSearch] = useState("");

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

                </div>
            </div>
        </header>
    );
}
