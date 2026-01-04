import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplyButton } from "@/components/careers/apply-button";
import {
  Cpu,
  Zap,
  Palette,
  Megaphone,
  Code2,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const JOBS = [
  {
    id: "zig-ml",
    icon: Cpu,
    title: "Zig Engineer — Machine Learning",
    location: "Remote (US/EU)",
    type: "Full-time",
    team: "Inference",
    tagline: "Make VibeMLX even more ridiculous.",
    description: `You'll be working on VibeMLX, our native inference runtime that does what Python frameworks need 500MB to accomplish—in 17MB. We load HuggingFace models directly, run on Metal, and compile into the daemon with zero subprocess overhead.

Your job is to make it faster, support more architectures, and push Apple Silicon to its absolute limits. Time to first token is already 32-66x faster than Python alternatives. That's not fast enough.`,
    responsibilities: [
      "Optimize VibeMLX inference performance on Apple Silicon (M1-M4)",
      "Implement support for new model architectures as they drop",
      "Build and maintain MLX-C bindings in Zig with zero-copy interop",
      "Develop quantization strategies for KV cache and model weights",
      "Profile Metal shaders and eliminate bottlenecks",
      "Contribute to vibe-jinja templating engine optimizations",
      "Measure everything. If it's not benchmarked, it didn't happen.",
    ],
    requirements: [
      "Deep experience with systems programming (Zig, Rust, C, or C++)",
      "Understanding of transformer architectures and inference optimization",
      "Experience with GPU compute (Metal, CUDA, or similar)",
      "Obsessive about performance measurement and profiling",
      "Ability to read ML papers and implement them in low-level code",
      "Bonus: Prior work on llama.cpp, MLX, or similar inference runtimes",
    ],
    whyJoin: `VibeMLX isn't a wrapper around someone else's work. It's a ground-up inference engine that proves you don't need Python to run models fast. If you're tired of bloated ML frameworks and want to build something that actually respects the hardware, this is the gig.`,
  },
  {
    id: "zig-perf",
    icon: Zap,
    title: "Zig Engineer — App Performance",
    location: "Remote (US/EU)",
    type: "Full-time",
    team: "Platform",
    tagline: "100MB isn't small enough.",
    description: `The Vibe Mode daemon is where the magic happens—inference, context management, file watching, WebSocket server, and terminal integration. All compiled into a single binary. All written in Zig.

Your job is to make it faster, smaller, and more responsive. We're already under 100MB idle RAM and sub-second cold start. Your job is to make those numbers embarrassing for everyone else.`,
    responsibilities: [
      "Optimize the daemon's memory footprint and startup performance",
      "Build and maintain the HTTP/WebSocket server infrastructure",
      "Implement efficient IPC between the daemon and SwiftUI frontend",
      "Develop file watching and indexing systems using native macOS APIs",
      "Profile and optimize Samsara context engine performance",
      "Ensure Ghostty terminal integration remains seamless",
      "Hunt down and eliminate every unnecessary allocation",
    ],
    requirements: [
      "Strong background in systems programming and performance optimization",
      "Experience with Zig, Rust, C, or C++",
      "Understanding of macOS internals and native APIs",
      "Experience building servers and handling concurrent connections",
      "Obsessive about binary size, memory usage, and latency",
      "Comfort with profiling tools and performance measurement",
      "Bonus: Experience with terminal emulators or text editors",
    ],
    whyJoin: `Most apps ship with 500MB of node_modules and call it a day. We ship with zero dependencies and measure every byte. If you believe software should be fast, small, and native—and you want to prove it—this is where you do it.`,
  },
  {
    id: "swiftui",
    icon: Palette,
    title: "SwiftUI Engineer",
    location: "Remote (US/EU)",
    type: "Full-time",
    team: "Frontend",
    tagline: "Make it beautiful. Make it 60fps.",
    description: `Vibe Mode's interface is built in SwiftUI—not Electron, not React Native, not a web view pretending to be native. Real SwiftUI, with real macOS integration, targeting real performance.

You'll own the frontend experience: the editor, the chat interface, the terminal integration, the settings, all of it. Your job is to make it feel like it was built by Apple, but with more personality.`,
    responsibilities: [
      "Build and maintain the Vibe Mode macOS frontend in SwiftUI",
      "Implement smooth animations and transitions at 60fps (no exceptions)",
      "Design and build the code editor interface with syntax highlighting",
      "Create responsive layouts that work across window sizes",
      "Integrate with the Zig daemon via efficient IPC patterns",
      "Ensure accessibility compliance without compromising aesthetics",
      "Obsess over pixel-perfect details and micro-interactions",
    ],
    requirements: [
      "5+ years of Swift experience, with deep SwiftUI expertise",
      "Portfolio demonstrating exceptional UI/UX sensibility",
      "Experience building complex, performance-critical macOS apps",
      "Understanding of Swift concurrency (async/await, actors)",
      "Strong opinions about design and the taste to back them up",
      "Experience with custom rendering and Core Graphics is a plus",
      "Bonus: Familiarity with code editors or developer tools",
    ],
    whyJoin: `You'll be building one of the few native macOS apps in the AI coding space. No fighting with Electron performance. No pretending web components are native. Just SwiftUI, Metal, and the freedom to build something beautiful.`,
  },
  {
    id: "fullstack",
    icon: Code2,
    title: "Full Stack TypeScript Developer",
    location: "Remote (US/EU)",
    type: "Full-time",
    team: "Web Platform",
    tagline: "Ship features, not node_modules.",
    description: `This website isn't just marketing fluff—it's the backbone of Vibe Mode's user experience. Account management, subscription billing, OAuth integrations, Discord bot sync, admin dashboards, and app-web communication. All TypeScript, all modern, all fast.

You'll own the web platform end-to-end: the Next.js frontend, the Drizzle-powered backend, the real-time features, and the integration points between the web and the native app. If you think most web apps are bloated and slow, you'll fit right in.`,
    responsibilities: [
      "Build and maintain the Vibe Mode web platform in Next.js 16 with React 19",
      "Design and implement database schemas with Drizzle ORM and PostgreSQL",
      "Create authenticated API routes and server actions with better-auth",
      "Build real-time features with BullMQ job queues and Redis",
      "Implement OAuth flows for Discord, Twitter/X, and other social integrations",
      "Develop admin dashboards for user management, analytics, and billing operations",
      "Create the desktop-web auth bridge for seamless app authentication",
      "Build responsive, accessible UI components with Radix UI and Tailwind CSS 4",
    ],
    requirements: [
      "5+ years of TypeScript experience with deep Next.js expertise",
      "Strong understanding of React 19 features (Server Components, Server Actions)",
      "Experience with SQL databases and ORMs (Drizzle, Prisma, or similar)",
      "Familiarity with Redis, job queues, and background processing patterns",
      "Understanding of OAuth 2.0 flows and authentication best practices",
      "Experience building admin interfaces and internal tools",
      "Strong opinions on code structure, type safety, and API design",
      "Bonus: Experience with Framer Motion, Discord.js, or email services like Resend",
    ],
    whyJoin: `Most companies treat their web platform as an afterthought—a marketing site with a login button. We're building web features that directly integrate with a native desktop app: device authorization, license management, real-time sync. If you want to build a web platform that actually matters, this is it.`,
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing Lead",
    location: "Remote (US/EU)",
    type: "Full-time",
    team: "Growth",
    tagline: "Weaponize the mischief.",
    description: `gremlinlabs has a voice: deviously confident, technically credible, self-aware about the "vibes" thing but dead serious about the engineering. We need someone who can amplify that voice across channels.

You'll own our marketing strategy—content, social, community, and developer relations. We're not looking for corporate-speak or growth hacking playbooks. We're looking for someone who understands developers and can make them care.`,
    responsibilities: [
      "Develop and execute marketing strategy across all channels",
      "Create content that resonates with technical audiences (blogs, videos, docs)",
      "Manage social presence on Twitter, Discord, and wherever developers lurk",
      "Build and nurture the gremlinlabs community",
      "Plan and execute product launches and announcements",
      "Analyze metrics and optimize conversion funnels",
      "Collaborate with engineering to translate features into compelling narratives",
    ],
    requirements: [
      "Experience marketing developer tools or technical products",
      "Excellent writing skills with a distinctive voice",
      "Understanding of the AI/ML and developer tools landscape",
      "Track record of building engaged communities",
      "Data-driven approach to measuring marketing effectiveness",
      "Comfort with technical concepts (you don't need to code, but you need to grok it)",
      "Bonus: Active presence in developer communities",
    ],
    whyJoin: `We're not another AI startup with a purple gradient and a waitlist. We built something genuinely different—native, fast, obsessively optimized—and we need someone who can tell that story without resorting to buzzword bingo.`,
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-[500px] w-[600px] rounded-full bg-pink/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[500px] rounded-full bg-purple/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-base px-4 py-2 text-sm text-fg-muted">
            <Sparkles className="h-4 w-4 text-pink" />
            We&apos;re hiring
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-fg-primary md:text-6xl lg:text-7xl">
            Build Something
            <br />
            <span className="text-pink">Unreasonable</span>
          </h1>
          <p className="mt-6 text-xl text-fg-muted">
            We&apos;re a small team obsessed with building the native AI IDE
            that should have existed years ago. If &ldquo;good enough&rdquo;
            isn&apos;t in your vocabulary, you might fit in.
          </p>
        </div>
      </section>

      {/* Why gremlinlabs */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-md border border-border-subtle bg-surface-base p-8 md:p-12">
            <h2 className="mb-6 text-2xl font-bold text-fg-primary md:text-3xl">
              Why gremlinlabs?
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-fg-secondary">
              <p>
                The AI coding tools market is full of VSCode forks. Same
                architecture, same performance, same limitations. We took a
                different path: build from scratch, in native code, with zero
                compromises.
              </p>
              <p>
                The result is a 100MB app that outperforms 1GB+ competitors on
                every metric that matters. We wrote our own inference engine in
                Zig. We built our own templating engine. We integrated Ghostty
                natively. We measure every byte.
              </p>
              <p className="text-fg-primary font-medium">
                If that sounds like the kind of obsessive engineering you want
                to be part of, keep reading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fg-primary md:text-4xl">
            Open Positions
          </h2>
          <p className="mb-12 text-center text-fg-muted">
            Remote-first. Results-driven. Zero tolerance for bloat.
          </p>

          <div className="space-y-6">
            {JOBS.map((job) => (
              <div
                key={job.id}
                id={job.id}
                className="group rounded-md border border-border-subtle bg-surface-base transition-all hover:border-border-default"
              >
                {/* Job Header */}
                <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-pink-dim text-pink">
                      <job.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-fg-primary md:text-2xl">
                        {job.title}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-pink">
                        {job.tagline}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-fg-muted">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="rounded-full bg-surface-raised px-3 py-1 text-xs font-medium">
                          {job.team}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="border-t border-border-subtle p-6 md:p-8">
                  {/* Description */}
                  <div className="mb-8">
                    <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-fg-muted">
                      The Role
                    </h4>
                    <p className="whitespace-pre-line text-fg-secondary leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Responsibilities */}
                    <div>
                      <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-fg-muted">
                        What You&apos;ll Do
                      </h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-fg-secondary"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-fg-muted">
                        What You Bring
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-fg-secondary"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Why Join */}
                  <div className="mt-8 rounded-md border border-border-subtle bg-surface-raised p-6">
                    <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-fg-muted">
                      Why This Role
                    </h4>
                    <p className="text-fg-secondary leading-relaxed">
                      {job.whyJoin}
                    </p>
                  </div>

                  {/* Apply CTA */}
                  <div className="mt-8 flex justify-end">
                    <ApplyButton jobId={job.id} jobTitle={job.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-fg-primary md:text-4xl">
            The Fine Print
          </h2>

          <div className="rounded-md border border-border-subtle bg-surface-base p-8 md:p-12">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-bold text-fg-primary">Compensation</h3>
                <p className="text-sm text-fg-secondary">
                  Competitive salary + meaningful equity. We&apos;re
                  early-stage, so you&apos;re trading some cash for upside.
                  We&apos;re transparent about the tradeoff.
                </p>
              </div>
              <div>
                <h3 className="mb-3 font-bold text-fg-primary">Remote-First</h3>
                <p className="text-sm text-fg-secondary">
                  Work from wherever you do your best work. We care about output, not
                  office presence. Async communication, minimal meetings.
                </p>
              </div>
              <div>
                <h3 className="mb-3 font-bold text-fg-primary">Hardware</h3>
                <p className="text-sm text-fg-secondary">
                  We&apos;ll get you whatever Apple Silicon machine you need.
                  You&apos;re building native macOS software—you need native
                  macOS hardware.
                </p>
              </div>
              <div>
                <h3 className="mb-3 font-bold text-fg-primary">Time Off</h3>
                <p className="text-sm text-fg-secondary">
                  Unlimited PTO that we actually expect you to use. Burnout
                  doesn&apos;t ship features. Take the vacation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-fg-primary md:text-4xl">
            Don&apos;t See Your Role?
          </h2>
          <p className="mb-8 text-fg-muted">
            If you&apos;re exceptional at something we haven&apos;t listed,
            reach out anyway. We&apos;re always interested in unreasonable
            people.
          </p>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a href="mailto:careers@gremlinlabs.dev?subject=General Application">
              Say Hello
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
