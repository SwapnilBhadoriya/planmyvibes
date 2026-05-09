"use client";

import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoverImageFieldProps {
    value: string;
    onChange: (url: string) => void;
    uploadPath?: string;
}

export function CoverImageField({ value, onChange, uploadPath = "/api/upload" }: CoverImageFieldProps) {
    const [uploading, setUploading] = useState(false);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch(uploadPath, { method: "POST", body: fd });
            const json = await res.json();
            if (!json.success) throw new Error(json.error ?? "Upload failed");
            onChange(json.url);
        } catch {
            // silently ignore — user can retry
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    return (
        <div>
            <Label>Cover Image</Label>
            <div className="mt-1.5 flex items-start gap-4">
                {value ? (
                    <div className="relative h-32 w-56 shrink-0 overflow-hidden rounded-lg border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Cover" className="h-full w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : (
                    <label className={cn(
                        "flex h-32 w-56 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
                        uploading && "pointer-events-none opacity-60"
                    )}>
                        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                            <>
                                <ImagePlus className="h-6 w-6" />
                                <span className="text-xs">Upload cover</span>
                            </>
                        )}
                        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
                    </label>
                )}
                <div className="flex-1">
                    <Input
                        placeholder="Or paste image URL"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="font-mono text-xs"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">Shown as the hero image at the top.</p>
                </div>
            </div>
        </div>
    );
}
