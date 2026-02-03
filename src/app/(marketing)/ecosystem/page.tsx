import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Cpu,
  Waves,
  Zap,
  Terminal,
  Box,
  FileCode,
} from "lucide-react";

const VIBEMLX_MODELS = [
  "Llama 3.x, 3.2",
  "Qwen 2, 2.5, 3",
  "Phi 3, 4",
  "Gemma 2, 3",
  "Mistral, Mistral Nemo",
  "Granite (including MoE)",
  "DeepSeek-R1 (distilled)",
  "ModernBERT (embeddings)",
];

const VIBEMLX_FEATURES = [
  "Native BPE tokenizer with caching",
  "16 chat template formats (auto-detected)",
  "Quantized KV cache for long contexts",
  "Metal-optimized inference via MLX-C",
  "Streaming output with token callbacks",
  "Zero-copy C interop from Zig",
];

const SAMSARA_FEATURES = [
  {
    title: "Infinite History",
    description:
      "Every conversation is indexed and searchable. Ask about something you discussed last week—Samsara remembers.",
  },
  {
    title: "Project Awareness",
    description:
      "File changes, dependency updates, structural patterns—all indexed and available for context retrieval.",
  },
  {
    title: "Intelligent Compression",
    description:
      "Old context is semantically compressed, not deleted. The meaning survives even when the tokens don't.",
  },
  {
    title: "Seamless Retrieval",
    description:
      "You don't manage context. Samsara does. The right information surfaces at the right time, automatically.",
  },
];

const JINJA_CAPABILITIES = [
  "Full Jinja2 template syntax",
  "Variable interpolation, filters, conditionals",
  "Loop constructs with proper scoping",
  "Template inheritance and includes",
  "All the chat template formats models expect",
];

const GHOSTTY_BENEFITS = [
  "GPU-accelerated rendering — buttery smooth at any size",
  "Native integration — shares memory with the app",
  "Proper font rendering — your ligatures work correctly",
  "Fast — really fast",
  "It's Ghostty — you know it's good",
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-1/4 top-0 h-[500px] w-[600px] rounded-full bg-cyan/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[500px] rounded-full bg-green/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-fg-primary md:text-6xl lg:text-7xl">
            The Stack That Makes the Vibes Possible
          </h1>
          <p className="mt-4 text-xl text-fg-muted">
            Every component built for one purpose:
            <br />
            getting out of your way while making you faster.
          </p>
        </div>
      </section>

      {/* VibeMLX Section */}
      <section id="vibemlx" className="scroll-mt-20 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-cyan/30 bg-surface-base">
            {/* Header */}
            <div className="border-b border-border-subtle bg-cyan-dim/10 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-dim text-cyan">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="label-uppercase text-cyan">Inference Runtime</p>
                    <h2 className="text-2xl font-bold text-fg-primary">VibeMLX</h2>
                  </div>
                </div>
                <p className="text-lg font-mono text-cyan">17MB of Pure Inference</p>
              </div>
            </div>

            <div className="p-8">
              <p className="mb-8 text-lg text-fg-secondary leading-relaxed">
                Most local inference solutions require Python environments, pip
                packages, model conversion pipelines, and prayers to the dependency
                gods. VibeMLX is a single 17MB binary that loads HuggingFace models
                directly and starts generating tokens.
              </p>
              <p className="mb-8 text-fg-muted">
                No Python. No pip. No conda. No conversion tools.
                <br />
                Just one executable and your model weights.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="stat-card text-center">
                  <div className="text-stat font-bold text-cyan">17</div>
                  <div className="text-sm text-fg-muted">MB Binary</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-stat font-bold text-cyan">3-20</div>
                  <div className="text-sm text-fg-muted">ms First Token</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-stat font-bold text-cyan">21+</div>
                  <div className="text-sm text-fg-muted">Architectures</div>
                </div>
              </div>

              {/* Two Column */}
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="label-uppercase mb-4 text-cyan flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    Supported Models
                  </h3>
                  <ul className="space-y-2">
                    {VIBEMLX_MODELS.map((model) => (
                      <li key={model} className="flex items-center gap-2 text-fg-secondary font-mono text-sm">
                        <span className="text-cyan">•</span>
                        {model}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label-uppercase mb-4 text-cyan flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    What&apos;s Inside
                  </h3>
                  <ul className="space-y-2">
                    {VIBEMLX_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-fg-secondary text-sm">
                        <span className="text-cyan">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Why We Built It */}
              <div className="mt-8 p-6 rounded-md bg-surface-raised border border-border-subtle">
                <h3 className="label-uppercase mb-4 text-fg-primary">Why We Built It</h3>
                <div className="space-y-3 text-fg-secondary">
                  <p>We needed local inference that:</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2 font-mono text-sm">
                    <li>Didn&apos;t require Python (dependency hell)</li>
                    <li>Started instantly (no warm-up spinners)</li>
                    <li>Compiled into our daemon (no subprocess overhead)</li>
                    <li>Actually used Apple Silicon properly</li>
                  </ol>
                  <p className="text-fg-muted">
                    Nothing fit. So we built VibeMLX in Zig, binding directly to Apple&apos;s
                    MLX-C framework. 17MB. Zero dependencies. 32-66x faster time to
                    first token than Python-based alternatives.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex justify-end">
                <Link
                  href="/benchmarks"
                  className="inline-flex items-center gap-2 text-cyan hover:underline"
                >
                  See Benchmark Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Samsara Section */}
      <section id="samsara" className="scroll-mt-20 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-green/30 bg-surface-base">
            {/* Header */}
            <div className="border-b border-border-subtle bg-green-dim/10 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-dim text-green">
                    <Waves className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="label-uppercase text-green">Context Engine</p>
                    <h2 className="text-2xl font-bold text-fg-primary">Samsara</h2>
                  </div>
                </div>
                <p className="text-lg font-mono text-green">Context That Never Dies</p>
              </div>
            </div>

            <div className="p-8">
              <p className="mb-8 text-lg text-fg-secondary leading-relaxed">
                Named for the cycle of death and rebirth, Samsara ensures your
                conversations with AI never truly end. It maintains semantic
                continuity across sessions, intelligently compressing and
                retrieving context so your AI assistant always knows what
                you&apos;ve discussed.
              </p>
              <p className="mb-8 text-fg-muted">
                No more &ldquo;context window exceeded.&rdquo;
                <br />
                No more re-explaining your architecture.
                <br />
                No more starting over.
              </p>

              {/* How It Works Diagram */}
              <div className="mb-8 p-6 rounded-md bg-surface-raised border border-border-subtle font-mono text-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-green font-semibold">Conversation</p>
                    <p className="text-fg-muted text-xs">• Current message</p>
                    <p className="text-fg-muted text-xs">• Recent context</p>
                    <p className="text-fg-muted text-xs">• Project files</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-green" />
                  <div className="space-y-1">
                    <p className="text-green font-semibold">Samsara Engine</p>
                    <p className="text-fg-muted text-xs">• Semantic compression</p>
                    <p className="text-fg-muted text-xs">• Vector search</p>
                    <p className="text-fg-muted text-xs">• Intelligent retrieval</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-green" />
                  <div className="space-y-1">
                    <p className="text-green font-semibold">Retrieved Context</p>
                    <p className="text-fg-muted text-xs">• Relevant history</p>
                    <p className="text-fg-muted text-xs">• Project patterns</p>
                    <p className="text-fg-muted text-xs">• Architectural context</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid gap-4 md:grid-cols-2">
                {SAMSARA_FEATURES.map((feature) => (
                  <div key={feature.title} className="p-4 rounded-md bg-surface-raised border border-border-subtle">
                    <h4 className="font-semibold text-fg-primary mb-2">{feature.title}</h4>
                    <p className="text-sm text-fg-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* vibe-jinja Section */}
      <section id="vibe-jinja" className="scroll-mt-20 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-yellow/30 bg-surface-base">
            {/* Header */}
            <div className="border-b border-border-subtle bg-yellow-dim/10 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-dim text-yellow">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="label-uppercase text-yellow">Templating Engine</p>
                    <h2 className="text-2xl font-bold text-fg-primary">vibe-jinja</h2>
                  </div>
                </div>
                <p className="text-lg font-mono text-yellow">Jinja2, Without the Jinja</p>
              </div>
            </div>

            <div className="p-8">
              <p className="mb-8 text-lg text-fg-secondary leading-relaxed">
                Chat templates are critical for model compatibility. Every model
                expects a specific format—ChatML, Llama, Mistral, Phi, and dozens
                more. The standard solution is Jinja2, which means Python, which
                means dependencies.
              </p>
              <p className="mb-8 text-fg-muted">
                We rewrote Jinja2 templating in Zig. Complete compatibility.
                Native performance. Zero external dependencies.
                <br />
                <span className="text-yellow">Because sometimes the right solution is the unhinged one.</span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="stat-card text-center">
                  <div className="text-stat font-bold text-yellow">&lt;100</div>
                  <div className="text-sm text-fg-muted">KB (embedded)</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-lg font-bold text-yellow">Jinja2 ✓</div>
                  <div className="text-sm text-fg-muted">Compatible</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-stat font-bold text-yellow">0</div>
                  <div className="text-sm text-fg-muted">Dependencies</div>
                </div>
              </div>

              {/* What It Does */}
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="label-uppercase mb-4 text-yellow">What It Does</h3>
                  <ul className="space-y-2">
                    {JINJA_CAPABILITIES.map((cap) => (
                      <li key={cap} className="flex items-center gap-2 text-fg-secondary text-sm">
                        <span className="text-yellow">•</span>
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label-uppercase mb-4 text-yellow">Why It Exists</h3>
                  <p className="text-fg-secondary text-sm leading-relaxed">
                    When your goal is a single binary with zero dependencies,
                    &ldquo;just pip install jinja2&rdquo; isn&apos;t an option. vibe-jinja lets
                    VibeMLX format prompts correctly for any model without
                    touching Python.
                  </p>
                  <p className="mt-4 text-fg-muted text-sm">
                    <strong>Compatibility:</strong> Tested against the full Jinja2 test suite.
                    If Python Jinja2 renders it, vibe-jinja renders it identically.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex justify-end">
                <a
                  href="https://github.com/gremlin-labs/vibe-jinja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow hover:underline"
                >
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ghostty Section */}
      <section id="ghostty" className="scroll-mt-20 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-purple/30 bg-surface-base">
            {/* Header */}
            <div className="border-b border-border-subtle bg-purple-dim/10 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-dim text-purple">
                    <Terminal className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="label-uppercase text-purple">Terminal</p>
                    <h2 className="text-2xl font-bold text-fg-primary">Ghostty Inside</h2>
                  </div>
                </div>
                <p className="text-lg font-mono text-purple">Yes, That Ghostty</p>
              </div>
            </div>

            <div className="p-8">
              <p className="mb-8 text-lg text-fg-secondary leading-relaxed">
                Mitchell Hashimoto&apos;s GPU-accelerated terminal emulator—the one
                that broke the internet when it launched—is built directly into
                Amazing App. Not as a subprocess. Not wrapped in an iframe. Native
                integration via the libghostty embedding API.
              </p>
              <p className="mb-8 text-fg-primary font-medium">
                You get the fastest terminal emulator available, and the whole
                application is still just 100MB.
              </p>

              {/* Benefits */}
              <div className="p-6 rounded-md bg-surface-raised border border-border-subtle">
                <h3 className="label-uppercase mb-4 text-purple">Why It Matters</h3>
                <ul className="space-y-2">
                  {GHOSTTY_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-fg-secondary">
                      <span className="text-purple">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-8 flex justify-end">
                <a
                  href="https://ghostty.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple hover:underline"
                >
                  Learn More About Ghostty
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
