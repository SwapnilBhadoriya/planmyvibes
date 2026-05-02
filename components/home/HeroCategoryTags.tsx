"use client";

const TAGS = [
    { label: "Beach", emoji: "🏖️", color: "bg-blue-50 text-blue-600" },
    { label: "Mountains", emoji: "🏔️", color: "bg-emerald-50 text-emerald-600" },
    { label: "Budget", emoji: "💰", color: "bg-yellow-50 text-yellow-700" },
    { label: "Solo Trip", emoji: "🧑", color: "bg-indigo-50 text-indigo-600" },
    { label: "Romantic", emoji: "💕", color: "bg-pink-50 text-pink-600" },
    { label: "Adventure", emoji: "🔥", color: "bg-orange-50 text-orange-600" },
];

export default function HeroCategoryTags() {

    return (
        <div className="flex items-center gap-2">
            {TAGS.map((tag) => (
                <button
                    key={tag.label}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${tag.color}`}>
                    <span>{tag.emoji}</span>
                    {tag.label}
                </button>
            ))}
        </div>
    );
}
