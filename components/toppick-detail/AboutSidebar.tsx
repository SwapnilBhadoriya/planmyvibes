"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar01Icon,
    LanguageSkillIcon,
    Dollar01Icon,
    Bus01Icon,
    Tick01Icon,
} from "@hugeicons/core-free-icons";
import type { TopPickCollection } from "./types";

interface Props {
    collection: TopPickCollection;
}

export default function AboutSidebar({ collection }: Props) {
    const infoItems = [
        {
            icon: Calendar01Icon,
            color: "text-purple-500",
            label: "Best Time to Visit",
            value: collection.bestTimeToVisit,
        },
        {
            icon: LanguageSkillIcon,
            color: "text-blue-500",
            label: "Language",
            value: collection.language,
        },
        {
            icon: Dollar01Icon,
            color: "text-green-500",
            label: "Currency",
            value: collection.currency,
        },
        {
            icon: Bus01Icon,
            color: "text-orange-500",
            label: "Local Transport",
            value: collection.localTransport,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* About card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">
                    About {collection.title.replace(/Top \d+ (Places|Things|Spots)? ?(in|to|at)? ?/i, "").trim() || "This Destination"}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{collection.aboutText}</p>

                <div className="flex flex-col gap-3">
                    {infoItems.map(({ icon, color, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                            <div className={`mt-0.5 ${color}`}>
                                <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">{label}</p>
                                <p className="text-sm text-gray-800 font-semibold">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Travel tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Travel Tips</h3>
                <div className="flex flex-col gap-2">
                    {collection.travelTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <HugeiconsIcon
                                icon={Tick01Icon}
                                size={14}
                                className="text-purple-500 mt-0.5 shrink-0"
                                strokeWidth={2}
                            />
                            <p className="text-sm text-gray-600 leading-snug">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
