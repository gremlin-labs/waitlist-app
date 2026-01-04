import { redirect } from "next/navigation";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  // Redirect to unified signin page, preserving referral code
  redirect("/auth/signin");
}
