"use client";

interface Props {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (cat: string) => void;
    total: number;
}

export default function TopPickFilters({
    categories,
    activeCategory,
    onCategoryChange,
    total,
}: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-100">
            {/* Category pills — horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-hide">
                <button
                    onClick={() => onCategoryChange("all")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                        activeCategory === "all"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    All Places ({total})
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                            activeCategory === cat
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors shrink-0">
                Sort
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
        </div>
    );
}
