"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { Calendar, Download, Headphones, History, KeyRound, Loader2, ShieldCheck, UserCircle } from "lucide-react";
import { Protected } from "@/components/protected";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { activateKey } from "@/lib/firebase-actions";
import { formatDate, isFuture } from "@/lib/utils";
import type { AccessKey, PaymentRequest } from "@/lib/types";

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}

function DashboardContent() {
  const { appUser } = useAuth();
  const [keyCode, setKeyCode] = useState("");
  const [history, setHistory] = useState<PaymentRequest[]>([]);
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const expiry = appUser?.keyExpiry?.toDate?.() || null;
  const active = isFuture(expiry);

  useEffect(() => {
    async function load() {
      if (!appUser) return;
      const paymentSnap = await getDocs(query(collection(db, "payments"), where("userId", "==", appUser.uid), orderBy("createdAt", "desc"), limit(8)));
      setHistory(paymentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PaymentRequest)));
      const keySnap = await getDocs(query(collection(db, "keys"), where("userId", "==", appUser.uid), limit(12)));
      setKeys(keySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AccessKey)));
    }
    load();
  }, [appUser]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!appUser) return;
    setBusy(true);
    setMessage("");
    try {
      await activateKey(appUser, keyCode);
      setMessage("Key activated. Refresh the dashboard to see latest status.");
      setKeyCode("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Activation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="label">User Dashboard</p>
          <h1 className="mt-3 text-4xl font-black">Welcome {appUser?.username}</h1>
        </div>
        <Link href="/download" className={active ? "btn-primary" : "btn-secondary"}>
          <Download size={18} /> Download APK
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={ShieldCheck} label="Active Key Status" value={active ? "Active" : "Inactive"} />
        <Stat icon={Calendar} label="Key Expiry Date" value={formatDate(expiry)} />
        <Stat icon={KeyRound} label="Subscription Type" value={appUser?.subscriptionType || "None"} />
        <Stat icon={UserCircle} label="Account Status" value={appUser?.status || "active"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <form onSubmit={submit} className="glass neon-ring rounded-lg p-6">
          <p className="label">Key Activation</p>
          <h2 className="mt-3 text-2xl font-black">Activate subscription key</h2>
          <input className="input mt-6 uppercase" value={keyCode} onChange={(e) => setKeyCode(e.target.value)} placeholder="DD-7DAYSPLAN-XXXXXXXX" required />
          {message ? <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p> : null}
          <button className="btn-primary mt-5 w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={18} /> : null} Activate Key
          </button>
        </form>

        <div className="glass rounded-lg p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="text-ocean" />
            <h2 className="text-2xl font-black">Purchase History</h2>
          </div>
          <div className="grid gap-3">
            {history.length ? history.map((item) => (
              <div key={item.id} className="rounded-lg border border-blue-100 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold">{item.plan}</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-ocean">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Transaction: {item.transactionId}</p>
              </div>
            )) : <p className="text-slate-600">No purchase requests yet.</p>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-lg p-6">
          <h2 className="text-2xl font-black">Key History</h2>
          <div className="mt-4 grid gap-3">
            {keys.length ? keys.map((key) => (
              <div key={key.id} className="rounded-lg border border-blue-100 bg-white/70 p-4">
                <p className="font-mono text-sm font-bold text-ocean">{key.code}</p>
                <p className="mt-1 text-sm text-slate-600">{key.plan} • {key.status} • expires {formatDate(key.expiryAt?.toDate?.())}</p>
              </div>
            )) : <p className="text-slate-600">No activated keys yet.</p>}
          </div>
        </div>
        <div className="glass rounded-lg p-6">
          <Headphones className="text-ocean" size={28} />
          <h2 className="mt-4 text-2xl font-black">Support</h2>
          <p className="mt-3 leading-7 text-slate-600">For payment rejection, key activation problems, or APK access issues, send your username and transaction ID to admin support.</p>
          <Link href="/buy-key" className="btn-secondary mt-5">Buy Another Key</Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="glass neon-ring rounded-lg p-5">
      <Icon className="text-ocean" size={24} />
      <p className="label mt-4">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
