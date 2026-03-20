import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

/**
 * Reusable card container component with consistent styling
 * Standardizes background, border, padding, and shadow
 */
export function CardContainer({
  children,
  className,
  padding = "md",
}: CardContainerProps) {
  const paddingClasses = {
    sm: "p-4 md:p-6",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-10",
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-card shadow-lg",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

