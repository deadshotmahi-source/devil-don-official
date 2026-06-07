"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (password.length < 6) return setMessage("Password must be at least 6 characters.");
    if (password !== confirm) return setMessage("Passwords do not match.");
    setBusy(true);
    try {
      await register(username, password);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section grid min-h-[78vh] place-items-center">
      <form onSubmit={submit} className="glass neon-ring w-full max-w-md rounded-lg p-6">
        <div className="mb-7 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-ocean text-white shadow-glow">
            <UserPlus size={24} />
          </div>
          <h1 className="mt-4 text-3xl font-black">Register</h1>
          <p className="mt-2 text-sm text-slate-600">Create your username/password account.</p>
        </div>
        <label className="label">Username</label>
        <input className="input mt-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="devildon_user" required />
        <label className="label mt-5 block">Password</label>
        <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label className="label mt-5 block">Confirm password</label>
        <input className="input mt-2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        {message ? <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p> : null}
        <button className="btn-primary mt-6 w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" size={18} /> : null} Create Account
        </button>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already registered? <Link href="/login" className="font-bold text-ocean">Login</Link>
        </p>
      </form>
    </main>
  );
}
