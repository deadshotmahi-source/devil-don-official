"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-2xl text-center shadow-xl w-[400px]">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          DEVIL DON 😈
        </h1>

        <h2 className="text-2xl mb-4">
          Welcome To Dashboard 🔥
        </h2>

        <p className="text-zinc-400 mb-6">
          Login Successful 😈
        </p>

        <button
          onClick={logout}
          className="bg-red-600 px-6 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>
    </main>
  );
}