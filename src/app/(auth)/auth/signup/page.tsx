import { redirect } from "next/navigation";

export default function SignUpPage({
  _searchParams,
}: {
  _searchParams: Promise<{ ref?: string }>;
}) {
  // Redirect to unified signin page, preserving referral code
  redirect("/auth/signin");
}
