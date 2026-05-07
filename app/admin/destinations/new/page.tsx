"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { DestinationForm } from "../components/destination-form";

export default function NewDestinationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch("/api/destinations", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message ?? "Failed to create destination");
            router.push("/admin/destinations");
        } catch (e: any) {
            setSubmitError(e.message ?? "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="Add Destination"
                subtitle="Create a new country, state, or city."
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/destinations">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to list
                        </Link>
                    </Button>
                }
            />

            {submitError && (
                <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {submitError}
                </div>
            )}

            <DestinationForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                cancelHref="/admin/destinations"
            />
        </div>
    );
}
