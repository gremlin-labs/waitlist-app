"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      const callbackURL = searchParams.get("callbackURL") || "/dashboard";

      if (!token) {
        setStatus("error");
        setError("No verification token found");
        return;
      }

      try {
        // Better Auth handles the verification automatically via the API
        // This page is mainly for showing status to the user
        // The actual verification happens server-side
        
        // Redirect to the callback URL after a brief delay
        setTimeout(() => {
          router.push(callbackURL);
        }, 1500);
        
        setStatus("success");
      } catch {
        setStatus("error");
        setError("Failed to verify your email. The link may have expired.");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-dim text-pink">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <CardTitle className="text-2xl">Verifying...</CardTitle>
          <CardDescription>
            Please wait while we confirm your email
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-1 w-32 bg-surface-raised rounded-full overflow-hidden">
            <div className="h-full w-full bg-pink animate-[data-stream_1.5s_ease-in-out_infinite]" 
                 style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, transparent, var(--color-pink), transparent)" }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-dim text-red">
            <XCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl text-red">Verification failed</CardTitle>
          <CardDescription>
            {error || "Something went wrong"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-fg-muted text-sm">
            The magic link may have expired or already been used.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/signin">Try signing in again</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-dim text-green">
          <CheckCircle className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl text-green">You&apos;re in!</CardTitle>
        <CardDescription>
          Welcome to Vibe Mode
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-fg-muted text-sm">
          Redirecting you to your dashboard...
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-dim text-pink">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <CardTitle className="text-2xl">Verifying...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <VerifyContent />
    </Suspense>
  );
}
