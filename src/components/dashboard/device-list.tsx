"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Laptop, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

interface Device {
  id: string;
  deviceName: string;
  deviceId: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

interface DeviceListProps {
  devices: Device[];
  onRevoke: (tokenId: string) => Promise<void>;
}

export function DeviceList({ devices, onRevoke }: DeviceListProps) {
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = async (tokenId: string) => {
    setRevokingId(tokenId);
    try {
      await onRevoke(tokenId);
    } finally {
      setRevokingId(null);
    }
  };

  if (devices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Devices</CardTitle>
          <CardDescription>Manage authorized devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Laptop className="w-12 h-12 mx-auto text-fg-dim mb-4" />
            <p className="text-fg-muted text-sm">
              No devices authorized yet. Download the app to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Devices</CardTitle>
        <CardDescription>
          {devices.length} device{devices.length !== 1 ? "s" : ""} authorized
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-4 rounded-md border border-border-subtle bg-surface-raised"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-surface-overlay flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-fg-muted" />
                </div>
                <div>
                  <p className="font-medium text-fg-primary">
                    {device.deviceName}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {device.lastUsedAt
                      ? `Last used ${formatDistanceToNow(new Date(device.lastUsedAt))}`
                      : "Never used"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRevoke(device.id)}
                disabled={revokingId === device.id}
                className="text-red hover:text-red hover:bg-red-dim"
              >
                {revokingId === device.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Revoke</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
