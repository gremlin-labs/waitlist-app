import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <span
      className={cn(
        "font-bold tracking-tight",
        sizeClasses[size],
        className
      )}
      aria-label="Waitlist"
    >
      waitlist
    </span>
  );
}
