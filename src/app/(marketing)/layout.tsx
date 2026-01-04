import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-void">
      <Navbar />
      <main className="pt-14">{children}</main>
      <Footer />
    </div>
  );
}
