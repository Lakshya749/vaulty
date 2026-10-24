import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow-violet group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Vaulty<span className="text-violet-400">.</span>
          </span>
        </Link>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
          v2.0 Beta
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto z-10 my-8">
        {children}
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-text-muted z-10">
        <p>&copy; {new Date().getFullYear()} Vaulty (SubTrack). All rights reserved.</p>
      </div>
    </div>
  );
}
