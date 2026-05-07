import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                <div className="space-y-1.5">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-36" />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}
