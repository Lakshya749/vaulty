import React from "react";
import Link from "next/link";
import { BentoCard } from "@/components/ui/BentoCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Pill } from "@/components/ui/Pill";
import {
  Zap,
  Ghost,
  Clock,
  TrendingDown,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-violet-500/30">
      {/* Background radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-violet-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow-violet group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
              Vaulty<span className="text-violet-400">.</span>
            </span>
            <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase">
              SubTrack
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-text-secondary">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Overview
          </Link>
          <Link href="/vault" className="hover:text-white transition-colors">
            Vault
          </Link>
          <Link href="/radar" className="hover:text-white transition-colors">
            Radar
          </Link>
          <Link href="/split" className="hover:text-white transition-colors">
            Smart Split
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin / Viva
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-text-secondary hover:text-white px-3.5 py-2 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link href="/dashboard">
            <GradientButton size="sm">
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </GradientButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 sm:pt-20 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold shadow-glow-violet animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>PERSONAL SUBSCRIPTION &amp; RECURRING SPEND RADAR</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          Stop bleeding cash on subscriptions{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            you forgot about.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          The Gen-Z personal burn-rate radar for college students and developers. Automatically detects zombie liabilities, warns before free trials auto-charge, and splits shared costs in 1 click.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <GradientButton size="lg" className="text-sm font-bold px-8 py-3.5 shadow-xl shadow-violet-600/30">
              <Zap className="w-4 h-4 mr-2 fill-current" />
              <span>Explore Arjun&apos;s Live Vault (₹3,849/mo)</span>
            </GradientButton>
          </Link>
          <Link href="/vault">
            <button className="px-6 py-3.5 rounded-xl glass-panel text-sm font-semibold text-text-secondary hover:text-white hover:border-violet-500/50 transition-all">
              Inspect Subscription Vault
            </button>
          </Link>
        </div>

        {/* Live Seed Highlight Badges */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <BentoCard colSpan={1} className="p-6 space-y-3 hover:border-violet-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <Pill variant="emerald" dot>LIVE BURN RATE</Pill>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              ₹3,849<span className="text-xs font-normal text-text-muted">/month</span>
            </div>
            <p className="text-xs text-text-secondary">
              Pure mathematical 30-day normalization across monthly, quarterly, and annual billing cycles.
            </p>
          </BentoCard>

          <BentoCard colSpan={1} className="p-6 space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <Pill variant="pink">3 ZOMBIES FOUND</Pill>
              <Ghost className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-3xl font-black text-pink-400 font-mono">
              Save ₹899<span className="text-xs font-normal text-text-muted">/mo</span>
            </div>
            <p className="text-xs text-text-secondary">
              Cult.fit Gym, Xbox Game Pass, and iCloud identified as 30+ days inactive. 1-click termination.
            </p>
          </BentoCard>

          <BentoCard colSpan={1} className="p-6 space-y-3 hover:border-violet-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <Pill variant="amber">TRIAL RADAR</Pill>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              48 Hours Left
            </div>
            <p className="text-xs text-text-secondary">
              Amazon Prime auto-converts to ₹299/mo in 2 days. Direct cancellation deep-link ready.
            </p>
          </BentoCard>
        </div>

        {/* Feature Grid */}
        <div className="pt-16 space-y-8 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Engineered with Mathematical Rigor
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
              Built with 100% test-covered calculation algorithms, instant client normalization, and dual persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard colSpan={1} className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Split & UPI Reminders</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Splitting Netflix 4K with roommates? Smart Split calculates your net true bleed and generates preformatted WhatsApp reminders with UPI payment links.
              </p>
            </BentoCard>

            <BentoCard colSpan={1} className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Price Hike Watchdog</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tracks stealth price hikes across streaming and AI tools (like YouTube Premium&apos;s +58% hike or Claude Pro currency fluctuation) to recommend downgrades.
              </p>
            </BentoCard>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-20 border-t border-border-subtle space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary-gradient flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white fill-current" />
              </div>
              <span className="font-bold text-white">Vaulty.</span>
              <span>&mdash; Personal Subscription &amp; Burn-Rate Radar</span>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <Link href="/dashboard" className="hover:text-white transition-colors">Overview</Link>
              <Link href="/vault" className="hover:text-white transition-colors">Vault</Link>
              <Link href="/radar" className="hover:text-white transition-colors">Radar</Link>
              <Link href="/split" className="hover:text-white transition-colors">Split</Link>
              <Link href="/admin" className="hover:text-white transition-colors">Console</Link>
            </div>
          </div>

          <div className="text-center text-xs text-text-muted">
            <p>&copy; {new Date().getFullYear()} Vaulty (SubTrack). All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
