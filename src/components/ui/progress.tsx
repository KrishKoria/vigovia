"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, max = 100, indeterminate = false, ...props },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-primary transition-all duration-300 ease-in-out",
            indeterminate && "animate-pulse"
          )}
          style={{
            width: indeterminate ? "100%" : `${percentage}%`,
            transform: indeterminate ? "translateX(-100%)" : "none",
            animation: indeterminate
              ? "progress-indeterminate 2s infinite"
              : "none",
          }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
