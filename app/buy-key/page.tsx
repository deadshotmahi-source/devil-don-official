"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, QrCode, UploadCloud } from "lucide-react";
import { Protected } from "@/components/protected";
import { createPaymentRequest } from "@/lib/firebase-actions";
import type { PlanName } from "@/lib/types";

const plans: PlanName[] = ["7 Days Plan", "30 Days Plan", "VIP Plan"];

export default function BuyKeyPage() {
  return (
    <Protected>
      <BuyKeyContent />
    </Protected>
  );
}

function BuyKeyContent() {
  const searchParams = useSearchParams();

  const initialPlan = useMemo(() => {
    const plan = searchParams.get("plan") as PlanName | null;
    return plan && plans.includes(plan) ? plan : "7 Days Plan";
  }, [searchParams]);

  const [plan, setPlan] = useState<PlanName>(initialPlan);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Temporary demo user for deployment
  const appUser = {
    uid: "demo-user",
    username: "Guest User",
  };

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!screenshot) {
      return setMessage("Upload a payment screenshot.");
    }

    setBusy(true);
    setMessage("");

    try {
      await createPaymentRequest({
        user: appUser,
        plan,
        transactionId,
        screenshot,
      });

      setMessage(
        "Verification request submitted. Admin will review and issue your key."
      );

      setTransactionId("");
      setScreenshot(null);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit payment."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="mb-8">
        <p className="label">Manual QR Payment</p>
        <h1 className="mt-3 text-4xl font-black">
          Buy subscription key
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
        <div className="grid gap-4">
          {plans.map((item) => (
            <button
              key={item}
              onClick={() => setPlan(item)}
              className={`glass neon-ring rounded-lg p-5 text-left transition ${
                plan === item
                  ? "border-ocean ring-4 ring-ocean/10"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">
                  {item}
                </h2>
                {plan === item ? (
                  <CheckCircle2 className="text-ocean" />
                ) : null}
              </div>

              <p className="mt-2 text-sm text-slate-600">
                Secure APK access, dashboard status,
                and key history.
              </p>
            </button>
          ))}

          <div className="glass rounded-lg p-6">
            <div className="mx-auto grid aspect-square max-w-[280px] place-items-center rounded-lg border border-blue-100 bg-white">
              <div className="grid h-44 w-44 place-items-center rounded-lg bg-[linear-gradient(135deg,#06142e_0_25%,#fff_25%_35%,#075bff_35%_60%,#fff_60%_70%,#06142e_70%)] text-white shadow-glow">
                <QrCode size={88} />
              </div>
            </div>

            <p className="mt-4 text-center text-sm font-semibold text-slate-600">
              Replace this QR block with your production payment QR asset.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="glass neon-ring rounded-lg p-6"
        >
          <p className="label">
            Verification System
          </p>

          <h2 className="mt-3 text-2xl font-black">
            Submit payment details
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="label">
                User Name
              </label>

              <input
                className="input mt-2"
                value={appUser.username}
                readOnly
              />
            </div>

            <div>
              <label className="label">
                Selected Plan
              </label>

              <select
                className="input mt-2"
                value={plan}
                onChange={(e) =>
                  setPlan(e.target.value as PlanName)
                }
              >
                {plans.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                Transaction ID
              </label>

              <input
                className="input mt-2"
                value={transactionId}
                onChange={(e) =>
                  setTransactionId(e.target.value)
                }
                required
              />
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ocean/35 bg-blue-50/70 p-8 text-center transition hover:bg-blue-50">
              <UploadCloud
                className="text-ocean"
                size={32}
              />

              <span className="mt-3 text-sm font-bold text-ink">
                {screenshot
                  ? screenshot.name
                  : "Upload payment screenshot"}
              </span>

              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setScreenshot(
                    e.target.files?.[0] || null
                  )
                }
                required
              />
            </label>
          </div>

          {message ? (
            <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">
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

            Submit Verification
          </button>
        </form>
      </div>
    </main>
  );
}