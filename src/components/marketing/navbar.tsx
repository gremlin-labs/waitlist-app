"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/philosophy", label: "Philosophy" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/benchmarks", label: "Benchmarks" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border-subtle bg-surface-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Logo size="lg" className="text-pink" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                pathname === link.href
                  ? "text-pink"
                  : "text-fg-muted hover:text-fg-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="hidden text-sm text-fg-muted hover:text-fg-primary sm:inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-sm bg-pink px-4 py-2 text-sm font-semibold text-fg-inverse transition-all hover:bg-pink-bright hover:shadow-glow-pink"
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
