import { HugeiconsIcon } from "@hugeicons/react";
import {
    FavouriteIcon,
    PinLocation01Icon,
    Add01Icon,
    Share01Icon,
    CheckmarkCircle01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { PlaceItem } from "@/components/toppick-detail/types";
import RelatedPosts from "@/components/shared/RelatedPosts";

interface Props { place: PlaceItem }

export default function PlaceSidebar({ place }: Props) {
    const actions = [
        { icon: FavouriteIcon, label: "Save Place", color: "text-red-400" },
        { icon: PinLocation01Icon, label: "Open in Google Maps", color: "text-blue-500" },
        { icon: Add01Icon, label: "Add to Itinerary", color: "text-purple-500" },
        { icon: Share01Icon, label: "Share Place", color: "text-green-500" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <RelatedPosts
                title="Related Posts"
                posts={place.suggestedBlogs.map((b) => ({
                    title: b.title,
                    readTime: b.readTime,
                    image: b.image,
                }))}
            />

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                    {actions.map(({ icon, label, color }) => (
                        <button
                            key={label}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left w-full"
                        >
                            <HugeiconsIcon icon={icon} size={16} className={color} strokeWidth={1.8} />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Travel Tips</h3>
                <div className="flex flex-col gap-2">
                    {place.travelTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-purple-500 mt-0.5 shrink-0" strokeWidth={1.8} />
                            <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Explore Itineraries CTA */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 text-white">
                <p className="text-sm font-bold mb-1">Plan your {place.location.split(",")[0]} trip</p>
                <p className="text-xs text-purple-200 mb-4">with curated itineraries</p>
                <button className="w-full flex items-center justify-center gap-1.5 bg-white text-purple-700 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-purple-50 transition-colors">
                    Explore Itineraries
                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
