import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable section header component with consistent styling
 * Standardizes typography, spacing, and icon alignment
 */
function SectionHeaderComponent({ icon, children, className }: SectionHeaderProps) {
  return (
    <h2
      className={cn(
        "flex items-center gap-2 shrink-0 text-2xl font-bold text-foreground",
        className
      )}
    >
      {icon && <span className="h-6 w-6 shrink-0">{icon}</span>}
      {children}
    </h2>
  );
}

export const SectionHeader = memo(SectionHeaderComponent);

