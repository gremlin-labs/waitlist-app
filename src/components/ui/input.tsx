import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-border-default bg-surface-raised px-3 py-2 font-mono text-base text-fg-primary ring-offset-surface-void file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg-primary placeholder:text-fg-dim focus-visible:outline-none focus-visible:border-pink focus-visible:ring-2 focus-visible:ring-pink-glow disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
