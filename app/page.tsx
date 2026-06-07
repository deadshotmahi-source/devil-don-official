import Link from "next/link";
import { ArrowRight, BadgeCheck, Download, KeyRound, Lock, MessageCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { MotionDiv } from "@/components/motion";

const features = [
  { icon: KeyRound, title: "Premium Keys", text: "7 days, 30 days, and VIP access keys with activation history and expiry tracking." },
  { icon: ShieldCheck, title: "Protected Access", text: "Dashboard, APK downloads, and admin routes are gated by active login and subscription state." },
  { icon: Zap, title: "Fast Manual Approval", text: "Upload QR payment proof, submit a transaction ID, and get an issued key after admin approval." }
];

const plans = [
  { name: "7 DAYS PLAN", detail: "Starter access with secure dashboard download.", price: "Entry" },
  { name: "30 DAYS PLAN", detail: "Monthly premium access for regular users.", price: "Popular" },
  { name: "VIP PLAN", detail: "Long-term VIP access with priority support.", price: "Elite" }
];

const faqs = [
  ["How do I buy a key?", "Select a plan, scan the QR, upload your payment screenshot, and submit your transaction ID."],
  ["When does the key expire?", "Each key stores an expiry date based on its plan and the dashboard always shows active or expired status."],
  ["Can I download without a key?", "No. APK downloads are restricted to logged-in users with an active subscription key."]
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="section grid items-center gap-10 py-12 sm:py-16 lg:min-h-[calc(100vh-68px)] lg:grid-cols-[1.05fr_.95fr] lg:pb-10">
          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-ocean shadow-sm">
              <Sparkles size={15} /> Premium Blue Access System
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-6xl lg:text-7xl">
              DEVIL DON OFFICIAL
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Register, buy keys by manual QR payment, activate subscriptions, download APK releases, and manage everything through a polished premium dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/buy-key" className="btn-primary">
                Buy Key <ArrowRight size={18} />
              </Link>
              <Link href="/download" className="btn-secondary">
                <Download size={18} /> Download APK
              </Link>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass neon-ring rounded-lg p-5"
          >
            <div className="rounded-lg bg-gradient-to-br from-ocean to-azure p-1 shadow-glow">
              <div className="rounded-md bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="label">Live Access</p>
                    <h2 className="mt-2 text-2xl font-black">Premium Dashboard</h2>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-ocean">
                    <Lock size={22} />
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {["Active Key Status", "APK Version Control", "Payment Verification", "Admin Analytics"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/60 p-4">
                      <span className="font-semibold text-slate-700">{item}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ocean">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section id="features" className="section">
        <div className="mb-8 max-w-2xl">
          <p className="label">Features</p>
          <h2 className="mt-3 text-4xl font-black">Premium control for users and admins.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass neon-ring rounded-lg p-6">
              <feature.icon className="text-ocean" size={28} />
              <h3 className="mt-5 text-xl font-black">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="label">Plans</p>
            <h2 className="mt-3 text-4xl font-black">Subscription plans</h2>
          </div>
          <Link href="/buy-key" className="btn-primary">Purchase Access</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="glass neon-ring rounded-lg p-6">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-ocean">{plan.price}</span>
              <h3 className="mt-5 text-2xl font-black">{plan.name}</h3>
              <p className="mt-3 leading-7 text-slate-600">{plan.detail}</p>
              <Link href={`/buy-key?plan=${encodeURIComponent(plan.name)}`} className="mt-6 w-full btn-secondary">
                Select Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="label">FAQ</p>
          <h2 className="mt-3 text-4xl font-black">Simple purchase flow.</h2>
        </div>
        <div className="grid gap-4">
          {faqs.map(([q, a]) => (
            <div key={q} className="glass rounded-lg p-5">
              <h3 className="flex items-center gap-2 font-black"><BadgeCheck size={18} className="text-ocean" /> {q}</h3>
              <p className="mt-2 leading-7 text-slate-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section pb-24">
        <div className="glass neon-ring flex flex-col justify-between gap-6 rounded-lg p-8 sm:flex-row sm:items-center">
          <div>
            <p className="label">Support</p>
            <h2 className="mt-2 text-3xl font-black">Need help with payment or activation?</h2>
            <p className="mt-2 text-slate-600">Use the dashboard support action after login or contact the site admin directly.</p>
          </div>
          <Link href="/dashboard" className="btn-primary">
            <MessageCircle size={18} /> Open Support
          </Link>
        </div>
      </section>
    </main>
  );
}
