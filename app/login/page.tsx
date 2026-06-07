"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { KeyRound, Loader2, Lock, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setBusy(true);
    setMessage("");

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section grid min-h-[78vh] place-items-center">
      <form
        onSubmit={submit}
        className="glass neon-ring w-full max-w-md rounded-lg p-6"
      >
        <div className="mb-7 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-ocean text-white shadow-glow">
            <Lock size={24} />
          </div>

          <h1 className="mt-4 text-3xl font-black">
            Login
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Access your DEVIL DON OFFICIAL dashboard.
          </p>
        </div>

        <label className="label">
          Username
        </label>

        <div className="mt-2 flex items-center gap-2 rounded-lg border border-blue-100 bg-white/85 px-3 focus-within:border-ocean focus-within:ring-4 focus-within:ring-ocean/10">
          <User
            size={18}
            className="text-ocean"
          />

          <input
            className="w-full bg-transparent py-3 text-sm outline-none"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />
        </div>

        <label className="label mt-5 block">
          Password
        </label>

        <div className="mt-2 flex items-center gap-2 rounded-lg border border-blue-100 bg-white/85 px-3 focus-within:border-ocean focus-within:ring-4 focus-within:ring-ocean/10">
          <KeyRound
            size={18}
            className="text-ocean"
          />

          <input
            className="w-full bg-transparent py-3 text-sm outline-none"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        {message ? (
          <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">
            {message}
          </p>
        ) : null}

        <button
          className="btn-primary mt-6 w-full"
          disabled={busy}
        >
          {busy ? (
            <Loader2
              className="animate-spin"
              size={18}
            />
          ) : null}

          Secure Login
        </button>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-400">
            Forgot password
          </span>

          <Link
            href="/register"
            className="font-semibold text-slate-600 hover:text-ocean"
          >
            Create account
          </Link>
        </div>
      </form>
    </main>
  );
}