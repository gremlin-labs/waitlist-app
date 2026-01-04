import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { Logo } from "@/components/ui/logo";
import { AdminSidebar } from "./admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const admin = await requireAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface-base flex">
      {/* Sidebar */}
      <AdminSidebar email={admin.email} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-base/80 backdrop-blur-sm h-14 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <div className="lg:hidden">
              <Link href="/admin" className="flex items-center gap-2">
                <Logo size="sm" className="text-pink" />
                <span className="font-bold text-fg-muted text-sm">Admin</span>
              </Link>
            </div>
            <div className="hidden lg:block" />
            <Link
              href="/dashboard"
              className="text-sm text-pink hover:text-pink/80 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
