import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  PartyPopper, 
  ArrowRight, 
  Sparkles,
  MessageCircle,
  Clock,
  Heart,
} from "lucide-react";

export default async function ApplicationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ already?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const params = await searchParams;
  const alreadyApplied = params.already === "true";

  // Check if user has completed survey (is on waitlist)
  const userData = await db.query.user.findFirst({
    where: eq(userTable.id, session.user.id),
    columns: {
      surveyCompletedAt: true,
      betaStatus: true,
    },
  });

  const hasCompletedOnboarding = !!userData?.surveyCompletedAt;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 -mt-12">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-[400px] w-[500px] rounded-full bg-green/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[400px] rounded-full bg-pink/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Card */}
        <div className="rounded-xl border border-border-subtle bg-surface-base/80 backdrop-blur-sm overflow-hidden">
          {/* Success Header */}
          <div className="relative px-8 pt-10 pb-8 text-center border-b border-border-subtle bg-gradient-to-b from-green/5 to-transparent">
            {/* Confetti decoration */}
            <div className="absolute top-4 left-6 text-yellow/60">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="absolute top-8 right-8 text-pink/60">
              <PartyPopper className="h-4 w-4" />
            </div>
            <div className="absolute bottom-6 left-10 text-purple/40">
              <Sparkles className="h-3 w-3" />
            </div>

            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/20 ring-4 ring-green/10">
                  <CheckCircle className="h-8 w-8 text-green" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-fg-primary mb-2">
              {alreadyApplied ? "Already Applied!" : "Application Received"}
            </h1>
            
            <p className="text-fg-muted">
              {alreadyApplied
                ? "We have your application on file."
                : "Thanks for applying to gremlinlabs."}
            </p>
          </div>

          {/* Promises */}
          <div className="px-8 py-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-pink-dim">
                <MessageCircle className="h-4 w-4 text-pink" />
              </div>
              <div>
                <p className="font-medium text-fg-primary text-sm">No ghosting policy</p>
                <p className="text-fg-muted text-sm">
                  You&apos;ll hear back from us either way.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-dim">
                <Clock className="h-4 w-4 text-purple" />
              </div>
              <div>
                <p className="font-medium text-fg-primary text-sm">Response within a week</p>
                <p className="text-fg-muted text-sm">
                  We review applications personally.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-dim">
                <Heart className="h-4 w-4 text-green" />
              </div>
              <div>
                <p className="font-medium text-fg-primary text-sm">We read everything</p>
                <p className="text-fg-muted text-sm">
                  No AI screening. Real humans, real conversations.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-8 py-6 bg-surface-raised border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-pink" />
              <p className="font-mono text-xs uppercase tracking-wider text-fg-muted">
                While you wait
              </p>
            </div>

            {hasCompletedOnboarding ? (
              <>
                <p className="text-sm text-fg-secondary mb-4">
                  Check your dashboard to track your waitlist position and earn early access.
                </p>
                <Button asChild className="w-full gap-2">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-fg-secondary mb-4">
                  Join the waitlist to get early access and be first in line when we launch.
                </p>
                <Button asChild className="w-full gap-2">
                  <Link href="/onboarding">
                    Join the Waitlist
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link 
            href="/careers" 
            className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg-primary transition-colors"
          >
            <ArrowRight className="h-3 w-3 rotate-180" />
            Back to Careers
          </Link>
        </div>
      </div>
    </div>
  );
}
