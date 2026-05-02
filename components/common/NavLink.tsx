"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavLinkProps = {
    href: string;
    label: string;
    className?: string;
    activeClassName?: string;
};

export default function NavLink({ href, label, className, activeClassName }: NavLinkProps) {
    const pathname = usePathname();

    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={clsx(
                "text-[0.95rem] font-medium transition-colors py-5 border-b-2",
                isActive
                    ? (activeClassName ?? "text-purple-600 font-bold border-purple-600")
                    : "hover:text-purple-600 border-transparent hover:border-purple-600",
                className
            )}
        >
            {label}
        </Link>
    );
}
