import Link from "next/link";
import { Twitter, MessageCircle, Github } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-base">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Logo size="lg" className="text-pink" />
            </Link>
            <p className="mt-2 text-sm text-fg-muted">
              Native AI IDE for macOS
            </p>
            <p className="mt-1 font-mono text-xs text-fg-dim">
              Built by gremlinlabs
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="label-uppercase mb-4 text-fg-muted">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/philosophy" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link href="/ecosystem" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link href="/benchmarks" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Waitlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="label-uppercase mb-4 text-fg-muted">Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ecosystem#vibemlx" className="text-sm text-fg-secondary hover:text-fg-primary">
                  VibeMLX
                </Link>
              </li>
              <li>
                <Link href="/ecosystem#samsara" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Samsara
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/gremlin-labs/vibe-jinja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fg-secondary hover:text-fg-primary"
                >
                  vibe-jinja
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/gremlin-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fg-secondary hover:text-fg-primary"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="label-uppercase mb-4 text-fg-muted">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-fg-secondary hover:text-fg-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="label-uppercase mb-4 text-fg-muted">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-fg-secondary hover:text-fg-primary">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border-subtle pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="font-mono text-sm text-fg-dim">
                © 2026 gremlinlabs. All rights reserved.
              </p>
              <p className="mt-1 font-mono text-xs text-fg-dim">
                Made with weaponized mischief in Los Angeles.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/vibemodeai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/gremlinlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg-primary transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/gremlin-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
