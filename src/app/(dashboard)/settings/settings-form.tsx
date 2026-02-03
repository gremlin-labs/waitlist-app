"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  MapPin,
  Mail,
  Clock,
  Save,
  Loader2,
  Check,
  Copy,
  Calendar,
  Link as LinkIcon,
  AtSign,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { COUNTRIES, getTimezones } from "@/constants/countries";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    username: string;
    country: string;
    region: string;
    timezone: string;
    referralCode: string;
    memberSince: string;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    country: initialData.country,
    region: initialData.region,
    timezone: initialData.timezone,
  });
  const [username, setUsername] = useState(initialData.username);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [profileCopied, setProfileCopied] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://waitlist.example.com";
  const timezones = getTimezones();
  const hasChanges =
    formData.name !== initialData.name ||
    formData.country !== initialData.country ||
    formData.region !== initialData.region ||
    formData.timezone !== initialData.timezone;

  const usernameChanged = username.toLowerCase() !== initialData.username.toLowerCase();

  // Debounced username check
  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.toLowerCase() === initialData.username.toLowerCase()) {
      setUsernameStatus("idle");
      setUsernameError(null);
      return;
    }

    setUsernameStatus("checking");
    setUsernameError(null);

    try {
      const res = await fetch(`/api/username/check?username=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.available) {
        setUsernameStatus("available");
        setUsernameError(null);
      } else {
        setUsernameStatus(data.error?.includes("taken") ? "taken" : "invalid");
        setUsernameError(data.error);
      }
    } catch {
      setUsernameStatus("invalid");
      setUsernameError("Failed to check username");
    }
  }, [initialData.username]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username.toLowerCase() !== initialData.username.toLowerCase()) {
        checkUsername(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsername, initialData.username]);

  async function handleSaveUsername() {
    if (usernameStatus !== "available") return;

    setSavingUsername(true);
    setUsernameError(null);

    try {
      const res = await fetch("/api/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update username");
      }

      // Update initial data reference
      initialData.username = data.username;
      setUsernameStatus("idle");
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : "Failed to update username");
      setUsernameStatus("invalid");
    } finally {
      setSavingUsername(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function handleCopyReferral() {
    navigator.clipboard.writeText(`${baseUrl}/join/${initialData.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyProfileUrl() {
    const cleanBaseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash if present
    navigator.clipboard.writeText(`${cleanBaseUrl}/${username || initialData.username}`);
    setProfileCopied(true);
    setTimeout(() => setProfileCopied(false), 2000);
  }

  function handleVisitProfile() {
    const cleanBaseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash if present
    window.open(`${cleanBaseUrl}/${username || initialData.username}`, "_blank");
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Username Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AtSign className="w-5 h-5 text-pink" />
            Username
          </CardTitle>
          <CardDescription>
            Your unique handle - visible at waitlist.example.com/{username || "username"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-username"
                  className={cn(
                    "pl-8",
                    usernameStatus === "available" && "border-green focus:border-green",
                    (usernameStatus === "taken" || usernameStatus === "invalid") && "border-red focus:border-red"
                  )}
                />
                {usernameStatus === "checking" && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-fg-muted" />
                )}
                {usernameStatus === "available" && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green" />
                )}
                {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red" />
                )}
              </div>
              <Button
                onClick={handleSaveUsername}
                disabled={usernameStatus !== "available" || savingUsername}
                className="shrink-0"
              >
                {savingUsername ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
            {usernameError && (
              <p className="text-xs text-red mt-1">{usernameError}</p>
            )}
            {usernameStatus === "available" && (
              <p className="text-xs text-green mt-1">Username is available!</p>
            )}
            {!usernameChanged && usernameStatus === "idle" && (
              <p className="text-xs text-fg-dim mt-1">
                Lowercase letters, numbers, and hyphens only. 3-30 characters.
              </p>
            )}
          </div>
          
          <div className="p-3 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-between gap-2">
            <p className="text-sm text-fg-muted">
              Your public profile:{" "}
              <span className="font-mono text-pink">waitlist.example.com/{username || "username"}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyProfileUrl}
                className="h-8 w-8 shrink-0"
                title="Copy profile URL"
              >
                {profileCopied ? (
                  <Check className="w-4 h-4 text-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVisitProfile}
                className="h-8 w-8 shrink-0"
                title="Visit profile"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-cyan" />
            Profile
          </CardTitle>
          <CardDescription>Your basic account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              value={initialData.email}
              disabled
              className="bg-bg-elevated text-fg-muted cursor-not-allowed"
            />
            <p className="text-xs text-fg-dim mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-green" />
            Location
          </CardTitle>
          <CardDescription>Help us understand our global community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full h-10 px-3 bg-bg-elevated border border-border-subtle rounded-md text-fg-primary focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="region">State / Region</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="e.g., California, Bavaria, Ontario"
            />
          </div>

          <div>
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timezone
            </Label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full h-10 px-3 bg-bg-elevated border border-border-subtle rounded-md text-fg-primary focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent"
            >
              <option value="">Select a timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Account Info Section (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <LinkIcon className="w-5 h-5 text-orange" />
            Account Info
          </CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              Referral Link
            </Label>
            <div className="flex gap-2">
              <Input
                value={`waitlist.example.com/join/${initialData.referralCode}`}
                disabled
                className="bg-bg-elevated text-fg-muted font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyReferral}
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

          <div>
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member Since
            </Label>
            <Input
              value={new Date(initialData.memberSince).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              disabled
              className="bg-bg-elevated text-fg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        <div>
          {error && <p className="text-sm text-red">{error}</p>}
          {saved && (
            <p className="text-sm text-green flex items-center gap-1">
              <Check className="w-4 h-4" />
              Settings saved successfully
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="min-w-[120px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Sign Out */}
      <div className="pt-6 border-t border-border-subtle">
        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-fg-muted hover:text-red hover:border-red"
        >
          {signingOut ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
