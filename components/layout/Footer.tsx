import Link from "next/link";

const LINKS = [
    { label: "Home",           href: "/",               live: true },
    { label: "Itineraries",    href: "/itineraries",    live: true },
    { label: "Destinations",   href: "/destinations",   live: true },
    { label: "Top Picks",      href: "/top-picks",      live: false },
    { label: "Blog",           href: "#",               live: false },
    { label: "About Us",       href: "/about",          live: true },
    { label: "Contact Us",     href: "/about#contact",  live: true },
    { label: "Privacy Policy", href: "/privacy",        live: true },
    { label: "Terms",          href: "/terms",          live: true },
];

const SOCIAL = [
    { label: "Instagram", symbol: "IG", bg: "bg-gradient-to-br from-pink-500 to-orange-400" },
    { label: "Facebook",  symbol: "f",  bg: "bg-blue-600" },
    { label: "Twitter",   symbol: "𝕏",  bg: "bg-gray-900" },
    { label: "Pinterest", symbol: "P",  bg: "bg-red-600" },
];

export default function Footer() {
    return (
        <footer className="mt-8 bg-purple-50 border-t border-purple-100">
            <div className="px-5 sm:px-8 xl:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Brand */}
                <Link href="/" className="flex items-center gap-0.5 shrink-0">
                    <span className="text-base font-bold text-gray-900">TripVibee</span>
                    <span className="text-base font-bold text-purple-600">+</span>
                    <span className="ml-1 text-sm">✈️</span>
                </Link>

                {/* Horizontal links */}
                <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                    {LINKS.map((link, i) => (
                        <span key={link.label} className="flex items-center gap-1">
                            {i > 0 && <span className="text-purple-200 text-xs select-none">·</span>}
                            <Link
                                href={link.href}
                                className={`text-xs transition-colors ${link.live ? "text-gray-500 hover:text-purple-600" : "text-gray-300 pointer-events-none"}`}
                            >
                                {link.label}
                            </Link>
                            {!link.live && (
                                <span className="text-[9px] font-bold text-purple-400 bg-purple-100 border border-purple-200 rounded px-1 leading-tight">
                                    Soon
                                </span>
                            )}
                        </span>
                    ))}
                </nav>

                {/* Socials */}
                <div className="flex items-center gap-2 shrink-0">
                    {SOCIAL.map((s) => (
                        <button
                            key={s.label}
                            aria-label={s.label}
                            className={`h-7 w-7 rounded-full ${s.bg} flex items-center justify-center text-white text-[10px] font-bold hover:opacity-80 transition-all`}
                        >
                            {s.symbol}
                        </button>
                    ))}
                </div>

            </div>

            {/* Copyright */}
            <div className="border-t border-purple-100 px-5 sm:px-8 xl:px-10 py-2.5 flex items-center justify-between">
                <p className="text-[11px] text-gray-400">© 2026 TripVibee. All rights reserved.</p>
                <p className="text-[11px] text-gray-400">Made with ♥ for travelers</p>
            </div>
        </footer>
    );
}
