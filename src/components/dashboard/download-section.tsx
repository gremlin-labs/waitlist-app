"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Apple, ExternalLink } from "lucide-react";

interface DownloadSectionProps {
  downloadUrl?: string;
  version?: string;
}

export function DownloadSection({
  downloadUrl = "#",
  version = "0.1.0-beta",
}: DownloadSectionProps) {
  return (
    <Card className="border-pink bg-pink-ghost">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Download Vibe Mode</CardTitle>
        <CardDescription>
          Native inference engine for Apple Silicon
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        {/* Main Download Button */}
        <Button
          asChild
          size="lg"
          className="h-14 px-8 text-lg gap-3 shadow-glow-pink"
        >
          <a href={downloadUrl} download>
            <Apple className="w-6 h-6" />
            Download for macOS
            <Download className="w-5 h-5" />
          </a>
        </Button>

        {/* System Requirements */}
        <div className="space-y-2">
          <p className="font-mono text-xs text-fg-muted">
            Version {version} • macOS 14+ • Apple Silicon
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-fg-dim">
            <span>Universal Binary</span>
            <span>•</span>
            <span>~50MB</span>
            <span>•</span>
            <span>Signed & Notarized</span>
          </div>
        </div>

        {/* Alternative Download Options */}
        <div className="pt-4 border-t border-border-subtle">
          <p className="text-sm text-fg-muted mb-3">Other options</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg-primary transition-colors"
            >
              <span>Homebrew</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-fg-dim">•</span>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg-primary transition-colors"
            >
              <span>Release Notes</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
