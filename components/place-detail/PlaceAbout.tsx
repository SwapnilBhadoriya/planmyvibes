import type { PlaceItem } from "@/components/toppick-detail/types";

interface Props { place: PlaceItem }

export default function PlaceAbout({ place }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About {place.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{place.about}</p>
        </div>
    );
}
