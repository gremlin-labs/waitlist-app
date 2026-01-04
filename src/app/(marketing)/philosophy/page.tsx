import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Box,
  Cpu,
  Timer,
  Package,
  Crown,
  Smartphone,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const PRINCIPLES = [
  {
    number: 1,
    icon: Box,
    title: "Every Byte Earns Its Place",
    description:
      "100MB for a complete IDE with inference, terminal, and 15+ provider integrations. If something doesn't justify its size, it doesn't ship. Bloat is a bug.",
  },
  {
    number: 2,
    icon: Cpu,
    title: "Memory Is Sacred",
    description:
      "Under 100MB at idle. Your RAM exists to run models, not to keep an Electron wrapper warm. We measure memory usage religiously and treat regressions as emergencies.",
  },
  {
    number: 3,
    icon: Timer,
    title: "Latency Is Lying",
    description:
      "When your IDE lags, it's lying to you about its capabilities. We target 60fps for all animations, sub-second cold start, and 3-20ms time to first token. Smooth isn't a nice-to-have.",
  },
  {
    number: 4,
    icon: Package,
    title: "Dependencies Are Debt",
    description:
      "Every external dependency is a liability—maintenance burden, security surface, potential bloat. We wrote our own inference engine, our own templating engine, our own everything. When something isn't good enough, we build it ourselves.",
  },
  {
    number: 5,
    icon: Crown,
    title: "Context Is King",
    description:
      "The difference between a helpful AI and an annoying one is context. We obsess over giving models the right information: project structure, dependencies, recent changes, coding patterns. An AI that knows your codebase is worth ten that don't.",
  },
  {
    number: 6,
    icon: Smartphone,
    title: "Native or Nothing",
    description:
      "macOS has beautiful APIs. Apple Silicon has incredible performance. Why would we wrap everything in a web browser? SwiftUI for the interface. Metal for the GPU. Zig for the performance-critical paths. Native all the way down.",
  },
  {
    number: 7,
    icon: Sparkles,
    title: "The Vibes Must Flow",
    description:
      "Yes, we named it \"Vibe Mode.\" Yes, we're aware that's ridiculous. But here's the thing: when your tools disappear and you're just creating, that's a vibe. We're engineering that feeling—the flow state where great work happens. Call it vibes. We do.",
  },
];

const BUILT_LIST = [
  "Inference engine (VibeMLX) — written in Zig",
  "Templating engine (vibe-jinja) — written in Zig",
  "Context management (Samsara) — written in Zig",
  "HTTP/WebSocket server — written in Zig",
  "Terminal integration (Ghostty) — integrated, not spawned",
  "File watching & indexing — native APIs, not polling",
  "UI framework — SwiftUI, not Electron",
];

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-[500px] w-[600px] rounded-full bg-pink/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[500px] rounded-full bg-purple/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-fg-primary md:text-6xl lg:text-7xl">
            The Optimization Obsession
          </h1>
          <p className="mt-4 text-xl text-fg-muted">
            Why we rebuilt everything from scratch instead of
            <br />
            bolting AI onto someone else&apos;s architecture.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-fg-primary md:text-4xl">
            The IDE Market Has a Forking Problem
          </h2>

          <div className="rounded-md border border-border-subtle bg-surface-base p-8 md:p-12">
            <div className="space-y-6 text-lg leading-relaxed text-fg-secondary">
              <p>Look at the landscape of AI coding tools. What do you see?</p>
              <div className="font-mono text-fg-muted space-y-1">
                <p>VSCode fork. VSCode fork. VSCode extension. VSCode fork.</p>
                <p>CLI tool. CLI tool. Terminal UI. CLI tool.</p>
                <p>VSCode fork with extra steps.</p>
              </div>
              <p>
                Every tool starts from the same place: take something that already
                exists, add AI features, ship fast, iterate later. It&apos;s a reasonable
                strategy. It&apos;s also why every tool feels the same, performs the same,
                and hits the same walls.
              </p>
              <p className="text-fg-primary font-medium">
                We&apos;re not interested in reasonable strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-fg-primary md:text-4xl">
            What If We Started From Zero?
          </h2>

          <div className="rounded-md border border-border-subtle bg-surface-base p-8 md:p-12">
            <div className="space-y-6 text-lg leading-relaxed text-fg-secondary">
              <p>
                Vibe Mode began with a question: What would an IDE look like if AI
                wasn&apos;t a feature, but the foundation?
              </p>
              <div className="font-mono text-fg-muted space-y-1 pl-4 border-l-2 border-border-subtle">
                <p>Not &ldquo;code editor + AI sidebar.&rdquo;</p>
                <p>Not &ldquo;terminal + chat interface.&rdquo;</p>
                <p>Not &ldquo;fork of X with Y bolted on.&rdquo;</p>
              </div>
              <p>
                An IDE where the inference engine and the editor share memory. Where
                context indexing happens at filesystem speed because it&apos;s written in
                Zig, not JavaScript. Where the terminal emulator doesn&apos;t spawn a new
                process because it&apos;s compiled into the same binary.
              </p>
              <p className="text-fg-primary font-medium">
                This is what we mean by &ldquo;built from scratch.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Seven Principles */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fg-primary md:text-4xl">
            The Seven Vibes of Obsessive Engineering
          </h2>
          <p className="mb-12 text-center text-fg-muted">
            (We&apos;re only half-joking about the vibes thing)
          </p>

          <div className="space-y-6">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.number}
                className="group relative overflow-hidden rounded-md border border-border-subtle bg-surface-base p-8 transition-all hover:border-border-default md:p-10"
              >
                {/* Number accent */}
                <div className="absolute -right-4 -top-4 font-mono text-[120px] font-bold leading-none text-border-subtle">
                  {principle.number}
                </div>

                <div className="relative">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-pink-dim text-pink">
                      <principle.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-fg-primary">
                      {principle.title}
                    </h3>
                  </div>
                  <p className="max-w-3xl text-fg-secondary leading-relaxed text-lg">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Payoff */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-fg-primary md:text-4xl">
            This Is What Obsession Gets You
          </h2>

          <div className="rounded-md border border-border-subtle bg-surface-base p-8 md:p-12">
            <p className="text-lg text-fg-secondary mb-6">
              When we said &ldquo;built from scratch,&rdquo; we meant it:
            </p>

            <ul className="space-y-3">
              {BUILT_LIST.map((item) => (
                <li key={item} className="flex items-center gap-3 text-fg-secondary">
                  <CheckCircle className="h-5 w-5 text-green shrink-0" />
                  <span className="font-mono text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-lg text-fg-primary font-medium">
              The result: A 100MB download that outperforms 1GB+ competitors
              in every metric that matters for development flow.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-2 text-pink hover:text-pink-bright transition-colors"
            >
              See the Benchmarks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-fg-primary md:text-4xl">
            Ready to Experience the Difference?
          </h2>
          <Button asChild size="lg" className="gap-2 px-8 h-14 text-lg">
            <Link href="/auth/signin">Join the Waitlist</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
