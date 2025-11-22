import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  waiting: { label: "Waiting", className: "bg-warning/10 text-warning border-warning/20" },
  ready: { label: "Ready", className: "bg-info/10 text-info border-info/20" },
  done: { label: "Done", className: "bg-success/10 text-success border-success/20" },
  canceled: { label: "Canceled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
