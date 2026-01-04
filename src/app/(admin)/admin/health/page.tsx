"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Server,
  Key,
  Check,
  X,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnvVar {
  key: string;
  label: string;
  required: boolean;
  set: boolean;
}

interface HealthData {
  database: {
    status: "healthy" | "unhealthy";
    latency?: number;
    error?: string;
  };
  redis: {
    status: "healthy" | "unhealthy" | "not_configured";
    latency?: number;
    error?: string;
  };
  environment: Record<string, EnvVar[]>;
  summary: {
    requiredSet: number;
    requiredTotal: number;
    optionalSet: number;
    optionalTotal: number;
    allRequiredSet: boolean;
  };
  timestamp: string;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  core: { label: "Core Configuration", icon: <Server className="w-4 h-4" /> },
  oauth: { label: "OAuth Providers", icon: <Key className="w-4 h-4" /> },
  email: { label: "Email (Resend)", icon: <Key className="w-4 h-4" /> },
  twitter: { label: "Twitter Integration", icon: <Key className="w-4 h-4" /> },
  discord: { label: "Discord Integration", icon: <Key className="w-4 h-4" /> },
  infrastructure: { label: "Infrastructure", icon: <Server className="w-4 h-4" /> },
};

function StatusIcon({ status }: { status: "healthy" | "unhealthy" | "not_configured" }) {
  if (status === "healthy") {
    return <CheckCircle2 className="w-5 h-5 text-green" />;
  }
  if (status === "not_configured") {
    return <MinusCircle className="w-5 h-5 text-yellow" />;
  }
  return <AlertCircle className="w-5 h-5 text-red" />;
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/health");
      if (!res.ok) throw new Error("Failed to fetch health data");
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">System Health</h1>
          <p className="text-fg-muted mt-1">
            Monitor services and environment configuration
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchHealth}
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red/50 bg-red-dim/20">
          <CardContent className="py-4">
            <p className="text-red flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {loading && !health ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-fg-muted" />
        </div>
      ) : health ? (
        <>
          {/* Service Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Database */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-surface-raised">
                      <Database className="w-5 h-5 text-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg-primary">PostgreSQL</h3>
                      <p className="text-sm text-fg-muted">Primary database</p>
                    </div>
                  </div>
                  <StatusIcon status={health.database.status} />
                </div>
                {health.database.latency !== undefined && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-sm text-fg-muted">
                      Latency: <span className="font-mono text-green">{health.database.latency}ms</span>
                    </p>
                  </div>
                )}
                {health.database.error && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-sm text-red font-mono">{health.database.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Redis */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-surface-raised">
                      <Server className="w-5 h-5 text-pink" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg-primary">Redis</h3>
                      <p className="text-sm text-fg-muted">Job queues & caching</p>
                    </div>
                  </div>
                  <StatusIcon status={health.redis.status} />
                </div>
                {health.redis.latency !== undefined && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-sm text-fg-muted">
                      Latency: <span className="font-mono text-green">{health.redis.latency}ms</span>
                    </p>
                  </div>
                )}
                {health.redis.status === "not_configured" && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-sm text-yellow">REDIS_URL not configured</p>
                  </div>
                )}
                {health.redis.error && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-sm text-red font-mono">{health.redis.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Environment Summary */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-surface-raised">
                    <Key className="w-5 h-5 text-yellow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-fg-primary">Environment Variables</h3>
                    <p className="text-sm text-fg-muted">API keys, secrets, and configuration</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-fg-muted">Required</p>
                    <p className={cn(
                      "font-mono font-bold",
                      health.summary.allRequiredSet ? "text-green" : "text-red"
                    )}>
                      {health.summary.requiredSet}/{health.summary.requiredTotal}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-fg-muted">Optional</p>
                    <p className="font-mono font-bold text-fg-primary">
                      {health.summary.optionalSet}/{health.summary.optionalTotal}
                    </p>
                  </div>
                </div>
              </div>

              {/* Environment Tables */}
              <div className="space-y-6">
                {Object.entries(health.environment).map(([category, vars]) => (
                  <div key={category} className="rounded-lg border border-border-subtle overflow-hidden">
                    <div className="bg-surface-raised px-4 py-3 border-b border-border-subtle">
                      <h4 className="font-mono text-sm uppercase tracking-wider text-fg-muted flex items-center gap-2">
                        {CATEGORY_LABELS[category]?.icon}
                        {CATEGORY_LABELS[category]?.label || category}
                      </h4>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-subtle bg-surface-base">
                          <th className="text-left p-3 text-xs font-medium text-fg-dim uppercase tracking-wider">Variable</th>
                          <th className="text-center p-3 text-xs font-medium text-fg-dim uppercase tracking-wider w-24">Required</th>
                          <th className="text-center p-3 text-xs font-medium text-fg-dim uppercase tracking-wider w-24">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vars.map((v, i) => (
                          <tr
                            key={v.key}
                            className={cn(
                              "border-b border-border-subtle last:border-0",
                              i % 2 === 0 ? "bg-surface-base" : "bg-surface-raised/30"
                            )}
                          >
                            <td className="p-3">
                              <p className="font-medium text-fg-primary text-sm">{v.label}</p>
                              <p className="font-mono text-xs text-fg-dim">{v.key}</p>
                            </td>
                            <td className="p-3 text-center">
                              {v.required ? (
                                <span className="text-xs px-2 py-1 rounded-full bg-pink-dim text-pink">Required</span>
                              ) : (
                                <span className="text-xs px-2 py-1 rounded-full bg-surface-raised text-fg-dim">Optional</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {v.set ? (
                                <Check className="w-5 h-5 text-green mx-auto" />
                              ) : (
                                <X className={cn(
                                  "w-5 h-5 mx-auto",
                                  v.required ? "text-red" : "text-fg-dim"
                                )} />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <p className="text-xs text-fg-dim text-center">
            Last checked: {new Date(health.timestamp).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  );
}
