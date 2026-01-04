import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-void">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Logo size="lg" className="text-pink" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-fg-muted hover:text-fg-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="text-sm text-fg-muted hover:text-fg-primary transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-auto">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center">
          <p className="font-mono text-sm text-fg-dim">
            Built by <span className="text-pink">gremlinlabs</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
