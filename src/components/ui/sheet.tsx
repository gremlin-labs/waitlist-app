"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

// Animated overlay component
const MotionOverlay = motion.div;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-bg-surface border-border-subtle shadow-2xl overflow-y-auto",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-md",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

// Animation variants for each side
const slideVariants = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const variants = slideVariants[side || "right"];

  return (
    <SheetPrimitive.Portal forceMount>
      <SheetPrimitive.Overlay asChild forceMount>
        <MotionOverlay
          className="fixed inset-0 z-50 bg-black/60"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3 }}
        />
      </SheetPrimitive.Overlay>
      <SheetPrimitive.Content
        ref={ref}
        forceMount
        className={cn(sheetVariants({ side }), className)}
        {...props}
        asChild
      >
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8,
          }}
          className="p-6"
        >
          {children}
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-md p-1.5 opacity-70 transition-all hover:opacity-100 hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-bg-surface">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <X className="h-5 w-5 text-fg-muted" />
            </motion.div>
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </motion.div>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

// Wrapper component that handles AnimatePresence
interface SheetContentWrapperProps extends SheetContentProps {
  open?: boolean;
}

const SheetContentWrapper = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentWrapperProps
>(({ open, ...props }, ref) => {
  return (
    <AnimatePresence>
      {open && <SheetContent ref={ref} {...props} />}
    </AnimatePresence>
  );
});
SheetContentWrapper.displayName = "SheetContentWrapper";

const SheetHeader = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.3 }}
    className={cn("flex flex-col space-y-2 text-left", className)}
  >
    {children}
  </motion.div>
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.3 }}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
  >
    {children}
  </motion.div>
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-fg-primary", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-fg-muted", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

// Re-export with the animated wrapper as default
export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetContentWrapper,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
