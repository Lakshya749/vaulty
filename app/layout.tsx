import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { SubscriptionProvider } from "@/components/providers/SubscriptionProvider";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "SubTrack — Personal Subscription & Spend Intelligence",
  description: "Stop bleeding money on subscriptions you forgot about.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-base text-text-primary selection:bg-violet-500/30 selection:text-violet-400">
        <div className="ambient-glow-tl" aria-hidden="true" />
        <div className="ambient-glow-br" aria-hidden="true" />
        <SubscriptionProvider>
          <main className="relative z-10 min-h-screen">{children}</main>
        </SubscriptionProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0F1118",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#F5F5FA",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
