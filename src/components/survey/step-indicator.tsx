"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepTitles,
}: StepIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-fg-muted uppercase tracking-wider">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-mono text-xs text-pink">
          {stepTitles[currentStep]}
        </span>
      </div>
      <Progress value={progress} className="h-1" />
      
      {/* Step dots */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i < currentStep
                ? "bg-pink"
                : i === currentStep
                ? "bg-pink animate-pulse"
                : "bg-surface-raised"
            )}
          />
        ))}
      </div>
    </div>
  );
}
