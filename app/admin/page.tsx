"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { Ban, Check, FileUp, KeyRound, Loader2, Shield, Trash2, Users, X } from "lucide-react";
import { Protected } from "@/components/protected";
import { db } from "@/lib/firebase";
import { approvePayment, deleteRecord, generateKey, uploadApk } from "@/lib/firebase-actions";
import type { AccessKey, ApkFile, AppUser, PaymentRequest, PlanName } from "@/lib/types";

const plans: PlanName[] = ["7 Days Plan", "30 Days Plan", "VIP Plan"];

export default function AdminPage() {
  return (
    <Protected adminOnly>
      <AdminContent />
    </Protected>
  );
}

function AdminContent() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [apks, setApks] = useState<ApkFile[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<PlanName>("7 Days Plan");
  const [apkVersion, setApkVersion] = useState("");
  const [apkFile, setApkFile] = useState<File | null>(null);

  async function load() {
    const [userSnap, paymentSnap, keySnap, apkSnap] = await Promise.all([
      getDocs(query(collection(db, "users"), limit(100))),
      getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(100))),
      getDocs(query(collection(db, "keys"), orderBy("createdAt", "desc"), limit(100))),
      getDocs(query(collection(db, "apk_files"), orderBy("createdAt", "desc"), limit(20)))
    ]);
    setUsers(userSnap.docs.map((item) => ({ uid: item.id, ...item.data() } as AppUser)));
    setPayments(paymentSnap.docs.map((item) => ({ id: item.id, ...item.data() } as PaymentRequest)));
    setKeys(keySnap.docs.map((item) => ({ id: item.id, ...item.data() } as AccessKey)));
    setApks(apkSnap.docs.map((item) => ({ id: item.id, ...item.data() } as ApkFile)));
  }

  useEffect(() => {
    load();
  }, []);

  const analytics = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.status !== "banned").length,
      totalPayments: payments.length,
      activeSubscriptions: users.filter((user) => {
        const expiry = user.keyExpiry?.toDate?.();
        return Boolean(expiry && expiry.getTime() > Date.now());
      }).length
    };
  }, [payments, users]);

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Admin action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function submitKey(event: FormEvent) {
    event.preventDefault();
    await run(() => generateKey(plan), "Key generated.");
  }

  async function submitApk(event: FormEvent) {
    event.preventDefault();
    if (!apkFile) return setMessage("Select an APK file.");
    await run(() => uploadApk(apkVersion, apkFile), "APK uploaded.");
    setApkVersion("");
    setApkFile(null);
  }

  return (
    <main className="section">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="label">Admin Panel</p>
          <h1 className="mt-3 text-4xl font-black">Premium control center</h1>
        </div>
        <div className="glass rounded-lg px-4 py-3 text-sm font-bold text-ocean">
          <Shield className="mr-2 inline" size={16} /> Admin authenticated
        </div>
      </div>

      {message ? <p className="mb-6 rounded-lg bg-blue-50 p-4 text-sm font-semibold text-slate-700">{message}</p> : null}
      {busy ? <p className="mb-6 flex items-center gap-2 text-sm font-bold text-ocean"><Loader2 className="animate-spin" size={18} /> Processing admin action</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Users" value={analytics.totalUsers} />
        <Metric label="Active Users" value={analytics.activeUsers} />
        <Metric label="Total Payments" value={analytics.totalPayments} />
        <Metric label="Active Subscriptions" value={analytics.activeSubscriptions} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="glass rounded-lg p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="text-ocean" />
            <h2 className="text-2xl font-black">User Management</h2>
          </div>
          <div className="grid gap-3">
            {users.map((user) => (
              <div key={user.uid} className="rounded-lg border border-blue-100 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black">{user.username}</p>
                    <p className="text-sm text-slate-600">{user.role} • {user.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary px-3 py-2" onClick={() => run(() => updateDoc(doc(db, "users", user.uid), { status: user.status === "banned" ? "active" : "banned" }), "User status updated.")}>
                      <Ban size={16} />
                    </button>
                    <button className="btn-secondary px-3 py-2" onClick={() => run(() => deleteRecord("users", user.uid), "User document deleted.")}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-lg p-6">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="text-ocean" />
            <h2 className="text-2xl font-black">Key Management</h2>
          </div>
          <form onSubmit={submitKey} className="mb-5 flex flex-col gap-3 sm:flex-row">
            <select className="input" value={plan} onChange={(e) => setPlan(e.target.value as PlanName)}>
              {plans.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button className="btn-primary shrink-0">Generate Key</button>
          </form>
          <div className="grid gap-3">
            {keys.map((key) => (
              <div key={key.id} className="rounded-lg border border-blue-100 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-black text-ocean">{key.code}</p>
                    <p className="text-sm text-slate-600">{key.plan} • {key.status} • {key.username || "unassigned"}</p>
                  </div>
                  <select
                    className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm font-semibold"
                    value={key.status}
                    onChange={(e) => run(() => updateDoc(doc(db, "keys", key.id), { status: e.target.value }), "Key status updated.")}
                  >
                    <option>unused</option>
                    <option>active</option>
                    <option>expired</option>
                    <option>banned</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass mt-6 rounded-lg p-6">
        <h2 className="text-2xl font-black">Payment Management</h2>
        <div className="mt-5 grid gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-lg border border-blue-100 bg-white/70 p-4">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <p className="font-black">{payment.username} • {payment.plan}</p>
                  <p className="mt-1 text-sm text-slate-600">Transaction: {payment.transactionId} • {payment.status}</p>
                  <a className="mt-2 inline-block text-sm font-bold text-ocean" href={payment.screenshotUrl} target="_blank" rel="noreferrer">View screenshot</a>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary px-3 py-2" onClick={() => run(() => approvePayment(payment), "Payment approved and key issued.")}>
                    <Check size={16} /> Approve
                  </button>
                  <button className="btn-secondary px-3 py-2" onClick={() => run(() => updateDoc(doc(db, "payments", payment.id), { status: "rejected" }), "Payment rejected.")}>
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!payments.length ? <p className="text-slate-600">No payment requests yet.</p> : null}
        </div>
      </section>

      <section className="glass mt-6 rounded-lg p-6">
        <div className="mb-5 flex items-center gap-2">
          <FileUp className="text-ocean" />
          <h2 className="text-2xl font-black">APK Management</h2>
        </div>
        <form onSubmit={submitApk} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input className="input" value={apkVersion} onChange={(e) => setApkVersion(e.target.value)} placeholder="APK version, e.g. 1.0.0" required />
          <input className="input" type="file" accept=".apk,application/vnd.android.package-archive" onChange={(e) => setApkFile(e.target.files?.[0] || null)} required />
          <button className="btn-primary">Upload APK</button>
        </form>
        <div className="mt-5 grid gap-3">
          {apks.map((apk) => (
            <div key={apk.id} className="flex flex-col justify-between gap-3 rounded-lg border border-blue-100 bg-white/70 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-black">Version {apk.version}</p>
                <p className="text-sm text-slate-600">{apk.fileName}</p>
              </div>
              <button className="btn-secondary px-3 py-2" onClick={() => run(() => deleteRecord("apk_files", apk.id), "APK record removed.")}>
                <Trash2 size={16} /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass neon-ring rounded-lg p-5">
      <p className="label">{label}</p>
      <p className="mt-3 text-4xl font-black text-ocean">{value}</p>
    </div>
  );
}
