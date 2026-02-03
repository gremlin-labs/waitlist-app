"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Cpu, Timer, Gauge, HardDrive, ArrowRight } from "lucide-react";

const SUMMARY_STATS = [
  { label: "Models", value: "34", icon: Cpu },
  { label: "Avg Decode", value: "158.7", unit: "tok/s", icon: Gauge },
  { label: "Avg Prefill", value: "87.7", unit: "tok/s", icon: Gauge },
  { label: "Avg TTFT", value: "44", unit: "ms", icon: Timer },
];

const TTFT_COMPARISON = [
  { model: "TinyMistral-248M", vibemlx: "3.6ms", mlx: "117ms", speedup: "32×" },
  { model: "QwQ-0.5B", vibemlx: "4.8ms", mlx: "228ms", speedup: "47×" },
  { model: "DeepSeek-R1-1.5B", vibemlx: "5.9ms", mlx: "389ms", speedup: "66×" },
  { model: "Llama-3.2-1B", vibemlx: "14.4ms", mlx: "271ms", speedup: "19×" },
  { model: "Mistral-7B-v0.3", vibemlx: "20.3ms", mlx: "1,283ms", speedup: "63×" },
  { model: "Phi-3-mini", vibemlx: "11.1ms", mlx: "737ms", speedup: "66×" },
  { model: "Qwen2.5-Coder-3B", vibemlx: "11.2ms", mlx: "638ms", speedup: "57×" },
];

const TOP_DECODE = [
  { rank: 1, model: "TinyMistral-248M-4bits", speed: "919 tok/s", ttft: "3.6ms" },
  { rank: 2, model: "QwQ-0.5B-4bit", speed: "450 tok/s", ttft: "4.8ms" },
  { rank: 3, model: "QwQ-0.5B-8bit", speed: "331 tok/s", ttft: "4.5ms" },
  { rank: 4, model: "Dolphin-Llama-1B", speed: "285 tok/s", ttft: "7.9ms" },
  { rank: 5, model: "Llama-3.2-1B", speed: "276 tok/s", ttft: "14.4ms" },
  { rank: 6, model: "Llama-3.2-1B-Instruct", speed: "272 tok/s", ttft: "15.5ms" },
  { rank: 7, model: "Granite-350M", speed: "269 tok/s", ttft: "11.5ms" },
  { rank: 8, model: "DeepSeek-R1-1.5B", speed: "250 tok/s", ttft: "5.9ms" },
  { rank: 9, model: "Qwen2.5-Coder-1.5B", speed: "220 tok/s", ttft: "7.3ms" },
  { rank: 10, model: "Gemma-3-1B", speed: "193 tok/s", ttft: "24.2ms" },
];

const EMBEDDING_RESULTS = [
  { rank: 1, model: "ModernBERT-base-8bit", throughput: "3,227 tok/s", load: "936ms" },
  { rank: 2, model: "ModernBERT-base-4bit", throughput: "2,802 tok/s", load: "2,054ms" },
  { rank: 3, model: "ModernBERT-base-bf16", throughput: "1,750 tok/s", load: "996ms" },
  { rank: 4, model: "Qwen3-Embedding-0.6B", throughput: "68 tok/s", load: "2,143ms" },
];

const RESOURCE_COMPARISON = [
  { metric: "Download Size", vibe: "100 MB", other: "1,000+ MB" },
  { metric: "Memory at Idle", vibe: "< 100 MB", other: "3-5 GB" },
  { metric: "Time to Launch", vibe: "< 1 sec", other: "3-8 seconds" },
  { metric: "Framework", vibe: "SwiftUI", other: "Electron" },
  { metric: "Inference", vibe: "Native", other: "Subprocess" },
  { metric: "Terminal", vibe: "Ghostty", other: "xterm.js" },
  { metric: "Dependencies", vibe: "Zero", other: "node_modules" },
];

const METHODOLOGY = [
  "All tests on Apple M3 Max (128GB unified memory)",
  "Each model tested 3+ times, results averaged",
  "Prefill: 40-token prompts",
  "Decode: 100-token generations",
  "Models loaded fresh for fair comparison",
  "Background processes killed before testing",
  "Memory cleared between tests",
];

type Tab = "ttft" | "decode" | "embedding";

export default function BenchmarksPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ttft");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-0 h-[500px] w-[600px] rounded-full bg-green/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-pink/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* ASCII Logo */}
          <pre className="mx-auto mb-8 font-mono text-[8px] leading-tight text-pink sm:text-[10px] md:text-xs">
            {`██╗   ██╗██╗██████╗ ███████╗███╗   ███╗██╗     ██╗  ██╗
██║   ██║██║██╔══██╗██╔════╝████╗ ████║██║     ╚██╗██╔╝
██║   ██║██║██████╔╝█████╗  ██╔████╔██║██║      ╚███╔╝ 
╚██╗ ██╔╝██║██╔══██╗██╔══╝  ██║╚██╔╝██║██║      ██╔██╗ 
 ╚████╔╝ ██║██████╔╝███████╗██║ ╚═╝ ██║███████╗██╔╝ ██╗
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝`}
          </pre>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-fg-primary md:text-6xl lg:text-7xl">
            The Numbers Don&apos;t Lie
          </h1>
          <p className="mt-4 text-xl text-fg-muted">
            Real benchmarks. Real hardware. No asterisks.
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SUMMARY_STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="h-4 w-4 text-pink" />
                  <span className="label-uppercase">{stat.label}</span>
                </div>
                <div className="text-stat font-bold text-pink">{stat.value}</div>
                {stat.unit && <div className="text-sm text-fg-dim">{stat.unit}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-border-subtle bg-surface-base">
            {/* Tab Headers */}
            <div className="flex border-b border-border-subtle">
              {(["ttft", "decode", "embedding"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 px-6 py-4 font-mono text-sm uppercase tracking-wider transition-colors",
                    activeTab === tab
                      ? "bg-pink-dim/20 text-pink border-b-2 border-pink"
                      : "text-fg-muted hover:text-fg-primary"
                  )}
                >
                  {tab === "ttft" ? "Time to First Token" : tab === "decode" ? "Decode Speed" : "Embedding"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "ttft" && (
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary mb-2">
                    Where It Really Matters
                  </h3>
                  <p className="text-fg-muted mb-6">
                    When you send a message and wait for the AI to respond, TTFT
                    determines how long you stare at a blank screen. This is the
                    metric that makes or breaks conversational UX.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-subtle">
                          <th className="label-uppercase p-3 text-left">Model</th>
                          <th className="label-uppercase p-3 text-right text-green">VibeMLX</th>
                          <th className="label-uppercase p-3 text-right text-fg-dim">mlx-engine</th>
                          <th className="label-uppercase p-3 text-right text-pink">Speedup</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TTFT_COMPARISON.map((row) => (
                          <tr key={row.model} className="border-b border-border-subtle">
                            <td className="p-3 font-mono text-sm text-fg-primary">{row.model}</td>
                            <td className="p-3 text-right font-mono text-green">{row.vibemlx}</td>
                            <td className="p-3 text-right font-mono text-fg-dim">{row.mlx}</td>
                            <td className="p-3 text-right font-mono font-bold text-pink">{row.speedup}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 rounded-md bg-surface-raised border border-border-subtle">
                    <p className="text-sm text-fg-muted">
                      <strong className="text-fg-primary">Why the massive difference?</strong>{" "}
                      VibeMLX compiles directly into the application. No Python interpreter.
                      No cross-language FFI overhead. No framework abstraction layers.
                      The moment your prompt is ready, tokens start flowing.
                    </p>
                  </div>

                  {/* Test System Badge */}
                  <div className="mt-6 rounded-md border border-blue/30 bg-blue/5 px-4 py-3 text-center font-mono text-sm text-blue/70 flex items-center justify-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Test System: Apple M3 Max | 16 cores | 128GB Unified Memory
                  </div>
                </div>
              )}

              {activeTab === "decode" && (
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary mb-2">
                    Top Performers: Decode Speed
                  </h3>
                  <p className="text-fg-muted mb-6">
                    Tokens per second during generation. Higher is better.
                  </p>

                  <div className="space-y-2">
                    {TOP_DECODE.map((entry) => (
                      <div
                        key={entry.model}
                        className="flex items-center justify-between rounded-sm bg-surface-raised p-3"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 font-mono text-pink">{entry.rank}.</span>
                          <span className="font-mono text-fg-primary">{entry.model}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="font-mono text-green">{entry.speed}</span>
                          <span className="font-mono text-fg-dim text-sm w-20 text-right">{entry.ttft}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "embedding" && (
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary mb-2">
                    Embedding Throughput
                  </h3>
                  <p className="text-fg-muted mb-6">
                    For semantic search and context retrieval.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-subtle">
                          <th className="label-uppercase p-3 text-left">Rank</th>
                          <th className="label-uppercase p-3 text-left">Model</th>
                          <th className="label-uppercase p-3 text-right">Throughput</th>
                          <th className="label-uppercase p-3 text-right">Load Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {EMBEDDING_RESULTS.map((row) => (
                          <tr key={row.model} className="border-b border-border-subtle">
                            <td className="p-3 font-mono text-pink">{row.rank}.</td>
                            <td className="p-3 font-mono text-fg-primary">{row.model}</td>
                            <td className="p-3 text-right font-mono text-green">{row.throughput}</td>
                            <td className="p-3 text-right font-mono text-fg-dim">{row.load}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Resource Comparison */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-border-subtle bg-surface-base p-6">
            <h2 className="mb-2 font-mono text-sm uppercase tracking-wider text-pink flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Bundle & Resource Comparison
            </h2>
            <p className="text-sm text-fg-muted mb-6">
              How Amazing App compares to popular AI coding assistants.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="label-uppercase p-3 text-left">Metric</th>
                    <th className="label-uppercase p-3 text-right text-green">Amazing App</th>
                    <th className="label-uppercase p-3 text-right text-fg-dim">Other Tools*</th>
                  </tr>
                </thead>
                <tbody>
                  {RESOURCE_COMPARISON.map((row, i) => (
                    <tr
                      key={row.metric}
                      className={cn(
                        "border-b border-border-subtle",
                        i % 2 === 0 ? "bg-surface-base" : "bg-surface-raised/50"
                      )}
                    >
                      <td className="p-3 font-medium text-fg-primary">{row.metric}</td>
                      <td className="p-3 text-right font-mono text-green">{row.vibe}</td>
                      <td className="p-3 text-right font-mono text-fg-dim">{row.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-fg-dim">
              * Measured against popular AI coding assistants. We&apos;re not naming
              names, but you know who. If you want specifics, ask in Discord.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="px-6 py-8 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-border-subtle bg-surface-base p-6">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-wider text-fg-muted">
              How We Test
            </h2>
            <ul className="space-y-2 font-mono text-sm text-fg-secondary">
              {METHODOLOGY.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-pink">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-fg-muted">
              Benchmarks are reproducible. Code available on request.
            </p>

            <div className="mt-6 flex justify-end">
              <a
                href="https://discord.gg/thiscompany"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink hover:underline"
              >
                Join Discord to Discuss Benchmarks
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
