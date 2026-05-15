import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Diamond01Icon, Building01Icon, StarIcon } from "@hugeicons/core-free-icons";
import type { PlaceItem } from "@/components/toppick-detail/types";

interface Props { place: PlaceItem }

export default function PlaceQuickInfo({ place }: Props) {
    const items = [
        { icon: Clock01Icon, color: "text-blue-500 bg-blue-50", label: "Duration", value: place.timeToVisit },
        { icon: Diamond01Icon, color: "text-green-500 bg-green-50", label: "Price Range", value: place.entryFee },
        { icon: Building01Icon, color: "text-purple-500 bg-purple-50", label: "Type", value: place.type },
        { icon: StarIcon, color: "text-yellow-500 bg-yellow-50", label: "Rating", value: `${place.rating} (${place.reviewCount})` },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {items.map(({ icon, color, label, value }) => (
                    <div key={label} className={`rounded-xl p-4 ${color.split(" ")[1]}`}>
                        <div className={`mb-2 ${color.split(" ")[0]}`}>
                            <HugeiconsIcon icon={icon} size={20} strokeWidth={1.8} />
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
                        <p className="text-sm font-bold text-gray-800">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
