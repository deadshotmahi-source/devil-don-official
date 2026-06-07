"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export function Protected({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const router = useRouter();
  const { appUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!appUser) router.replace("/login");
    if (adminOnly && appUser?.role !== "admin") router.replace("/dashboard");
  }, [adminOnly, appUser, loading, router]);

  if (loading || !appUser || (adminOnly && appUser.role !== "admin")) {
    return (
      <main className="grid min-h-[70vh] place-items-center">
        <div className="glass neon-ring flex items-center gap-3 rounded-lg px-6 py-5 text-sm font-semibold text-ocean">
          <Loader2 className="animate-spin" size={20} /> Loading premium access
        </div>
      </main>
    );
  }

  if (appUser.status === "banned") {
    return (
      <main className="section">
        <div className="glass rounded-lg p-8 text-center">
          <h1 className="text-3xl font-black">Account banned</h1>
          <p className="mt-3 text-slate-600">Contact support if you believe this was a mistake.</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
