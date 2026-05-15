"use client";

type DayItem = {
    dayNumber: number;
    title: string;
    coverImageUrl?: string | null;
    destinationName?: string | null;
};

type LeftSidebarProps = {
    days: DayItem[];
    selectedIndex: number;
    onSelectDay: (index: number) => void;
    quickTips: string[];
};

export default function ItineraryLeftSidebar({ days, selectedIndex, onSelectDay, quickTips }: LeftSidebarProps) {
    return (
        <div className="w-full sticky top-[76px] self-start">

            {/* Your Itinerary heading */}
            <p className="text-[13px] font-bold text-gray-800 mb-4 px-1">
                Your Itinerary
            </p>

            {/* Day list — timeline style */}
            <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[9px] top-4 bottom-4 w-px bg-gray-200" />

                <div className="space-y-2">
                    {days.map((day, i) => {
                        const isActive = i === selectedIndex;
                        return (
                            <button
                                key={day.dayNumber}
                                onClick={() => onSelectDay(i)}
                                className="relative flex items-center gap-3 w-full text-left"
                            >
                                {/* Timeline dot */}
                                <div className="relative z-10 shrink-0 flex items-center justify-center" style={{ width: 20 }}>
                                    {isActive ? (
                                        <div className="h-5 w-5 rounded-full bg-purple-600 shadow-sm shadow-purple-300" />
                                    ) : (
                                        <div className="h-3 w-3 rounded-full bg-gray-300" />
                                    )}
                                </div>

                                {/* Card */}
                                <div className={`flex-1 flex items-center gap-3 bg-white rounded-2xl px-3 py-2.5 transition-all ${
                                    isActive
                                        ? "shadow-md shadow-purple-100 border border-purple-100"
                                        : "shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200"
                                }`}>
                                    {/* Thumbnail */}
                                    {day.coverImageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={day.coverImageUrl}
                                            alt={day.title}
                                            className="h-12 w-12 rounded-xl object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-200 to-indigo-300 shrink-0" />
                                    )}

                                    {/* Labels */}
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold text-gray-400 leading-none mb-1">
                                            Day {day.dayNumber}
                                        </p>
                                        <p className={`text-[13px] font-bold leading-tight line-clamp-2 ${isActive ? "text-purple-600" : "text-gray-800"}`}>
                                            {day.title}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Tips */}
            {quickTips.length > 0 && (
                <div className="mt-5 bg-violet-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base leading-none">💡</span>
                        <h4 className="text-[13px] font-bold text-purple-700">Quick Tips</h4>
                    </div>
                    <ul className="space-y-2">
                        {quickTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 leading-relaxed">
                                <span className="text-purple-400 mt-0.5 shrink-0">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}
