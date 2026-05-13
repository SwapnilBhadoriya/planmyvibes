import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Share01Icon } from "@hugeicons/core-free-icons";
import { Clock, Sun, Wallet, Download } from "lucide-react";

type HeroProps = {
    title: string;
    subtitle: string;
    coverImageUrl?: string | null;
    durationDays: number;
    stayNights: number;
    budgetMin: number;
    budgetMax: number;
    bestTimeLabel: string;
};

export default function ItineraryDetailHero({
    title, subtitle, coverImageUrl,
    durationDays, stayNights, budgetMin, budgetMax, bestTimeLabel,
}: HeroProps) {
    return (
        <section
            className="relative overflow-hidden mx-4 lg:mx-6 rounded-3xl bg-white border border-gray-100 shadow-sm"
            style={{ minHeight: 200 }}
        >
            {/* Right-side image — covers the right 55%, fades into white on left */}
            <div className="absolute inset-y-0 right-0 w-[55%]">
                <Image
                    src={coverImageUrl ?? "/images/itineraries-hero.png"}
                    alt={title}
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/55 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-6" style={{ minHeight: 200 }}>

                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                    <Link
                        href="/itineraries"
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                        ← Back to Itineraries
                    </Link>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full transition-colors shadow-sm">
                            <HugeiconsIcon icon={Share01Icon} size={14} strokeWidth={2} />
                            Share
                        </button>
                        <button className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">
                            <Download size={14} strokeWidth={2} />
                            Download Itinerary
                        </button>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight max-w-[460px]">
                    {title}
                </h1>
                <p className="text-sm text-gray-500 mt-1.5 max-w-[400px] leading-relaxed">
                    {subtitle}
                </p>

                {/* 3 chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <Chip icon={<Clock size={12} className="text-gray-400" />}
                        label={`${durationDays} Days / ${stayNights} Nights`} />
                    <Chip icon={<Sun size={12} className="text-gray-400" />}
                        label={`Best Time: ${bestTimeLabel}`} />
                    <Chip icon={<Wallet size={12} className="text-gray-400" />}
                        label={`Budget: ₹${Math.round(budgetMin / 1000)}K – ₹${Math.round(budgetMax / 1000)}K / person`} />
                </div>
            </div>
        </section>
    );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="inline-flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 bg-white shadow-sm">
            {icon}
            <span className="text-xs text-gray-600 whitespace-nowrap">{label}</span>
        </div>
    );
}
