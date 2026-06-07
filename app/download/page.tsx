"use client";

import { useEffect, useState } from "react";
import { Download, Lock, ShieldAlert } from "lucide-react";
import { Protected } from "@/components/protected";
import { useAuth } from "@/components/auth-provider";
import { latestApks } from "@/lib/firebase-actions";
import { isFuture } from "@/lib/utils";
import type { ApkFile } from "@/lib/types";

export default function DownloadPage() {
  return (
    <Protected>
      <DownloadContent />
    </Protected>
  );
}

function DownloadContent() {
  const { appUser } = useAuth();
  const [apks, setApks] = useState<ApkFile[]>([]);
  const active = isFuture(appUser?.keyExpiry?.toDate?.() || null);

  useEffect(() => {
    latestApks().then((snap) => setApks(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ApkFile))));
  }, []);

  return (
    <main className="section">
      <div className="mb-8">
        <p className="label">APK Download</p>
        <h1 className="mt-3 text-4xl font-black">Secure APK access</h1>
      </div>
      {!active ? (
        <div className="glass neon-ring rounded-lg p-8 text-center">
          <ShieldAlert className="mx-auto text-ocean" size={42} />
          <h2 className="mt-4 text-2xl font-black">Active key required</h2>
          <p className="mt-3 text-slate-600">Login is confirmed, but APK download requires an active subscription key.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {apks.length ? apks.map((apk) => (
            <div key={apk.id} className="glass neon-ring flex flex-col justify-between gap-4 rounded-lg p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black">Version {apk.version}</h2>
                <p className="mt-1 text-sm text-slate-600">{apk.fileName}</p>
              </div>
              <a href={apk.url} className="btn-primary" target="_blank" rel="noreferrer">
                <Download size={18} /> Download APK
              </a>
            </div>
          )) : (
            <div className="glass rounded-lg p-8 text-center">
              <Lock className="mx-auto text-ocean" size={40} />
              <h2 className="mt-4 text-2xl font-black">No APK uploaded</h2>
              <p className="mt-3 text-slate-600">Admin can upload the latest APK from the admin panel.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
