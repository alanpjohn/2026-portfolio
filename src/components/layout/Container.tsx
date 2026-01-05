import type { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Container({
  children,
  className,
  fullWidth = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        fullWidth ? "max-w-screen-2xl" : "max-w-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
