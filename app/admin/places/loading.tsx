import { Skeleton } from "@/components/ui/skeleton";

export default function PlacesLoading() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-9 w-28" />
            </div>
            <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-9 w-36" />
            </div>
            <div className="rounded-xl border border-border bg-white">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}
