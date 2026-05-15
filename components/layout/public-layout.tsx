"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");
    const isAuth = pathname.startsWith("/login") || pathname.startsWith("/signup");

    if (isAdmin || isAuth) return <>{children}</>;

    return (
        <>
            <Navbar />
            {/* Spacer to push content below the fixed navbar (h-16 = 64px) */}
            <div className="h-16" />
            <div className="isolate">
                {children}
            </div>
            <Footer />
        </>
    );
}
