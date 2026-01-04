"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Mail, Loader2, Github, Gift } from "lucide-react";

function AuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const jobParam = searchParams.get("job");
  const referralCode = searchParams.get("ref");
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build callback URL with job param if present
  const finalCallback = jobParam 
    ? `${callbackUrl}?job=${jobParam}` 
    : callbackUrl;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: finalCallback,
      });
      setIsMagicLinkSent(true);
    } catch {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: finalCallback,
      });
    } catch {
      setError("Failed to continue with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: finalCallback,
      });
    } catch {
      setError("Failed to continue with GitHub. Please try again.");
      setIsLoading(false);
    }
  };

  if (isMagicLinkSent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-dim text-pink">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent a magic link to <span className="text-pink font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-fg-muted text-sm mb-6">
            Click the link in the email to continue. The link expires in 10 minutes.
          </p>
          <Button
            variant="ghost"
            onClick={() => setIsMagicLinkSent(false)}
            className="text-sm"
          >
            Use a different email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo size="xl" className="text-pink" />
        </div>
        <CardTitle className="text-xl">The AI IDE for macOS</CardTitle>
        {referralCode && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-dim border border-green text-green text-xs font-mono">
            <Gift className="h-3 w-3" />
            <span>Referred by a friend</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-sm bg-red-dim border border-red text-red text-sm">
            {error}
          </div>
        )}

        {/* Social Sign In Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGitHubSignIn}
            disabled={isLoading}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-base px-2 text-fg-muted uppercase tracking-wider">
              or use email
            </span>
          </div>
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLink}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-fg-dim">
          By continuing, you agree to our terms of service.
        </p>

        {/* Philosophy box */}
        <div className="mt-6 p-4 rounded-md bg-cyan/10 border border-cyan/20">
          <p className="text-xs text-cyan/80 italic text-center leading-relaxed">
            "Sign in. Sign up. The distinction is an illusion. You are either known to us, or about to be."
          </p>
          <p className="text-[10px] text-cyan/50 text-center mt-2">
            — Ancient Philosopher
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink" />
        </div>
        <CardTitle className="text-2xl">Loading...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <AuthForm />
    </Suspense>
  );
}
