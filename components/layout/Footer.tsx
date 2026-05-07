import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Backpack01Icon, StarIcon, HeartAddIcon, GlobeIcon, Search01Icon,
} from "@hugeicons/core-free-icons";

const NAV_COLS = [
    {
        heading: "Company",
        links: ["About Us", "Our Story", "Careers", "Press", "Blog", "Contact Us"],
    },
    {
        heading: "Support",
        links: ["Help Center", "Travel Guides", "FAQs", "Booking Support", "Cancellation Policy", "Report an Issue"],
    },
    {
        heading: "Destinations",
        links: ["Popular Destinations", "Beach Getaways", "Mountain Adventures", "Cultural Experiences", "Weekend Trips", "View All Destinations"],
    },
    {
        heading: "Legal",
        links: ["Privacy Policy", "Terms of Service", "Terms of Use", "Cookie Policy", "Refund Policy", "Sitemap"],
    },
];

const TRUST_ITEMS = [
    { icon: Backpack01Icon, iconBg: "bg-purple-100", iconColor: "text-purple-600", title: "Trusted & Secure", subtitle: "Your data is 100% secure" },
    { icon: StarIcon,       iconBg: "bg-green-100",  iconColor: "text-green-600",  title: "Best Price Guarantee", subtitle: "Find the best deals" },
    { icon: HeartAddIcon,   iconBg: "bg-rose-100",   iconColor: "text-rose-500",   title: "24/7 Travel Support", subtitle: "We're here to help" },
    { icon: GlobeIcon,      iconBg: "bg-orange-100", iconColor: "text-orange-500", title: "10M+ Happy Travelers", subtitle: "Join our travel community" },
];

const SOCIAL = [
    { label: "Instagram", symbol: "IG", bg: "bg-gradient-to-br from-pink-500 to-orange-400" },
    { label: "Facebook",  symbol: "f",  bg: "bg-blue-600" },
    { label: "Twitter",   symbol: "𝕏",  bg: "bg-gray-900" },
    { label: "Pinterest", symbol: "P",  bg: "bg-red-600" },
];

const PAYMENTS = [
    { label: "VISA",   color: "text-blue-700 border-blue-200" },
    { label: "MC",     color: "text-red-600 border-red-200" },
    { label: "AMEX",   color: "text-indigo-700 border-indigo-200" },
    { label: "PayPal", color: "text-blue-500 border-blue-200" },
];

export default function Footer() {
    return (
        <footer className="mt-10">

            {/* ── CTA Banner ─────────────────────────────────────────── */}
            <div className="mx-4 lg:mx-6 rounded-2xl bg-purple-50 border border-purple-100 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <span className="text-3xl bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center shrink-0">
                        🧳
                    </span>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Ready to explore the world?</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Plan your next adventure with TripVibee and make memories that last forever.
                        </p>
                    </div>
                </div>

                {/* Dashed curve — decorative, desktop only */}
                <svg
                    viewBox="0 0 200 60"
                    className="hidden lg:block w-48 shrink-0 opacity-40"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M10 50 C 60 10, 140 50, 190 10"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                    />
                </svg>

                {/* CTA button */}
                <Link
                    href="#"
                    className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors whitespace-nowrap"
                >
                    Start Your Journey →
                </Link>
            </div>

            {/* ── Main Footer ────────────────────────────────────────── */}
            <div className="bg-white border-t border-gray-100 mt-0">
                <div className="px-6 lg:px-10 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[200px_1fr_1fr_1fr_1fr] xl:grid-cols-[200px_1fr_1fr_1fr_1fr_260px] gap-8">

                    {/* Brand column */}
                    <div>
                        <Link href="/" className="flex items-center gap-1">
                            <span className="text-xl font-bold text-gray-900">TripVibee</span>
                            <span className="text-xl font-bold text-purple-600">+</span>
                            <span className="ml-1 text-base">✈️</span>
                        </Link>
                        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                            Your go-to travel companion for discovering amazing destinations and creating unforgettable memories.
                        </p>
                        <div className="flex gap-2.5 mt-5">
                            {SOCIAL.map((s) => (
                                <button
                                    key={s.label}
                                    aria-label={s.label}
                                    className={`h-9 w-9 rounded-full ${s.bg} flex items-center justify-center text-white text-xs font-bold hover:opacity-90 hover:scale-105 transition-all`}
                                >
                                    {s.symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {NAV_COLS.map((col) => (
                        <div key={col.heading}>
                            <h4 className="text-sm font-bold text-gray-900 mb-4">{col.heading}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1 group"
                                        >
                                            {link}
                                            <span className="text-gray-300 group-hover:text-purple-400 transition-colors text-xs">›</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter column */}
                    <div className="relative rounded-2xl bg-gray-50 border border-gray-100 p-5 overflow-hidden">
                        {/* Decorative suitcase */}
                        <span className="absolute bottom-3 right-3 text-5xl opacity-20 pointer-events-none select-none">
                            🧳
                        </span>

                        <h4 className="text-sm font-bold text-gray-900">Stay in the loop</h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            Subscribe for travel tips, exclusive deals and inspiration.
                        </p>

                        {/* Email input */}
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
                            <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.8} className="text-gray-400 shrink-0" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 flex-1 min-w-0"
                            />
                        </div>

                        <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl py-2.5 transition-colors">
                            Subscribe Now
                        </button>
                    </div>
                </div>

                {/* ── Trust Bar ──────────────────────────────────────── */}
                <div className="border-t border-b border-gray-100 py-5 px-6 lg:px-10">
                    <div className="flex flex-wrap items-center gap-6 lg:gap-0 justify-between">
                        {/* Trust items */}
                        <div className="flex flex-wrap items-center gap-6 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                            {TRUST_ITEMS.map((item, i) => (
                                <div
                                    key={item.title}
                                    className={`flex items-center gap-3 ${i > 0 ? "lg:pl-8" : ""} ${i < TRUST_ITEMS.length - 1 ? "lg:pr-8" : ""}`}
                                >
                                    <span className={`shrink-0 ${item.iconBg} rounded-xl p-2.5`}>
                                        <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} className={item.iconColor} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment logos */}
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-400 font-medium">We accept</span>
                            <div className="flex items-center gap-2">
                                {PAYMENTS.map((p) => (
                                    <span
                                        key={p.label}
                                        className={`border rounded px-2 py-0.5 text-xs font-bold ${p.color}`}
                                    >
                                        {p.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Copyright Bar ──────────────────────────────────── */}
                <div className="px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                        © 2024 TripVibee. All rights reserved.
                    </p>

                    {/* Decorative center */}
                    <div className="flex items-center gap-2 opacity-40" aria-hidden="true">
                        <svg viewBox="0 0 80 30" className="w-16" fill="none">
                            <path
                                d="M5 15 C 20 5, 35 25, 40 15 C 45 5, 60 25, 75 15"
                                stroke="#8B5CF6"
                                strokeWidth="1.5"
                                strokeDasharray="4 3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="text-base">✈️</span>
                    </div>

                    {/* Legal links */}
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, i) => (
                            <span key={item} className="flex items-center gap-3">
                                {i > 0 && <span className="text-gray-200">|</span>}
                                <Link href="#" className="text-xs text-gray-400 hover:text-purple-600 transition-colors">
                                    {item}
                                </Link>
                            </span>
                        ))}
                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 border border-gray-200 rounded-full px-3 py-1 ml-1 transition-colors">
                            🌐 English ↓
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
