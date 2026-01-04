import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-void flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-14 px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-pink-dim text-pink">
            <Ghost className="h-10 w-10" />
          </div>

          <h1 className="text-5xl font-bold text-fg-primary mb-4">
            Lost in the Void
          </h1>

          <p className="text-lg text-fg-muted mb-8">
            This page doesn&apos;t exist. But the vibes do.
          </p>

          <Button asChild size="lg">
            <Link href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Safety
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
