import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-void flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-block">
          <Logo size="lg" className="text-pink" />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="font-mono text-sm text-fg-dim">
          Built by <span className="text-pink">This Company</span>
        </p>
      </footer>
    </div>
  );
}
