import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, Money01Icon, Location01Icon } from "@hugeicons/core-free-icons";

export type BadgeColor = "green" | "blue" | "emerald" | "orange" | "rose";

type DestinationCardProps = {
    badge: string;
    badgeColor: BadgeColor;
    location: string;
    country: string;
    days: number;
    price: string;
    gradient: string;
};

const BADGE_STYLES: Record<BadgeColor, string> = {
    green:   "bg-green-500 text-white",
    blue:    "bg-blue-500 text-white",
    emerald: "bg-emerald-400 text-white",
    orange:  "bg-orange-400 text-white",
    rose:    "bg-rose-500 text-white",
};

export default function DestinationCard({
    badge,
    badgeColor,
    location,
    country,
    days,
    price,
    gradient,
}: DestinationCardProps) {
    return (
        <div className={`relative h-52 w-52 shrink-0 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-b ${gradient}`}>

            {/* Badge */}
            <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLES[badgeColor]}`}>
                {badge}
            </span>

            {/* Bottom info overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                <div className="flex items-center gap-1 mb-0.5">
                    <HugeiconsIcon icon={Location01Icon} size={12} strokeWidth={2} className="text-white/70" />
                    <span className="text-[11px] text-white/70">{country}</span>
                </div>
                <p className="text-sm font-bold text-white leading-tight">{location}</p>
                <p className="text-xs text-white/80 mb-1.5">{days} Days Itinerary</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Calendar01Icon} size={12} strokeWidth={2} className="text-white/70" />
                        <span className="text-[11px] text-white/70">{days} Days</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Money01Icon} size={12} strokeWidth={2} className="text-white/70" />
                        <span className="text-[11px] text-white/70">{price}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
