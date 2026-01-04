"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-void flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-dim text-red">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="text-4xl font-bold text-fg-primary mb-4">
          The Gremlins Broke Something
        </h1>

        <p className="text-lg text-fg-muted mb-8">
          Our fault, not yours. We&apos;re already on it.
          <br />
          Try refreshing, or come back in a minute.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button variant="outline" size="lg" asChild>
            <a
              href="https://discord.gg/gremlinlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Report Issue
            </a>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-xs text-fg-dim">
            Error ID: {error.digest}
          </p>
        )}

        <p className="mt-4 text-sm text-fg-muted">
          Or{" "}
          <Link href="/" className="text-pink hover:text-pink-bright">
            go back home
          </Link>
        </p>
      </div>
    </div>
  );
}
