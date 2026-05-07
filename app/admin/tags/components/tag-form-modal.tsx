"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Tag } from "./tag-columns";

const PRESET_TYPES = ["vibe", "budget", "audience", "category"];

interface TagFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag?: Tag;
    onSave: (name: string, type: string) => void;
    loading?: boolean;
}

export function TagFormModal({ open, onOpenChange, tag, onSave, loading = false }: TagFormModalProps) {
    const [name, setName] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [customType, setCustomType] = useState("");
    const [useCustom, setUseCustom] = useState(false);

    useEffect(() => {
        if (open) {
            setName(tag?.name ?? "");
            const type = tag?.type ?? "";
            if (type && !PRESET_TYPES.includes(type)) {
                setSelectedType("__custom__");
                setCustomType(type);
                setUseCustom(true);
            } else {
                setSelectedType(type);
                setCustomType("");
                setUseCustom(false);
            }
        }
    }, [open, tag]);

    function handleTypeChange(value: string) {
        setSelectedType(value);
        setUseCustom(value === "__custom__");
        if (value !== "__custom__") setCustomType("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const type = useCustom ? customType.trim() : selectedType;
        onSave(name.trim(), type);
    }

    const isEdit = !!tag;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Tag" : "Add Tag"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tag-name">Name</Label>
                        <Input
                            id="tag-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Beach vibes"
                            maxLength={50}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tag-type">Type</Label>
                        <Select value={selectedType} onValueChange={handleTypeChange}>
                            <SelectTrigger id="tag-type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRESET_TYPES.map((t) => (
                                    <SelectItem key={t} value={t} className="capitalize">
                                        {t}
                                    </SelectItem>
                                ))}
                                <SelectItem value="__custom__">Custom…</SelectItem>
                            </SelectContent>
                        </Select>
                        {useCustom && (
                            <Input
                                value={customType}
                                onChange={(e) => setCustomType(e.target.value)}
                                placeholder="Enter custom type"
                                maxLength={50}
                                required
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !name.trim()}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Save changes" : "Add tag"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
