"use client";

import {
    Plane, MapPin, Utensils, BedDouble, ShoppingBag, Mountain, Car,
} from "lucide-react";

type Transport = {
    id: string;
    mode: string;
    durationMinutes?: number | null;
    distanceKm?: number | null;
    cost?: string | null;
    fromPlace?: string | null;
    toPlace?: string | null;
};

type Activity = {
    id: string;
    title: string;
    activityType: string;
    startTime?: string | null;
    durationMinutes?: number | null;
    notes?: string | null;
    imageUrl?: string | null;
    transports: Transport[];
    tips?: string[] | string | null;
    address?: string | null;
    gallery?: string[];
    description?: string | null;
    bestTime?: string | null;
    duration?: string | null;
    entryFee?: string | null;
};

type DayTimelineProps = {
    dayNumber: number;
    totalDays: number;
    title: string;
    subtitle?: string | null;
    temperature?: string | null;
    dayNote?: string | null;
    activities: Activity[];
    selectedActivityId: string | null;
    onSelectActivity: (id: string) => void;
};

// ── Per-type visual config ─────────────────────────────────────────────────
type TypeStyle = {
    category: string;
    categoryColor: string;
    iconBg: string;
    iconColor: string;
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

const TYPE_STYLES: Record<string, TypeStyle> = {
    travel: {
        category: "TRANSPORTATION",
        categoryColor: "text-indigo-500",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        Icon: Plane,
    },
    sightseeing: {
        category: "PLACE",
        categoryColor: "text-green-600",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        Icon: MapPin,
    },
    adventure: {
        category: "PLACE",
        categoryColor: "text-green-600",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        Icon: Mountain,
    },
    food: {
        category: "GENERAL",
        categoryColor: "text-orange-500",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
        Icon: Utensils,
    },
    shopping: {
        category: "GENERAL",
        categoryColor: "text-orange-500",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
        Icon: ShoppingBag,
    },
    relaxation: {
        category: "STAY",
        categoryColor: "text-teal-500",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        Icon: BedDouble,
    },
    other: {
        category: "GENERAL",
        categoryColor: "text-gray-400",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-500",
        Icon: MapPin,
    },
};

function formatTime(t: string | null | undefined): { time: string; ampm: string } | null {
    if (!t) return null;
    const parts = t.split(":");
    if (parts.length < 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return { time: `${h12}:${m}`, ampm };
}

function formatDuration(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
}

export default function DayTimeline({
    dayNumber, title, subtitle, temperature, dayNote,
    activities, selectedActivityId, onSelectActivity,
}: DayTimelineProps) {
    return (
        <div className="w-full">

            {/* Day header */}
            <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-[18px] font-bold text-gray-900">
                            Day {dayNumber}
                            <span className="text-gray-300 mx-2">·</span>
                            {title}
                        </h2>
                    </div>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtitle}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    {temperature && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                            ☀ {temperature}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                        ⏱ {activities.length} Activities
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mt-3 mb-5" />

            {/* Activity rows */}
            <div>
                {activities.map((act, idx) => {
                    const style = TYPE_STYLES[act.activityType] ?? TYPE_STYLES.other;
                    const { Icon } = style;
                    const isLast = idx === activities.length - 1;
                    const isSelected = act.id === selectedActivityId;
                    const transport = act.transports?.[0];
                    const parsed = formatTime(act.startTime);

                    // Right-side content
                    const showThumb = act.activityType !== "travel" && act.imageUrl;
                    const showDuration = act.activityType === "travel" && transport?.durationMinutes;

                    return (
                        <div key={act.id} className="flex items-start gap-3">

                            {/* Time column */}
                            <div className="w-[52px] shrink-0 text-right pt-2.5">
                                {parsed ? (
                                    <>
                                        <span className="block text-[12px] font-semibold text-gray-700 leading-none">
                                            {parsed.time}
                                        </span>
                                        <span className="block text-[10px] text-gray-400 mt-0.5">
                                            {parsed.ampm}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-[10px] text-gray-300">—</span>
                                )}
                            </div>

                            {/* Icon + vertical line */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className={`h-9 w-9 rounded-full ${style.iconBg} flex items-center justify-center shrink-0 mt-1`}>
                                    <Icon size={16} strokeWidth={1.8} className={style.iconColor} />
                                </div>
                                {!isLast && (
                                    <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 28 }} />
                                )}
                            </div>

                            {/* Activity card */}
                            <div
                                onClick={() => onSelectActivity(act.id)}
                                className={`flex-1 min-w-0 rounded-2xl border px-4 py-3 mb-3 cursor-pointer transition-all flex items-start gap-3 ${
                                    isSelected
                                        ? "border-purple-200 bg-purple-50/40 shadow-sm shadow-purple-100"
                                        : "border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md"
                                }`}
                            >
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[9.5px] font-bold uppercase tracking-widest leading-none mb-1.5 ${style.categoryColor}`}>
                                        {style.category}
                                    </p>
                                    <p className="text-[13.5px] font-bold text-gray-900 leading-snug">
                                        {act.title}
                                    </p>
                                    {act.notes && (
                                        <p className="text-[11.5px] text-gray-500 mt-1 leading-relaxed line-clamp-1">
                                            {act.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Right: thumbnail OR duration */}
                                {showThumb && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={act.imageUrl!}
                                        alt={act.title}
                                        className="h-12 w-16 sm:h-14 sm:w-20 rounded-xl object-cover shrink-0"
                                        loading="lazy"
                                    />
                                )}
                                {showDuration && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0 pt-1">
                                        <span className="font-medium">{formatDuration(transport!.durationMinutes!)}</span>
                                        <Car size={12} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Day Note */}
            {dayNote && (
                <div className="mt-2 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-yellow-400 text-base leading-none shrink-0 mt-0.5">★</span>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Day Note</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{dayNote}</p>
                    </div>
                </div>
            )}

            {activities.length === 0 && (
                <p className="py-12 text-center text-gray-400 text-sm">No activities scheduled for this day.</p>
            )}
        </div>
    );
}
