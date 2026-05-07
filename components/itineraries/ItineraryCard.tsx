import { HugeiconsIcon } from "@hugeicons/react";
import { HeartAddIcon, Clock01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";

export type ItinBadgeType =
    | "trending" | "top-rated" | "popular" | "culture"
    | "hidden-gem" | "budget-pick" | "new" | "family-friendly";

export type ItinTagType =
    | "Beach" | "Mountains" | "Adventure" | "Relaxing"
    | "Culture" | "History" | "Nature" | "Romantic" | "Luxury";

type ItineraryCardProps = {
    badge: string;
    badgeType: ItinBadgeType;
    title: string;
    subtitle: string;
    days: number;
    nights: number;
    price: string;
    tags: ItinTagType[];
    rating: number;
    reviewCount: number;
    gradient: string;
};

const BADGE_STYLES: Record<ItinBadgeType, string> = {
    "trending":        "bg-green-500 text-white",
    "top-rated":       "bg-blue-500 text-white",
    "popular":         "bg-teal-500 text-white",
    "culture":         "bg-purple-500 text-white",
    "hidden-gem":      "bg-orange-400 text-white",
    "budget-pick":     "bg-emerald-500 text-white",
    "new":             "bg-cyan-500 text-white",
    "family-friendly": "bg-violet-500 text-white",
};

const TAG_STYLES: Record<ItinTagType, string> = {
    Beach:     "bg-blue-50 text-blue-600 border border-blue-100",
    Mountains: "bg-green-50 text-green-700 border border-green-100",
    Adventure: "bg-orange-50 text-orange-600 border border-orange-100",
    Relaxing:  "bg-pink-50 text-pink-600 border border-pink-100",
    Culture:   "bg-purple-50 text-purple-600 border border-purple-100",
    History:   "bg-amber-50 text-amber-700 border border-amber-100",
    Nature:    "bg-teal-50 text-teal-600 border border-teal-100",
    Romantic:  "bg-rose-50 text-rose-600 border border-rose-100",
    Luxury:    "bg-indigo-50 text-indigo-600 border border-indigo-100",
};

export default function ItineraryCard({
    badge, badgeType, title, subtitle, days, nights, price, tags, rating, reviewCount, gradient,
}: ItineraryCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:border-purple-100 transition-all duration-200">

            {/* Image — gradient placeholder */}
            <div className={`relative h-44 bg-gradient-to-b ${gradient} overflow-hidden`}>
                {/* Bottom vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Badge */}
                <span className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${BADGE_STYLES[badgeType]}`}>
                    {badge}
                </span>

                {/* Save heart */}
                <button className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition-transform">
                    <HugeiconsIcon icon={HeartAddIcon} size={14} strokeWidth={2} className="text-gray-400 group-hover:text-pink-400 transition-colors" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition-colors truncate">
                    {title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>

                {/* Duration + Price */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
                        <HugeiconsIcon icon={Clock01Icon} size={11} strokeWidth={2} className="text-gray-400 shrink-0" />
                        {days}D / {nights}N
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-full px-2.5 py-1">
                        <HugeiconsIcon icon={Wallet01Icon} size={11} strokeWidth={2} className="text-gray-400 shrink-0" />
                        from {price}
                    </span>
                </div>

                {/* Vibe tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TAG_STYLES[tag]}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Divider + Rating */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm leading-none">★</span>
                        <span className="text-xs font-bold text-gray-900">{rating}</span>
                        <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
                    </div>
                    <span className="text-[10px] font-medium text-purple-500 bg-purple-50 rounded-full px-2 py-0.5">View →</span>
                </div>
            </div>

        </div>
    );
}
