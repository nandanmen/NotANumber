import { cn } from "~/lib/cn";

export function Figure({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn(
            "bg-gray5 border-y md:border-x border-gray8 md:rounded-lg shadow-inner",
            className,
        )}>
            {children}
        </div>
    );
}