import Link from "next/link";
import {
  Shield,
  Eye,
  EyeOff,
  Database,
  Cpu,
  Activity,
  Gauge,
  Search,
  FileCode,
  AlertTriangle,
  Download,
  Trash2,
  RefreshCw,
  ToggleLeft,
  ArrowLeft,
} from "lucide-react";

const TELEMETRY_LEVELS = [
  {
    level: "Off",
    description: "No data is collected or stored.",
    default: true,
    uploads: false,
  },
  {
    level: "Local Only",
    description: "Data stored locally for hardware-specific recommendations. Never uploaded.",
    default: false,
    uploads: false,
  },
  {
    level: "Anonymous",
    description: "Aggregated, anonymized statistics uploaded. No individual patterns.",
    default: false,
    uploads: true,
  },
  {
    level: "Detailed",
    description: "Additional model performance metrics. Still no personal data or code.",
    default: false,
    uploads: true,
  },
];

const USER_CONTROLS = [
  { icon: ToggleLeft, control: "Master Toggle", description: "Enable or disable all telemetry collection" },
  { icon: Gauge, control: "Collection Level", description: "Choose between Local Only, Anonymous, or Detailed" },
  { icon: RefreshCw, control: "Regenerate ID", description: "Generate a new anonymous identifier at any time" },
  { icon: Download, control: "Export Data", description: "Download all collected telemetry data as JSON" },
  { icon: Trash2, control: "Delete All Data", description: "Permanently delete all collected telemetry data" },
];

const MACHINE_PROFILE = [
  { field: "chip_family", description: "Apple Silicon or Intel generation", example: "m3, m2, m1, intel" },
  { field: "chip_variant", description: "Chip tier", example: "base, pro, max, ultra" },
  { field: "chip_core_count_perf", description: "Performance CPU cores", example: "12" },
  { field: "chip_core_count_eff", description: "Efficiency CPU cores", example: "4" },
  { field: "gpu_core_count", description: "GPU cores", example: "40" },
  { field: "neural_engine_cores", description: "Neural Engine cores", example: "16" },
  { field: "total_ram_gb", description: "Total system RAM", example: "128" },
  { field: "memory_bandwidth_gbps", description: "Memory bandwidth", example: "400" },
  { field: "macos_version", description: "macOS version", example: "15.7.2" },
  { field: "vibe_version", description: "Vibe Mode version", example: "0.1.0" },
];

const SESSION_INFO = [
  { field: "started_at", description: "Session start timestamp (Unix epoch)" },
  { field: "ended_at", description: "Session end timestamp (Unix epoch)" },
  { field: "duration_seconds", description: "Total session duration" },
  { field: "events_count", description: "Number of events in session" },
  { field: "inferences_count", description: "Number of AI inferences performed" },
  { field: "searches_count", description: "Number of context searches performed" },
  { field: "ended_normally", description: "Whether the session ended cleanly" },
];

const MODEL_AGGREGATES = [
  { field: "model_id", description: "Model identifier", example: "qwen2.5-coder-7b-4bit" },
  { field: "inference_count", description: "Total inferences with this model" },
  { field: "total_tokens", description: "Total tokens processed" },
  { field: "avg_ttft_ms", description: "Average time to first token" },
  { field: "avg_tps", description: "Average tokens per second" },
  { field: "avg_memory_mb", description: "Average memory usage" },
  { field: "peak_memory_mb", description: "Peak memory usage observed" },
  { field: "error_rate", description: "Percentage of failed inferences" },
];

const APP_EVENTS = [
  { event: "app_launch", description: "Application started" },
  { event: "app_quit", description: "Application closed normally" },
  { event: "app_crash", description: "Application crashed (no crash details)" },
  { event: "app_update", description: "Application updated to new version" },
];

const MODEL_EVENTS = [
  { event: "model_download_started", description: "Model download initiated" },
  { event: "model_download_completed", description: "Model download finished" },
  { event: "model_download_failed", description: "Model download failed (error type only)" },
  { event: "model_load_started", description: "Model loading initiated" },
  { event: "model_load_completed", description: "Model loaded successfully" },
  { event: "model_load_failed", description: "Model failed to load (error type only)" },
  { event: "model_inference_complete", description: "Inference completed (timing metrics only)" },
];

const CONTEXT_EVENTS = [
  { event: "index_started", description: "Project indexing started" },
  { event: "index_completed", description: "Project indexing completed" },
  { event: "index_failed", description: "Project indexing failed (error type only)" },
  { event: "search_performed", description: "Context search initiated" },
  { event: "search_completed", description: "Context search completed" },
];

const NOT_COLLECTED = [
  { category: "Personal Information", examples: "Name, email, IP address, location" },
  { category: "File Contents", examples: "Source code, documents, configuration files" },
  { category: "Prompts & Messages", examples: "User prompts, AI responses, chat history" },
  { category: "File Paths", examples: "Directory structure, file names, project names" },
  { category: "API Keys & Credentials", examples: "Provider API keys, tokens, passwords" },
  { category: "Network Information", examples: "IP addresses, hostnames, URLs accessed" },
  { category: "Usage Content", examples: "What features were used for, specific actions taken" },
  { category: "Error Details", examples: "Stack traces, error messages with sensitive data" },
];

export default function TelemetryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/3 top-0 h-[500px] w-[600px] rounded-full bg-green/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-pink/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <Link 
            href="/privacy" 
            className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Privacy Policy
          </Link>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-fg-primary md:text-5xl">
            Telemetry Data Collection
          </h1>
          <p className="mt-4 text-xl text-fg-muted">
            Complete transparency on what Vibe Mode collects — and what it doesn&apos;t.
          </p>
        </div>
      </section>

      {/* Key Points */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-green/30 bg-green-dim p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-green/20 text-green">
                <EyeOff className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-bold text-fg-primary">Off by Default</h3>
              <p className="text-sm text-fg-secondary">
                Telemetry must be explicitly enabled. We collect nothing until you opt in.
              </p>
            </div>
            <div className="rounded-md border border-blue/30 bg-blue-dim p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-blue/20 text-blue">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-bold text-fg-primary">No Personal Data</h3>
              <p className="text-sm text-fg-secondary">
                No code, prompts, file paths, or personally identifiable information. Ever.
              </p>
            </div>
            <div className="rounded-md border border-pink/30 bg-pink-dim p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-pink/20 text-pink">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-bold text-fg-primary">Full Control</h3>
              <p className="text-sm text-fg-secondary">
                Export, delete, or regenerate your anonymous ID at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Levels */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-fg-primary">Telemetry Levels</h2>
          <div className="overflow-hidden rounded-md border border-border-subtle">
            <table className="w-full">
              <thead className="bg-surface-raised">
                <tr>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Level</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Description</th>
                  <th className="px-6 py-4 text-center font-mono text-xs uppercase tracking-wider text-fg-muted">Default</th>
                  <th className="px-6 py-4 text-center font-mono text-xs uppercase tracking-wider text-fg-muted">Uploads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {TELEMETRY_LEVELS.map((item) => (
                  <tr key={item.level} className="bg-surface-base">
                    <td className="px-6 py-4 font-medium text-fg-primary">{item.level}</td>
                    <td className="px-6 py-4 text-fg-secondary">{item.description}</td>
                    <td className="px-6 py-4 text-center">
                      {item.default ? (
                        <span className="inline-flex items-center rounded-full bg-green-dim px-2 py-1 text-xs font-medium text-green">
                          Default
                        </span>
                      ) : (
                        <span className="text-fg-dim">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.uploads ? (
                        <span className="text-yellow">Yes</span>
                      ) : (
                        <span className="text-green">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* User Controls */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-fg-primary">User Controls</h2>
          <div className="overflow-hidden rounded-md border border-border-subtle">
            <table className="w-full">
              <thead className="bg-surface-raised">
                <tr>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Control</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {USER_CONTROLS.map((item) => (
                  <tr key={item.control} className="bg-surface-base">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-pink" />
                        <span className="font-medium text-fg-primary">{item.control}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-fg-secondary">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Data Categories */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold text-fg-primary">Data Categories</h2>

          {/* Machine Profile */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-dim text-pink">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-fg-primary">Machine Profile</h3>
                <p className="text-sm text-fg-muted">Hardware and system information for optimized recommendations</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-border-subtle">
              <table className="w-full">
                <thead className="bg-surface-raised">
                  <tr>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Field</th>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Description</th>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {MACHINE_PROFILE.map((item) => (
                    <tr key={item.field} className="bg-surface-base">
                      <td className="px-6 py-3 font-mono text-sm text-pink">{item.field}</td>
                      <td className="px-6 py-3 text-sm text-fg-secondary">{item.description}</td>
                      <td className="px-6 py-3 font-mono text-sm text-fg-muted">{item.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Information */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-dim text-blue">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-fg-primary">Session Information</h3>
                <p className="text-sm text-fg-muted">Basic session metadata to understand usage patterns</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-border-subtle">
              <table className="w-full">
                <thead className="bg-surface-raised">
                  <tr>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Field</th>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {SESSION_INFO.map((item) => (
                    <tr key={item.field} className="bg-surface-base">
                      <td className="px-6 py-3 font-mono text-sm text-blue">{item.field}</td>
                      <td className="px-6 py-3 text-sm text-fg-secondary">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Performance */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-dim text-green">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-fg-primary">Model Performance Aggregates</h3>
                <p className="text-sm text-fg-muted">Aggregated statistics for AI models (no individual inferences)</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-border-subtle">
              <table className="w-full">
                <thead className="bg-surface-raised">
                  <tr>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Field</th>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Description</th>
                    <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wider text-fg-muted">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {MODEL_AGGREGATES.map((item) => (
                    <tr key={item.field} className="bg-surface-base">
                      <td className="px-6 py-3 font-mono text-sm text-green">{item.field}</td>
                      <td className="px-6 py-3 text-sm text-fg-secondary">{item.description}</td>
                      <td className="px-6 py-3 font-mono text-sm text-fg-muted">{item.example || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-2xl font-bold text-fg-primary">Event Types</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* App Lifecycle */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-fg-primary">
                <Activity className="h-4 w-4 text-pink" />
                App Lifecycle Events
              </h3>
              <div className="overflow-hidden rounded-md border border-border-subtle">
                <table className="w-full">
                  <tbody className="divide-y divide-border-subtle">
                    {APP_EVENTS.map((item) => (
                      <tr key={item.event} className="bg-surface-base">
                        <td className="px-4 py-3 font-mono text-xs text-pink">{item.event}</td>
                        <td className="px-4 py-3 text-sm text-fg-secondary">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model Events */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-fg-primary">
                <Database className="h-4 w-4 text-green" />
                Model Events
              </h3>
              <div className="overflow-hidden rounded-md border border-border-subtle">
                <table className="w-full">
                  <tbody className="divide-y divide-border-subtle">
                    {MODEL_EVENTS.map((item) => (
                      <tr key={item.event} className="bg-surface-base">
                        <td className="px-4 py-3 font-mono text-xs text-green">{item.event}</td>
                        <td className="px-4 py-3 text-sm text-fg-secondary">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Context Events */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-fg-primary">
                <Search className="h-4 w-4 text-blue" />
                Context Engine Events
              </h3>
              <div className="overflow-hidden rounded-md border border-border-subtle">
                <table className="w-full">
                  <tbody className="divide-y divide-border-subtle">
                    {CONTEXT_EVENTS.map((item) => (
                      <tr key={item.event} className="bg-surface-base">
                        <td className="px-4 py-3 font-mono text-xs text-blue">{item.event}</td>
                        <td className="px-4 py-3 text-sm text-fg-secondary">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage Info */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-fg-primary">
                <FileCode className="h-4 w-4 text-yellow" />
                Data Storage
              </h3>
              <div className="rounded-md border border-border-subtle bg-surface-base p-4 space-y-3">
                <p className="text-sm text-fg-secondary">
                  <strong className="text-fg-primary">Local:</strong>{" "}
                  <code className="rounded bg-surface-raised px-2 py-0.5 text-xs">~/.vibemode/telemetry.db</code>
                </p>
                <p className="text-sm text-fg-secondary">
                  <strong className="text-fg-primary">Format:</strong> SQLite database
                </p>
                <p className="text-sm text-fg-secondary">
                  <strong className="text-fg-primary">Cloud retention:</strong> 90 days for events, indefinite for aggregates
                </p>
                <p className="text-sm text-fg-secondary">
                  <strong className="text-fg-primary">Encryption:</strong> TLS 1.3 for all uploads
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do NOT Collect */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-dim text-red">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-fg-primary">What We Do NOT Collect</h2>
          </div>
          <p className="mb-6 text-fg-secondary">
            The following data is explicitly <strong className="text-red">never</strong> collected or transmitted:
          </p>
          <div className="overflow-hidden rounded-md border border-red/30">
            <table className="w-full">
              <thead className="bg-red-dim">
                <tr>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-fg-primary">Category</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wider text-fg-primary">Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {NOT_COLLECTED.map((item) => (
                  <tr key={item.category} className="bg-surface-base">
                    <td className="px-6 py-4 font-medium text-fg-primary">{item.category}</td>
                    <td className="px-6 py-4 text-fg-secondary">{item.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-12 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-md border border-border-subtle bg-surface-base p-8 text-center">
            <h2 className="mb-4 text-xl font-bold text-fg-primary">Questions about telemetry?</h2>
            <p className="mb-6 text-fg-secondary">
              For questions about telemetry data collection or to request data deletion:
            </p>
            <a 
              href="mailto:support@gremlinlabs.com" 
              className="inline-flex items-center gap-2 text-pink hover:text-pink-bright transition-colors"
            >
              support@gremlinlabs.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
