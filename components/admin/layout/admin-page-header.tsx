import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export function AdminPageHeader({ title, subtitle, action, className }: AdminPageHeaderProps) {
    return (
        <div className={cn("mb-6 flex items-center justify-between border-b border-border pb-4", className)}>
            <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
    );
}
