"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Download,
  LayoutDashboard,
  LogIn,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/buy-key", label: "Buy Key" },
  { href: "/download", label: "Download" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  // Temporary user for deploy
  const appUser = {
    username: "Guest User",
    role: "user",
  } as any;

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/75 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ocean text-white shadow-glow">
            <Sparkles size={20} />
          </span>

          <span className="text-sm font-black tracking-[.18em] text-ink sm:text-base">
            DEVIL DON
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-blue-100 bg-white/70 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-ocean",
                pathname === item.href &&
                  "bg-ocean text-white hover:bg-ocean hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}

          {appUser?.role === "admin" ? (
            <Link
              href="/admin"
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-ocean",
                pathname === "/admin" &&
                  "bg-ocean text-white hover:bg-ocean hover:text-white"
              )}
            >
              Admin
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {appUser ? (
            <>
              <button
                className="btn-secondary hidden px-3 py-2 sm:inline-flex"
                onClick={() =>
                  router.push("/dashboard")
                }
              >
                <LayoutDashboard size={16} />
                Panel
              </button>

              <button
                className="btn-secondary px-3 py-2"
                onClick={logout}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn-secondary hidden px-3 py-2 sm:inline-flex"
                href="/download"
              >
                <Download size={16} />
                APK
              </Link>

              <Link
                className="btn-primary px-3 py-2"
                href="/login"
              >
                <LogIn size={16} />
                Login
              </Link>
            </>
          )}

          {appUser?.role === "admin" ? (
            <Link
              className="btn-primary px-3 py-2"
              href="/admin"
              title="Admin"
            >
              <Shield size={16} />
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  );
}