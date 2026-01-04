"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
}

export function ApplyButton({ jobId, jobTitle }: ApplyButtonProps) {
  const router = useRouter();

  const handleApply = () => {
    // Set a cookie to remember the job they clicked on
    document.cookie = `apply_job=${jobId}; path=/; max-age=3600; SameSite=Lax`;
    
    // Redirect to the apply page (will redirect to login if not authenticated)
    router.push(`/apply?job=${jobId}`);
  };

  return (
    <Button 
      size="lg" 
      className="gap-2"
      onClick={handleApply}
      aria-label={`Apply for ${jobTitle}`}
    >
      Apply for this role
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
