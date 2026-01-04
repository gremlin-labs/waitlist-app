import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-sm border border-border-default bg-surface-raised px-3 py-2 font-mono text-base text-fg-primary ring-offset-surface-void placeholder:text-fg-dim focus-visible:outline-none focus-visible:border-pink focus-visible:ring-2 focus-visible:ring-pink-glow disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
