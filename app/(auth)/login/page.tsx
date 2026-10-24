"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GradientButton } from "@/components/ui/GradientButton";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    toast.success("Welcome, Arjun! Loaded calibrated profile.");
    router.push("/dashboard");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        // If Supabase is not configured, fall back to instant demo login seamlessly
        toast.info("Offline demo mode active. Logging in as Arjun.");
        router.push("/dashboard");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      }
    } catch {
      toast.info("Logging into local session...");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-[28px] glass-panel bg-[#12131A]/90 border border-border-subtle shadow-2xl space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Sign In to Vaulty
        </h1>
        <p className="text-xs text-text-muted">
          Access your real-time burn rate intelligence and subscription radar.
        </p>
      </div>

      {/* 1-Click Demo Login Button */}
      <div className="p-4 rounded-2xl bg-violet-600/10 border border-violet-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-violet-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Instant College Demo Mode
          </span>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-bold">
            RECOMMENDED
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Preloaded with Arjun&apos;s ₹3,849/mo bleed, 3 zombie subscriptions, and 48h Amazon Prime trial alert.
        </p>
        <GradientButton
          type="button"
          onClick={handleDemoLogin}
          className="w-full text-xs font-bold py-2.5"
        >
          <span>Continue as Arjun</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </GradientButton>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-border-subtle w-full" />
        <span className="bg-[#12131A] px-3 text-[11px] font-medium text-text-muted uppercase">
          Or with Supabase
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arjun@example.com"
              className="w-full bg-surface-base border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary block">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-base border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-surface-base hover:bg-surface-hover border border-border-subtle text-xs font-bold text-white transition-all shadow-sm"
        >
          {loading ? "Authenticating..." : "Sign In with Credentials"}
        </button>
      </form>

      <div className="text-center text-xs text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold">
          Create one
        </Link>
      </div>
    </div>
  );
}
