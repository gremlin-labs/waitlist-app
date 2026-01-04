"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Users,
  Trophy,
  BarChart3,
  Briefcase,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  email: string;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Leaderboard",
    href: "/admin/waitlist",
    icon: Trophy,
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: Briefcase,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "System Health",
    href: "/admin/health",
    icon: Activity,
  },
];

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border-subtle bg-surface-void">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-6 border-b border-border-subtle">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo size="sm" className="text-pink" />
          <span className="font-bold text-fg-muted">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-pink-dim text-pink"
                  : "text-fg-muted hover:text-fg-primary hover:bg-surface-raised"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle">
        <div className="px-3 py-2">
          <p className="text-xs text-fg-dim truncate">{email}</p>
        </div>
      </div>
    </aside>
  );
}
