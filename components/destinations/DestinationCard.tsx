import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Wallet01Icon, HeartAddIcon } from "@hugeicons/core-free-icons";

export type DestBadgeColor = "green" | "blue" | "purple" | "orange" | "indigo";

type DestinationCardProps = {
    badge: string;
    badgeColor: DestBadgeColor;
    location: string;
    country: string;
    description: string;
    days: number;
    price: string;
    gradient: string;
};

const BADGE_STYLES: Record<DestBadgeColor, string> = {
    green:  "bg-green-500 text-white",
    blue:   "bg-blue-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-400 text-white",
    indigo: "bg-indigo-500 text-white",
};

export default function DestinationCard({
    badge, badgeColor, location, country, description, days, price, gradient,
}: DestinationCardProps) {
    return (
        <div className={`relative h-48 sm:h-56 xl:h-64 w-full rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-b ${gradient}`}>

            {/* Badge */}
            <span className={`absolute top-2.5 left-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${BADGE_STYLES[badgeColor]}`}>
                {badge}
            </span>

            {/* Save heart */}
            <button className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                <HugeiconsIcon icon={HeartAddIcon} size={12} strokeWidth={2} className="text-white" />
            </button>

            {/* Bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 sm:p-3">
                <p className="text-sm font-bold text-white leading-tight truncate">{location}</p>
                <p className="text-[11px] text-white/70 mb-1.5 truncate">{country}</p>
                {/* Description — hidden on lg (too narrow), visible on sm–md */}
                <p className="text-[10px] text-white/60 mb-1.5 hidden sm:block truncate">{description}</p>
                <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Clock01Icon} size={10} strokeWidth={2} className="text-white/60 shrink-0" />
                    <span className="text-[10px] text-white/70">{days}d</span>
                    <span className="text-[10px] text-white/40 mx-0.5">·</span>
                    <HugeiconsIcon icon={Wallet01Icon} size={10} strokeWidth={2} className="text-white/60 shrink-0" />
                    <span className="text-[10px] text-white/70 truncate">{price}</span>
                </div>
            </div>

        </div>
    );
}
