import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "DEVIL DON OFFICIAL",
  description: "Premium key management, APK downloads, and subscription dashboard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="premium-shell">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
