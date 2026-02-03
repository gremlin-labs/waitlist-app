"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Shield,
  ShieldOff,
  UserCheck,
  Loader2,
  Check,
  Bot,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  betaStatus: string | null;
  isAdmin: boolean | null;
  surveyCompletedAt: string | null;
  referralCode: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [hideDemoUsers, setHideDemoUsers] = useState(true);

  // Helper to check if a user is a demo user
  const isDemoUser = (email: string) => email.startsWith("demo-") && email.endsWith("@example.com");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        hideDemoUsers: hideDemoUsers.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      setUsers(data.users || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, hideDemoUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, betaStatus: newStatus }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: !isAdmin }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendInvite = async (userId: string) => {
    setActionLoading(userId);
    try {
      await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sendEmail: true }),
      });
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkInvite = async () => {
    if (selectedUsers.size === 0) return;
    setActionLoading("bulk");
    try {
      await fetch("/api/admin/bulk-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
          sendEmail: true,
        }),
      });
      setSelectedUsers(new Set());
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAllWaitlist = () => {
    const waitlistUsers = users.filter((u) => u.betaStatus === "waitlist");
    setSelectedUsers(new Set(waitlistUsers.map((u) => u.id)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary">Users</h1>
          <p className="text-fg-muted mt-1">
            {pagination.total.toLocaleString()} total users
          </p>
        </div>
        {selectedUsers.size > 0 && (
          <Button
            onClick={handleBulkInvite}
            disabled={actionLoading === "bulk"}
            className="gap-2"
          >
            {actionLoading === "bulk" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Invite {selectedUsers.size} Selected
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fg-dim" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "waitlist", "invited", "active", "churned"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Hide demo users toggle */}
          <div className="flex items-center gap-2 pt-3 border-t border-border-subtle mt-4">
            <Checkbox
              id="hide-demo"
              checked={hideDemoUsers}
              onCheckedChange={(checked) => setHideDemoUsers(checked === true)}
            />
            <Label
              htmlFor="hide-demo"
              className="text-sm text-fg-muted cursor-pointer inline-flex items-center gap-2 leading-none"
            >
              <Bot className="w-4 h-4" />
              Hide demo users
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {statusFilter === "waitlist" && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectAllWaitlist}>
            Select All Waitlist
          </Button>
          <span className="text-sm text-fg-muted">
            {selectedUsers.size} selected
          </span>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-fg-muted" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border-subtle">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-fg-muted w-10">
                      <Checkbox
                        checked={selectedUsers.size === users.filter(u => u.betaStatus === "waitlist").length && selectedUsers.size > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            selectAllWaitlist();
                          } else {
                            setSelectedUsers(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-fg-muted">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-fg-muted">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-fg-muted">
                      Survey
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-fg-muted">
                      Joined
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-fg-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border-subtle last:border-0 hover:bg-surface-raised"
                    >
                      <td className="py-3 px-4">
                        {user.betaStatus === "waitlist" && (
                          <Checkbox
                            checked={selectedUsers.has(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          {isDemoUser(user.email) ? (
                            <p 
                              className="font-medium text-fg-muted text-sm italic cursor-help inline-flex items-center gap-1.5"
                              title={user.email}
                            >
                              <Bot className="w-3.5 h-3.5 text-fg-dim" />
                              Demo user
                            </p>
                          ) : (
                            <p className="font-medium text-fg-primary text-sm">
                              {user.email}
                            </p>
                          )}
                          {user.name && (
                            <p className="text-xs text-fg-dim">{user.name}</p>
                          )}
                          {user.isAdmin && (
                            <span className="inline-flex items-center gap-1 text-xs text-pink mt-1">
                              <Shield className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.betaStatus === "active"
                              ? "bg-green-dim text-green"
                              : user.betaStatus === "invited"
                                ? "bg-cyan-dim text-cyan"
                                : user.betaStatus === "churned"
                                  ? "bg-red-dim text-red"
                                  : "bg-yellow-dim text-yellow"
                          }`}
                        >
                          {user.betaStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.surveyCompletedAt ? (
                          <Check className="w-4 h-4 text-green" />
                        ) : (
                          <span className="text-fg-dim">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-fg-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.betaStatus === "waitlist" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendInvite(user.id)}
                              disabled={actionLoading === user.id}
                              className="gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                              Invite
                            </Button>
                          )}
                          {user.betaStatus === "invited" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(user.id, "active")}
                              disabled={actionLoading === user.id}
                              className="gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <UserCheck className="w-3 h-3" />
                              )}
                              Activate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleAdmin(user.id, user.isAdmin || false)}
                            disabled={actionLoading === user.id}
                            className={user.isAdmin ? "text-red" : "text-fg-muted"}
                            title={user.isAdmin ? "Remove admin" : "Make admin"}
                          >
                            {user.isAdmin ? (
                              <ShieldOff className="w-3 h-3" />
                            ) : (
                              <Shield className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-fg-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() =>
                setPagination((p) => ({ ...p, page: p.page - 1 }))
              }
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setPagination((p) => ({ ...p, page: p.page + 1 }))
              }
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
