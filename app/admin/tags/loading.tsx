import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";

export default function TagsLoading() {
    return (
        <div>
            <AdminPageHeader title="Tags" subtitle="Manage tags used across destinations, itineraries, and places." />
            <div className="space-y-2">
                <div className="flex items-center justify-between py-4">
                    <Skeleton className="h-8 w-[300px]" />
                    <Skeleton className="h-8 w-[80px]" />
                </div>
                <div className="rounded-xl border border-border bg-white">
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
