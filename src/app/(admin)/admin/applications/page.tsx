"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContentWrapper,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Linkedin,
  Github,
  Globe,
  Clock,
  User,
  FileText,
  Loader2,
} from "lucide-react";

const JOB_TITLES: Record<string, string> = {
  "zig-ml": "Zig Engineer — ML",
  "zig-perf": "Zig Engineer — Performance",
  "swiftui": "SwiftUI Engineer",
  "fullstack": "Full Stack TypeScript",
  "marketing": "Marketing Lead",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-cyan", bg: "bg-cyan-dim" },
  reviewing: { label: "Reviewing", color: "text-yellow", bg: "bg-yellow-dim" },
  outreach: { label: "Outreach", color: "text-purple", bg: "bg-purple-dim" },
  phone_screen: { label: "Phone Screen", color: "text-blue", bg: "bg-blue-dim" },
  interview: { label: "Interview", color: "text-orange", bg: "bg-orange-dim" },
  final_round: { label: "Final Round", color: "text-pink", bg: "bg-pink-dim" },
  offer: { label: "Offer", color: "text-green", bg: "bg-green-dim" },
  hired: { label: "Hired! 🎉", color: "text-green", bg: "bg-green-dim" },
  rejected: { label: "Rejected", color: "text-red", bg: "bg-red-dim" },
  withdrawn: { label: "Withdrawn", color: "text-fg-dim", bg: "bg-surface-raised" },
};

interface Application {
  id: string;
  jobRole: string;
  status: string;
  submittedAt: string;
  linkedinUrl: string;
  githubUrl: string | null;
  portfolioUrl: string | null;
  notes: string | null;
  userId: string;
  userName: string | null;
  userEmail: string;
}

interface ApplicationDetail extends Application {
  passionResponse: string;
  workStyleResponse: string;
  experienceResponse: string;
  reviewedAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  // Sheet state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editNotes, setEditNotes] = useState("");

  async function fetchApplications(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
      });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (jobFilter !== "all") params.set("jobRole", jobFilter);

      const res = await fetch(`/api/admin/applications?${params}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setPagination(data.pagination || { page: 1, limit: 25, total: 0, pages: 0 });
      setStatusCounts(data.statusCounts || {});
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetail(id: string) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      const data = await res.json();
      setDetail(data.application);
      setEditNotes(data.application?.notes || "");
    } catch (error) {
      console.error("Failed to fetch detail:", error);
    } finally {
      setDetailLoading(false);
    }
  }

  async function updateStatus(status: string) {
    if (!selectedId) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchDetail(selectedId);
        await fetchApplications(pagination.page);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  }

  async function saveNotes() {
    if (!selectedId) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editNotes }),
      });
      if (res.ok) {
        await fetchDetail(selectedId);
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, jobFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchApplications(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    } else {
      setDetail(null);
    }
  }, [selectedId]);

  const totalApps = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-pink" />
            Job Applications
          </h1>
          <p className="text-fg-muted mt-1">
            {totalApps} total application{totalApps !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchApplications(pagination.page)}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === key
                ? `${config.bg} ${config.color} ring-2 ring-offset-2 ring-offset-surface-void ring-current`
                : `bg-surface-raised text-fg-muted hover:text-fg-primary`
            }`}
          >
            {config.label}
            {statusCounts[key] ? (
              <span className="ml-1.5 opacity-70">({statusCounts[key]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-dim" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {Object.entries(JOB_TITLES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && applications.length === 0 ? (
            <div className="text-center py-8 text-fg-dim">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-fg-dim">No applications found</div>
          ) : (
            <div className="space-y-2">
              {applications.map((app) => {
                const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.new;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedId === app.id
                        ? "bg-pink-dim border border-pink"
                        : "bg-surface-raised hover:bg-surface-base border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.bg}`}
                      >
                        <User className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-fg-primary">
                          {app.userName || app.userEmail.split("@")[0]}
                        </p>
                        <p className="text-sm text-fg-dim">{app.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-fg-secondary">
                          {JOB_TITLES[app.jobRole] || app.jobRole}
                        </p>
                        <p className="text-xs text-fg-dim flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
              <p className="text-sm text-fg-dim">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchApplications(pagination.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchApplications(pagination.page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContentWrapper open={!!selectedId} className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Application Details</SheetTitle>
            <SheetDescription>
              {detail ? `${detail.userName || detail.userEmail} — ${JOB_TITLES[detail.jobRole]}` : "Loading..."}
            </SheetDescription>
          </SheetHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-pink" />
            </div>
          ) : detail ? (
            <div className="mt-6 space-y-6">
              {/* Status Selector */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={detail.status}
                  onValueChange={updateStatus}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={config.color}>{config.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <Label>Links</Label>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={detail.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0077b5]/20 text-[#0077b5] text-sm hover:bg-[#0077b5]/30 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {detail.githubUrl && (
                    <a
                      href={detail.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-fg-primary/10 text-fg-primary text-sm hover:bg-fg-primary/20 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {detail.portfolioUrl && (
                    <a
                      href={detail.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple/20 text-purple text-sm hover:bg-purple/30 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Portfolio
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Responses */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink" />
                    What they love
                  </Label>
                  <div className="p-3 rounded-md bg-surface-raised text-sm text-fg-secondary whitespace-pre-wrap">
                    {detail.passionResponse}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple" />
                    How they work
                  </Label>
                  <div className="p-3 rounded-md bg-surface-raised text-sm text-fg-secondary whitespace-pre-wrap">
                    {detail.workStyleResponse}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green" />
                    Experience
                  </Label>
                  <div className="p-3 rounded-md bg-surface-raised text-sm text-fg-secondary whitespace-pre-wrap">
                    {detail.experienceResponse}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 pt-4 border-t border-border-subtle">
                <Label>Internal Notes</Label>
                <Textarea
                  placeholder="Add notes about this candidate..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={saveNotes}
                  disabled={updating || editNotes === (detail.notes || "")}
                  className="w-full"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </div>

              {/* Meta */}
              <div className="text-xs text-fg-dim space-y-1 pt-4 border-t border-border-subtle">
                <p>Submitted: {new Date(detail.submittedAt).toLocaleString()}</p>
                {detail.reviewedAt && (
                  <p>Last updated: {new Date(detail.reviewedAt).toLocaleString()}</p>
                )}
                <p>User ID: {detail.userId}</p>
              </div>
            </div>
          ) : null}
        </SheetContentWrapper>
      </Sheet>
    </div>
  );
}
