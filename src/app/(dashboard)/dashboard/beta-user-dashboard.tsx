"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadSection } from "@/components/dashboard/download-section";
import { DeviceList } from "@/components/dashboard/device-list";
import { AuthorizeDeviceDialog } from "@/components/dashboard/authorize-device-dialog";
import { Plus, Settings, LogOut, BookOpen, MessageSquare } from "lucide-react";

interface Device {
  id: string;
  deviceName: string | null;
  deviceId: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

interface BetaUserDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  devices: Device[];
}

export function BetaUserDashboard({ user, devices: initialDevices }: BetaUserDashboardProps) {
  const router = useRouter();
  const [devices, setDevices] = useState(initialDevices);
  const [showAuthorize, setShowAuthorize] = useState(false);

  const handleAuthorize = useCallback(async (deviceName: string) => {
    const response = await fetch("/api/desktop-auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceName }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to generate token");
    }

    const data = await response.json();
    
    // Refresh the devices list
    router.refresh();
    
    return {
      token: data.token,
      expiresAt: data.expiresAt,
    };
  }, [router]);

  const handleRevoke = useCallback(async (tokenId: string) => {
    const response = await fetch(`/api/desktop-auth/token?tokenId=${tokenId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to revoke token");
    }

    setDevices((prev) => prev.filter((d) => d.id !== tokenId));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary mb-1">
            You&apos;re In
          </h1>
          <p className="text-fg-muted">
            Welcome to Vibe Mode, {user.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Download Section */}
      <DownloadSection
        downloadUrl="/downloads/vibe-mode-latest.dmg"
        version="0.1.0-beta"
      />

      {/* Device Management */}
      {showAuthorize ? (
        <AuthorizeDeviceDialog
          onAuthorize={handleAuthorize}
          onClose={() => setShowAuthorize(false)}
        />
      ) : (
        <>
          <DeviceList
            devices={devices.map((d) => ({
              ...d,
              deviceName: d.deviceName || "Unknown Device",
            }))}
            onRevoke={handleRevoke}
          />

          <Button
            variant="outline"
            onClick={() => setShowAuthorize(true)}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Authorize New Device
          </Button>
        </>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resources</CardTitle>
          <CardDescription>
            Get the most out of Vibe Mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-sm border border-border-subtle bg-surface-raised hover:border-border-default transition-colors"
            >
              <BookOpen className="w-5 h-5 text-cyan" />
              <div className="flex-1">
                <p className="text-fg-primary font-medium">Documentation</p>
                <p className="text-sm text-fg-muted">Get started guide</p>
              </div>
            </a>
            <a
              href="https://discord.gg/gremlinlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-sm border border-border-subtle bg-surface-raised hover:border-border-default transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-purple" />
              <div className="flex-1">
                <p className="text-fg-primary font-medium">Discord</p>
                <p className="text-sm text-fg-muted">Join the community</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span className="text-fg-muted">Email</span>
              <span className="font-mono text-fg-primary">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span className="text-fg-muted">Status</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-dim text-green text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Active Beta
              </span>
            </div>
            <div className="pt-2">
              <Button variant="ghost" className="w-full gap-2 text-red hover:text-red hover:bg-red-dim">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
