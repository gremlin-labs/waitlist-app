import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Logo } from "@/components/ui/logo";
import {
  Zap,
  Eye,
  Terminal,
  Waves,
  Lock,
  Layers,
  ArrowRight,
} from "lucide-react";

const STATS = [
  { label: "Bundle Size", value: "100", unit: "MB", note: "(yes, really)" },
  { label: "Memory at Idle", value: "< 100", unit: "MB", note: "(not a typo)" },
  { label: "Time to Launch", value: "< 1", unit: "sec", note: "(cold start)" },
];

const FEATURES = [
  {
    icon: Eye,
    title: "Project Omniscience",
    description:
      "Your AI assistant doesn't just see your current file—it understands your entire codebase. Dependencies, patterns, that weird utility function you wrote six months ago. All of it. Indexed. Searchable. Contextual.",
    tagline: "See around corners. Know what breaks before you break it.",
  },
  {
    icon: Zap,
    title: "Instant Inference",
    description:
      "Run models locally on Apple Silicon with our native inference engine. 3-20ms to first token. No Python runtime. No pip install. No \"waiting for model to load\" spinner of death.",
    tagline: "Your M-series chip finally earns its keep.",
  },
  {
    icon: Terminal,
    title: "Ghostty Inside",
    description:
      "Yes, that Ghostty. The mass-hyped, mass-praised GPU-accelerated terminal emulator—built directly into Amazing App. Not spawned as a subprocess. Not wrapped in an iframe. Native integration.",
    tagline: "And the whole app is still just 100MB. We checked.",
  },
  {
    icon: Waves,
    title: "Infinite Context",
    description:
      "Our Samsara context engine maintains conversation continuity without the \"context window exceeded\" interruptions. Your AI remembers the architecture discussion from this morning while you're debugging tonight.",
    tagline: "Context that flows. Conversations that don't reset.",
  },
  {
    icon: Lock,
    title: "Security by Default",
    description:
      "API keys in Keychain where they belong. Local inference that never phones home. Project-level isolation. Your code stays your code—we built paranoia into the architecture.",
    tagline: "Privacy isn't a feature. It's a constraint we designed around.",
  },
  {
    icon: Layers,
    title: "Every Provider",
    description:
      "Anthropic, OpenAI, Google, xAI, Groq, DeepSeek, OpenRouter, Together, Cerebras, and 10+ more. Plus local models via VibeMLX, Ollama, or LM Studio. Use what you want. Switch when you want.",
    tagline: "No vendor lock-in. No \"works best with our cloud.\"",
  },
];

const COMPARISON = [
  { metric: "Download Size", vibe: "100 MB", other: "1+ GB" },
  { metric: "Memory at Idle", vibe: "< 100 MB", other: "3-5 GB" },
  { metric: "Cold Start Time", vibe: "< 1 sec", other: "3-8 seconds" },
  { metric: "Framework", vibe: "Native", other: "Electron" },
  { metric: "Terminal", vibe: "Ghostty", other: "xterm.js" },
  { metric: "Local Inference", vibe: "Built-in", other: "Subprocess" },
  { metric: "Context Indexing", vibe: "Instant", other: '"Indexing..."' },
];

const STACK_CARDS = [
  {
    name: "VibeMLX",
    subtitle: "Native Inference Runtime",
    description:
      "A 17MB Zig binary that does what Python frameworks need 500MB to accomplish. Loads HuggingFace models directly. Runs on Metal. Compiles into the daemon—no subprocess overhead, no IPC latency.",
    stat: "3-20ms time to first token. 900+ tok/s on small models.",
    href: "/benchmarks",
    cta: "See Benchmarks",
    color: "cyan",
  },
  {
    name: "Samsara",
    subtitle: "Infinite Context Engine",
    description:
      "Named for the cycle of rebirth. Your conversations don't die—they transform. Samsara maintains semantic continuity across sessions, intelligently compressing and retrieving context so your AI always knows what you've discussed.",
    stat: 'No more "as we discussed earlier" when it doesn\'t remember.',
    href: "/ecosystem#samsara",
    cta: "Learn More",
    color: "green",
  },
  {
    name: "vibe-jinja",
    subtitle: "Bare-Metal Templating",
    description:
      "We needed Jinja2 for chat templates. Python Jinja2 meant Python dependencies. So we rewrote it in Zig. Complete compatibility, native speed, zero external dependencies.",
    stat: 'Because "good enough" isn\'t in our vocabulary.',
    href: "https://github.com/gremlin-labs/vibe-jinja",
    cta: "View on GitHub",
    color: "yellow",
    external: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-void">
      <Navbar />

      <main className="pt-14">
        {/* Hero Section */}
        <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20">
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-pink/5 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-blue/5 blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Logo */}
            <div className="mb-10">
              <Logo size="xl" className="h-16 sm:h-20 md:h-24 text-pink mx-auto" />
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-fg-primary sm:text-5xl md:text-6xl">
              A Wonderful App
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-2xl font-semibold text-yellow sm:text-3xl">
              Unfork yourself.
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-fg-secondary sm:text-xl">
              A native AI development environment built from scratch.
              <br />
              No Electron. No VSCode. No compromises.
              <br />
              <span className="text-fg-muted">Just 100MB of pure, optimized intention.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signin"
                className="h-12 flex items-center rounded-sm bg-pink px-8 font-semibold uppercase tracking-wide text-fg-inverse shadow-sm transition-all hover:bg-pink-bright hover:shadow-glow-pink"
              >
                Join the Waitlist
              </Link>
              <Link
                href="#features"
                className="h-12 flex items-center gap-2 rounded-sm border border-border-default bg-surface-raised px-8 font-semibold text-fg-primary transition-all hover:border-border-strong hover:bg-surface-overlay"
              >
                See What&apos;s Inside
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div className="label-uppercase mb-2">{stat.label}</div>
                  <div className="text-stat font-bold text-pink">
                    {stat.value}
                    <span className="ml-1 text-lg text-fg-muted">{stat.unit}</span>
                  </div>
                  <div className="text-sm text-fg-dim">{stat.note}</div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-fg-dim">
              Compare that to the 1GB+ download and 3-5GB idle RAM of... well, you know.
            </p>
          </div>
        </section>

        {/* The Thesis */}
        <section className="px-6 py-20 border-t border-border-subtle">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-fg-primary md:text-4xl">
              We Didn&apos;t Fork Anything. We Built Everything.
            </h2>

            <div className="rounded-md border border-border-subtle bg-surface-base p-8 md:p-12">
              <div className="space-y-6 text-lg leading-relaxed text-fg-secondary">
                <p>
                  Every other AI coding tool starts the same way: take an existing
                  IDE, bolt on some AI features, ship it, and pray the duct tape holds.
                </p>
                <p>
                  We asked a different question: What if we designed an IDE from the
                  bare metal specifically for AI-assisted development?
                </p>
                <p>
                  The answer is Amazing App—a native macOS application where every byte
                  serves a purpose. The inference engine compiles directly into the
                  daemon. The terminal emulator shares memory with the app. The context
                  engine indexes your project in milliseconds, not minutes.
                </p>
                <p className="text-fg-primary font-medium">
                  This isn&apos;t an AI feature grafted onto a code editor.
                  <br />
                  This is what happens when AI is the architecture.
                </p>
              </div>

              <blockquote className="mt-10 border-l-2 border-pink pl-6">
                <p className="text-xl italic text-fg-primary">
                  &ldquo;The best tool isn&apos;t the one with the most features.
                  It&apos;s the one that disappears when you&apos;re in flow.&rdquo;
                </p>
                <cite className="mt-4 block font-mono text-sm text-fg-muted">
                  — Some gremlin who&apos;s been optimizing for six months straight
                </cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-6 py-20 border-t border-border-subtle bg-surface-base">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-fg-primary md:text-4xl">
              An IDE That Knows More Than You Do
            </h2>
            <p className="mb-12 text-center text-fg-muted">
              (And we mean that as a compliment)
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border-subtle bg-surface-raised p-6 transition-colors hover:border-border-default"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-dim text-pink">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-fg-primary">{feature.title}</h3>
                  </div>
                  <p className="text-fg-secondary mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="text-sm font-medium text-pink">
                    {feature.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="px-6 py-20 border-t border-border-subtle">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-fg-primary md:text-4xl">
              Let&apos;s Talk Numbers
            </h2>
            <p className="mb-12 text-center text-fg-muted">
              We&apos;re not here to name names. But we will name sizes.
            </p>

            <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-base">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-raised">
                    <th className="label-uppercase p-4 text-left" />
                    <th className="label-uppercase p-4 text-right text-pink">Amazing App</th>
                    <th className="label-uppercase p-4 text-right text-fg-dim">The Other Guys™</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.metric}
                      className={i % 2 === 0 ? "bg-surface-base" : "bg-surface-raised/50"}
                    >
                      <td className="p-4 font-medium text-fg-primary">{row.metric}</td>
                      <td className="p-4 text-right font-mono text-green">{row.vibe}</td>
                      <td className="p-4 text-right font-mono text-fg-dim">{row.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-center text-sm text-fg-dim">
              We&apos;re not saying Electron is bad. We&apos;re saying there&apos;s another way.
              <br />
              A way that doesn&apos;t require 8GB of RAM to edit a config file.
            </p>
          </div>
        </section>

        {/* The Stack */}
        <section className="px-6 py-20 border-t border-border-subtle bg-surface-base">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-fg-primary md:text-4xl">
              Built Different. Built Native. Built to Last.
            </h2>
            <p className="mb-12 text-center text-fg-muted">
              No forks. No wrappers. Just raw metal and vibes.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {STACK_CARDS.map((card) => (
                <div
                  key={card.name}
                  className={`rounded-lg border bg-surface-raised p-6 border-${card.color}/30`}
                >
                  <h3 className={`text-xl font-bold text-${card.color}`}>{card.name}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{card.subtitle}</p>
                  <p className="mt-4 text-fg-secondary leading-relaxed">
                    {card.description}
                  </p>
                  <p className="mt-4 text-sm italic text-fg-muted">
                    {card.stat}
                  </p>
                  {card.external ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex items-center gap-1 text-${card.color} hover:underline`}
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      className={`mt-4 inline-flex items-center gap-1 text-${card.color} hover:underline`}
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 border-t border-border-subtle">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-fg-primary md:text-5xl">
              Join the Gremlins
            </h2>
            <p className="mb-8 text-lg text-fg-muted">
              Amazing App is currently in private beta. We&apos;re letting people in
              based on waitlist position—which you can improve by following us
              on social and inviting friends who appreciate good engineering.
            </p>
            <p className="mb-8 text-fg-secondary font-medium">
              The vibes are invite-only. For now.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex h-14 items-center rounded-sm bg-pink px-10 text-lg font-semibold uppercase tracking-wide text-fg-inverse shadow-sm transition-all hover:bg-pink-bright hover:shadow-glow-pink"
            >
              Join the Waitlist
            </Link>
            <p className="mt-4 font-mono text-sm text-fg-dim">
              Already have access?{" "}
              <Link href="/auth/signin" className="text-pink hover:text-pink-bright">
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
