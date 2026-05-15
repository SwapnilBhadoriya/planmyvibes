import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface Props {
    collections: { title: string; count: number; image: string }[];
}

export default function PlaceRelatedCollections({ collections }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {collections.map((col, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden h-36 cursor-pointer group">
                        <Image src={col.image} alt={col.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-bold leading-tight">{col.title}</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-white/70 text-xs">{col.count} Places</p>
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-white" strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
