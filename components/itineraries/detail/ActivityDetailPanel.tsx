"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, MapPin, Clock, Sun, Ticket, CheckCircle } from "lucide-react";

type Activity = {
    id: string;
    title: string;
    activityType: string;
    notes?: string | null;
    imageUrl?: string | null;
    address?: string | null;
    gallery?: string[];
    description?: string | null;
    bestTime?: string | null;
    duration?: string | null;
    entryFee?: string | null;
    tips?: string[] | string | null;
};

type PanelProps = {
    activity: Activity | null;
};

function normalizeTips(tips: string[] | string | null | undefined): string[] {
    if (!tips) return [];
    if (Array.isArray(tips)) return tips;
    return tips.split(/\.\s+|;\s*/).filter(Boolean);
}

export default function ActivityDetailPanel({ activity }: PanelProps) {
    const [galleryIdx, setGalleryIdx] = useState(0);

    useEffect(() => { setGalleryIdx(0); }, [activity?.id]);

    if (!activity) {
        return (
            <div className="w-full sticky top-[76px] self-start bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center" style={{ minHeight: 300 }}>
                <p className="text-sm text-gray-400 text-center">Click any activity to see details</p>
            </div>
        );
    }

    const gallery = activity.gallery?.length
        ? activity.gallery
        : activity.imageUrl ? [activity.imageUrl] : [];

    const tips = normalizeTips(activity.tips);
    const currentImg = gallery[galleryIdx] ?? activity.imageUrl ?? "";

    function prev() { setGalleryIdx(i => (i - 1 + gallery.length) % gallery.length); }
    function next() { setGalleryIdx(i => (i + 1) % gallery.length); }

    return (
        <div className="w-full sticky top-[76px] self-start bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-green-500 shrink-0" />
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                        Current Stop
                    </span>
                </div>
                <button
                    className="h-8 w-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-200 transition-colors shadow-sm"
                    aria-label="Save"
                >
                    <Heart size={14} />
                </button>
            </div>

            {/* ── Title + address ── */}
            <div className="px-5 pb-4">
                <h2 className="text-[18px] font-extrabold text-gray-900 leading-tight">
                    {activity.title}
                </h2>
                {activity.address && (
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        {activity.address}
                    </p>
                )}
            </div>

            {/* ── Hero image with prev / next ── */}
            {currentImg && (
                <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ height: 210 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentImg}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {gallery.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/95 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <ChevronLeft size={15} className="text-gray-700" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/95 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <ChevronRight size={15} className="text-gray-700" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* ── Gallery thumbnails — 4 equal columns ── */}
            {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2 px-4 mt-3">
                    {gallery.slice(0, 3).map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setGalleryIdx(i)}
                            className={`rounded-xl overflow-hidden transition-all ${
                                i === galleryIdx ? "ring-2 ring-purple-400 ring-offset-1" : "opacity-70 hover:opacity-100"
                            }`}
                            style={{ height: 62 }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                    ))}
                    {/* +More tile */}
                    <button
                        onClick={() => setGalleryIdx(Math.min(3, gallery.length - 1))}
                        className="rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center flex-col gap-0.5"
                        style={{ height: 62 }}
                    >
                        <span className="text-white text-[13px] font-bold">+{Math.max(gallery.length - 3, 1)}</span>
                        <span className="text-white/70 text-[9px] font-medium">More</span>
                    </button>
                </div>
            )}

            {/* ── Description ── */}
            {(activity.description || activity.notes) && (
                <p className="px-5 mt-4 text-[12px] text-gray-600 leading-relaxed line-clamp-3">
                    {activity.description ?? activity.notes}
                </p>
            )}

            {/* ── Meta chips — purple bg, vertical layout ── */}
            {(activity.bestTime || activity.duration || activity.entryFee) && (
                <div className="flex gap-2 px-4 mt-4">
                    {activity.bestTime && (
                        <MetaChip
                            icon={<Sun size={14} strokeWidth={1.8} className="text-orange-400" />}
                            label="Best Time to Visit"
                            value={activity.bestTime}
                        />
                    )}
                    {activity.duration && (
                        <MetaChip
                            icon={<Clock size={14} strokeWidth={1.8} className="text-blue-400" />}
                            label="Duration"
                            value={activity.duration}
                        />
                    )}
                    {activity.entryFee && (
                        <MetaChip
                            icon={<Ticket size={14} strokeWidth={1.8} className="text-purple-400" />}
                            label="Entry Fee"
                            value={activity.entryFee}
                        />
                    )}
                </div>
            )}

            {/* ── Tips ── */}
            {tips.length > 0 && (
                <div className="px-5 mt-5">
                    <p className="text-[13px] font-bold text-gray-900 mb-3">Tips</p>
                    <div className="space-y-2.5">
                        {tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" fill="currentColor" strokeWidth={0} />
                                <p className="text-[12px] text-gray-600 leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── View on Map ── */}
            <div className="px-5 py-5 mt-1">
                <button className="w-full border border-purple-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-[13px] font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
                    <MapPin size={14} className="text-purple-400" />
                    View on Map
                </button>
            </div>
        </div>
    );
}

function MetaChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex-1 bg-violet-50 rounded-xl px-3 py-3 flex flex-col items-start gap-1">
            {icon}
            <p className="text-[9.5px] text-gray-400 font-semibold leading-none mt-0.5">{label}</p>
            <p className="text-[12px] font-bold text-gray-800 leading-tight">{value}</p>
        </div>
    );
}
