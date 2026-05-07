"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { AdminNavbar } from "./admin-navbar";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change (mobile navigation)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50">
            <AdminNavbar
                sidebarOpen={sidebarOpen}
                onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            />
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden
                />
            )}

            <main className="min-w-0 pt-16 lg:ml-60">
                <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
