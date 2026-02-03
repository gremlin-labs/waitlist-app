"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check, Loader2, Plus, X } from "lucide-react";

interface AuthorizeDeviceDialogProps {
  onAuthorize: (deviceName: string) => Promise<{ token: string; expiresAt: string }>;
  onClose: () => void;
}

export function AuthorizeDeviceDialog({
  onAuthorize,
  onClose,
}: AuthorizeDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<{
    token: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onAuthorize(deviceName.trim());
      setGeneratedToken(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedToken) return;

    await navigator.clipboard.writeText(generatedToken.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (generatedToken) {
    return (
      <Card className="border-green">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green" />
            Device Authorized
          </CardTitle>
          <CardDescription>
            Copy this token and paste it in the Amazing App app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-fg-muted">Your Token</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={generatedToken.token}
                className="font-mono text-sm bg-surface-raised"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-md bg-yellow-dim/30 border border-yellow p-3">
            <p className="text-sm text-yellow">
              ⚠️ This token will only be shown once. Make sure to copy it now!
            </p>
          </div>

          <p className="text-xs text-fg-dim">
            Expires: {new Date(generatedToken.expiresAt).toLocaleDateString()}
          </p>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Authorize New Device</CardTitle>
            <CardDescription>
              Generate a token to connect your Mac
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-dim border border-red text-red text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="deviceName">Device Name</Label>
            <Input
              id="deviceName"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder='e.g., "MacBook Pro 16"'
              disabled={isLoading}
            />
            <p className="text-xs text-fg-dim">
              Give your device a name so you can recognize it later
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !deviceName.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Token
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
