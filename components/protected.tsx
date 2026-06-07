"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Protected({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const router = useRouter();

  // Temporary demo user
  const appUser = {
    username: "Guest User",
    role: "user",
  } as any;

  const loading = false;

  useEffect(() => {
    if (loading) return;

    // If no user, redirect login
    if (!appUser) {
      router.push("/login");
      return;
    }

    // Admin route protection
    if (
      adminOnly &&
      appUser?.role !== "admin"
    ) {
      router.push("/dashboard");
    }
  }, [
    appUser,
    loading,
    adminOnly,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}