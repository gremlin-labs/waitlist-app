import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-glow disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-pink text-fg-inverse shadow-sm hover:bg-pink-bright hover:shadow-glow-pink active:translate-y-px",
        destructive:
          "bg-red text-fg-inverse shadow-sm hover:bg-red-bright hover:shadow-[0_0_20px_rgba(255,51,102,0.3)]",
        outline:
          "border border-border-default bg-surface-raised text-fg-primary hover:border-border-strong hover:bg-surface-overlay",
        secondary:
          "bg-surface-raised text-fg-primary border border-border-default hover:bg-surface-overlay hover:border-border-strong",
        ghost:
          "text-fg-secondary hover:bg-surface-raised hover:text-fg-primary",
        link: "text-pink underline-offset-4 hover:text-pink-bright hover:underline",
      },
      size: {
        default: "h-10 px-6 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
